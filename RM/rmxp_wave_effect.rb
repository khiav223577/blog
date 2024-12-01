#==============================================================================
# ■ RMXP 圖片波動效果
#------------------------------------------------------------------------------
#
# Version: 2.0
#
# Origin Author: 
#   zecomeia (2010/01/03)
#   www.colmeia-do-ze.blogspot.com
# 
# Edited By:
#   狼 (2017/02/17)
#   https://khiav223577.github.io/blog/2017/08/20/RMXP-圖片波動效果?r=1
#
#==============================================================================
=begin

  移植 VX 的 wave 效果到 XP 上。設定方法參照 VX 的文件。
  
  Defines the amplitude, frequency, speed, and phase of the wave effect. A 
  raster scroll effect is achieved by using a sinusoidal function to draw the 
  sprite with each line's horizontal position a bit different from the last.
  
  wave_amp (RGSS2) 
  wave_length (RGSS2) 
    wave_amp is the wave amplitude and wave_length is the wave frequency, and 
    each is specified by number of pixels.

  wave_speed (RGSS2) 
    wave_speed specifies the speed of the wave animation. The default is 360,
    and the larger the value, the faster the effect.
  
  wave_phase (RGSS2) 
    wave_phase specifies the phase of the top line of the sprite using an angle 
    of up to 360 degrees. This is updated each time the update method is called. 
    It is not necessary to use this property unless it is required for two 
    sprites to have their wave effects synchronized.

=end

class Sprite
  attr_reader     :wave_amp
  attr_accessor   :wave_length
  attr_accessor   :wave_speed
  attr_accessor   :wave_phase
  def wave_amp=(v)
    v ||= 0
    if @wave_amp != 0 and v == 0
      dispose_wave_cache
    end
    self.bitmap_without_wave = @temp_bitmap if @temp_bitmap
    @wave_amp = v
    return v
  end
  
#--------------------------------------------------------------------------
# ● 初始化
#--------------------------------------------------------------------------
  alias initialize_without_wave initialize  unless $@
  def initialize(viewport=nil)
    @wave_amp = 0
    @wave_length = 72
    @wave_speed = 720
    @wave_phase = 0.25
    initialize_without_wave(viewport)
    @temp_bitmap = nil
  end
  
#--------------------------------------------------------------------------
# ● 刷新 Sprite
#--------------------------------------------------------------------------
  alias update_without_wave update unless $@
  def update
    # wave effect only works if wave_amp propertie is a number more than zero
    wave_effect_with_cache if @wave_amp > 0
    update_without_wave
  end
  
#--------------------------------------------------------------------------
# ● Sprite 寬度
#
#   Return the width of image, because when useobj.bitmap.width the value will 
#   be more than the original value (because effect).
#--------------------------------------------------------------------------
  def width
    return (self.bitmap.width - @wave_amp * 2)
  end
  
#--------------------------------------------------------------------------
# ● 變更圖片
#--------------------------------------------------------------------------
  alias bitmap_without_wave= bitmap=  unless $@
  def bitmap=(_bitmap)
    self.bitmap_without_wave = _bitmap
    #raise RuntimeError, "" if self.bitmap != _bitmap
    @temp_bitmap = nil
    @wave_effect_cache = nil
  end
  
#--------------------------------------------------------------------------
# ● 釋放 Sprite
#--------------------------------------------------------------------------
  alias dispose_without_save dispose  unless $@
  def dispose
    dispose_wave_cache
    dispose_without_save
  end
  
  private
  
#--------------------------------------------------------------------------
# ● 釋放快取住的 bitmaps
#--------------------------------------------------------------------------
  def dispose_wave_cache
    return if @wave_effect_cache == nil
    @wave_effect_cache.delete(:wave_info)
    @wave_effect_cache.each{|_, bitmap| bitmap.dispose }
    @wave_effect_cache = nil
  end
  
#--------------------------------------------------------------------------
# ● 計算套上波動效果後的圖片
#--------------------------------------------------------------------------
  def get_waved_bitmap_without_cache
    return nil if self.bitmap == nil
    @temp_bitmap ||= self.bitmap
    width  = @temp_bitmap.width
    height = @temp_bitmap.height
    bitmap = Bitmap.new(width + (@wave_amp * 2), height)
    # Follow the VX wave effect, each horizontal line has 8 pixel of height.
    for i in 0..(height / 8.0).ceil
      i8 = i * 8
      phase_angle = (@wave_phase * Math::PI) / 180.0
      length_angle = i8 * 2 * Math::PI / @wave_length
      x = @wave_amp * Math.sin(length_angle + phase_angle)
      bitmap.blt(x, i8, @temp_bitmap, Rect.new(0, i8, width, 8))
    end
    return bitmap
  end
  
  def get_waved_bitmap
    @wave_effect_cache ||= {}
    return (@wave_effect_cache[@wave_phase] ||= get_waved_bitmap_without_cache)
  end
  
#--------------------------------------------------------------------------
# ● 刷新波動周期
#
#   frame rate: VX = 60 | XP = 40
#   wave speed compatibility VX to XP: wave_speed * 60/40 (= wave_speed * 1.5)
#--------------------------------------------------------------------------
  def update_wave_phase
    @wave_phase += (@wave_speed * 1.5 / @wave_length).round
    @wave_phase -= 360 if @wave_phase > 360
    @wave_phase += 360 if @wave_phase < 0
  end

#--------------------------------------------------------------------------
# ● 刷新波動效果
#--------------------------------------------------------------------------
  def wave_effect_with_cache
    return if self.bitmap == nil
    return if self.visible == false or self.opacity == 0
    wave_info = [@wave_amp, @wave_length]
    # wave 效果改變的時候
    if @wave_effect_cache == nil or @wave_effect_cache[:wave_info] != wave_info
      dispose_wave_cache
      @wave_effect_cache = {:wave_info => wave_info}
    end
    self.bitmap_without_wave = get_waved_bitmap
    update_wave_phase
  end
end
