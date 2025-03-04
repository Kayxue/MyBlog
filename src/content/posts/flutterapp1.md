---
title: Flutter App 1-First App Created with Using AI
published: 2025-02-25
description: 使用 Flutter 和 AI 開發第一個 App
tags: [Flutter, WebScoket, App]
category: Development
draft: false
---
個人最近因為系上物聯網課程剛開始，所以目前有在稍微研究 WebSocket，但因為都感覺沒有什麼好用的 WebSocket Client，所以藉這次作業的機會，我決定看 AI 看能不能幫我做一個。

## 1st Version
:::tip[PROMPT]
please develop a simple websocket application which can send message to websocket server and show message from websocket server
:::
畫面截圖
![](https://cdn-images-1.medium.com/max/1600/1*XLnlzADYdaJPWFxhwzj6Jg.png)
感覺還不錯，只是標題感覺有點不合適，所以自己修改了一下標題，也順便將連上的 WebSocket Server 換成我自己的。但修改完成後，App 剛執行時卻直接噴錯誤，錯誤為 `SocketException: connection refused`，切到我寫的 WebSocket Server 專案才發現我的 server 忘了開，所以問題不大，開了以後那個錯誤就消失了。修改之後如下圖所示：
![](https://cdn-images-1.medium.com/max/1600/1*4jZO1Mm5Ge36hssKGO5kRg.png)
所以個人感覺或許可以在下一版實作個開關，以啟動或關閉連線
## 2nd Version
:::tip[PROMPT]
Please insert a row above the text input, and it contains a text and a switch, text is on the left and content is "Connection Status: {status}" where {status} is current connection status, switch is on the right, if it turn on, establish the connection, or else close the connection.
:::
軟體畫面與使用效果截圖：
![](https://cdn-images-1.medium.com/max/1600/1*ARmSvKJB1noxL7Q_VCpzmA.png)
看一下 server 的 console:
![](https://cdn-images-1.medium.com/max/1600/1*J2blSCxbrsvUkdd9H1Zj8g@2x.png)
那些 Session closed 訊息皆是在關掉 switch 後出現的，所以程式部分目前沒問題。接下來就是小防禦的部分，其實在第一版剛修改完時直接啟動，他會直接噴 `SocketException`，並且程式直接變成無法載入，所以接下來就是要對無法連線的狀況進行處理
## 3rd Version
:::tip[PROMPT]
please add a checking to check whether can connect to websocket server after user toggled the switch, if can't connect to the websocket server, please show a toast "Can't connect to websocket server" and remain the switch in off state
:::
沒操作時畫面跟上一版是一樣的，所以在此不放了。

但是滿懷期待的先關掉 server，然後點一下連線開關，結果很不幸的……又是 Connection refused：
![](https://cdn-images-1.medium.com/max/1600/1*N87R_JNThR4WwOn46KMkog@2x.png)
我嘗試下了一個 prompt：
:::tip[PROMPT]
After I toggle the switch when server down, the app throws SocketException: connection refused
:::
然後 GitHub Copilot 跟我講說修復了，結果安裝程式並操作後還是噴出了一樣的錯誤，還好我以前有看過一些 Dart 官方教學，所以我稍微觀察了一下，相較修改前，我發現他只是增加 `SocketException` 處理罷了（圖中上方）：
![](https://cdn-images-1.medium.com/max/1600/1*zhOjv_-SLJMbbAlmKWMCUg@2x.png)
可見這個問題 AI 似乎已經不知道怎麼處理了，且該問題並不是這樣處理的，所以我只好先把程式碼還原，並開始自己處理。
首先找到了模組的網站，發現剛剛他是裝舊版的，所以先使用 `flutter pub add web_socket_channel` 進行了模組更新。
![](https://cdn-images-1.medium.com/max/1600/1*ZIdLgCNwO6gHMuSwusYlhw@2x.png)
接下來就是找整個的問題所在，既然是連線出問題，稍微看了一下 Flutter 官方的教學，知道了進行連線的方法是 `WebSocketChannel#connect` ，所以在 docs 裡找 `WebSocketChannel` 類別的 `connect` 方法或許會有相關線索。幸運的是我稍微找一下就挖到了，並且從下圖可以看到該方法是一個 static method:
![](https://cdn-images-1.medium.com/max/1600/1*IrAnuPhAXnsgL59Ex__1EA@2x.png)
點進去後，發現了關鍵線索：
![](https://cdn-images-1.medium.com/max/1600/1*4ib5EbDgSzn31TPVTrXF2Q@2x.png)
所以可見該方法執行時，他會以 synchronous 的方式傳回 WebSocketChannel 物件，但是發起連線這動作並不是同步的，並且 `ready` 這個 future 會在連線成功後完成，如果有錯誤的話，它會結束並丟出錯誤。
可見解決問題的關鍵是 `ready` 這個 future，點一下該段落中的 `ready`，進到了該屬性的 docs 頁面，解決方案總算出現了：
![](https://cdn-images-1.medium.com/max/1600/1*_6rfRkNherFRjqxYtggLaA@2x.png)
在這就可以跟著範例直接將正確程式碼寫入，寫好正確程式碼後，再透過註解插入法請 AI 插入個 Toast 的程式碼，讓連線成功時會顯示 Toast。
![](https://cdn-images-1.medium.com/max/1600/1*4cIEQ4CyKODAjQfd4qwqpw@2x.png)
此時提示出現了：
:::note
Don't use 'BuildContext's across async gaps.
Try rewriting the code to not use the 'BuildContext', or guard the use with a 'mounted' check.
:::
上網查了一下，大概知道了如何採用以上訊息後半提的方法解決，不過因為目前程式個人看上去沒有什麼關於程式執行時 unmount 的部分，所以這部分個人就決定先不處理。
接下來本人又下了一個 prompt 請 AI 加上程式碼，當使用者點開關關閉連線時，會顯示 Toast:
:::tip[PROMPT]
Show a toast when user toggle the switch to close connection
:::
無法連線效果：
![](https://cdn-images-1.medium.com/max/1600/1*_VFWwKGivdL0Q5Y0PmZ2HQ.gif)
最後看出來怎麼搞個 Toast 後，最後自己也針對沒連線或沒輸入訊息的狀況新增了 Toast：
![](https://cdn-images-1.medium.com/max/1600/1*2NFrofb38W4usbY2DpnPAw.gif)
但是稍後成功和 server 連線後，點 switch 關閉連線時卻又不幸發生了 Exception:
:::caution[ERROR]
Invalid argument: 1001, close code must be 1000 or in the range 3000–4999
:::
所以可見是關閉連線時出了問題，看了一下，當時 AI 在寫時幫我在關閉連線時加了 status code，所以當下本人決定先把 status code 先移除，結果問題就這樣解決了。
原始 AI 寫的：
![](https://cdn-images-1.medium.com/max/1600/1*IdkMzhmUbrFZNLT7wlc4xQ@2x.png)
然後下了這版最後一個 prompt，讓 Toast 顯示時間短一點：
:::tip[PROMPT]
Change all toast display time to 2 secs
:::
最終效果（無法連線的部分就不展示了）：
![](https://cdn-images-1.medium.com/max/1600/1*xjALUMcvowPO5QoMWV_odw.gif)
接下來就是依作業要求加點圖片，然後還有聲音
## 4th Version
因為畢竟是工具軟體，圖片與音效自然會不太容易融入，不如在左下角加個圖片小按鈕當做作者小頭像，並且在送出訊息時加個音效吧！
首先先用 prompt 在畫面左下角插入有圖片的懸浮按鈕吧：
:::tip[PROMPT]
Add a flow button locate at bottom-left of the screen, and which can display a picture
:::
結果寫錯了一個單字，並且 AI 幫我加了不是我想要的程式碼，所以只好還原重寫：
:::tip[PROMPT]
Add a floating button at the bottom-left of the screen, and filling textures is a picture
:::
這次 AI 比較理解了，只是他還是插入了一個不是我預期的點擊監聽器，等一下再搞成自己需要的功能吧：
![](https://cdn-images-1.medium.com/max/1600/1*tohzLs0lac2FUsj7ihM6EA@2x.png)
在這先自己把按鈕改成想要的樣子：
![](https://cdn-images-1.medium.com/max/1600/1*3NPEkBnJzlQTylEBtzchDA@2x.png)
結果按鈕位置非常奇怪，並且圖片也整個使按鈕失去了原有形狀：
![](https://cdn-images-1.medium.com/max/1600/1*35reQJ5hYezDfGQfp-jJfQ.jpeg)
所以又在檔案中的元件屬性內寫註解 prompt:
:::tip[PROMPT]
```dart title="main.dart"
//Make the button fill with the image
```
:::
結果 AI 新增程式碼後儲存，圖片直接變成了圓型
![](https://cdn-images-1.medium.com/max/1600/1*escn5IJungrxSqL34R1lUw.jpeg)
再次找了 AI:
:::tip[PROMPT]
Change avatar to rounded square
:::
雖然變成圓角方形，但圓角的部分跟按鈕還是有點不合拍，所以最後自行調整了圓角程度，好看多了，順帶一提，鳩真的好可愛喔.w.
![](https://cdn-images-1.medium.com/max/1600/1*RP4wzMIgjHRcGPLFzyY4kA.jpeg)
嘗試請 AI 修復左下角按鈕與左螢幕邊界距離：
:::tip[PROMPT]
make bottom-left corner button a little bit futher to left screen margin, just like bottom-right corner button
:::
結果請 AI 調整許久還是沒辦法調好位置，最後只能自行調整了
![](https://cdn-images-1.medium.com/max/1600/1*F79qILXZw4WhhTDz3nrmiw.png)
接下來就是點擊後的效果部分，這邊個人決定是點了會出現製作者的名字：
:::tip[PROMPT]
When click on bottom-left corner button, show a toast to display creator's name
:::
效果如下：
![](https://cdn-images-1.medium.com/max/1600/1*b5zmI07JxDp8iluzhqz6tQ.gif)
## 5th Version
接下來就是送出音效的部分：
:::tip[PROMPT]
Play a sound before sending a message
:::
AI 剛修改完，程式碼馬上跳紅線，按接受後輸入 `flutter pub add audioplayers` 即可，只是個人覺得有點扯的是為什麼他都不是給你裝最新的，還要自己再輸入一次才能裝到最新的。
找好音檔，將東西放入資料夾並寫好相關東西後，然後改個程式碼就 OK 了
<div style="position:relative; width:100%; height:0px; padding-bottom:216.216%"><iframe allow="fullscreen" allowfullscreen height="100%" src="https://streamable.com/e/8etoz3?" width="100%" style="border:none; width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden;"></iframe></div>

## 6th Version
最後再做一點小美化跟人性化，因為最近我也不知道為什麼某天我突然上網去查 switch 元件的 docs，發現它可以在開關上插入小圖示，所以接下來就來在 switch 上插入小圖示吧
:::tip[PROMPT]
Add icons to switch, and the icon can be changed, the icon to change depends on connection status
:::
結果沒想到出現在了奇怪的位置，這真的不是我想要的
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*SBqCN81QXwr5MYb6sWBGSQ.jpeg)
原本以為又是我要自己動手的時候了，但最後決定換了一個 prompt 再次嘗試，他終於理解我想要加什麼了：
:::tip[PROMPT]
Add icons on switch, and the icon can be changed, the icon to change depends on connection status
:::
但是最好笑的是他居然是換成本地沒有的 asset，我 hot reload 看到錯誤才知道你這樣搞，請問你認真的？
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*PijasVI1UFtgRdeVpQaQBw@2x.png)
因為真的不知道怎樣再下 prompt 了，所以只能看官方文件範例開改，這 AI 感覺有點……
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*n8Ek8-aMv04C8QN7Ms_nqg@2x.png)
中途我知道你想幫我，但不好意思，我想用比較保險的官方做法
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Y5-P4qhHduFgUA_3ZLrw0g@2x.png)
效果：
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*f7MIwJXLlJpcNOlZ7dGFtw.gif)
接下來就是字型，照著老師給的文章設定，然後下 prompt 請 AI 幫我換：
:::tip[PROMPT]
Add font to all text
:::
結果全數報錯， 請問 AI 你資料還太少嗎？
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*cWj6D6lbme0Eq4nEarEl5w@2x.png)
所以只能先接受，然後自己看 docs 換，超大一坨
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*WaoSvkC9ASvmKT9-u3PGeQ@2x.png)
但到後面我才不知道為什麼自己剛剛要那樣做
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*QIdX_l1uPOBhIpunbg3NnA@2x.png)
到後面才發現官方其實有寫怎麼套全域字體，所以後來自己就把套字體方式換成 docs 上面寫的了
套用字型後效果可以說是非常好
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*dojWjHG936DMhrNNmDb57Q.jpeg)
最後自己換個不錯的顏色
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*I3EYyIfeGRcjU8-9jCy4hw.jpeg)
## 7th Version - Final Challenge
這樣的 app 其實基本上來說已經算不錯了，但是不知道哪來的想法……最後就來搞發通知吧！這個除了是對 AI 的最後考驗，但或許也是最多我需要自己動手的部分了！接下來就準備開始吧！首先，第一個 prompt:
:::tip[PROMPT]
Send a notification when receive message from websocket server
:::
結果按下接受變更，補模組後，程式剛執行時卻馬上被編譯器打臉：
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*rM65Hin0TJm4JN0XvTuhrg@2x.png)
簡單來講就是我沒有針對 iOS 進行設定，在此就請 AI 先幫忙設定：
:::tip[PROMPT]
Pease set up notification settings for iOS
:::
但是這波看起來 AI 資料還沒更新，插了一個 linting 不認識的東西進去
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*kt7T4B7WYAVCaEExcVWK6Q@2x.png)
滑鼠滑上去 `InitializationSettings` 類別 constructor 的 `ios` property 上其實不難發現 AI 寫錯型別了……我自己改吧！
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*tt9w9sF3kXEVUMObePJQuw@2x.png)
下方 `IOSNotificationDetails` 也是跟剛剛一樣的做法進行探索跟修正
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*82un7WHTLNkcY_e_MLtbCQ@2x.png)
修改完後啟動 app，看到了這個東西，在這按下接受吧！這個時候，應該距離成功已經不遠了！
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*_klYrlalrr5rWKwEHVyHIw.jpeg)
結果很不幸的，錯了……請問通知呢？
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HdbyCY-JFDxGt-A37-dZCQ.gif)
這應該不是 Flutter 本身的問題吧？如果有或許早拋 exception 了。
所以只好去模組的介紹頁看有沒有一些線索，結果終於找到問題所在。
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*q51fz82hQ6qNIdXs_GNSPw@2x.png)
以上作者大概的意思是說你需要將下方對應程式語言程式碼插入 `AppDelegate.swift` 檔案，雖然剛開始看到檔案不知道是要怎麼處理，但是還好作者有給範例，看了就知道了，如下插入即可：
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*h_lV_-JdwEO9bi24rG0BkA@2x.png)
最後就是一個小 bug，通知會在關閉連線時再次送出，在此本人自己手動加個 state 和一些程式碼防止後，問題就消失了：
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*jGwK3XOlU2_6nM1K0C2d-g@2x.png)
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*T04qoyZavm3QgLPq-rYqsQ@2x.png)
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6zNsk_DkkHoR_ZUgy5bUbg@2x.png)
最後來享受成果吧！
## Finished Version
無法連上 WebSocket 狀況與無連線展示：
<div style="position:relative; width:100%; height:0px; padding-bottom:216.216%"><iframe allow="fullscreen" allowfullscreen height="100%" src="https://streamable.com/e/sjil94?" width="100%" style="border:none; width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden;"></iframe></div>

其他部分展示：
<div style="position:relative; width:100%; height:0px; padding-bottom:216.216%"><iframe allow="fullscreen" allowfullscreen height="100%" src="https://streamable.com/e/1mzz4n?" width="100%" style="border:none; width:100%; height:100%; position:absolute; left:0px; top:0px; overflow:hidden;"></iframe></div>

## Github Repo
:::warning[自行使用注意]
自行使用注意：此應用程式目前所連線的 WebSocket server 仍為本人自己寫的本地 server 位置，若想測試效果，請將 WebSocket server 連線位置改成 `wss://echo.websocket.events` 或者你自己寫的 WebSocket server 位置。並且若在 iOS 之外系統執行，因為本人沒有進行特別設定，故無法看到通知，請見諒。
:::
::github{repo="Kayxue/MyFirstFlutterApp"}
## Wrapping Up
不得不說 AI 真的蠻強大的，對於這種 app 來說，在我對 Flutter 不熟的狀況下，可能自己不知道寫出來要花多久時間，但只要交給 AI，只要跟他講你想要有怎樣的東西，他就可以幫你做出來，雖然說還是會有錯的可能，但是確實是一個可以減輕自己工作負擔的一個好工具。
## Image Resource

<blockquote class="twitter-tweet"><p lang="qme" dir="ltr"><a href="https://twitter.com/hashtag/Phigros_art?src=hash&amp;ref_src=twsrc%5Etfw">#Phigros_art</a> <a href="https://t.co/m9NqVDCaJX">pic.twitter.com/m9NqVDCaJX</a></p>&mdash; 蒼紫 (@tit_phin3005) <a href="https://twitter.com/tit_phin3005/status/1891825480757657965?ref_src=twsrc%5Etfw">February 18, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
