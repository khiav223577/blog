---
title: Rails-進階小技巧（三）
subtitle: pluck 純數字
date: 2018-09-26 08:47:27
tags:
  - Rails
---

有時候我們會需要大量創立關聯。例如我們想要支援一次發送大量的好友請求時，我們需要建立 `user_id` 對應到 `friend_id` 的資料，最後 import 到資料庫去。

為了方便起見，我們先定義 import 的函式

```rb
class User < ApplicationRecord
  def import_relationship(data)
    User::Relationship.import([:user_id, :friend_id], data)
  end
end
```

從給定的 emails 取出要成為好友的人的 id 後，

再組合成 `[[id, friend_id1], [id, friend_id2], ...]` 的格式匯入。

```rb
class User < ApplicationRecord
  def send_friend_requests(emails)
    friend_ids = User.where(email: emails).pluck(:id)
    data = friend_ids.map{|friend_id| [id, friend_id] }
    import_relationship(data)
  end
end
```

不過其實 `id` 是固定的，我們可以在 pluck 的時候丟數字進去，這樣回傳時每筆 row 都會帶著該數字回來。這樣我們就不用自己組資料了，資料庫會幫你組好。

使用了這個小技巧後，程式碼可以變得更簡潔一點，不再需要客製化地組合資料：
```rb
class User < ApplicationRecord
  def send_friend_requests(emails)
    data = User.where(email: emails).pluck(id, :id)
    import_relationship(data)
  end
end
```

