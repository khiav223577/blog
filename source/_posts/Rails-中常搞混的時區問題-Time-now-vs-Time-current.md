---
title: Rails 中常搞混的時區問題
subtitle: Time.now vs. Time.current
date: 2018-03-03 13:00:02
tags:
  - Rails
---

在 Rails 的開發中，時區問題是一個很容易踩到雷的地方。尤其是 Server 時區跟本地開發時的時區不同，一旦部署後才會發現沒有處理好時區問題。

網路上的教學常建議大家一律使用 `Time.current` 取代 `Time.now`，以避免時區問題。但假如沒有搞懂其中的原理的話，以後若使用其它框架時仍然會遭遇到相同的問題。因此這篇文章要來幫助大家理解時區的概念，以及為何 `Time.current` 的使用機會其實少之又少。

## Time.now vs. Time.current

首先我們要理解的是 `Time.now` 與 `Time.current` 本質上是一樣的，都是代表著「現在」，不一樣的是「時區」。好比說你在臺灣與日本的朋友聊天，你們是在「同一個時間」下聊天的，只是同一個時間在臺灣可能是顯示九點，在日本是顯示十點。

如以下程式碼：
<sub>（註：因為「現在」是隨時會變動的，在二次函式呼叫間可能會流逝掉零點幾亳秒。因此這邊透過 Timecop 凍結時間）</sub>

```rb
Timecop.freeze
Time.now
# => 2018-03-03 02:25:00 +0800

Time.current
# => Fri, 02 Mar 2018 18:25:00 UTC +00:00

Time.now == Time.current
# => true
```

二者代表的時間是一樣的，差別在於時區可能不一樣
 - `Time.now` 使用當前機器作業系統的時區
 - `Time.current` 使用 Rails 中設定的時區


## 不同時區中的日期

既然時間一樣那為什麼有時候會遇到時區問題呢？答案是當你要計算「日期」的時候。例如跨年時，你可能在臺灣是 12/31 23:00 還沒跨年，但在日本的朋友已經是 1/1 0:00 正在跨年了！

因此時區對於「時間」沒有影響，但對於「日期」可能就會有影響。當程式碼內要進行日期相關的計算時，就得考慮時區的處理。

如以下程式碼：
```rb
Time.now.to_date
# => Fri, 02 Mar 2018

Time.current.to_date
# => Sat, 03 Mar 2018

Time.now.to_date == Time.current.to_date
# => false
```

因此在日期的計算時，會需要額外指定是哪個時區底下的日期。

例如以下各種不同時區日期的寫法：

### 使用當前機器作業系統的時區
```rb
# 今天
Time.now.to_date
Date.today

# 昨天
Time.now.yesterday.to_date
Date.today.yesterday

# 指定時間
Time.at(1520015100).to_date
Time.parse('2018-03-03 02:25:00').to_date
```

### 使用 Rails 中設定的時區
```rb
# 今天
Time.current.to_date
Time.zone.now
Time.zone.today
Date.current

# 昨天
Time.current.yesterday.to_date
Time.zone.yesterday
Date.current.yesterday
Date.yesterday

# 指定時間
Time.zone.at(1520015100).to_date
Time.zone.parse('2018-03-03 02:25:00').to_date
```


### 指定時區
```rb
# 今天
Time.now.in_time_zone('Japan').to_date
Time.find_zone('Japan').today

# 昨天
Time.now.yesterday.in_time_zone('Japan').to_date
Time.find_zone('Japan').yesterday

# 指定時間
Time.find_zone('Japan').at(1520015100).to_date
Time.find_zone('Japan').parse('2018-03-03 02:25:00').to_date
Time.parse('2018-03-03 02:25:00 +0900').to_date
```

在弄懂了原理之後，我們知道在時間上能用 `Time.now`、在日期上能用 `Date.current` ，因此在實務上其實沒有使用到 `Time.current` 的機會。

## 小心 Date.today

會踩到雷的都是在計算日期的時候，因而在進行相關運算的時候要多注意。有些函式是 ruby 原生的，有些是 rails 加上去的，混在一起用的話可能會有非預期性的行為，如：
```rb
Date.today == Date.yesterday + 2.day
# => true

Date.today
# => Sat, 03 Mar 2018

Date.yesterday
# => Thu, 01 Mar 2018
```





