---
title: Rails 進階小技巧（一）
subtitle: 在 one-to-one relation 上使用 update_all
date: 2018-04-19 18:54:25
tags:
  - Rails
  - active_model
---

## 一對一關聯會直接載入 model

假如我們有 user model 如下：

```rb
class User < ActiveRecord::Base
  has_one :profile
  has_many :posts
end
```

在 Rails 中 `has_one`, `belongs_to` 所定義的是`一對一關聯`。在操作這種關聯時，Rails 會直接下 SQL query 載入該物件，而不會給你一個 relation，讓你可以做進一步的操作（下 where 條件、joins 條件之類的）。

我們可以看到下面例子：


```rb
user.profile.class
# => Profile

user.posts.class
# => Post::ActiveRecord_Associations_CollectionProxy 
# P.S. ActiveRecord_Associations_CollectionProxy 繼承自 ActiveRecord::Relation
```

### touch
但有時候我們會想要直接 update 一對一的關聯，例如我們想要 touch 一下 user 的 profile。這時候因為 Rails 這項特性的關係，我們不能直接下 query 去更新，一定要先撈出 profile 物件、呼叫 touch 函式，函式再 update 資料回 database。

```rb
user.profile.touch

# SELECT `profiles`.* FROM `profiles` WHERE `profiles`.`user_id` = 5827 LIMIT 1
# UPDATE `profiles` SET `profiles`.`updated_at` = '2018-04-19 11:29:05' WHERE `profiles`.`id` = 1042936
```

### column = column + ?
或者是我們要直接進行 SQL 層操作，例如 user 獲得 10 點點數。我們一樣也是不能直接下 query 去更新，要先撈出 profile 物件，再從 profile id 去下 SQL 語句更新。
```rb
Profile.where(id: user.profile).update_all('point = point + 10')

# SELECT `profiles`.* FROM `profiles` WHERE `profiles`.`user_id` = 5827 LIMIT 1
# UPDATE `profiles` SET point = point + 10 WHERE `profiles`.`id` = 1042936
```


## Use association_scope

其實 Rails 的 `Association` 上有 `association_scope` 函式，可以取得 association 的 scope！而 association 物件的話，也可以藉由呼叫 model 上的 association 函式取得

```rb
profile_association = user.association(:profile)
profile_scope = profile_association.association_scope

profile_scope.class
# => Profile::ActiveRecord_Relation
```

取得 relation 後，要進行各種 SQL 的操作就很方便啦：

```rb
# touch
profile_scope.update_all(updated_at: Time.now)

# column = column + ?
profile_scope.update_all('point = point + 10')
```



