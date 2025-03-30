---
title: 在 Active Record 中手動指定 SQL 查詢索引
subtitle: Implementing use_index in Rails
date: 2025-03-30 16:04:12
categories:
  - 程式開發
tags:
  - Rails
  - ActiveRecord
---

在大部分資料庫查詢中，MySQL 能夠正確分析並選擇適合的索引（index）。但因為 MySQL 依賴統計資訊與抽樣（sampling）來判斷資料分佈，因此在某些特殊情況下，可能無法選擇最佳索引。如果我們對資料的結構與查詢需求有更深入的了解，能夠判斷應該使用哪個索引，這時候我們可以手動指定 MySQL 使用特定索引來查詢。

但在 Rails 中，ActiveRecord 目前並不支援下這樣的 query。我們只能寫 raw SQL query 去執行，無法直接使用 ActiveRecord 操作。會比較不方便一點。

Rails 曾考慮新增這項功能：[Support USE INDEX index hints API](https://github.com/rails/rails/pull/42046)，但由於 MySQL 計劃淘汰 Index Hints，改為依賴 Query Optimizer 自動選擇索引 [MySQL is discontinuing the USE INDEX in favor of optimizer](https://dev.mysql.com/doc/refman/8.0/en/index-hints.html)，最終這項功能未能合併進 Rails。

因此，我們只能自行擴充 ActiveRecord，實作 `use_index` 函式，以方便我們手動指定 SQL index。

## 方法一：使用 from 函式

我們可以參考 [Stack Overflow](https://stackoverflow.com/questions/13904035/use-specific-mysql-index-with-rails) 上的解法，在 `initializers` 內新增一個檔案，透過 `from` 函式覆寫原本的 FROM table 語句，並在後面加上 USE INDEX 語句。

### 方法優缺點

優點：
  - `use_index` 可以在 `where`、`joins` 等操作之後使用，無論呼叫順序為何，生成的 SQL 語句都能保持正確。

缺點：
  - `from` 函式會互相覆寫，因此如果程式碼或第三方 gem（例如 [active_record_union](https://github.com/brianhempel/active_record_union)）有使用 `from` 來修改 FROM table，之後又想要用 `use_index` 去指定 index 的話，會導致 FROM table 被覆寫為原本的 table，產生不可預期的錯誤，甚至洩露資料庫整張表的資料出去

### 範例程式
```rb
module MyExtensions
  module ActiveRecord
    module UseIndex
      extend ActiveSupport::Concern

      class_methods do
        def use_index(index_name)
          from("#{quoted_table_name} USE INDEX(#{index_name})")
        end
      end
    end
  end
end

# include the extension
ActiveRecord::Base.include MyExtensions::ActiveRecord::UseIndex
```
## 方法二：使用 joins 函式

另一種方式是使用 `joins` 函式，首先我們先新增一個檔案在 `initializers` 內，然後使用 `joins` 函式，將 USE INDEX 插入到 FROM table 語句之後。

### 方法優缺點
優點：
  - 不用擔心覆寫問題，因為 joins 一定是插入新東西到語句內，不會去改變原本的 query 內容。

缺點：
  - 不能在同一個查詢中，多次使用 `use_index`，否則會產生多個 USE INDEX，導致 SQL 語法錯誤。
  - `joins` 的順序也要注意，必須在 `use_index` 之後執行。若先 joins 再使用 use_index，USE INDEX 會在 INNER JOIN 之後，導致 SQL 語法錯誤。

### 範例程式
```rb
module MyExtensions
  module ActiveRecord
    module UseIndex
      extend ActiveSupport::Concern

      class_methods do
        def use_index(index_name)
          joins("USE INDEX(#{index_name})")
        end
      end
    end
  end
end

# include the extension
ActiveRecord::Base.include MyExtensions::ActiveRecord::UseIndex
```

## 方法三：參考 Rails 的 PR

上述兩種方法各有優缺點，最佳方式可能是參考 Rails 曾實作但未合併的 [PR](https://github.com/rails/rails/pull/42046)，並將相關功能 patch 回自己的專案中。

但這可能需要改動到多個 Rails 底層的程式，實作起來相對複雜，這邊就不附範例程式了。如果有人成功完成這項改動，歡迎分享經驗與程式碼！
