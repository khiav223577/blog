---
title: 升級到 Rails 7.2？小心一個隱藏的效能陷阱
subtitle: YJIT 預設設定
date: 2025-12-21 19:31:39
categories:
  - 程式開發
tags:
  - Rails
---

最近專案升上 Rails 7.2 後，發現不但測試速度變慢、local 開發時，改 code 之後新的 request 進來，rails server 都要等近一分鐘才有反應。中間想要關閉 server 還會完全沒有反應，要直接關閉 terminal 或下 kill -9 指令強制關閉。

## Root Cause

經過一行行測試後，發現原因是 Rails 7.2 預設打開了 `yjit` 功能 ([commit](https://github.com/aliismayilov/rails/commit/30e6a197df1f141c00117e5a2328df63e340b2ad))

在我們 `config.load_defaults 7.2` 時，會呼叫到：
```rb
def load_defaults(target_version)
  # ...
  case target_version.to_s
  # ...
  when "7.2"
    load_defaults "7.1"
  
    self.yjit = true
    # ...
  end
end
```

而將 yjit 打開

## 分析原因

目前網路上相關的資料並不多，找到少數幾個案例如下：
- [Rails 7.2: Disable YJIT for RSpec to Run Faster](https://medium.com/@kei178/rails-7-2-disable-yjit-for-rspec-to-run-faster-71da3805f9f5)
- [Upgrade Rails 7.1.x to 7.2.x huge performance regression](https://github.com/rails/rails/issues/54351)

推測是啟用 yjit 後，在第一次運行程式時，yjit 會去動態編譯 ruby 的程式碼，變成高效能的本地機器碼，像 Java JIT 那樣。

而在 development 環境下，只要一個改動，就要 hot reload 程式碼，導致 yjit 好不容易編譯好的機器碼又要重新編譯，因而導致花很多時間在 reload

而 test 環境下，因為 rspec 的寫法是用 block 層層嵌套動態運行的，let 寫法也讓 Ruby method 也不斷被重新定義。加上 Rspec 為了避免測試互相影響，example isolation 的設計原則下做了很多 hooks、rollback、mock、動態建立與刪除 context...等。 這些都可能讓 yjit 花了時間編譯了很多一次性的 code，但沒辦法共用，無法享受編譯完之後的效能增幅。

## 改善方式

我們可以在 environments/development.rb 以及 environments/test.rb 內，加上 `config.yjit = false`。只針對開發環境關閉 yjit，不影響到 production 環境。

或是等之後直升 Rails 8.1，Rails 8.1 上也預設有修正了([Don't enable YJIT in development and test environments](https://github.com/rails/rails/pull/53746))。 
