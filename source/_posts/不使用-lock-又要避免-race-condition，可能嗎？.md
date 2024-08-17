---
title: 不使用 lock 又要避免 race condition，可能嗎？
date: 2019-02-07 15:01:32
categories:
  - 程式開發
tags:
  - Rails
  - race condition
---

在 Rails 的框架下，官方文件對於如何防止 race condition 著墨並不多。可能是因為 race condition 跟應用層邏輯比較有關，Rails 只是提供一些對 DB 或對 cache 方便操作的方式，這些方式是否會形成 race condition 是自己要去注意、並解決的。

接下來文章會舉幾個常見容易發生 race condition 的例子。先試著用 lock 的方式解決問題，再嘗試用非 lock 的方式解決。

## Example 1: Select then Update

這是一個很常見的例子。我們從資料庫取出資料後，回到應用端計算數值的變化，最後再將計算完的結果存回資料庫去。

```rb
def inc
  c = Counter.find(1)
  c.value += 1
  c.save
end
```

在這個例子中，因為撈取資料到存入資料庫中間會有時間差，而有發生 race condition 的可能。例如同時有二個 request 都打到這個 API，二個 processes 同時都撈到數值 30，計算完 30 + 1 = 31 後，存入 31 到資料庫。但因為打了二次 API，正確的數值應該要加 2 變成 32。

### Solution: Lock the record

解決這個問題其中最簡單的一種辦法是使用 lock。在撈取資料前先鎖定該筆資料，避免其它人變動該資料。直到應用端計算完成，將資料存回資料庫後，再解除鎖定。這樣的話，二個 processes 不會同時進到 lock 內，會等到其中一個計算完，存入 31 後，另一個 request 再撈到 31 ，計算完 32 後存入資料庫。

如以下範例：

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

### Solution: Use Single Query

在比較簡單情境下，我們可以將要做的事寫成單一的 query 去操作資料庫。在大部份的資料庫系統中，單一個 query 都為 atomic 的，可以保證這個 query 一定會一次完成，中間不會插入任何其它操作。在這個例子當中，我們可以使用 Rails 提供的 [update_counters](https://api.rubyonrails.org/classes/ActiveRecord/CounterCache/ClassMethods.html#method-i-update_counters) 函式做到這件事。

```rb
def inc
  Counter.update_counters(1, value: 1)
  # UPDATE "counters" SET "value" = COALESCE("value", 0) + 1 WHERE "counters"."id" = 1
end
```

該函式會直接下一條指令到資料庫中，將指定欄位的數值加 1。這樣的話資料不會回到應用層，直接由資料庫幫你計算完畢。效能跟平常我們 save model 幾乎一樣，只是一個 update 語句的時間而已。

## Example 2: Validate then Update

另一個很常見的例子是，我們要驗證數量是否足夠，足夠的話扣除，不足的話回傳錯誤。這個情況若發生 race condition 會比較危險一點。可能會導致買了二樣東西卻只扣一次錢，或是一張票被好幾個人買到。

```rb
def consume(cost = 1000)
  return false if money < cost

  self.money -= cost
  return save
end
```

在這個例子中，因為二個 request 同時進行的關係，二者都撈到使用者當前的錢（假設是 1200），因為驗證 1200 錢足夠，就扣錢，將剩餘的錢 200 更新回資料庫。二個 request 都通過驗證並且執行購買成功的流程，但最後資料庫記錄的卻只有扣過一次錢後，剩餘的錢 200元。


### Solution: Lock the record

同樣地，我們也可以改用 lock 的方式去避免 race condition 的情況。

```rb
def consume(cost = 1000)
  with_lock do
    return false if money < cost

    self.money -= cost
    return save
  end
end
```

### Solution: Single query

我們可以將邏輯變化一下，一樣也透過一次 update query 來達成我們要的`驗證` ＋ `更新`。讓資料層能幫我們直接處理好二個動作，避免動作之間插入其它人而造成 race condition。

原本的邏輯是：
1. 到資料庫撈資料（撈到 1200 元）
2. 應用程檢查是否足夠（1200 > 1000，足夠）
3. 扣除金額後存回資料庫（存入 1200 - 1000 = 200）

修改後的邏輯是：
1. 到資料庫中找到「使用者 id 為你自己」且「擁有足夠錢」的人，扣除他的錢（扣 1000 元）
2. 資料庫回傳更新了幾筆資料
3. 判斷錢是否足夠（因為 query 有限制 id，所以若成功的話會回傳 1 筆，失敗則回傳 0 筆）

我們可以使用 Rails 提供的 [update_all](https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-update_all) 函式撰寫需要的 query。
```rb
def consume(cost = 1000)
  User.where(id: id).where('money >= ?', cost).update_all('money = money - ?', cost) == 1
  # UPDATE "users" SET "money" = money - 1000 WHERE money >= 1000
end
```

或者我們可以使用 [atomically](https://github.com/khiav223577/atomically) gem 提供的 [decrement_unsigned_counters](https://github.com/khiav223577/atomically#decrement_unsigned_counters-counters) 函式。該函式等價於上面的 update_all 的寫法。
```rb
def comsume(cost = 1000)
  atomically.decrement_unsigned_counters(money: cost)
end
```

## 總結

這邊我們舉出二種例子，可以單純使用 update 語句取代 lock 的寫法。這樣的好處是，update 的話伺服器只要對資料庫作一次性的單向溝通，不需要做多次溝通，避免時間都花費在與資料庫的通信當中，也減少了長時間的 lock 等待。

當然實際上我們在寫時，可能會遇到更複雜的情境。也許在非效能瓶頸的地方，可以採用 lock 的方式來實作也沒關係，開發上會更有效率。


