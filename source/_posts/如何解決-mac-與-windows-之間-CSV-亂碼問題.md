---
title: 如何解決 mac 與 windows 之間 CSV 亂碼問題
date: 2018-07-11 14:46:00
tags:
  - mac
  - windows
  - 編碼
---

之前常常有這個問題，在 windows 上能正常顯示的 csv 檔，到 mac 上看就會變亂碼。在 mac 上能正常顯示的 csv 檔，到 windows 上看就會變亂碼。

原本以為是作業系統預設編碼問題，無解，因而不管採用 Big 5 或 Utf-8 編碼，都會有一方無法正常顯示。後來發現是我對檔案編碼不夠熟的關係，才會有這種問題。

## 亂碼原因

- windows 上 Excel 預設編碼為 `CP950` (Big5 的超集) 或 `ISO-8859`。
- mac 上 Numbers 預設編碼為 `UTF-8`。

假如一個 CP950 編碼的 csv 檔在 mac 上開啟，作業系統會以 UTF-8 解析 CP950 資料，解析不出來就變成了亂碼。同理，假如一個非 CP950 編碼的 csv 在 windows 上開啟，也會無法解析而變成亂碼。


## 解決方式

簡單來說：一律使用 `UTF-8` 編碼，並加上 `BOM` (位元組順序記號)

Ruby 程式範例：

```rb
BOM = "\xEF\xBB\xBF"

csv = CSV.generate(BOM, encoding: "utf-8"){|csv| csv << ["我是中文"] }
File.write("output.csv", csv)
```

因為在不同的電腦系統中，資料的排序有不同的規則，主要有二種「big-endian」以及「little-endian」，因此會需要 BOM 來描述「位元組的順序」。

我們將文件存成 UTF-8 後，在 mac 上不需要 BOM 也能正常顯示的原因是因為，預設就是 UTF-8 了，所以不需要 BOM 也剛好會使用到正確的編碼。但在 windows 上預設的編碼不一樣，所以就需要 BOM 的協助，去判斷正確的編碼是什麼。

## 不同編碼的 BOM

以下附上常用編碼以及相對應的位元組順序記號：

編碼                    | BOM      |
-----------------------|----------|
UTF-8                  | EF BB BF |
UTF-16 (big-endian)    | FE FF    |
UTF-16 (little-endian) | FF FE    |

