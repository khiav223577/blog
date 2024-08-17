---
title: Vue 中使用 debounce 防止前端瘋狂發送請求
date: 2018-04-09 18:04:46
categories:
  - 程式開發
tags:
  - Javascript
  - vue
---

其實很簡單，但因為一直以來誤會了某個 es6 的語法，導致鬼打牆卡了一陣子，怒寫一篇文章以避免有人也陷入如此的冏境。

## Debounce

假設你有一個函式 doQuery，負責送出 API 請求。但因為前端可能每次按下按鈕時都會呼叫這個函式，假如使用者連按的話，會瘋狂送請求到後端，增加 server 的負擔。因而想要加上 debounce 機制，以避免發生這種情況。

```js
methods: {
  doQuery(){
    this.api.send('v1/get_data', this.queryParams, data => {
      this.rows = data
    })
  },
},
```

作法其實蠻簡單的。以 lodash 的 debounce 為例，只要用 debounce 函式包住原本的程式碼即可。
`_.debounce(function(){ /* 原本的程式碼*/ })`

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

這裡隱藏了一個容易踩到雷的陷阱。一直以來我都以為`箭頭函式`是一個語法糖，能以更簡潔的方式寫 function。我就自作聰明地將 `function(){ ... }` 改寫成 `() => { ... }`
例如：

```js
methods: {
  doQuery: _.debounce(() => {
    this.api.send('v1/get_data', this.queryParams, data => {
      this.rows = data
    })
  }),
},
```
改成這樣後會發現 debounce 函式運作都正常，只是抓不到 this.api 而噴出：
```
Uncaught TypeError: Cannot read property 'send' of undefined
```

研究後發現是二個語法有些微的不同，傳統函式的 this 指向`呼叫者`，箭頭函式則是指向`定義函式者`，且這個 this 還無法透過 `bind`、`call` 去改變，導致這個 bug 更難去 debug。




