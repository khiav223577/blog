---
title: Ruby 快速實作客戶 PHP 加解密函式
date: 2023-12-03 23:05:48
tags:
  - Ruby
  - PHP
  - Encryption
---

## 需求

在朋友的公司中，有一天來了這樣的一個需求：

他們想要可以做類似 google 那種單次登入，多平台使用的功能。 然而，公司的資訊系統是使用 PHP 做的，而工作管理系統則是使用 Ruby on Rails 寫的。 解密 token 的方式他們在 PHP 上已經有一份實作了，現在需要在 Ruby on Rails 上實作同樣的解密函式，以實現跨平台的 Token 認證。

由於之前的合作經歷，朋友們希望我能夠迅速地完成這項任務

## 前言

根據我多年（？）的 ChatGPT 經驗，如果你問它的問題太發散，像是架構設計，或是一些套件的用法，通常結果都很慘，不是搞錯重點就是亂湊一些不正確的東西，把不同套件的用法混淆在一起。

但假如是這種程式語言的改寫，就非常適合。 首先，你不用花太多力氣去告訴它你要的是什麼，直接程式碼貼給它它就懂了。再來是因為這些加解密函式，都是程式語言原生就有實作的，函式功能很明確，用法也不太會更改，不像套件可能有很多不同的版本，升個版號可能用法就改了。或是有很多類似的套件，ChatGPT 很容易把它們混在一起。

講了那麼多前言，再來就來看我們如何完成這次工作的吧 （其實是實作過程是太短了，所以只好多湊些字數XD）

## 實作

以下是一支 PHP 程式，請幫我改用 ruby 實作

```php
function decrypt($key, $iv, $encryptedData) {
  $cipher = MCRYPT_RIJNDAEL_128;
  $mode = MCRYPT_MODE_CBC;
  $key = hexToStr(hash('md5', $key));
  $iv = hexToStr(hash('md5', $iv));
  
  $result = mcrypt_decrypt(
    // ...（略）
  );
  
  $pad = ord($result[strlen($result) - 1]);
  return substr($result, 0, -$pad);
}
```

然後就完成了：

```rb
require 'openssl'
require 'base64'

def decrypt(str_key, str_iv, encrypted_data)
  cipher = OpenSSL::Cipher.new('aes-128-cbc')
  cipher.decrypt
  cipher.key = Digest::MD5.hexdigest(str_key).scan(/../).map(&:hex).pack('c*')
  cipher.iv = Digest::MD5.hexdigest(str_iv).scan(/../).map(&:hex).pack('c*')

  decrypted_data = # ...（略）

  pad = decrypted_data[-1].ord
  return decrypted_data[0...-pad]
end
```

實測了一下都會 work，不過也發現 decrypted_data 似乎就是答案了，不用再 pad
再手動調整一下就一切搞定啦～

結束了（咦）
