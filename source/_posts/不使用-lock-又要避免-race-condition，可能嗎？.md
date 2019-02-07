---
title: 不使用 lock 又要避免 race condition，可能嗎？
date: 2019-02-07 15:01:32
tags:
  - Rails
  - race condition
---

在 Rails 的框架下，對於如何防止 race condition 著墨並不多。因為 race condition 跟應用層邏輯比較有關，Rails 只是提供一些對 DB 或對 cache 方便操作的方式，這些方式是否會形成 race condition 是自己要去注意、並解決的。

## Select then Update

最常見到的例子是類似下面的例子這樣，從資料庫取出資料後，在應用端計算數值的變化，最後再將計算完的結果存回資料庫去。

```rb
def inc
  c = Counter.find(1)
  c.value += 1
  c.save
end
```

在這個例子中，因為撈取資料到存入資料庫中間會有時間差，而有發生 race condition 的可能。其中最簡單的一種解決辦法是使用 lock，在撈取資料前先鎖定該筆資料，避免其它人變動該資料。直到應用端計算完成，將資料存回資料庫後，再解除鎖定。如以下範例：

```rb
def inc
  c = Counter.find(1)
  c.with_lock do
    c.value += 1
    c.save
  end
end
```

用 lock 避免 race condition 這種方式在實作上很簡單，但效能上卻會大幅影響系統最大 I/O 吞吐量。假設每次對資料庫進行操作，操作時間加上伺服器跟資料庫的通訊時間為 1ms，每次要先撈資料回來計算再更新資料，二次動作需要 2ms 的時間。而同時間內因為 lock 的緣故，只能有一臺伺服器對該筆資料操作，則一秒鐘最多只能進行 500 次操作 (1000 / 2 = 500)。這還沒有考慮到伺服器計算所要花費的時間。

### Single query: update_counters

在比較簡單情境下，我們可以將要做的事寫成單一的 query 去操作資料庫。在大部份的資料庫系統中，單一個 query 都為 atomic 的，可以保證這個 query 一定會一次完成，中間不會插入任何其它操作。在上面的例子當中，我們可以使用 Rails 提供的 [update_counters](https://api.rubyonrails.org/classes/ActiveRecord/CounterCache/ClassMethods.html#method-i-update_counters) 函式做到這件事。

```rb
def inc
  Counter.update_counters(1, value: 1)
  # UPDATE "counters" SET "value" = COALESCE("value", 0) + 1 WHERE "counters"."id" = 1
end
```

## Validate then Update

另一個很常見的例子是，我們要驗證數量是否足夠，足夠的話扣除，不足的話回傳錯誤

```rb
def consume
  return false if money < 1000
  self.money -= 1000
  return save
end
```

這個例子下，發生 race condition 會比較危險一點，可能會導致買了二樣東西卻只扣一次錢。但同樣地，我們也可以改用 lock 的方式去避免 race condition 的情況

```rb
def consume
  with_lock do
    return false if money < 1000
    self.money -= 1000
    return save
  end
end
```

### Single query: update_all

我們可以將邏輯變化一下，然後移到資料層去處理。

原本的邏輯是：
1. 到資料庫撈資料
2. 伺服器檢查是否足夠
3. 若足夠，扣除金額後存回資料庫

修改後的邏輯是：
1. 跟資料庫說如果擁有的錢足夠就扣錢
2. 資料庫回傳更新了幾筆資料
3. 伺服器檢查是否有資料被更新，有的話代表成功扣到錢

我們可以使用 Rails 提供的 [update_all](https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-update_all) 函式撰寫需要的 query。
```rb
def consume
  return User.where(id: id).where('money >= ?', 1000).update_all('money = money - ?', 1000) == 1
end
```

或者我們可以使用 [atomically](https://github.com/khiav223577/atomically) gem 提供的 [decrement_unsigned_counters](https://github.com/khiav223577/atomically#decrement_unsigned_counters-counters) 函式。
```rb
def comsume
  atomically.decrement_unsigned_counters(money: 1000)
end
```

