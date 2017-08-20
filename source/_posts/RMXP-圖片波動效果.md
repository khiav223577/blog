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
<a href="/blog/RM/rmxp_wave_effect.rar" target="_blank">下載範例檔</a>

## 使用方法

先下載腳本，放到 `main` 前。
這個腳本會擴展 `Sprite` ，增加四個屬性：

- wave_amp
  波動的幅度，預設 0

- wave_length
  波長，波長越長波峰數量越少。單位是像素，預設 72px

- wave_speed
  波速，波速越高頻率越高。

- wave_phase
  相位，單位為角度。在每次刷新時會不斷更新此屬性。




