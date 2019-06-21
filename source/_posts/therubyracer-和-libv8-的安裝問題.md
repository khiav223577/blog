---
title: therubyracer 和 libv8 的安裝問題
date: 2018-12-20 21:05:58
tags: gem
---

本來以為是 library 檔問題，試了參照網路上的教學安裝 v8 但沒有用
```
brew install v8
# or
brew install v8-315
```

後來錯誤嘗試發現是很蠢的問題

在此記下來以免忘記

## 移除乾淨所有版本

首先要先把所有裝好的 `therubyracer`, `libv8` 都移除
```
gem uninstall -a libv8
gem uninstall -a therubyracer
```

## 先裝好 therubyracer

假如要裝 [therubyracer 0.12.1](https://rubygems.org/gems/therubyracer/versions/0.12.1) (February 03, 2014) 版的話：

```
gem install libv8 -v '3.16.14.13'
gem install therubyracer -v '0.12.1'
```

假如要裝 [therubyracer 0.12.2](https://rubygems.org/gems/therubyracer/versions/0.12.2) (April 07, 2015) 版的話：

```
gem install libv8 -v '3.16.14.13'
gem install therubyracer -v '0.12.2'
```

假裝要裝 [therubyracer 0.12.3](https://rubygems.org/gems/therubyracer/versions/0.12.3) (January 05, 2017) 版的話：

```
gem install libv8 -v '3.16.14.15'
gem install therubyracer -v '0.12.3'
```

## 更新 libv8

裝好 therubyracer 後再跑 bundle 把 libv8 升到最新版。

一定要用指定版號的 libv8 才能成功安裝 therubyracer （以上都是我錯誤嘗試試出來可以 work 的版本）。詳細原因不明，可能是他套件沒有處理好吧。假如先裝了 [libv8 3.16.14.19](https://rubygems.org/gems/libv8/versions/3.16.14.19-x86_64-darwin-15) 的話，就無法成功安裝 [therubyracer 0.12.3](https://rubygems.org/gems/therubyracer/versions/0.12.3)

## 錯誤訊息

附註一下，若先裝最新版 libv8 時會噴的錯誤訊息：

```
$ gem install therubyracer
Fetching: libv8-3.16.14.19.gem (100%)
Building native extensions. This could take a while...
ERROR:  Error installing therubyracer:
  ERROR: Failed to build gem native extension.

    current directory: /Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/ext/libv8
/Users/khiav223577/.rvm/rubies/ruby-2.3.3/bin/ruby -r ./siteconf20181220-96081-t2nw2u.rb extconf.rb
creating Makefile
Applying /Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/patches/disable-building-tests.patch
Applying /Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/patches/disable-werror-on-osx.patch
Applying /Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/patches/disable-xcode-debugging.patch
Applying /Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/patches/do-not-imply-vfp3-and-armv7.patch
Applying /Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/patches/do-not-use-MAP_NORESERVE-on-freebsd.patch
Applying /Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/patches/do-not-use-vfp2.patch
Applying /Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/patches/fPIC-for-static.patch
Compiling v8 for x64
Using python 2.7.15
Using compiler: c++ (Apple LLVM version 10.0.0)
Unable to find a compiler officially supported by v8.
It is recommended to use GCC v4.4 or higher
Beginning compilation. This will take some time.
Building v8 with env CXX=c++ LINK=c++  /usr/bin/make x64.release ARFLAGS.target=crs werror=no
GYP_GENERATORS=make \
  build/gyp/gyp --generator-output="out" build/all.gyp \
                -Ibuild/standalone.gypi --depth=. \
                -Dv8_target_arch=x64 \
                -S.x64  -Dv8_enable_backtrace=1 -Dv8_can_use_vfp2_instructions=true -Darm_fpu=vfpv2 -Dv8_can_use_vfp3_instructions=true -Darm_fpu=vfpv3 -Dwerror=''
  CXX(target) /Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/vendor/v8/out/x64.release/obj.target/preparser_lib/src/allocation.o
warning: include path for stdlibc++ headers not found; pass '-std=libc++' on the command line to use the libc++ standard library instead [-Wstdlibcxx-not-found]
In file included from ../src/allocation.cc:33:
../src/utils.h:33:10: fatal error: 'climits' file not found
#include <climits>
         ^~~~~~~~~
1 warning and 1 error generated.
make[1]: *** [/Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/vendor/v8/out/x64.release/obj.target/preparser_lib/src/allocation.o] Error 1
make: *** [x64.release] Error 2
/Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/ext/libv8/location.rb:36:in `block in verify_installation!': libv8 did not install properly, expected binary v8 archive '/Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/vendor/v8/out/x64.release/obj.target/tools/gyp/libv8_base.a'to exist, but it was not found (Libv8::Location::Vendor::ArchiveNotFound)
  from /Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/ext/libv8/location.rb:35:in `each'
  from /Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/ext/libv8/location.rb:35:in `verify_installation!'
  from /Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19/ext/libv8/location.rb:26:in `install!'
  from extconf.rb:7:in `<main>'

extconf failed, exit code 1

Gem files will remain installed in /Users/khiav223577/.rvm/gems/ruby-2.3.3/gems/libv8-3.16.14.19 for inspection.
Results logged to /Users/khiav223577/.rvm/gems/ruby-2.3.3/extensions/x86_64-darwin-14/2.3.0/libv8-3.16.14.19/gem_make.out
```

