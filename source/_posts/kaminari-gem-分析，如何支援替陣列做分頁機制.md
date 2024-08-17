---
title: kaminari gem 分析，如何支援替陣列做分頁機制
date: 2024-08-17 16:18:51
categories:
  - 程式開發
tags:
  - Rails
  - Ruby
  - pagination
---

## 介紹

一般我們使用 kaminari 時，是為了想要替 ActiveRecord 做分頁，以避免一次性讀取所有資料。但有時候資料來源並非來自資料庫，例如當我們想顯示一個大型的 CSV 檔案時，行數過多需要分頁來優化顯示。此時我們會需要對一個陣列進行分頁。

其實，Kaminari 已經提供了一個 paginate_array 的 class method，讓我們可以對陣列進行分頁。這個方法會將陣列加上一些分頁相關的函式，讓它能夠配合分頁的 helper 函式 (pagination) 來 render 出分頁。


Ex:
```rb
assets = Kaminari.paginate_array(array).page(params[:page]).per(params[:per])
paginate(assets)
```

## 實作

Kaminari 的[內部實作](https://github.com/amatsuda/kaminari/blob/v1.1.1/kaminari-core/lib/kaminari/models/array_extension.rb)較為複雜，我們來看看如果自己要實作一個支援分頁的陣列時，該怎麼做呢？

首先先觀察 source code 中 [paginate](https://github.com/amatsuda/kaminari/blob/v1.1.1/kaminari-core/lib/kaminari/helpers/helper_methods.rb#L21-L27) 函式的實作

> ```rb
> def paginate(scope, paginator_class: Kaminari::Helpers::Paginator, template: nil, **options)
>   options[:total_pages] ||= scope.total_pages
>   options.reverse_merge! current_page: scope.current_page, per_page: scope.limit_value, remote: false
>   
>   paginator = paginator_class.new (template || self), options
>   paginator.to_s
> end
> ```

這個函式主要會呼叫 scope 的三個方法：
1. `total_pages`: 總頁數
2. `current_page`: 當前頁數
3. `limit_value`: 每頁顯示的行數

### 定義屬性

首先，因為分頁需要上面三個方式，我們可以先定義好我們的陣列 class，並加上這幾個屬性：

```rb
class ArrayWithPagination < Array
  attr_accessor :current_page
  attr_accessor :total_pages
  attr_accessor :limit_value
end
```

接著，我們需要實作分頁機制、加上 `page` 與 `per` 這兩個函式。並在呼叫這二個函式的過程中，將上述三個屬性賦值為正確的數字。

### 實作 page 函式

page 函式是用來設定當前頁數的。這邊可以單純先將資訊記錄在 instance variable (@page) 上，然後回傳自己，以利後續做 method chaining。

```rb
class ArrayWithPagination < Array
  def page(page_value)
    @page = page_value
    return self
  end
end
```

### 實作 per 函式

per 函式是用來設定每頁顯示的行數的。我們需要計算並設定各屬性，並切割陣列，讓後續 render 時僅顯示當前頁面的資料。切割陣列時，我們要計算資料的起始位置 (start_idx) 與結束位置 (end_idx)。

當一頁有 N 筆資料時，第 1 頁的資料區間是 `0 ~ N-1`，第 2 頁的的資料區間是 `N ~ 2N - 1` 同理，第 K 頁的資料區間就是 `(K - 1) * N ~ (K - 1) * N + (N - 1)`。知道資料區間後，我們就知道該如何切割陣列。

Ex:
```rb
class ArrayWithPagination < Array
  def per(per_page)
    per_page = per_page.to_i
    start_idx = (@page ? @page.to_i - 1 : 0) * per_page
    end_idx = start_idx + per_page - 1

    ArrayWithPagination.new(self[start_idx...end_idx] || [])
  end
end
```

接著我們需要設定三個屬性
1. `current_page` 很簡單就設定為 page 函式中記錄的 instance variable (@page) 就好了
2. `total_pages` 則可以用陣列長度 (size) 除以每頁筆數 (per_page) 來得到
3. `limit_value` 也很簡單就是每頁筆數 (per_page)

Ex:
```rb
new_array.current_page = (@page || 1).to_i
new_array.total_pages = size / per_page
new_array.limit_value = per_page
```

## 程式碼

最終實作成程式如下：

```rb
class ArrayWithPagination < Array
  attr_accessor :current_page
  attr_accessor :total_pages
  attr_accessor :limit_value

  def page(page_value)
    @page = page_value
    return self
  end

  def per(per_page)
    per_page = per_page.to_i
    start_idx = (@page ? @page.to_i - 1 : 0) * per_page
    end_idx = start_idx + per_page - 1

    ArrayWithPagination.new(self[start_idx...end_idx] || []).tap do |new_array|
      new_array.current_page = (@page || 1).to_i
      new_array.total_pages = size / per_page
      new_array.limit_value = per_page
    end
  end
end
```

## 後記

這篇文章是記錄當時我在實作陣列分頁時的做法，後來發現其實 kaminari gem 內就有相關的實作了，特別用這邊文章留存一下當時實作的想法。

自己實作的版本好處在於較輕量，目前使用上雖然沒有遇到問題，但 gem 內的實作應該會考慮到更多的 edge case，未來比較不會踩雷。
