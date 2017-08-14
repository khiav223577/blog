---
title: 在 hexo 上踩過的雷
date: 2017-08-13 15:25:35
tags:
  - hexo
---
# 部署到 github 後頁面未更新
本機測試都正常，也成功部署到 github 上了，網頁卻遲遲沒有更新
拜讀 stackoverflow 上的這篇 [Github Page not updating](https://stackoverflow.com/questions/20422279/github-pages-are-not-updating) 後，發現 github 的 setting 頁有顯示錯誤訊息：
> Your site is having problems building: The tag fancybox on line 77 in themes/landscape/README.md is not a recognized Liquid tag. For more information, see https://help.github.com/articles/page-build-failed-unknown-tag-error/.

原因是因為預設的 `landscape` 主題內的`README.md`有 github 不支援的語法。手動註解那一行，或把那個檔案刪除即可。


# 部署完路徑多一層 public
路徑變為 `https://khiav223577.github.io/blog/public`
發生原因不明。解決方法：
1. 刪除遠端 `gh-pages` branch
2. 刪除本機 `.deploy_git` 資料夾
3. 再重新部署一次即可。
