---
title: 修復 npm 的漫漫長路
date: 2017-09-24 17:05:51
categories:
  - 環境設定
tags: npm
header-img: /blog/imgs/header_img/npm_update_check_failed.png
---

不知道為什麼，裝了幾個套件後 `npm` 就掛了。只好開始修復 `npm` 的漫漫長路...
深深感受到 `npm` 滿滿的坑 XD

```
$ npm

module.js:471
    throw err;
    ^
Error: Cannot find module '../lib/utils/unsupported.js'
    at Function.Module._resolveFilename (module.js:469:15)
    at Function.Module._load (module.js:417:25)
    at Module.require (module.js:497:17)
    at require (internal/module.js:20:19)
    at /usr/local/lib/node_modules/npm/bin/npm-cli.js:19:21
    at Object.<anonymous> (/usr/local/lib/node_modules/npm/bin/npm-cli.js:92:3)
    at Module._compile (module.js:570:32)
    at Object.Module._extensions..js (module.js:579:10)
    at Module.load (module.js:487:32)
    at tryModuleLoad (module.js:446:12)
```

## Reinstall npm
先試著重裝 `npm` 好了

```
$ brew uninstall --ignore-dependencies npm
$ brew install npm
$ npm

module.js:471
    throw err;
    ^
```

等待半小時終於裝好
結果還是一樣，噴出同樣的錯誤

## Remove node_modules

Google 一下為什麼，找到這篇。有二十幾個讚，看起來不錯。
[Missing modules when running npm run build or npm install](https://github.com/olefredrik/FoundationPress/issues/780)

> The error in the original post is from running npm run build. I want to see the error from npm install
　 
Please do the following:
rm -rf node_modules
npm install
provide the contents of that error message
　
Thanks.

文章建議移除全部套件後再重裝
以前也有不少次經驗是移除後再裝，就能恢復正常了 XD
那就試看看吧：

```
$ sudo rm -rf /usr/local/lib/node_modules/
$ npm install
-bash: /usr/local/bin/npm: No such file or directory
```

結果變成找不到 `npm` 了 @@

## Reinstall npm again


再重裝一次試看看

```
$ brew install npm
Updating Homebrew...
==> Auto-updated Homebrew!
Updated 1 tap (homebrew/core).
No changes to formulae.

Warning: node 8.5.0 is already installed, it's just not linked.
You can use `brew link node` to link this version.
```

系統說已經有 `npm` 了，但連結不到！？

## Link node

可能是什麼參照沒有設定好，照 command line 中的提示打打看。

```
$ brew link node

Linking /usr/local/Cellar/node/8.5.0... 
Error: Could not symlink share/doc/node/lldb_commands.py
Target /usr/local/share/doc/node/lldb_commands.py
already exists. You may want to remove it:
  rm '/usr/local/share/doc/node/lldb_commands.py'

To force the link and overwrite all conflicting files:
  brew link --overwrite node

To list all files that would be deleted:
  brew link --overwrite --dry-run node
```

系統提示說 `conflicts` 了，直接用最新的覆寫舊的應該 OK 吧
```
$ brew link --overwrite node

Linking /usr/local/Cellar/node/8.5.0... 
Error: Could not symlink share/doc/node/gdbinit
/usr/local/share/doc/node is not writable.
```

權限不足無法覆寫，只好改一下檔案權限再試一次

```
$ sudo rm '/usr/local/share/doc/node/gdbinit'
$ sudo chown -R $USER /usr/local
$ brew link --overwrite node
$ npm
-bash: /usr/local/bin/npm: No such file or directory
```

沒用 😿

## brew doctor

查到 brew 有指令能修復，試試看

```
$ brew doctor
$ brew prune
$ npm
-bash: /usr/local/bin/npm: No such file or directory
```

沒用x2 😿😿

## Reinstall npm again 2

用另一種方式裝 `npm` 看看

```
$ curl -L http://npmjs.org/install.sh | sudo sh
$ npm
> -bash: /usr/local/bin/npm: No such file or directory
```

沒用x3 😿😿😿


## 用非 brew 的方式裝 npm

查到一篇文章說， `npm` 用官網建議的方式裝，不要用 `brew` 裝
[Fixing npm On Mac OS X for Homebrew Users](https://gist.github.com/DanHerbert/9520689)
> Installing node through Homebrew can cause problems with npm for globally installed packages. To fix it quickly, use the solution below. An explanation is also included at the end of this document.

照著它的指令安裝看看


### Remove node

先移除剛才裝的 `node`

```
$ rm -rf /usr/local/lib/node_modules
$ brew uninstall --ignore-dependencies node

Uninstalling /usr/local/Cellar/node/8.5.0... (4,082 files, 17.2MB)
Error: Permission denied - /usr/local/Cellar/node/8.5.0/lib/node_modules/npm

$ sudo brew uninstall --ignore-dependencies node

Error: Running Homebrew as root is extremely dangerous and no longer supported.
As Homebrew does not drop privileges on installation you would be giving all
build scripts full access to your system.
```

結果還刪不掉，只好硬砍

```
$ sudo rm -f /usr/local/Cellar/node/8.5.0/lib/node_modules/npm
$ brew uninstall --ignore-dependencies node

Uninstalling /usr/local/Cellar/node/8.5.0... (4,081 files, 17.2MB)
Error: Permission denied - /usr/local/Cellar/node/8.5.0/share/man/man5/npm-folders.5

$ sudo rm -rf /usr/local/Cellar/node
$ brew uninstall --ignore-dependencies node
```

總算刪掉

### 安裝沒有 npm 的 node

照著文章的教學走，先裝 `node`，但不要裝 `npm`

```
$ brew install node --without-npm
$ echo prefix=~/.npm-packages >> ~/.npmrc
```

等待半小時終於裝好，然後用官網的安裝方式安裝 `npm`

```
$ curl -L https://www.npmjs.com/install.sh | sh
$ export PATH="$HOME/.npm-packages/bin:$PATH"
```

再等待數十分鐘的安裝時間，等到快要睡著 XD

```
$ npm
-bash: npm: command not found
```

結果一點用也沒有 😿😿😿😿


## Search npm location

感覺 `npm` 是有成功裝好，但只是參照路徑沒有設好，所以找不到
下指令搜尋一下 npm 在哪裡：

```
find / -iname npm
```

結果找不到實體執行檔，都是捷徑，冏
不知道我的 `npm` 跑去哪裡了

## Reinstall npm again 3

找到一篇 [Mac 重新安裝 npm](http://iambigd.blogspot.tw/2014/06/npm.html) 的教學
可能是我東西沒有刪乾淨，因此照著該 blog 的方法刪資料：

```
$ brew uninstall --ignore-dependencies node
$ rm -rf /usr/local/bin/node
$ rm -rf /usr/local/bin/npm
$ rm -rf /usr/local/bin/node_modules
```

然後再安裝一次
```
$ brew install node
$ npm -v
5.3.0
```

結果就成功啦！！

原來一切就只是我重新安裝時，資料沒有清乾淨惹的禍 😪

不過總算能繼續開發程式了～～
感恩師父，讚嘆師父






