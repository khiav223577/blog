---
title: 在 hexo 上踩過的雷
date: 2017-08-13 15:25:35
tags:
  - Hexo
---
## 部署到 github 後頁面未更新
本機測試都正常，也成功部署到 github 上了，網頁卻遲遲沒有更新
拜讀 stackoverflow 上的這篇 [Github Page not updating](https://stackoverflow.com/questions/20422279/github-pages-are-not-updating) 後，發現 github 的 setting 頁有顯示錯誤訊息：
> Your site is having problems building: The tag fancybox on line 77 in themes/landscape/README.md is not a recognized Liquid tag. For more information, see https://help.github.com/articles/page-build-failed-unknown-tag-error/.

原因是因為預設的 `landscape` 主題內的`README.md`有 github 不支援的語法。手動註解那一行，或把那個檔案刪除即可。


## 部署完路徑多一層 public
路徑變為 `https://khiav223577.github.io/blog/public`
發生原因不明。解決方法：
1. 刪除遠端 `gh-pages` branch
2. 刪除本機 `.deploy_git` 資料夾
3. 再重新部署一次即可

## 有些主題缺乏一些功能
慎選主題，否則請自行實作XD
大部份功能 `hexo` 都有提供[輔助函數](https://hexo.io/zh-tw/docs/helpers.html)，以下列出幾個比較實用的函數：
- `list_tags` 標籤雲
- `list_posts` 最新 N 篇文章
- `list_archives` 歷史文章依日期分類

## 樣式的改動本機有更新，但部署後沒有
輸入 `hexo clean` 指令清空所有檔案，再 `hexo g` 重新打包後，css 才會是最新的。

## 無法 git push，一直叫你要 pull
發生原因不明。不知道為什麼在 `master` branch 上 pull 到的是 `gh-pages` branch 的資料。
解決方法，在終端機輸入：
```
git branch --set-upstream-to=origin/master
```

## 連不到標籤頁 `blog/Tags`
原因：預設是小寫的網址，大小寫有差。但生成頁面時若打大寫 `hexo new page Tags`，則就只能用大寫網址進入。

解決方式：想辦法將 `gh-pages` branch 中大寫 `Tags` 資料夾改成小寫的。因為 git 預設是不分大小寫，所以...要自己想辦法。
有個指令可以讓 git 會去分大小寫：
```
git config core.ignorecase false
```
但 git 對大小寫支援並不好，中間可能會遇到各種奇葩問題，然後又會遇到 deploy 時被蓋掉的問題XD 🐛🐛
總之大概有幾點要做：
 - 要去隱藏資料夾 `.deploy_git/` 內改動才有效
 - 開啟區分大小寫後，將 `Tags` 改成 小寫 `tags`，commit 上去就是了
 - commit 後遠端可能會不知原因同時存在二個資料夾，但本機又無任何 file changes。此時要在本機將資料夾下所有東西都刪除（或搬移），git status 會看到 `Tags`, `tags`都被刪了，這時候才能 add `Tags`，接著 commit 並 push 後就可以把遠端的大寫 `Tags` 資料夾刪除XD

## Hello World 頁突然變成最新文章
因為這是內建生成的頁面，缺少了 `date` 屬性，補上即可。

但觸發這個 BUG 使 hello world 變成新文章的原因未知。

