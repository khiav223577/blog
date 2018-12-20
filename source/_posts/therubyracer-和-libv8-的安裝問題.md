---
title: therubyracer 和 libv8 的安裝問題
date: 2018-12-20 21:05:58
tags: gem
---

本來以為是 library 檔問題，試了參照網路上的教學安裝 v8 但沒有用
```
brew install v8
# or
brew install v8-315
```

後來錯誤嘗試發現是很蠢的問題

在此記下來以免忘記

## 移除乾淨所有版本

首先要先把所有裝好的 `therubyracer`, `libv8` 都移除
```
gem uninstall -a libv8
gem uninstall -a therubyracer
```

## 先裝好 therubyracer

假如要裝 [therubyracer 0.12.1](https://rubygems.org/gems/therubyracer/versions/0.12.1) (February 03, 2014) 版的話：

```
gem install libv8 -v '3.16.14.13'
gem install therubyracer -v '0.12.1'
```

假如要裝 [therubyracer 0.12.2](https://rubygems.org/gems/therubyracer/versions/0.12.2) (April 07, 2015) 版的話：

```
gem install libv8 -v '3.16.14.13'
gem install therubyracer -v '0.12.2'
```

假裝要裝 [therubyracer 0.12.3](https://rubygems.org/gems/therubyracer/versions/0.12.3) (January 05, 2017) 版的話：

```
gem install libv8 -v '3.16.14.15'
gem install therubyracer -v '0.12.3'
```

## 更新 libv8

裝好 therubyracer 後再跑 bundle 把 libv8 升到最新版。

一定要用指定版號的 libv8 才能成功安裝 therubyracer （以上都是我錯誤嘗試試出來可以 work 的版本）。詳細原因不明，可能是他套件沒有處理好吧。假如先裝了 [libv8 3.16.14.19](https://rubygems.org/gems/libv8/versions/3.16.14.19-x86_64-darwin-15) 的話，就無法成功安裝 [therubyracer 0.12.3](https://rubygems.org/gems/therubyracer/versions/0.12.3) 

