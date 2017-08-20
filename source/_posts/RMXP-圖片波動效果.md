---
title: RMXP 圖片波動效果
date: 2017-08-20 19:34:41
tags:
  - RMXP
  - RGSS
  - Sprite
  - Wave Effect
---
<a href="/blog/RM/rmxp_wave_effect.rb" target="_blank">下載腳本</a>
<a href="/blog/RM/rmxp_wave_effect.rar" target="_blank">下載範例專案</a>

## 使用方法

先下載腳本，放到 `main` 前。這個腳本會擴展 `Sprite` ，增加四個屬性：

- wave_amp
  波動的幅度，預設 0

- wave_length
  波長，波長越長波峰數量越少。單位是像素，預設 72px

- wave_speed
  波速，波速越高頻率越高，預設 720

- wave_phase
  相位，單位為角度。在每次刷新時會不斷更新此屬性。

使用時直接對 `Sprite` 操作即可，例如：
```rb
sprite = Sprite.new
sprite.bitmap = RPG::Cache.picture('wolf')
sprite.wave_amp = 2
```

## Wave 效果

範例專案內的狼圖片：
![wolf wave effect example](/blog/RM/rmxp_wave_effect_wolf.gif)
此效果也應用到 [回音](https://www.facebook.com/Echo2010.ourvoice/) 的扭曲空間中：
![echo wave effect example](/blog/RM/rmxp_wave_effect_echo.gif)





