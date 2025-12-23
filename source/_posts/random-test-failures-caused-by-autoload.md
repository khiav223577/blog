---
title: Rails 7.2 中，timecop + autoload 導致的 random test failures
date: 2025-09-13 12:29:02
categories:
  - 程式開發
tags:
  - Rails
---

最近專案升上 Rails 7.2 後，發現測試很容易失敗，但奇怪的是並不是每次都會重現，而且錯誤訊息也非常詭異。例如：

### 錯誤訊息

```
ActiveRecord::SubclassNotFound:
  Invalid single-table inheritance type: User is not a subclass of User
```
```
NameError:
  uninitialized constant User
```
```
ActiveRecord::AssociationTypeMismatch:
  User(#548920) expected, got #<User ...> which is an instance of User(#95540)
```

## Trace root cause

### 1. 重現錯誤

第一步是先能在 local 重現錯誤。我們可以先從 CI/CD 的 log 記錄中，找到 rspec 指令。上面應該會帶 `--seed` 參數，用這個 seed 我們能先在 local 重現噴錯的測試。能夠重現錯誤是關鍵的一步，接下來我們就能慢慢找 root cause。

### 2. 降低重現的時間

因為 CI/CD 會跑整個專案的所有測試，耗時太長，不方便快速驗證修改是否有效。這時可以利用 `--bisect` 參數，讓 rspec 自動幫我們用二分法找出最小測資組合，只需要執行兩個 test case 就能重現錯誤，大幅縮短 debug 時間。

### 3. 異常的 reload

有了快速重現步驟後，我們觀察到測試執行時間異常的長。用 print 大法後，發現卡住的地方並不在專案程式碼內，而是在 Rails 內部。

從上面錯誤訊息推測，User 常數不屬於 User 自己，猜測可能是測試執行的過程中，不明原因觸發 auto hot reload 了，導致常數改變。改變前的 User 被認定跟改變後的 User 不同，因此噴了這種錯誤訊息。

### 4. trace caller

從 Rails 的 source code 中，我們找到 autoloader 有 `on_unload` 這個 callback 函式。

因此我們能在 initializer 插入一段 code，檢查是誰呼叫到 `on_unload`，並將將 caller 印出來，追查呼叫者。
```rb
Rails.autoloaders.each do |loader|
  loader.on_unload do |*args|
    if $debug
      p "------ Rails.autoloaders on_unload: #{args} -------"
      caller.each{|s| p s }
      exit
    end
  end
end
```

### 找出觸發的 autoloader

從 caller 追蹤到最可疑的一段：`/.rvm/gems/ruby-3.3.9/gems/activesupport-7.2.2.1/lib/active_support/reloader.rb:64`
```rb
def self.check! # :nodoc:
  @should_reload ||= check.call
end
```

也就是 check 這個 lambda 回傳 true 時，就會觸發 autoload。接著我們可以在整個 rails gem 中搜尋 `check` 這個字串，找到這個 lambda 被定義的地方。最後找到：
```rb
app.reloader.check = lambda do
  app.reloaders.map(&:updated?).any?
end
```

接著使用 print 大法，我們找到是 `ActionView::CacheExpiry::ViewReloader` 不明原因 `updated?` 回傳 true，導致觸發 autoload。
```
p app.reloaders.map(&:updated?)
# => [false, true, false, false, false]

p app.reloaders.map{|s| s.class.name }
# => ["ActiveSupport::FileUpdateChecker”, "ActionView::CacheExpiry::ViewReloader”, "ActiveSupport::FileUpdateChecker”, "Rails::Application::RoutesReloader”, "ActiveSupport::FileUpdateChecker”]
```

## random test failures 原因

關鍵在於 Rails 7.2 的這個 [PR](https://github.com/rails/rails/pull/51308)，為了效能的考量，將 reloader 改成了 lazy load。原本 reloader 初始化時會跑的 `view_reloader.execute`，現在變成第一次檢查是否要 reload 時才執行，造成檔案時間戳（mtime）判斷出現落差。

然後再搭配以下流程就會觸發 bug：
- test case 在打 API 時，reloader 會去判斷需不需要重載 class。
- 但此時我們若有用 Timecop.freeze 或是 travel_to 函式去控制時間的話，Time.now 的時間可能是過去的時間。
- 而因為 ActiveSupport::FileUpdateChecker 在抓 `max_mtime` 時，會去 ignore 檔案 mtime 在未來的那些檔案。（可能是認為這檔案時間竟然在未來，太怪了所以 ignore (?)）
```rb
def max_mtime(paths)
  time_now = Time.now
  max_mtime = nil
  # Time comparisons are performed with #compare_without_coercion because
  # AS redefines these operators in a way that is much slower and does not
  # bring any benefit in this particular code.
  #
  # Read t1.compare_without_coercion(t2) < 0 as t1 < t2.
  paths.each do |path|
    mtime = File.mtime(path)
    next if time_now.compare_without_coercion(mtime) < 0
    if max_mtime.nil? || max_mtime.compare_without_coercion(mtime) < 0
      max_mtime = mtime
    end
  end
  max_mtime
end
```

- 因為部份檔案的 mtime 被 ignore 了，導致 `max_mtime` 算出來比實際小一點
- 在另一支測試打 API 時，因為沒有 Timecop.freeze，或是 freeze 的時間在比較晚一點的時間
- 因此比較少檔案被 ignore，使得 `max_mtime` 算出來的變大，而導致 reloader 誤以為有新檔案變動，而判斷需要 reload

## 解決方法

由於我們在跑測試時，不會再去改動檔案，因此也不需要去判斷要不要 reload。因此在 CI/CD 環境中，我們可以直接關閉關閉測試環境的 reloader 就好，避免測試過程中 reload，不但耗時，也可能會產生 random fails。
改法是：
1. `config/environments/test.rb` 中，設定 `config.cache_classes = true`
2. 因為 spring 是先跑在背景，靠 reload 機制載入 file changes，因此也要再設定 ENV `DISABLE_SPRING=1` 來關閉 spring


