---
title: 升級 Debian 的 sqlite 到最新版
date: 2018-11-30 01:12:42
categories:
  - 環境設定
tags:
 - Debian
 - SQLite
---

在測試 [activerecord-import](https://github.com/zdennis/activerecord-import) 的 [on-duplicate-key-update](https://github.com/zdennis/activerecord-import#duplicate-key-update) 時，為了方便而選用了 sqlite。沒想到卻遇到版本太舊的問題。
> MySQL, PostgreSQL (9.5+), and SQLite (3.24.0+) support on duplicate key update

## 移除 Debian 預設 sqlite

在 Debian 中，預設已經幫你裝好 sqlite ，但它的版本還蠻舊的。在官方 [package source](https://packages.debian.org/jessie/sqlite3) 裡，最新版 sqlite 也只來到了 3.8.7。這代表我們若使用 `apt-get install sqlite3` 去裝 sqlite 的話，最高只能裝到 3.8.7 版的。因此我們要先把它們都移除掉，再使用其它方式安裝：
```
apt-get remove libsqlite3-dev
apt-get remove sqlite3
```

## 裝 LinuxBrew

先準備好 ruby 環境，然後跑以下指令安裝
```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install)"
```

## 利用 brew 安裝最新版 sqlite

```
brew install sqlite
```

裝好後輸入
```
brew list sqlite
```

會顯示出 sqlite 的檔案路徑
```
/home/linuxbrew/.linuxbrew/Cellar/sqlite/3.25.2/bin/sqlite3
/home/linuxbrew/.linuxbrew/Cellar/sqlite/3.25.2/include/ (2 files)
/home/linuxbrew/.linuxbrew/Cellar/sqlite/3.25.2/lib/pkgconfig/sqlite3.pc
/home/linuxbrew/.linuxbrew/Cellar/sqlite/3.25.2/lib/ (4 files)
/home/linuxbrew/.linuxbrew/Cellar/sqlite/3.25.2/share/man/man1/sqlite3.1
```

因為用 brew 裝的 sqlite 不是在系統預設的路徑 `/usr/lib/`, `/usr/include/` 內，所以我們在裝 ruby 的 sqlite bindings ([sqlite3-ruby](https://github.com/sparklemotion/sqlite3-ruby)) 時要特別指定路徑，它才找得到
> If you have sqlite3 installed in a non-standard location, you can specify the location of the include and lib files by doing:
```
gem install sqlite3 -- --with-sqlite3-include=/opt/local/include \
   --with-sqlite3-lib=/opt/local/lib
```

我們利用剛才印出來的檔案路徑找到 sqlite 的 `include`, `lib` 位址後，將它填入安裝指令中：
```
# 填入 include 路徑為 --with-sqlite3-include="'/home/linuxbrew/.linuxbrew/Cellar/sqlite/3.25.2/include'"
# 填入 lib 路徑為 --with-sqlite3-lib="'/home/linuxbrew/.linuxbrew/Cellar/sqlite/3.25.2/lib'"

gem install sqlite3 --platform=ruby -- --with-sqlite3-include="'/home/linuxbrew/.linuxbrew/Cellar/sqlite/3.25.2/include'" --with-sqlite3-lib="'/home/linuxbrew/.linuxbrew/Cellar/sqlite/3.25.2/lib'"
```

安裝好便完成了

## 測試 sqlite 版本

在 irb 內輸入
```rb
require 'sqlite3'
begin
  tmp_db_path = 'tmp-get-sqlite-version.db'
  db = SQLite3::Database.new(tmp_db_path)
  db.execute('select sqlite_version();')
ensure
  File.delete(tmp_db_path) 
end
# => [["3.25.2"]]
```

假如有 rails console 能用的話，會更簡單一點
```rb
ActiveRecord::Base.connection.send(:sqlite_version).instance_variable_get(:@version)
# => [3, 25, 2]
```
