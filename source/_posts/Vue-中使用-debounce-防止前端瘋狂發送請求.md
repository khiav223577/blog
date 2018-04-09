---
title: Vue 中使用 debounce 防止前端瘋狂發送請求
date: 2018-04-09 18:04:46
tags:
  - javascript
  - vue
---

其實很簡單，但因為一直以來誤會了某個 es6 的語法，導致鬼打牆卡了一陣子，怒寫一篇文章以避免有人也陷入如此的冏境。

## Debounce

以下面這段程式碼為範例，假設你要為 doQuery 加上 debounce。
```js
methods: {
  doQuery(){
    this.api.send('v1/get_data', this.queryParams, data => {
      this.rows = data
    })
  },
},
```
只要引入 lodash，然後改成這樣就好了
```js
methods: {
  doQuery: _.debounce(function(){
    this.api.send('v1/get_data', this.queryParams, data => {
      this.rows = data
    })
  }),
},
```

## 箭頭函式 (Arrow functions) 不只是個語法糖

但不知道為什麼，一直以來我都以為`箭頭函式`是一個語法糖，能以更簡潔的方式寫 function。我就自作聰明地將 `function(){ ... }` 改寫成 `() => { ... }`
```js
methods: {
  doQuery: _.debounce(() => {
    this.api.send('v1/get_data', this.queryParams, data => {
      this.rows = data
    })
  }),
},
```
然後就發現 debounce 函式運作都正常，只是一直抓不到 this.api，噴了：
```
Uncaught TypeError: Cannot read property 'send' of undefined
```

研究了很久才發現是二個語法有些微的不同，傳統函式的 this 指向`呼叫者`，箭頭函式則是指向`定義函式者`，且這個 this 還無法透過 `bind`、`call` 去改變，使得這個 bug 更難去 debug。




