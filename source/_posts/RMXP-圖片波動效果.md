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
<a href="/blog/RM/rmxp_wave_effect.rar" target="_blank">下載 DEMO 範例專案</a>

## 使用方法

先下載腳本，放到 `main` 前。這個腳本會擴展 `Sprite` ，增加四個屬性：

- ** wave_amp **
  波動的幅度，預設 0

- ** wave_length **
  波長，波長越長波峰數量越少。單位是像素，預設 72px

- ** wave_speed **
  波速，波速越高頻率越高，預設 720

- ** wave_phase **
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


## 腳本實作方式

核心想法是將原始圖片切成許多橫條，用 `sin` 函式計算每個橫條的 `X 位移量`。根據位移量移動每個橫條，再將所有橫條拼接起來，就可以產生波浪波動的感覺。
### Pseudo code
```rb
# 每 1 pixel 切成一個橫條
for i in 0..height
  # 計算 X 位移量
  xchg = @wave_amp * Math.sin(@wave_phase)
  # 將橫條從原圖（origin_bitmap）切出來，傳到新圖（new_bitmap）中
  new_bitmap.blt(x, i, @origin_bitmap, Rect.new(0, i, width, 1))
end
```

## 快取機制

由於每一幀都要大量切割、拼接圖片。在圖片大的時候會造成很大的負擔，導致遊戲 `Lag`。但實際上，由於 `sin 正弦波`同樣的波形會不斷出現。因此很適合將計算完的圖片暫存住，重複利用，避免每次計算完就丟棄計算結果。程式中的實作也很簡單，只要拿 `wave_phase` 當 `key` 快取計算結果即可，例如：
```rb
def get_waved_bitmap
  @wave_effect_cache ||= {}
  return (@wave_effect_cache[@wave_phase] ||= get_waved_bitmap_without_cache)
end
```

原先回音的扭曲空間中，非常的頓，`FPS` 只有 `2x`。實作該快取機制後 `FPS` 提升到接近 `40`。






