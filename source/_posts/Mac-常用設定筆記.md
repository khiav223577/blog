---
title: Mac 常用設定筆記
date: 2017-08-29 02:04:11
tags: Mac
---
指令使用方法：開啟「終端機」視窗，貼上指令即可。
![image](https://user-images.githubusercontent.com/4011729/29791881-30c693d4-8c71-11e7-8e28-e1fb52374e75.png)


## Dock 工具列
### 加快 Dock 的顯示速度
```
# 取消 dock 的延遲
defaults write com.apple.Dock autohide-delay -float 0 && killall Dock

# 還原 dock 的延遲
defaults delete com.apple.Dock autohide-delay && killall Dock

# 取消 dock 的動畫
defaults write com.apple.dock autohide-time-modifier -int 0 && killall Dock

# 還原 dock 的動畫
defaults delete com.apple.dock autohide-time-modifier && killall Dock
```

<!-- ------------------------------ -->

## Chrome
### 禁用雙指跳轉上下頁的手勢
```
defaults write com.google.Chrome.plist AppleEnableSwipeNavigateWithScrolls -bool FALSE
```

<!-- ------------------------------ -->

## Finder
### 讓 Finder 顯示完整路徑名字
```
defaults write com.apple.finder _FXShowPosixPathInTitle -bool YES
```

### 隱藏檔
```
# 顯示隱藏檔案
defaults write com.apple.finder AppleShowAllFiles TRUE;\killall Finder

# 不顯示隱藏檔案
defaults write com.apple.finder AppleShowAllFiles FALSE;\killall Finder

```

### Library 資料夾
```
# 顯示 Library 資料夾
chflags hidden ~/Library

# 隱藏 Library 資料夾
chflags nohidden ~/Library
```

<!-- ------------------------------ -->

## Terminal
### 看 commands history
```
open /Users/YOUR_USER_NAME/.bash_history 
```

<!-- ------------------------------ -->

## 其它
### 更改電腦名字
```
sudo scutil --set HostName name-you-want
```
### 加快鍵盤游標速度
```
defaults write NSGlobalDomain KeyRepeat -int 1
```
