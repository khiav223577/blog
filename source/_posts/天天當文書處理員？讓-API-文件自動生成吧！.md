---
title: 天天當文書處理員？讓 API 文件自動生成吧！
subtitle: 利用 RSpec 測試自動生成 API 文件
date: 2020-04-12 05:21:14
header-img: /blog/imgs/api_doc_example/header.jpg
categories:
  - 程式開發
tags:
  - Rails
  - RSpec
---

在我們日常開發的過程中，難免有時候會需要去調整 API。在多次調整之後，往往當初寫的文件已經跟不上變化，而漸漸失去了參考價值。甚至有可能因此誤導前端串接人員，導致 Bug 的產生。

或是當程式邏輯很複雜的時候，一個不小心改動到了 API 回傳值而沒有注意到。剛好這個功能當下並沒有人有用到的話（如節慶、限時活動之類的非常態性的功能），等到發現有問題時再來加班搶修，就為時已晚，傷害已造成。

這個問題可以靠著寫更多、更詳盡的測試來避免。但假如我們測試已經寫了那麼多不同的情境，文件上還要再寫一次、還要檢查 API 行為是否有跟文件寫的一致的話，開發人員可能每天忙於寫文件就下班了。若我們選擇由測試直接生成文件，不但可以省下我們文書處理的時間，也能使這些各式各樣的情境都能自動列在文件上，讓前端串接的大大以及未來看的人可以快速掌握 API 各種可能的情境。



那麼，讓我們開始這次的教學吧～

## 使用的套件與流程

這篇文章將會帶大家使用 [rspec_api_documentation](https://github.com/zipmark/rspec_api_documentation) 生成 `API Blueprint` 格式的文件，再搭配上 [aglio](https://github.com/danielgtaylor/aglio) 將它 render 成漂亮的靜態網頁。

Rails 有很多自動生成 API 文件的套件。有些需要改動 Controller 的程式碼（如: [apipie-rails](https://github.com/Apipie/apipie-rails)）；有些有自己一套的 API 設計方式，因此有專門用的產文件的方式（如: [grape](https://github.com/ruby-grape/grape) + [grape-swagger](https://github.com/ruby-grape/grape-swagger)）。而 [rspec_api_documentation](https://github.com/zipmark/rspec_api_documentation) 是我綜合整理完，覺得上手最簡單的，也更彈性的一個套件。個人使用後的分析如下：

### 優點
1. 不用動 Controller 的程式碼，單純地靠測試去生成文件。（畢竟測試和文件不要跟 runtime 的東西混在一起比較好，而且我們平常 Controller 已經負責夠多事情了）
2. 測試改動不大，假如你原本寫的是 request 測試的話，改動就只有一些語法上變化
3. 支援的格式很多，可以輸出 html, json, open_api, markdown...等格式
4. 生出來文件上會包含完整的 response data, Headers, Cookie, Status Code

### 缺點
1. 若選擇比較少人用的格式的話，容易遇到 Bug
2. 一年多沒有發新版了

最後產出來的文件大概長這樣：（也可以看看一下 [aglio 提供的範例](https://htmlpreview.github.io/?https://raw.githubusercontent.com/danielgtaylor/aglio/blob/master/examples/default-triple.html)）
![api_doc_example_whole](/imgs/api_doc_example/api_doc_example_whole.png)

## 設定

### 安裝 [aglio](https://github.com/danielgtaylor/aglio)
```
npm install -g aglio
```

### 安裝 [rspec_api_documentation](https://github.com/zipmark/rspec_api_documentation) 
Gemfile 加入該套件，然後輸入 bundle 來安裝
（註： group 要包含 development，這樣才找得到產文件用的 rake 腳本）
```rb
# Gemfile

group :development, :test do
  gem 'rspec_api_documentation'
end
```

### Config

加上設定檔，以下依序設定了這幾點：
1. 格式用 `api_blueprint`
2. 預設 request 參數格式為 json（不然文件上會以字串顯示）
3. 設定文件輸出路徑，這邊設成了 github-pages 用的 /docs 資料夾
4. 設定文件的 example 順序跟測試中的 it 順序一致
5. 文件不顯示 `X-Request-Id`、`X-Runtime` 這二個 header。因為這二個 header 每次 request 都會不同，會導致文件的 diff 很多。

```rb
# spec\support\rspec_api_documentation.rb

RspecApiDocumentation.configure do |config|
  config.format = [:api_blueprint]
  config.request_body_formatter = :json
  config.docs_dir = Rails.root.join('docs')

  # By default examples and resources are ordered by description. Set to true keep
  # the source order.
  config.keep_source_order = true

  config.response_headers_to_include = [
    Class.new do
      def downcase
        self
      end

      def ==(other)
        !other.in?(%w[X-Request-Id X-Runtime].map(&:downcase))
      end
    end.new,
  ]
end
```
記得去 `rails_helper` 加上這一行，才會在跑測試時載入到設定。
```rb
# spec/rails_helper.rb

require 'support/rspec_api_documentation'
```

## 寫測試
加上 `acceptance` 測試。假如原本已經有 controller 或 request 測試的話，可以直接搬進來，稍改一下寫法就好。例如以下範例為登入 API 的測試，說明如下：

#### 1. require
記得 require 套件的 DSL

#### 2. resource
用來設定大分類，通常就用 resources 名字

#### 3. header
非必要。這裡寫的 header 會反應到產出來的文件上。可以像 let 一樣隨意在各層中去設定。

#### 4. route
設定 API 路徑，第二個參數為設定副標題。輸出文件時會自動把 url 一樣、且副標題也一樣的 API 分類在一起

#### 5. HTTP Verbs
決定 API 用哪個動詞，例如可以用 get / post / put / delete / patch
後面接的參數為 API 名字。

#### 6. parameter
定義這個 API 需要傳什麼參數。可以像 let 一樣隨意放在各層中去設定。也可以加一些描述的設定，如可以說明這個參數是必要的： `required: true`。詳細的設定說明可以參考該 gem 的 Github 頁面。

定義完參數後，測試可以用 let 去設定這個測試要傳的參數的值。

#### 7. context, it
`context` 命名不影響文件，只是給測試顯示用的情境名稱。
`it` 後面接的則是 example 的命名，名字會呈現在文件上。

#### 8. do_request
發送 request，送完之後才有 `status` 以及 `response_body`

#### 範例測試
```rb
# spec\acceptance\users_spec.rb

require 'rails_helper'
require 'rspec_api_documentation/dsl' # Note 1

resource 'Users' do # Note 2
  header 'Accept', 'application/json' # Note 3
  header 'Content-Type', 'application/json' # Note 3

  route '/users/sign_in', 'Sign In' do # Note 4
    post '登入' do # Note 5
      parameter :email, required: true # Note 6
      parameter :password, required: true # Note 6

      let(:email){ 'vin@example.com' }
      let(:password){ 'abcd1234' }

      context 'when account does not exist' do
        let(:email){ 'no_this_email' }
        it '信箱錯誤' do # Note 7
          do_request # Note 8

          expect(status).to eq 400

          response = JSON.parse(response_body)
          expect(response).to eq('errors' => ['code' => '40007', 'msg' => '信箱或密碼有誤，請重新登入'])
        end
      end

      context 'when password is wrong' do
        let(:password){ 'wrong_password' }
        it '密碼錯誤' do # Note 7
          do_request # Note 8

          expect(status).to eq 400

          response = JSON.parse(response_body)
          expect(response).to eq('errors' => ['code' => '40007', 'msg' => '帳號或密碼有誤，請重新登入'])
        end
      end

      it '成功' do # Note 7
        do_request # Note 8

        expect(status).to eq 200

        response = JSON.parse(response_body)
        expect(response).to eq('access_token' => 'abcdef')
      end
    end
  end
end
```

#### 測試如何對應文件

以下是我整理的，可以參考一下，測試中設定的東西最後會怎麼去影響到文件的生成：![parameter_to_docs_explanation](/imgs/api_doc_example/parameter_to_docs_explanation.png)

右上角 **example 的名字** （成功、信箱錯誤、密碼錯誤）那個按鈕是可以點的，點了可以切換看不同的情況的 request 以及 response。因為太長很難一次截完，上圖中有截到 Request 的樣子了，這裡再補個 Response 大概會長的樣子的圖：![response_example](/imgs/api_doc_example/response_example.png)

## 自動生成文件

輸入 rake 指令去生成文件
```
rake docs:generate
```

因為選擇的是 api_blueprint 格式，所以會產出 `.apib` 檔
接著用 aglio 來生成 html 網頁：
```
aglio -i docs/index.apib -o docs/index.html --theme-template triple --theme-style default
```

這樣文件就生成啦！

若要只跑測試不生成文件的話，跟以前一樣輸入 `rspec` 就好，指令沒有變。


## 分享 API 文件

完成了文件自動生成，接下來就是將文件給需要的人看啦。最簡單的方式就是將 docs 資料夾內的 index.html 傳給對方；或是不怕文件被看的話，可以設定在 Github Pages 上，讓 Github 幫你雲端自動託管。好處是可以不用每次文件更新都要再傳一次，只要連入網址就能立刻看到最新版的文件。Github Pages 設定方法很簡單，點入專案的 Repository > Settings 內設定就可以了，如圖：
![setup_github_pages](/imgs/api_doc_example/setup_github_pages.png)

這次的教學就到這裡了，希望這篇文章能幫助到常常有寫文件需求的人。讓我們能夠專注於寫程式當中，不被雜事佔據～
