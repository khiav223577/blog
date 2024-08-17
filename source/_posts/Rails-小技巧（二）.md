---
title: Rails 進階小技巧（二）
subtitle: joins 時使用其它 Model 的 scope 函式
date: 2018-05-19 14:20:13
categories:
  - 程式開發
tags:
  - Rails
  - active_model
---

假如我們有 user model 如下：

```rb
class User < ActiveRecord::Base
  has_many :posts
end
```

而我們想要找到「最近 N 天有發文的帳號」，可以這樣寫：

```rb
User.joins(:posts).where('posts.created_at >= ?', N.days.ago).uniq.pluck(:account)
```

若我們又要找到「最近 N 天文章的數量」的話：

```rb
Post.where('created_at >= ?', N.days.ago).count
```

## 使用 scope

但是我們發現 `created_at >= ?` 語句在多個地方用到，想要將它寫成 scope，使之更加語義化，因而加上了 `in_n_days` 這個 scope。

```rb
class Post < ActiveRecord::Base
  scope :in_n_days, ->(n){ where('posts.created_at > ?', n.days.ago) }
end
```

於是撈「最近 N 天文章的數量」的語句可以改寫成這樣：

```rb
Post.in_n_days(N).count
```

但是要撈「最近 N 天有發文的帳號」時卻不能用這個 scope。因為這個 scope 只定義在 Post 上，沒有定義在 User 上。

```rb
User.joins(:posts).in_n_days(N).uniq.pluck(:account)
# => undefined method `in_n_days' for #<User::ActiveRecord_Relation>
```
若要因為這個情境而在 user 上也加上這個 scope 的話，又會導致有二個類似的 scope，不太符合 DRY 的精神。

## 合併二個 Scope

其實 Rails 提供 `merge` 這個函式，因為比較不常用，很多人不知道這個函式的存在。但在剛才的情境中，這個函式非常好用，讓我們能在當前 Model 中使用別的 Model 的 scope。

例如前面我們要撈「最近 N 天有發文的帳號」的話，若使用 `merge` 函式，就能在 User 上使用到定義在 Post 中的 scope，而能寫成這樣：

```rb
User.joins(:posts).merge(Post.in_n_days(N)).uniq.pluck(:account)
```


