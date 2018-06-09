---
title: 在 irb 貼上多行腳本的方法
date: 2018-06-09 14:17:31
tags:
  - Ruby
  - irb
---

有時候程式碼太長，為了簡潔我們會將程式斷行。

```rb
emails = User.where('last_login_at >= ?', 7.days.ago)
             .where.not(confirmed_at: nil)
             .where.not(email: nil)
             .pluck(:email)
```

但這樣子斷行的方式，無法直接貼到 irb 內。因為 irb 在每一行的結束就會立刻執行該段程式，無法將多行程式串接在一起執行。

## trailing .

一種解法方式是將 `.` 移到上一行行尾，這樣 irb 就會知道那一行還沒有結束，而不會立刻執行程式。
```rb
emails = User.where('last_login_at >= ?', 7.days.ago).
              where.not(confirmed_at: nil).
              where.not(email: nil).
              pluck(:email)
```

## Escape the newline

也可以用 `\` 將行尾的換行符號跳脫掉。irb 沒有接收到換行符號，就不會將這一行結束而立刻執行。

```rb
emails = User.where('last_login_at >= ?', 7.days.ago) \
             .where.not(confirmed_at: nil) \
             .where.not(email: nil) \
             .pluck(:email)
```

## Begin .. end

另一種方式是將程式碼包在 `begin` 內，中間貼上你的程式碼。irb 會在你的 begin 定義結束後，才去跑裡面的程式。
```rb
begin
  emails = User.where('last_login_at >= ?', 7.days.ago)
               .where.not(confirmed_at: nil)
               .where.not(email: nil)
               .pluck(:email)
end
```

## Pry

假如你使用的是 `Pry` 的話，它有一個 [BUG](https://github.com/pry/pry/issues/1524) 會使得你無法執行多行程式碼。
解法是在 console 內輸入這一行：
```rb
Pry.commands.delete /\.(.*)/
```
