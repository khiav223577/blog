---
title: Ruby code tracing 技巧
date: 2017-09-11 01:23:57
tags: Ruby
header-img: /blog/imgs/debuff_ruby_code.png
---

## 搜尋物件上的方法

Ruby 反射機制中提供了 `methods` 方法，可以回傳物件上所有可以使用的方法。
再配合上 [Enumerable#grep](http://www.rubydoc.info/stdlib/core/Enumerable#grep-instance_method) 函式，能找到函式名字符合搜尋規則的項。如：

```rb
User.new.methods.grep /json$/
# => [:include_root_in_json, :as_json, :from_json, :to_json]
```
> 這邊要注意到的一點是：`methods` 並不會回傳 `private` 函式，只會回傳 `public` 和 `protected` 函式。若需要更精細的搜尋時，Ruby 另外有 public_methods、protected_methods、private_methods...等可以使用。

### 搜尋實例方法

假如想要從 `Class` 搜尋實例方法的話，則可以使用 `instance_methods`：

```rb
User.instance_methods.grep /yaml/
# => [:to_yaml, :to_yaml_properties, :psych_to_yaml]
```

> 同樣地，這裡所回傳的函式也不會有 `private` 的函式。可以透過相關的函式做更進階的查找：public_instance_methods、protected_instance_methods、private_instance_methods

## 查看函式原始碼
### 函式物件

在 Ruby 中，所有的東西都是物件。我們可以透過 [Object#method](http://www.rubydoc.info/stdlib/core/Object:method) 函式，把物件的函式拿出來：
```rb
User.new.method(:to_yaml)
# => #<Method: User(Object)#to_yaml(psych_to_yaml)> 
```

有了函式物件後，我們可以先稍微看一下該物件有什麼函式可以用。但是因為物件是繼承 `Object` 來的，也一併繼承了非常多的內建函式，難以搜尋該物件真正定義的函式。此時我們可以直接將取得到函式扣掉 `self.methods` ，就能排除掉原生函式了：
```rb
User.new.method(:to_json).methods - methods
# => [:[], :to_proc, :call, :name, :receiver, :arity, :curry, 
# :source_location, :parameters, :original_name, :owner, :unbind, :super_method] 

methods.size
# => 164
```

### 函式定義的文件與行數

有了函式物件後，我們可以透過 [Method#source_location](http://www.rubydoc.info/stdlib/core/Method:source_location) 函式，獲取函式定義所在的文件路徑以及行數。有了這項資訊我們就能找到函式的原始碼位置，做進一步的查看或修改。

```rb
location = User.new.method(:to_json).source_location
# => ["/Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/activesupport-4.2.9/lib/
# active_support/core_ext/object/json.rb", 31]

`open #{location[0]}` # 開啟編輯器
# => ""
```

這邊順便分享一個無意間看到的小套件 [where_is](https://github.com/daveallie/where_is)，基本上就是把這篇文章所講的東西都包起來。
