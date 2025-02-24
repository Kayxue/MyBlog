---
title: 如何使用 Thunder Client 測試 API
published: 2024-12-09
description: 一個 Thunder Client 使用小教學
image: "https://hackmd.io/_uploads/SJVcQ1Q4ye.png"
tags: [ThunderClient, API, Hono, Deno]
category: Software
draft: false
---
或許各位有一些使用 API 的經驗或者撰寫 API 的經驗，但是測試 API 時，如果沒有簡易的測試工具，對於新手來講會是一件麻煩的事。不只要自己額外手動安裝 API Client 軟體，還有的甚至還要學指令，對於剛開始接觸的人來說有一定的門檻。所以今天我們要來介紹一款擁有圖形界面的 API Client 測試工具，除了功能強大，且只要你有裝 VSCode 系列編輯器（Visual Studio Code、VSCodium、Code-OSS 等，以下簡稱 VSCode），即可直接從擴充商店直接安裝並使用，可謂相當方便。
:::warning
* 本文只會講解基礎用法與免費功能，對於其他進階用法或付費功能的部分，請自行前往[官方文件](https://docs.thunderclient.com/)了解相關內容
* 此文章會涉及到程式碼撰寫，本文會簡單解釋程式碼的用意，但如果想更深入研究程式碼中所使用的語法和框架用法等資訊，請自行利用 Google 進行查詢。
:::
## What is Thunder Client?
Thunder Client 是一個可以用來測試 API 的輕量級 Rest API Client，由 Ranga Vadhineni 製作，該擴充其中包含了不少的功能，例如 Local Storage，將 request 資料同步至 Git 等好用功能。
![CleanShot 2024-12-08 at 16.46.16@2x](https://hackmd.io/_uploads/HJixpRfE1l.png)
雖然說現在他們已經盈利化了，不少功能都要收費，但是基本上單純小小測試一個基礎 API 基本上個人覺得已經夠用了，如果你還是學生、教師或者你是有在經營小企業，你也可以選擇申請 Community Plan，以下是官網的小介紹：
![CleanShot 2024-12-08 at 17.00.43@2x](https://hackmd.io/_uploads/S1m_xk7Ekx.png)
申請方式的話也不會很麻煩，點選左上角「聯絡」，然後填寫所有欄位，並且詢問類型選擇 `Community License`，送出後等待消息
![CleanShot 2024-12-08 at 17.07.52@2x](https://hackmd.io/_uploads/B19NfJ7Nyg.png)
![CleanShot 2024-12-08 at 17.09.43@2x](https://hackmd.io/_uploads/BJsofkXNkx.png)
最後在這裡附上官網的功能比較表給各位參考一下：
![CleanShot 2024-12-08 at 16.58.56@2x](https://hackmd.io/_uploads/B1lWl1X4Jg.png)

## Let's Create a Micro API First!
雖然說現在網路上有公開的 API 其實一大堆，但為了後續的教學方便，還有方便各位進行實驗，所以我們先來自行架設一個 API 吧！
:::info
此節會帶各位使用 Deno 執行環境和 Hono 框架進行架設，如果你有自己習慣的框架或者 Runtime Environment，您也可以選擇自行架設，並跳至下一章節。
:::
### Install Runtime Environment
首先，我們先來安裝 Deno 吧！
#### Windows
請以系統管理員身份開啟一個 Powershell，並輸入以下指令：
```ps1=
irm https://deno.land/install.ps1 | iex
```
#### Mac/Linux
請開啟終端機並輸入以下指令：
```shell=
curl -fsSL https://deno.land/install.sh | sh
```
### Prepare Project
接下來我們要建立一個專案，請在你喜歡的位置建立一個新的資料夾，並且在 VSCode 中開啟
![CleanShot 2024-12-08 at 18.11.14@2x](https://hackmd.io/_uploads/SkqSbem4Jg.png)
再來請點選 VSCode 左邊 sidebar 上的擴充功能，然後在上方搜尋框搜尋 `Deno` 並安裝以下擴充功能：
![CleanShot 2024-12-08 at 18.22.38@2x](https://hackmd.io/_uploads/HkZ6Qxm4Jx.png)
然後請先在該專案資料夾下建立一個 `deno.json` 檔案，以利 Deno Extension 自動識別此專案為 Deno 類型的專案
### Let's Start coding!
請在專案資料夾下新增 `main.ts` 檔案，並且輸入以下內容：
```typescript=
import { Hono } from "jsr:@hono/hono";

const hono = new Hono();

hono.get("/", (c) => {
    return c.text("Hello Hono!");
});

Deno.serve({ port: 3000 }, hono.fetch);
```
:::info
若匯入模組時出現找不到模組之類的錯誤訊息，通常是因為您安裝或更新 Deno 後第一次匯入該模組，請先稍等一下，該錯誤便會自動消失。若過了一段時間後沒有消失，請自行將滑鼠游標移到紅色波浪線上，會出現一個錯誤提示訊息框，滑到錯誤提示框最下方，點選「快速修復」-> `Install xxx as dependencies`，Deno 就會自動安裝所需模組。
:::
在此檔案中，我們定義了一個 Hono Instance，並且定義了根路徑在接受到 `Get` 請求時的處理方式：Server 在接收到請求後，會傳回一段文字（也就是 `Hello Hono`）給請求者。定義完路徑之後，之後透過 `Deno.serve` 建立一個監聽端口 `3000` 的 Web Server，並且在接收到 request 之後，將 request 交給 hono 處理。
### Run the project
接下來，請在專案資料夾下開啟一個新的終端機，並輸入以下指令：
```shell=
# 下方 -N 參數的話 -N 或 --allow-net 皆可，表允許進行網路存取
deno run -N main.ts
```
順利的話，您會在終端機看到以下訊息：
```
Listening on http://0.0.0.0:3000/
```
之後打開網路瀏覽器，並前往上方訊息所列出的網址，即可看到 API Server 的回應
![CleanShot 2024-12-08 at 20.13.14@2x](https://hackmd.io/_uploads/r1Eqa-XEkg.png)
截至目前，一個簡單的 API Server 就已經架設完畢了，接下來我們來安裝這次文章最主要的主角——Thunder Client 吧！

## Install Thunder Client
接下來，我們再次點選視窗左邊 sidebar 上的「擴充功能」按鈕，然後搜尋 `Thunder`，並安裝以下模組：
![CleanShot 2024-12-08 at 22.01.58@2x](https://hackmd.io/_uploads/B1QjDmQ4yl.png)
安裝完成之後，在左側 sidebar 就可以看到 Thunder Client 的圖示，點一下即可開啟 Thunder Client 的介面
![CleanShot 2024-12-08 at 22.11.32@2x](https://hackmd.io/_uploads/ryytK7mE1e.png)
## First Request
剛剛我們已經安裝好 Thunder Client，現在，我們就用它來對我們的小型 API Server 發出第一個請求吧！
首先我們先點選 `New Request` 按鈕建立一個新的請求
![CleanShot 2024-12-09 at 09.33.40@2x](https://hackmd.io/_uploads/Sk27F6X4Jl.png)
接下來擴充會自動開啟一個新的 GUI 介面，在這裡我們就可以開始寫請求相關內容了
![CleanShot 2024-12-09 at 09.36.44@2x](https://hackmd.io/_uploads/SyExc67N1g.png)
以我們這個小型 API 為例，在確定我們架的小型 API Server 是位於啟動的狀態後，即可在此處寫上請求連結：
![CleanShot 2024-12-09 at 09.47.50@2x](https://hackmd.io/_uploads/rJg_n6XNJg.png)
寫完後，按下連結輸入框右側的 `Send` 即可送出請求，稍微等一下，即可在右側看到 API Server 回應的內容了！
![CleanShot 2024-12-09 at 09.51.51@2x](https://hackmd.io/_uploads/BJ0Dp6mE1e.png)

## Create Collections
在繼續下去之前，我們先來建立 collection 吧！在沒有建立 collection 的時候，過去所送出的 request 皆只會出現在 Thunder Client 的 `Activity` 列表，長久下來，在不使用搜尋功能尋找的狀況下，會造成要尋找過去請求時會非常麻煩！
![CleanShot 2024-12-09 at 10.18.43@2x](https://hackmd.io/_uploads/B1Ppm0XEJl.png)
所以接下來我們就來建立 Collection 歸類並儲存請求吧！
### Create Collections
首先，我們切換至 Thunder Client 的 `Collections` 頁面，點選 `filter collections` 旁邊的圖示打開選單，並選擇 `New Collection` 來建立新的 Collection
![CleanShot 2024-12-09 at 10.24.47@2x](https://hackmd.io/_uploads/SJ37rR7Eye.png)
接下來視窗上方會跳出一個輸入框，要你輸入 Collections 的名字，輸入完之後按下 Enter，之後我們就可以在左側 Collections List 中看到剛剛建立的 collection 了
![CleanShot 2024-12-09 at 10.28.40@2x](https://hackmd.io/_uploads/S1rzLCmVke.png)
![CleanShot 2024-12-09 at 10.30.56@2x](https://hackmd.io/_uploads/H1IePAX41l.png)
往後我們如果想建立請求並將其存入此 collection，我們只要將滑鼠游標移到 collection 上，右側會出現三個點，點一下打開選單後，選擇 `New Request`
![CleanShot 2024-12-09 at 10.34.11@2x](https://hackmd.io/_uploads/SkCdDRXNkl.png)
接下來視窗上方會出現一個輸入框，輸入你想給 request 取什麼名字後，按下 Enter 即可建立
![CleanShot 2024-12-09 at 10.36.58@2x](https://hackmd.io/_uploads/Sk54uAQV1l.png)
![CleanShot 2024-12-09 at 10.39.15@2x](https://hackmd.io/_uploads/rJs__CQV1g.png)
然後接下來就可以跟剛剛一樣開始寫 request 內容並測試了！
![CleanShot 2024-12-09 at 10.41.59@2x](https://hackmd.io/_uploads/Syg7YR7Nyx.png)
### Import from source
當然，如果您想測試的 API 有提供 collection 並且提供匯出功能的話，您也可以選擇從別的資源進行匯入，目前 Postman、Thunder Client、Insomnia 或者 Open API 都有支援喔！
:::info
此部分僅稍做介紹，因為免費版只有支援 Thunder Client 格式，並且只能匯入自己的 Collection，通常只會在你自己需要在別人的電腦上測試時，才會需要使用此功能，若想了解更多，請查閱[官方文件](https://docs.thunderclient.com/features/import)。
:::
首先，將滑鼠游標移到你想匯出的 Collection 上，點選右側的三個點按鈕開啟選單，然後選擇 `Export` 進行匯出
![CleanShot 2024-12-09 at 13.45.20@2x](https://hackmd.io/_uploads/SyMMEW441l.png)
匯出格式請選擇 `Thunder Client`
![CleanShot 2024-12-09 at 13.46.17@2x](https://hackmd.io/_uploads/r1ZL4ZNVkl.png)
接下來選擇一個合適的地方儲存即完成匯出
![CleanShot 2024-12-09 at 13.47.03@2x](https://hackmd.io/_uploads/ryVK4bNV1e.png)
接下來將檔案轉到你想要匯入 collection 的電腦後，再次進入 Thunder Client 的 Collection 頁面，點選 `filter collections` 右側的按鈕打開選單，並點選 `Import` 按鈕進行匯入
![CleanShot 2024-12-09 at 13.52.19@2x](https://hackmd.io/_uploads/H1qGLZNEJl.png)
選擇完檔案並點選 `Open` 後，即可看到匯入完成的 collection。
![CleanShot 2024-12-09 at 13.55.57@2x](https://hackmd.io/_uploads/SywKI-EVyx.png)
## Writing Request Contents & Testing
再來我們來撰寫 request 的其他內容吧！在 request 的編輯器中，您可以看到他提供了非常多 request 相關撰寫與測試工具：
![CleanShot 2024-12-09 at 10.53.45@2x](https://hackmd.io/_uploads/BJkZnCQEye.png)
接下來就來介紹一下官方免費提供的相關工具吧！
### Query
Query 是屬於 URL 的一部分，他提供你或者應用程式在送出相關請求時，可以提供相關數值，讓 API 可以依據您提供的相關數值進行資料過濾等操作！
在開始介紹相關功能之前，首先我們先修改一下我們 API 的程式碼吧！現在我們有一個資料庫中存著學生的成績，並且學生的成績可以透過向 `/scores` 發送 `GET` request 取得，並且在 requester 有提供學生名稱的狀況下，僅傳回該學生的成績內容：
```typescript=
import { Hono } from "jsr:@hono/hono";

//Defining type
type studentScore = {
    name: string;
    scores: {
        chinese: number;
        english: number;
        mathematics: number;
    };
};

//Defining a small database
const studentsScore: studentScore[] = [
    {
        name: "Mario",
        scores: {
            chinese: 55,
            english: 66,
            mathematics: 26,
        },
    },
    {
        name: "Barry",
        scores: {
            chinese: 85,
            english: 68,
            mathematics: 94,
        },
    },
    {
        name: "Isabella",
        scores: {
            chinese: 10,
            english: 67,
            mathematics: 95,
        },
    },
];

const hono = new Hono();

hono.get("/", (c) => {
    return c.text("Hello Hono!");
});

//Defining Path
hono.get("/scores", (c) => {
    const { name } = c.req.query();
    if (!name?.length) return c.json(studentsScore);
    const student = studentsScore.find((e) => e.name === name);
    if (student) return c.json(student);
    return c.text("Student not found", 400);
});

Deno.serve({ port: 3000 }, hono.fetch);
```
:::info
* `4~11` 行：定義學生成績資料的類型
* `14~39` 行：定義一個小型學生成績資料庫
* `48~54` 行：定義 `/scores` 路徑在接收到 `GET` 請求後如何處理。首先會先確認 requester 是否有提供 `name` （也就是學生名稱）參數，若無，傳回全部學生的成績資料，有則進行查詢。若有找到指定學生成績資料，則傳回該筆學生的成績資料，否則傳回找不到資料的訊息並附加狀態碼 `400 (Bad Request)`
:::
接下來，請先啟動 API Server，然後回到 Thunder Client 中，建立一個新的 request，並切換到 Query 編輯器
![CleanShot 2024-12-09 at 11.55.31@2x](https://hackmd.io/_uploads/HkvO9kVEyx.png)
再填上對應的 URL，先不要加上任何 Query，並按下 `Send` 按鈕送出請求，即可看到 API 傳回了所有學生的成績
![CleanShot 2024-12-09 at 14.11.42@2x](https://hackmd.io/_uploads/S12N5-4Vye.png)
接下來我們來嘗試加上 Query 吧！我們到下方 Query Parameters 處，將空欄位直接填入以下資訊，此時你就會發現上方網址列也自動同步幫你加上 Query 了
![CleanShot 2024-12-09 at 14.12.36@2x](https://hackmd.io/_uploads/BkXnc-EVJe.png)
送出請求，你會發現 API 傳回的資訊變成了只有學生 Mario 的成績資料
![CleanShot 2024-12-09 at 14.14.58@2x](https://hackmd.io/_uploads/B1uSob4Eye.png)
接下來可以點一下下方我們建立的 Query 左邊的勾勾，你就會發現那個 Query 從上方的連結中消失了，再次點選 `Send ` 按鈕你會發現傳回資料又變成了所有學生的成績資料
![CleanShot 2024-12-09 at 14.18.44@2x](https://hackmd.io/_uploads/SJdy2b441g.png)
![CleanShot 2024-12-09 at 14.20.21@2x](https://hackmd.io/_uploads/H1DrnW44kg.png)
再來我們稍微惡搞一下，假設我們在參數值中填的是資料庫中不存在的學生名稱呢？
![CleanShot 2024-12-09 at 14.22.46@2x](https://hackmd.io/_uploads/r1AA3-VE1g.png)
沒錯，API 就會傳回一個學生找不到的訊息和狀態碼 `400`
![CleanShot 2024-12-09 at 14.23.35@2x](https://hackmd.io/_uploads/HJh76ZNE1e.png)
之後如果這個 Query 你不需要了，您可以點選該 Query 旁邊的 `X` 按鈕從 `Query Parameters` 刪除該參數
### Headers
Request Header 是一種 HTTP Header，其可以用於發起請求時，用於告訴 Server 關於 Request Context 的相關資訊，而有些 API 也會請 requester 在向該 API 發起請求時，透過在 Header 處加上 API Key 的方式，將 API Key 傳送給 API Server。
接下來我們修改程式碼，未來將請求送至 `scores` 路徑時，需要在 Header 提供一個金鑰，且其值需要為 `123`，否則傳回錯誤：
```typescript=
hono.get("/scores", (c) => {
    //Add these
    const { key } = c.req.header();
    if (key !== "123") return c.text("Invalid Key", 400);

    const { name } = c.req.query();
    if (!name?.length) return c.json(studentsScore);
    const student = studentsScore.find((e) => e.name === name);
    if (student) return c.json(student);
    return c.text("Student not found", 400);
});
```
修改後重新啟動 Server，回到剛剛的編輯 request 的頁面，然後點選連結輸入框下方的 `Headers` 切換到編輯 Request Headers 的頁面，此時你會發現他已經為你新增該 API Client 預設的 Headers 了
![CleanShot 2024-12-09 at 14.51.14@2x](https://hackmd.io/_uploads/SkocmMV4kx.png)
接下來我們先不加其他 Header，直接送出請求看一下效果如何
![CleanShot 2024-12-09 at 14.55.08@2x](https://hackmd.io/_uploads/H1VvNMNN1g.png)
會看到他傳回了 `Invalid Key` 訊息和狀態碼 `400`。
此時，我們在下方 `HTTP Headers` 處加入以下 Header
![CleanShot 2024-12-09 at 14.57.18@2x](https://hackmd.io/_uploads/rkFxrfVEJg.png)
再次送出請求後，你就會發現 Server 再次傳回所有學生的成績了
![CleanShot 2024-12-09 at 14.58.00@2x](https://hackmd.io/_uploads/ryVNHMN4yl.png)
### Auth
Auth 工具的話主要負責 authentication 相關管理，裡面有支援非常多的 authentication method，Bearer、OAuth2 等全部都有，對於測試時可說是非常方便。
![CleanShot 2024-12-09 at 17.11.36@2x](https://hackmd.io/_uploads/SyStVVE4Jx.png)
:::info
礙於篇幅關係，在此只會示範 `Basic Authentication`，其餘 Authentication Method 若您有興趣可以自行參考[官方文件](https://docs.thunderclient.com/features/auth)。
:::
首先回到我們的 API 並修改以下段落程式碼：
```typescript=
import { Hono } from "jsr:@hono/hono";
//Import basicAuth middleware
import { basicAuth } from "jsr:@hono/hono/basic-auth";

// ...

// Add basicAuth middleware and specified correct username and password
hono.get("/scores", basicAuth({ username: "Josh", password: "12345" }), (c) => {
    // And remove these
    // const { key } = c.req.header();
    // if (key !== "123") return c.text("Invalid Key", 400);
    const { name } = c.req.query();
    if (!name?.length) return c.json(studentsScore);
    const student = studentsScore.find((e) => e.name === name);
    if (student) return c.json(student);
    return c.text("Student not found", 400);
});
```
修改完後請重新啟動 API Server。
接下來回到 request 的 `Headers` 頁面，刪除剛剛建立的 `key` Header。再來切換到 `Auth` 頁面，然後 authentication method 先選擇 `None`。
![CleanShot 2024-12-09 at 17.34.32@2x](https://hackmd.io/_uploads/HJpTKENNye.png)
此時送請求過去，你會發現 API 傳回了狀態碼 `401` 代表我們目前是 unauthenticated 的狀態
![CleanShot 2024-12-09 at 17.31.28@2x](https://hackmd.io/_uploads/Bkl_qVV4ye.png)
:::info
基本上不管 Unauthenticated 與 Unauthorized，通常皆會回傳此狀態碼，但是其實兩者是有差別的。Unauthenticated 是代表尚未確認或無法確認您的身份，而 Unauthorized 是代表您沒有權限進行存取或執行動作。
:::
接下來我們將 Authentication Method 改成 `Basic`，並輸入剛剛在專案中，在 `basicAuth` middleware 寫的 username 與 password
![CleanShot 2024-12-09 at 17.53.00@2x](https://hackmd.io/_uploads/H1OQRNV4ke.png)
再次送出請求你就會發現 API Server 這次傳回資料了
![CleanShot 2024-12-09 at 17.54.29@2x](https://hackmd.io/_uploads/HJgFCEVNJx.png)
### Body
此頁面可以撰寫該 Request 的 Request Body，當你要送出到 API 時，您有可能需要將特殊資料送給 API 處理（e.g. JSON、Form-data），此時即可把那些資料透過 Request Body 將整坨資料傳送至 API。請注意，`GET` and `HEAD` request 無法傳送 Request Body。
接下來我們就來寫程式碼吧！假設現在有人想要將成績送到資料庫內，所以我們需要定義一個新路徑，讓那個人可以透過 JSON 格式的 Request Body 將學生成績新增到資料庫！
```typescript=
hono.get("/scores", basicAuth({ username: "Josh", password: "12345" }), (c) => {
    //...
});

//Defining Path
hono.post("/scores", async (c) => {
    const data = await c.req.json();
    studentsScore.push(data);
    return c.json(studentsScore.at(-1), 201);
});

Deno.serve({ port: 3000 }, hono.fetch);
```
這次此路徑是改接收 `POST` request，因為 `GET` request 的話 Client 端是無法傳送 Request Body 的。接下來在接收到 post 請求後，我們會先呼叫 `c.req.json()` 取得 Request Body 並將其轉成 JavaScript Object，之後直接將資料新增至資料庫，並傳回新增進去的資料。`studentsScore.at(-1)` 表取得 `studentScore` 陣列中倒數第一筆資料，即我們剛剛新增進去的資料。
:::info
這次因為我們處理的程式中有需要處理 Promise，故這次在 handling function 前面加了 `async` 關鍵字，使我們在 handling function 中可以使用 `await` 來處理 Promise 的資料，降低處理 Promise 時的程式碼複雜度。
:::
修改完程式碼之後請再次重啟 API Server，然後回到 Thunder Client 的介面，新增一個 Request
![CleanShot 2024-12-09 at 18.33.20@2x](https://hackmd.io/_uploads/Hylcwr4N1x.png)
接下來到該列表右側的 Request 編輯器，將連結輸入框左側的 `GET` 改成 `POST`，並輸入剛剛新增路徑的連結
![CleanShot 2024-12-09 at 18.43.12@2x](https://hackmd.io/_uploads/ByZyqS44ke.png)
再來，請切換到 `Body` 頁面，下方格式選擇 `JSON`，並在 `JSON Content` 處填寫你想插入的資料
![CleanShot 2024-12-09 at 18.43.43@2x](https://hackmd.io/_uploads/rJMG9BENJg.png)
送出請求後，右側如果出現剛剛新增的資料，就代表新增成功了！
![CleanShot 2024-12-09 at 18.45.44@2x](https://hackmd.io/_uploads/SJUq5BVNyg.png)
再次查詢所有學生成績，就會發現資料成功新增進去了！
![CleanShot 2024-12-09 at 18.49.34@2x](https://hackmd.io/_uploads/BJKFiH44Jg.png)
### Tests
最後就是測試功能了，你可以在此制定測試通過的條件，然後送出請求，API Client 會自動依據您所提供的測試條件，來對回傳的資料進行檢查，進而讓你確認測試是否有通過。以下為 Tests 頁面展示：
![CleanShot 2024-12-09 at 18.51.33@2x](https://hackmd.io/_uploads/BJ4ZnH4Vyx.png)
:::info
測試部分，Thunder Client 有提供兩種測試方式，一種是給予測試條件（`Tests`），一種是透過寫程式碼進行測試（`Scripting`）。因為 `Scripting` 為付費功能，此處僅示範 `Tests`。
:::
假如我們想要測試查詢學生 Mario 的成績，確認是否回傳碼為 `200`、並且該學生英文成績是否為 86 分，我們可以先新增 Query
![CleanShot 2024-12-09 at 18.59.16@2x](https://hackmd.io/_uploads/SyUWCBVV1g.png)
接下來撰寫測試條件
![CleanShot 2024-12-09 at 19.03.39@2x](https://hackmd.io/_uploads/BJpnCHV4kx.png)
送出 Request 並且 API 傳回資料後，我們可以在右側的 `Results` 查看測試結果：
![CleanShot 2024-12-09 at 19.03.15@2x](https://hackmd.io/_uploads/S1VNyI4E1x.png)
在此結果中我們可以看到第一個測試「傳回狀態碼為 `200`」，因為請求成功，所以傳回狀態碼為 `200`，所以通過測試；但第二個測試「Mario 學生的英文成績為 85」因為回傳的資料中，英文成績為 66，故測試不通過。如果您正在開發 API 且遇到有測試條件無法通過測試的狀況，請檢查程式碼並修正後再次進行測試。
## Wrap-up
在此文中，我們介紹了 Thunder Client 的基礎功能，並且如何利用那些功能去對 API Server 進行測試。與 Postman 相比，它不僅只是單純用來做請求測試的工具，他提供了更多圖形界面，讓開發者能夠更容易撰寫要發出的 Request，並能透過 GUI 介面撰寫測試來自動化測試回傳資料是否滿足通過條件。雖然說免費版限制了不少功能，但是在沒有特殊要求下，免費方案提供的功能基本上也已經敷用了，如果免費版功能不足夠的話，也可以透過購買付費方案來解鎖其他更強大的功能（e.g. Scripting、Request Chaining）。整體來講是一個不錯的擴充功能，希望未來開發者可以再開放更多功能，讓這個 Extension 可以更加實用。