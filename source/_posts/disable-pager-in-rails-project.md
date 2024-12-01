---
title: 為你的 rails console 預設參數
subtitle: Disable pager in your rails project
date: 2024-12-01 21:40:35
categories:
  - 程式開發
tags:
  - Ruby
  - Rails
---

在 Rails 5.1.4 之後 ([rails#29010](https://github.com/rails/rails/pull/29010))，我們已經可以在啟動 rails console 時，傳我們需要的 IRB configuration 參數進去。例如我們要關閉 Ruby 3.3 加入的 pager 功能時，我們可以這樣傳參數進去：

```
rails c -- --no-pager
```

但假如你想要每次開 console 時，都預設有這個參數，該怎麼做呢？

以下分為二種設定方法：
- 一種是設定在 local 端，只有自己的電腦吃得到參數，部署在機器上的 server 則吃不到。
- 另一種則是設定在 project 上，讓這個 project 都固定啟用或不啟用參數。

### 在 local 上設定

我們可以新增 `~/.irbrc` 檔，將這行加入到該檔案內：

```rb
IRB.conf[:USE_PAGER] = false
```

這樣每次打開 irb，或打開 rails console 時，就會自動執行這份檔案的內容，將 pager 功能關閉。

### 在 project 上設定

在 rails project 上設定時，我們可能很直覺地想要寫個 initializer 把上面那行加進去
或是多包一層 `Rails.application.console do ... end`，讓 initializers 全部初始化之後，再執行那一行。

但不幸的是，這二種方法都沒有作用。原因是在起 console 時，會先載入好 rails 環境與執行 initializers，接著才會啟動 IRB
而 IRB 在啟動前會初始化參數 (`IRB.init_config(ap_path)`)，導致 initializer 內已經設定好的參數，又被重新初始化掉了。

到目前為止，rails 原生並沒有提供 project 層的參數讓我們可以設定，IRB 也不支援用環境變數來設定預設參數。因此我們只能自己寫一種 code，讓 rails console 起來時，可以自動帶上參數

#### 自動帶上 rails console 參數

首先，我們希望可以有一支獨立的檔案，來設定我們想要的參數。假設檔案路徑為 `config/irb_config.rb`。 
然後我們去 `bin/rails` 內，在 `require "rails/commands"` 這行之前，加上一行 `require_relative "../config/irb_config"`。

接著我們就能來實作我們的程式邏輯。

首先我們要知道我們現在是不是在起 console，這個可以藉由判斷第一個參數是不是 `'console'` 來決定。在部份環境中，rails c 的 c 不會自動轉換為 console，因此我們也要考慮 `== 'c'` 的情況。
然後我們要判斷有沒有 `--` 這個分隔符號，沒有的話要加上去。在這個分隔符號後的參數，才會送進 IRB 內。
最後我們就判斷有沒有 `--no-pager` 參數，沒有的話就加上去。
這樣就完成了，範例程式如下：

```rb
if ARGV[0] == 'console' || ARGV[0] == 'c'
  ARGV << '--' if !ARGV.index('--')
  ARGV << '--no-pager' if !ARGV.index('--no-pager')
end
```

這樣我們以後用 `rails c` 時，指令都會自動帶上我們想要的參數，變成 `rails c -- --no-pager` 了！




