---
title: 【Rails Bug 分析】model 儲存時會額外下 query 重新載入關聯
date: 2018-08-12 17:37:25
tags:
  - Rails
  - active_model
---

## BUG 觸發條件

第一個觸發該 BUG 的情境是，載入過 association 後又改變其 foreign_key。

```rb
post = Post.take
post.user.do_something # 載入 association
post.user_id = 123     # foreign_key 被改變
post.save
# 會多花一個 query 去載入 user
# => SELECT  `users`.* FROM `users` WHERE `users`.`id` = 123 LIMIT 1
```

第二個觸發情境是，查詢過某個 association 是否載入過，卻沒有真的載入。
```rb
post = Post.take
post.association(:user).loaded?
post.save
# 會多花一個 query 去載入 user
# => SELECT  `users`.* FROM `users` WHERE `users`.`id` = 1 LIMIT 1
```

## BUG 狀態

Rails 4.2.x 都有問題
Rails 5 後 `belongs_to` 已修復: [#23498 - Don't unnecessarily load a belongs_to when saving.](https://github.com/rails/rails/pull/23498)。但 `has_one` 還未修復。

## BUG 原因

在呼叫 association 時，會先從 `association_cache` 內找，假如找不到的話會 create 新的 association 物件，並寫入 association_cache。此時只會有 association 物件，model 資料還沒有載入，`association.loaded?` 為 false。[ref](https://github.com/rails/rails/blob/v4.2.10/activerecord/lib/active_record/associations.rb#L157-L167)
```rb
def association(name) #:nodoc:
  association = association_instance_get(name)

  if association.nil?
    raise AssociationNotFoundError.new(self, name) unless reflection = self.class._reflect_on_association(name)
    association = reflection.association_class.new(self, reflection)
    association_instance_set(name, association)
  end

  association
end
```

在物件儲存時，rails 會檢查哪些 association 需要 `autosave`。會去 association_cache 取出 association 物件，然後呼叫 `load_target` 取出 model 內容。但如果物件資料還沒有載入時，`load_target` 會下 query 去載入 model 資料。這其實是不需要的，因為假如子物件沒有載入過，代表子物件不可能有變動，不需要 `autosave`。[ref](https://github.com/rails/rails/blob/v4.2.10/activerecord/lib/active_record/autosave_association.rb#L431-L452)
```rb

def save_belongs_to_association(reflection)
  association = association_instance_get(reflection.name)
  record      = association && association.load_target
  # ...
end
```

## Workarounds

可以在 `initializers` 內加上以下程式碼
```rb
module ActiveRecord
  module Associations
    def association_loaded?(name)
      association = association_instance_get(name)
      return false if association == nil
      return association.loaded?
    end
  end
end
```

用這個函式取代原本的寫法，以避開 BUG
```rb
# before
association(:user).loaded?

# after
association_loaded?(:user)
```
