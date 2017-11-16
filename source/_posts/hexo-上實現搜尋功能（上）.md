---
title: hexo 上實現搜尋功能（上）
date: 2017-08-15 00:54:27
tags:
  - Hexo
  - Algolia
---
## 前言
hexo 原生是沒有搜尋功能的，但有些主題會提供搜尋功能，主要分成二種。一種是裝 npm 套件，在打包時先生成索引檔（可能是 `JSON`, `XML` 格式），再引入 js 檔自行實作搜尋的功能。另一種則是依賴外部服務，例如`Swiftype`、`Algolia`、`Azure`。在搜尋時發送請求給外部服務，由外部服務回傳搜尋結果。在這裡就不討論好壞了，直接說明我怎麼實現的吧XD

## Swiftype
這個是我使用的主題 [Anisina](https://github.com/Haojen/hexo-theme-Anisina) 內建提供的功能，在 `_config.yml` 內加上一句即可：
```yml
swiftype_key: your_application_key
```
假如以前沒有用過 [Swiftype](https://swiftype.com/) 的話，要先去註冊一個帳號（只能用公司 Email，不能用 Gmail）
註冊完會有 14 天的 `Free Trial`，但它沒有免費方案，而且超貴，最便宜的也要 `299/mo`（美金！？）。不過[聽說](http://www.jerryfu.net/post/search-engine-for-hexo-with-swiftype-v2.html)免費試用到了後，會給你一個選擇降級成免費帳號（？）

註冊完之後，點選 `Create Engine`，綁上部落格的網址後，它的爬蟲就會來你的網站爬資料、建立索引。只不過爬的速度有點慢，等了一整天還沒爬完，一直停留在 `Crawling` 步驟，如下圖：
![crawling forever](https://user-images.githubusercontent.com/4011729/29283635-27d45c4c-815a-11e7-9416-281db6c5b2f0.png)
網路上也沒有人反應有發生過這種狀況，是我太心急嗎XD。總之不管它，等它好了再來更新這篇。等待的時間就改串接別的服務吧。

## Algolia
在 hexo 的套件庫挖到 [hexo-algoliasearch](https://github.com/LouisBarranqueiro/hexo-algoliasearch) 
（還有另一個比較新的套件 [hexo-algolia](https://github.com/oncletom/hexo-algolia)，功能類似）才知道有這項服務XD。
照著 github 上的指示裝好後，編輯 `_config.yml`，加上：
```yml
algolia:
  appId: "xxxxxxxxxx"
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxx"
  adminApiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  chunkSize: 5000
  indexName: "my-hexo-blog"
  fields:
    - title
    - tags
    - raw
    - path
```
同樣地，也要去 [Algolia](https://www.algolia.com/) 註冊並創建你的 `APPs`，再回來填入你的 key（顯示在後臺 `API Keys`分頁內）。這個服務有免費方案，可以安心使用。💥 **這邊要注意的是 `adminApiKey` 不要 commit 到 github 上XD**。套件有支援將 key 設定在環境變數內，但設在環境變數內其實也蠻危險的。最好的方式是分離設定檔，並加到 `.gitignore` 內，不過這就得等善心人士幫那個套件發 PR 了～⭐
![algolia console](https://user-images.githubusercontent.com/4011729/29285221-577630c8-8160-11e7-8ccc-eb08c8e3f208.png)
設好後，輸入 `hexo algolia` 即可自動生成索引檔，並傳到 Algolia 上。假如失敗的話輸入 `hexo clean`清空資料後，再試一次。成功的話，在後臺 `Indices` 頁中就能看到你文章的索引資料。😃

> 若想要自訂索引資料的話，可自行修改 yml 內的 `fields`。
> 
> 不知道如何設定的話，可以參考這篇文件：[Hexo 變數](https://hexo.io/zh-tw/docs/variables.html) 👀

到這邊後臺大致上都設定完畢了，剩下前臺要自行實作。
## 未完待續...
[hexo 上實現搜尋功能（下）](/blog/2017/08/18/hexo-%E4%B8%8A%E5%AF%A6%E7%8F%BE%E6%90%9C%E5%B0%8B%E5%8A%9F%E8%83%BD%EF%BC%88%E4%B8%8B%EF%BC%89/)







