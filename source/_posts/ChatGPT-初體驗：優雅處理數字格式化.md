---
title: ChatGPT 初體驗：優雅處理數字格式化
subtitle: 構建自己的 JavaScript 版 Rails number_with_precision 函式
date: 2023-08-01 19:45:50
tags:
  - Ruby
  - Javascript
  - ChatGPT
---

在網頁開發中，我們經常需要處理數字的格式化，例如將小數四捨五入到指定精準度、添加千位分隔符...等等。對於使用 Ruby on Rails 框架的開發者來說，[number_with_precision](https://apidock.com/rails/v6.1.3.1/ActionView/Helpers/NumberHelper/number_with_precision) 函式是個方便實用的工具。但是，如果我們在 JavaScript 環境中工作，我們需要自己實現這樣的功能。


## 前情提要

首先，讓我們快速回顧一下 Ruby on Rails 中的 [number_with_precision](https://apidock.com/rails/v6.1.3.1/ActionView/Helpers/NumberHelper/number_with_precision) 函式是如何運作的。這個函式接受一個數字和一個精度參數，然後將數字四捨五入到指定的小數位數。此外，我們還可以選擇是否添加千位分隔符。

```rb
number_with_precision(1234567.89123, precision: 2, delimiter: ',')
# Output: "1,234,567.89"
```

我們的目標是在 JavaScript 中實現一個類似的功能，以便在不使用 Rails 的情況下，也能夠優雅地處理數字格式化。


## 其他人的實作

要處理這種問題，常見的選擇是使用 `numeral.js` 或 `accounting.js` 這類外部庫，這些庫提供了豐富的數字格式化選項，可以滿足各種不同的需求。但是假如今天我們只是要為了一小塊用到的地方，就去引用函式庫的話，無形之中也會導致專案的大小變得越來越肥大。因為外部函式庫通常包含了許多其他功能和模組，而我們只需要其中的一個功能。這將使得整個函式庫的代碼都被打包到我們的專案中，而這些冗餘的程式可能永遠不會被使用到。

我們想要一個輕量化的函式，但另一方面，又希望能快速達成我們的目標，畢竟我們的工程師都是懶惰的。而這個函式在 Rails 內的[實作](https://apidock.com/rails/v5.2.3/ActiveSupport/NumberHelper/NumberToRoundedConverter/convert)沒有很簡單，要快速轉成 javascript 可能得花一翻工夫。

最後想到一個最近流行的方式，就是請 ChatGPT 來幫忙實作啦！


## JavaScript 版 number_with_precision

為了實現我們的目標，我請 ChatGPT 創建了一個名為 `numberWithPrecision` 的函式。這個函式接受三個參數：number 是要被格式化的數字，precision 是四捨五入到的小數位數，delimiter 是千位分隔符（預設為 `,`）。

以下是最後的 JavaScript 實現：

```js
function numberWithPrecision(number, precision, delimiter = ',') {
  const multiplier = 10 ** precision;
  const roundedNumber = Math.round(number * multiplier) / multiplier;
  const [integerPart, decimalPart] = roundedNumber.toFixed(precision).split('.');
  const integerWithDelimiter = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);

  return decimalPart ? `${integerWithDelimiter}.${decimalPart}` : integerWithDelimiter;
}
```

## 程式分析

讓我們來分析一下這個 JavaScript 版的 `numberWithPrecision` 函式。

### 精準度

首先，我們先計算出精準度的 `multiplier`（例如：precision 為 2 時，就乘上 100），然後使用 `Math.round` 來四捨五入到指定的小數位數，最後再把 `multiplier` 除回來（例如：precision 為 2 時，就除以 100）。

然後，我們將整數部分和小數部分分開，以便後續處理。

### 千位分隔符

接下來，我們使用正則表達式來將整數部分的數字添加千位分隔符。這個正則表達式的作用是在整數的每三個數字之間插入指定的分隔符。這樣，我們就可以獲得一個格式化帶有千位分隔符的整數部分。讓我們更細緻地解釋正則表達式 `/\B(?=(\d{3})+(?!\d))/g` 的含義：

- \B：不匹配單詞邊界。這個是為了避免因為後三個是數字，就在最前面加上逗號（例如 `123` 會變成 `,123`）。也就是加逗號前，先檢查這裡是不是邊界，是的話就不要加。
- (?=...)：查找在每三個數字之前出現的匹配項目。之所以要用預查的方式，是為了讓匹配到的三個數字，不要被 replace 掉。
- (\d{3})：匹配三個連續的數字。
- +：表示前面的表達式（即 (\d{3})）可以重複一次或多次，這樣可以匹配多個連續的三位數字。
- (?!\d)：查找在每三個數字之後不出現的匹配項目。這個是為了確保 N 組三個數字之後，最後面不是數字，也就是在當前位置之後，數字的數量是三的倍數。

簡單來說，這個正則表達式的作用是在整數的每三個數字之間插入指定的分隔符，以實現千位分隔符的效果。最後，我們將整數部分和小數部分結合起來，並返回最終的格式化數字。


## 詠唱過程

其實就只有二行...，第一次直接破題請 ChatGPT 參考 rails 的實作，去實作一個 javascript 的版本：

```
How to implement the method `number_with_presicion` of rails in javascript?
```

實作後，發現 ChatGPT 只實作了精準度，沒有實作千位分隔符。因此再告訴它要實作 `delimiter` 參數：

```
There is an argument called `delimiter` in rails version.
Please implement it into the javascript version, too.
```

然後...Done，過程花不到 1 分鐘，反而是測試和看懂這個函式在做什麼花了不少時間XD

## 總結

最後的最後，其實這篇文章的標題與內容也是靠 ChatGPT 幫我生成的，我只說了一句 `幫我將今天上述的內容，轉換成 blog 的文章內容～`，然後就劈哩啪啦文章內容就跑出來了 XD，段落還有文筆都蠻通順的。

有了初稿之後，可能還需要再修飾一下，檢查一下不要有中國用語、去掉冗餘、重複的敘述、還有補一些想講但沒有提到的地方。最後再將分析的部份，寫得更詳細一點。畢竟我為了看懂這段 regexp 在幹嘛，也是花了一段時間。嗯...這篇文章就這麼誕生了。
