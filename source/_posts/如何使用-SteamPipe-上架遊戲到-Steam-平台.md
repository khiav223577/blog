---
title: 如何使用 SteamPipe 上架遊戲到 Steam 平台
date: 2018-01-20 15:08:30
tags: 
  - Steam
  - Echo
---

在開始教學之前，我們會需要一個已加入 Steamworks 的 Steam 帳號、創建好你的遊戲 Apps、並下載最新版的 `Steamworks SDK`。
（本文使用的是 v1.41）
![steampipe home page](/blog/imgs/steampipe/home.png)

## SteamPipe 設定

點入應用程式後，來到應用程式的主頁，會有很多設定頁。
我們先從程式管理的主頁面開始，點入「編輯 steamworks 設定」。
![steampipe main page](/blog/imgs/steampipe/main_page.png)

### 啟動設定
接著前往安裝頁，這個分頁內可以設定該如何安裝遊戲、與遊戲的啟動設定。
![go to installation page](/blog/imgs/steampipe/to_installation_page.png)

在安裝頁中可以設定安裝資料夾的名字，預設是 App ID，但可以隨意更改成你想要的名字。下面是啟動設定，點擊「Add New Launch Option」可以新增一組`啟動選項`。每組選項可以設定特定的作業系統、CPU要對應到的`執行檔`。例如可以設定 32-bits CPU 和 64-bits CPU 分別有不同的執行檔。執行檔的名字一定要跟上傳的檔名一樣，這邊沒有防呆檢查對應不到的情況，要特別注意有沒有打錯字。
![installation page](/blog/imgs/steampipe/installation_page.png)


### Depots
接著前往 Depots 頁。

![go to depots page](/blog/imgs/steampipe/to_depots_page.png)

在這頁中，可以設定遊戲要包含的 depot。`depot` 是用來打包、安裝所有玩家要從 Steam 下載的檔案，可以想像成是 `zip 檔`之類的東西。跟啟動設定一樣，depot 也能指定一些條件。不過有點不太一樣的是，一個玩家只會符合一個啟動設定，但可能同時有多個 depot 。只要符合條件的 depot 都會被下載：例如可以主程式放在一個 depot，而語系分別拆分到不同 depot。指定英文版就下載英文語系，中文版就下載中文語系，但主程式可以被共用。

在這邊 depot 的名字不重要，可以自由亂取。重要的是左方的 `DepotID`。每個應用程式都會有一個 `AppID`，這個是給 Steam 用的唯一識別碼。假如你的 AppID 為 123450，則可以用的 DepotID 為 123451 ~ 123459。這二種 ID 在上傳你的遊戲內容時都會用到。

![depots page](/blog/imgs/steampipe/depots_page.png)

## Steamworks SDK

下載完 Steam SDM 後，先到 `/tools/ContentBuilder/content` 內，會看到一個檔案叫「your game content lives here.txt」，顧名思義就是要把上傳的檔案放在這裡。建議自行在這裡再加一層資料夾，以區分給不同 depot 的檔案，如下：

![game content folder](/blog/imgs/steampipe/game_content_folder.png)


接著來到 `/tools/ContentBuilder/scripts`，這裡預設會有二個檔案，一個是 APP 建置設定檔，一個是 depot 建置設定檔。檔案名字可以自由取，不一定要把 ID 寫在檔名後面。

![scripts folder](/blog/imgs/steampipe/scripts_folder.png)

### APP 建置設定檔
這個設定檔是設定跑上傳腳本時，會上傳哪些 depots 到哪個 APP。
有二個地方要改：
  - appid: 改成實際上的 `AppID`
  - depots: 則照著原本的格式改，左邊是 `DepotID`，右邊是 depot 建置設定檔的檔名。

![app_build.vdf](/blog/imgs/steampipe/app_build_vdf.png)

### depot 建置設定檔
這個設定檔是設定 depot 的內容在哪裡。
有三個地方要設定：
  - DepotID: 改成實際上的 `DepotID`
  - ContentRoot: 建議改成相對路徑，路徑與此設定檔相對，因此設成 `..\content\`
  - LocalPath: 建議寫相對路徑，例如英文語言包的話，可以寫成 `..\content\en\*`。註解說路徑會相對於 `ContentRoot`，但實際測試發現是相對於此設定檔的所在地。如果抓不到檔案的話，可能要檢查一下是否是這裡的問題。


![depot_build.vdf](/blog/imgs/steampipe/depot_build_vdf.png)

### 建置與上傳

回到 `/tools/ContentBuilder`，我們可以看到預設已經有一個 bat 檔 `run_build.bat`。
![content builder folder](/blog/imgs/steampipe/content_builder_folder.png)
預設內容為：
```bat
builder\steamcmd.exe +login account password +run_app_build_http ..\scripts\app_build_1000.vdf +quit
```
有三個地方要改動：
- account: 這個 APP 開發者的 Steam 帳號
- password: 這個 APP 開發者的 Steam 密碼
- app_build_1000.vdf: APP 建置設定檔的檔名

改動完後，執行這個 bat 檔，順利的話你的遊戲就成功上傳到 Steam 上囉！

P.S. 如果你覺得密碼明碼儲存在這裡很不安全，也可以用手動打指令的方式上傳：
![command line example](/blog/imgs/steampipe/cmd_login_steam.png)

## 釋出組建

前往組建頁。
![go to build page](/blog/imgs/steampipe/to_build_page.png)

在這頁中你可以看到你最新的組建（上傳）排在最上方。可以在「已包含 Depot」看到你總共上傳成功的 depot。想要的話也可以點選 DepotID 檢視看看上傳了些什麼。檢查 OK 的話，可以到「釋出分支內的組建」內，把這個組建設成 `預設分支`(default branch)。點選「預覽變更」後，可以進到最後確認變更的畫面。
![build page](/blog/imgs/steampipe/build_page.png)

最後點選「Set Build Live Now」，就完成啦！
![preview build changes](/blog/imgs/steampipe/preview_build.png)

若需要更詳細的教學，可以觀看官方的教學影片、或 [documents](https://partner.steamgames.com/doc/sdk/uploading)
<iframe width="1141" height="667" src="https://www.youtube.com/embed/SoNH-v6aU9Q" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>




