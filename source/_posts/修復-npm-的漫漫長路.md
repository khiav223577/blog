---
title: 修復 npm 的漫漫長路
date: 2017-09-24 17:05:51
tags: npm
---

不知道為什麼，裝了幾個套件後 `npm` 就掛了。只好開始修復 `npm` 的漫漫長路...
終於感受到 `npm` 滿滿的坑坑坑

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
還是一樣，噴出同樣的錯誤

## Remove node_modules

Google 一下為什麼，找到這篇。有二十幾個讚，看起來不錯。
[Missing modules when running npm run build or npm install](https://github.com/olefredrik/FoundationPress/issues/780)

> The error in the original post is from running npm run build. I want to see the error from npm install
　 
Please do the following:
rm -rf node_modules
npm install
provide the contents of that error message
　
Thanks.

```
$ sudo rm -rf /usr/local/lib/node_modules/
$ npm install
-bash: /usr/local/bin/npm: No such file or directory
```

現在變成找不到 `npm` 了 @@

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

照 command line 中的提示打打看

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

conflicts 了，用最新的 overwrite 舊的應該沒關係吧
```
$ brew link --overwrite node

Linking /usr/local/Cellar/node/8.5.0... 
Error: Could not symlink share/doc/node/gdbinit
/usr/local/share/doc/node is not writable.
```

權限不足，改一下

```
$ sudo rm '/usr/local/share/doc/node/gdbinit'
$ sudo chown -R $USER /usr/local
```






brew doctor
brew prune













