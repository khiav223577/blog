---
title: 當開發者遇上 MySQL 編碼：你知道你的 Rate Limit 被巧妙繞過了嗎？
date: 2024-05-18 15:56:02
tags:
  - MySQL
  - Security
---

## 前言

網站開發時，我們常常需要設定 rate limit 的限制，以防止機器人大量嘗試登入，暴力破解使用者的密碼， 或是發送大量請求，造成 Server 負擔過重。在某些情況下，我們可能會想要使用用戶的 email 或帳號當作 key 來限制 rate limit。例如登入 API 或忘記密碼 API。

## 範例

以 Rails 常用的 [rack-attack](https://github.com/rack/rack-attack) 為例，我們可以這樣設定登入 API 的 rate limit：
```rb
Rack::Attack.throttle('limit logins per email', limit: 6, period: 60) do |req|
  if req.path == '/login' && req.post?
    # Normalize the email, using the same logic as your authentication process, to
    # protect against rate limit bypasses.
    req.params['email'].to_s.downcase.gsub(/\s+/, "")
  end
end
```

程式碼看起來很完美，做了 normalize 避免外層 middleware 檢查通過後，實際找對應用戶前又去掉空白，導致檢查的參數，與實際用來查詢用戶的參數不一致，從而可以透過加空白的方式繞過 rate limit 檢查。同時，將字串一律都轉成小寫，避免利用 DB case-insensitive 的特性繞過檢查。

## 問題

但假如你 MySql 編碼是用 `utf8_general_ci` ，或是參考了之前的 [MySQL 編碼挑選與差異比較](https://khiav223577.github.io/blog/2019/06/30/MySQL-%E7%B7%A8%E7%A2%BC%E6%8C%91%E9%81%B8%E8%88%87%E5%B7%AE%E7%95%B0%E6%AF%94%E8%BC%83/) 文章，使用了 `utf8mb4_unicode_ci`。

不幸的是，這二種編碼仍然存在被繞過 rate limit 的風險。它們無法判斷各種拉丁字母（如 É、Ê、È、Ë）、以及全形和半形字母（如 Ａ 和 A）的差異。這些字元在資料庫中會被視為相同，這會導致在程式碼檢查時認為是不同的 email，但在資料庫中查詢時卻找到同一個 email 的對應用戶。

## 解法

要解決這個問題，我們可以將該欄位的編碼改為 `utf8mb4_bin`，讓資料庫使用 binary value 進行比對。或者，我們 API 可以限制參數在某個字元編碼區間內，排除不預期的字元（如中文、emoji、拉丁字母...等），避免其進入後續的資料庫查詢。

在我們平常開發時，也都要時時刻刻去思考各種 edge case，確保 rate limit 檢查對象在程式碼和資料庫中的相等判斷一致。因為這種不一致往往會成為突破 rate limit 限制的方法。

