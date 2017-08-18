---
title: hexo 上實現搜尋功能（下）
date: 2017-08-18 15:50:12
tags:
  - Hexo
  - Algolia
---
## 前言

[上篇](/blog/2017/08/15/hexo-%E4%B8%8A%E5%AF%A6%E7%8F%BE%E6%90%9C%E5%B0%8B%E5%8A%9F%E8%83%BD%EF%BC%88%E4%B8%8A%EF%BC%89//) 提到如何設定後端服務。設定好了後，我們要想辦法把功能整合到網誌上。不幸的是 [Anisina](https://github.com/Haojen/hexo-theme-Anisina) 主題並沒有提供樣版，只能自行實作。

## 修改樣版

我們要修改主題內的樣版，先 `cd themes/Anisina`。接著我們要添加一些 `html`。

### 1. 添加搜尋按鈕

![nav](https://user-images.githubusercontent.com/4011729/29450074-d3a28ff8-842f-11e7-8a66-31b93271546b.png)
打開 `layout/_partial/nav.ejs`，在 `ul` 標籤內加上
```diff
  <ul class="nav navbar-nav navbar-right">
    ...
    ...
+ <% if (config.algolia){ %>
+   <li>
+     <a href="#search" class="popup-trigger">
+       <i class="fa fa-search"></i>
+     </a>
+    </li>
+ <% } %>
  </ul>
```

### 2. 添加搜尋彈出式 Modal

![search_modal](https://user-images.githubusercontent.com/4011729/29450597-d964a08c-8431-11e7-9a69-c40d2035457b.png)

同樣是 `layout/_partial/nav.ejs`，在最下方加上：
```html
<% if (config.algolia){ %>
  <div class="site-search">
    <div class="algolia-popup popup">
      <div class="algolia-search">
        <div class="algolia-search-input-icon">
          <i class="fa fa-search"></i>
        </div>
        <div class="algolia-search-input" id="algolia-search-input"></div>
      </div>
      <div class="algolia-results">
        <div id="algolia-stats"></div>
        <div id="algolia-hits"></div>
        <div id="algolia-pagination" class="algolia-pagination"></div>
      </div>
      <span class="popup-btn-close">
        <i class="fa fa-times-circle"></i>
      </span>
    </div>
  </div>
<% } %>
```

### 3. 添加相關 js, css 檔

下載下面的 js, css 檔，分別放到 `source/js/` 以及 `source/css/` 內
<a href="/blog/js/instantsearch.min.js" target="_blank">instantsearch.min.js</a>
<a href="/blog/js/algolia.js" target="_blank">algolia.js</a>
<a href="/blog/css/algolia.css" target="_blank">algolia.css</a>

並打開 `layout/_partial/head.ejs`，在 `head` 標籤內加上：
```diff
   <head>
     ...
     ...
+  <% if (config.algolia){ %>
+    <%- css('css/algolia') %>
+    <%- js('js/algolia') %>
+    <%- js('js/instantsearch.min') %>
+  <% } %>
   </head>
 ```

css 內已經幫你處理好一些被 `bootstrap` 影響的樣式，以及加上 `highlight` 效果。
js 內也已經幫你修好一些 BUG，並加上 `debounce` ，避免每打一個字就發一次請求。

### 4. 加上 API Keys

編輯 `algolia.js`，填上你自己的 `key`。
```diff
  var CONFIG ={
-   root: '/some_root/',
+   root: '/your_root/', // 跟你 _config.yml 內的 root 設定要一樣。
    algolia:{
-      applicationID: 'XXXXXX',
-      apiKey: 'YYYYYYYYYYY',
-      indexName: 'ZZZZZZ',
+      applicationID: 'YDG1C4ASA4',
+      apiKey: 'eecdd0f2174b77269d964813a61812bc',
+      indexName: 'khiav-hexo-blog',
      hits:{ per_page: 10 },
      labels:{ "input_placeholder": "輸入搜尋內容", "hits_empty": "找不到「${query}」", "hits_stats": "找到 ${hits} 條相關條目，花費 ${time} 亳秒" }
    }
  };
```

### 5. 加上 Algolia Logo

輸入 `cd ../../` 回到 blog 路徑，下載下面這張圖片，放到 `source/imgs/` 內
![algolia_logo](/blog/imgs/algolia_logo.svg)

### 6. 完成！

回到 Blog 上看看，應該已經能使用搜尋功能了。
