---
title: 三行 css 簡單地讓單行置中，多行置左
date: 2019-11-10 22:24:17
categories:
  - 程式開發
tags:
  - css
---

有一天 PM 突然表示，我們遊戲介面中平常文字都是置中的，畫面看起來很協調。但是如果文字太長換行了，這時候多行都一起置中，有些行長，有些行短，看起來就會參差不齊。因此想要做一個效果是：「超過一行的話，文字就要改成置左」。效果大概如下圖：

![align center image](/imgs/pagamo/align_center.png)![align left image](/imgs/pagamo/align_left.png)

那時候心裡一驚，不太妙，感覺會很複雜，可能得要用 javascript 去動態計算文字寬度，再動態去調整 css 要置中還是要置左。

不過在拜了 google 大神之後，發現 stackoverflow 上有[一篇](https://stackoverflow.com/a/43627669/2131983)發問，剛好就是我要的問的問題！一開始還不太懂原理，只能照抄文章中的複雜的 css 屬性 `display: table-cell;`、`overflow: hidden`、`vertical-align: middle;`、`line-height`...等，來試看看。確認功能正常後，再抽絲剝繭整理出必要的三行 CSS 以及 html 結構。

## 設置方法

1. 將文字用二層 Tag 包住，外層是 `<div>`，內層 `<div>`、`<span>`、`<pre>` 都可。
2. 外層 CSS 設定 `text-align: center;`
3. 內層 CSS 設定 `text-align: left;`、`display: inline-block;`

範例：（或到 [fiddle](https://jsfiddle.net/khiav223577/5nka1wbL/26/) 實際動手試看看）
```html
<div class="single-line-center">
  <div class="multi-line-left">
    文字內容文字內容文字內容
  </div>
</div>
```

```css
.single-line-center {
  text-align: center;
}

.multi-line-left {
  display: inline-block;
  text-align: left;
}
```

P.S. 用 `<pre>` 的話要設定換行規則，以避免文字能夠超出 pre 之外。Ex:
```css
pre {
  margin: 0;
  word-break: break-all;
  white-space: pre-wrap;
}
```

## 原理

一開始覺得很神奇，不知道這幾行 css 到底是怎麼運作的。也擔心不同瀏覽器的支援度問題，會不會有什麼行為不太一樣，導致出現 BUG。但在領悟出原理之後，覺得一切是那麼地簡單，就是一些很基本的規則而已，不必去擔心瀏覽器的相容性。

### 單行時

如下圖，紅色框是外層 `<div>`，內層藍色框是 `display: inline-block` 的元素。因為內層沒有指定寬度，所以寬度為文字的寬度。而外層設定了文字置中，而將內層藍色框置中了。
![align center image explanation](/imgs/pagamo/align_center-explanation.png)

### 多行時

此時文字太長，而把內層藍色框撐到最寬（最寬為外框的寛度）。內層藍色框依然是置中在外層之中的，但是因為內外寬度一樣，所以此時外框不管設置中、置左都不影響。

內層藍色框中，因為文字太長而被迫換行。原本單行時，文字在內層裡置中、置左都沒差。但多行時，內層設定的文字置左就發揮功能了，讓多行中的最後一行貼齊最左側。如下圖所示：

![align left image explanation](/imgs/pagamo/align_left-explanation.png)
