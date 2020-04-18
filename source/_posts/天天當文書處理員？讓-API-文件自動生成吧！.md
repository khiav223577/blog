---
title: 天天當文書處理員？讓 API 文件自動生成吧！
subtitle: 利用 RSpec 測試自動生成 API 文件
date: 2020-04-12 05:21:14
tags:
  - Rails
  - RSpec
---

在我們日常開發的過程中，難免有時候會需要去調整 API。在多次調整之後，往往當初寫的文件已經跟不上變化，而漸漸失去了參考價值。甚至有可能因此誤導前端串接人員，導致 Bug 的產生。

或是當程式邏輯很複雜的時候，一個不小心改動到了 API 回傳值而沒有注意到。剛好這個功能當下並沒有人有用到的話（如節慶、限時活動之類的非常態性的功能），等到發現有問題時再來加班搶修，就為時已晚，傷害已造成。

這個問題可以靠著寫更多、更詳盡的測試來避免。但假如我們測試已經寫了那麼多不同的情境，文件上還要再寫一次、還要檢查 API 行為是否有跟文件寫的一致的話，開發人員可能每天忙於寫文件就下班了。若我們選擇由測試直接生成文件，不但可以省下我們文書處理的時間，也能使這些各式各樣的情境都能自動列在文件上，讓前端串接的大大以及未來看的人可以快速掌握 API 各種可能的情境～


## 使用的套件與流程

Rails 有很多自動生成 API 文件的套件。有些需要去改動 Controller 的程式碼（如: [apipie-rails](https://github.com/Apipie/apipie-rails)）；有些是有自己一套的 API 設計方式，也就有專門用的產文件的方式（如: [grape](https://github.com/ruby-grape/grape) + [grape-swagger](https://github.com/ruby-grape/grape-swagger)）

而這篇文章將會帶大家使用 [rspec_api_documentation](https://github.com/zipmark/rspec_api_documentation) 。這個套件的好處是可以不用動 Controller （畢竟我們平常 Controller 已經負責夠多事情了），可以單純地靠測試去生成文件。假如你原本就有寫 Controller 或 Request 測試的話，那只要稍微改動一點寫法就能立刻生出 API 文件來了！

該套件支援的格式很多，可以輸出 html, json, open_api, markdown...等格式。經過各種嘗試，我選擇生成 `API Blueprint` 格式的文件，搭配上 [aglio](https://github.com/danielgtaylor/aglio) 將它 render 成漂亮的靜態網頁。

生出來文件上會包含完整的 response data, Headers, Cookie, Status Code，也許你的測試沒有測到 API 會設定 Cookie，但你的文件上會有。如果後來 API 調整成不會設 Cookie，從文件上的變化也能看得出來設定 Cookie 那段程式被動到了。比較不用擔心測試會漏驗什麼資料。

最後產出來的文件大概長這樣：（也可以看看一下 [aglio 提供的範例](https://htmlpreview.github.io/?https://raw.githubusercontent.com/danielgtaylor/aglio/blob/master/examples/default-triple.html)）
![api_doc_example_whole](/blog/imgs/api_doc_example/whole.png)

