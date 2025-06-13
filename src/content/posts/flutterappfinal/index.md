---
title: Flutter App & IoT Final - Parking System
published: 2025-06-13
description: IoT 兼 Flutter 課程的期末專題
tags: [Flutter, IoT]
image: ./WholeSystem.png
category: Development
draft: true
series: "Flutter"
---
這學期的 Flutter 和 IoT 課程終於結束了，真的是有點不容易。雖然說在做期末專題中途發生了一些曲折，包括在中途因為時間不足以處理完整個大架構的串接，還有因為在大學，考試時間不太固定，所以在時間安排上也經常要進行調整，但是最後還是在願意放下一些東西的狀況下，成功地完成了這次的專題，最後也感謝彼得對於期末專題的開放性是如此大，可以因要跟一些其他課程結合的因素而接受需求變動。
:::note
本文有些圖片內容為報告截圖，因那時不知道物聯網課程 Demo 此專題時誰要上去報告，所以內容雖然皆由本人直接撰寫，但我們這組有僑生成員，故全部皆使用英文撰寫。但是請各位讀者不用擔心，本人會在文中輔以繁體中文解釋相關內容。
:::
## System Structure
![Initial structure of the system](./InitialStructure.png)

原始系統如上圖所示，箭頭旁的文字是該互動所牽涉到的 protocol，因為這學期的物聯網課程是使用 Node-RED 與 oneM2M 為主，所以原本希望說可以保留類似的架構進行製作，並且已經想好大概要怎麼做了，但是因為微積分考試是跟我目前修的所有課程中，考試時間最不同的，所以微積分考試嚴重影響了我做專題的時間。

而在成果發表前的週末，我請了組員幫我處理 Arduino 端的程式碼，並告訴了他如何處理跟 M2M 系統互動的部分，但是結果他直接請了 AI，並且不小心請 AI 把整個裝置 server 都寫出來。我當下也是有點傻了，雖然該組員說他可以請我給關鍵字，讓他請 AI 幫忙改成可以跟 M2M 系統相接，但是我當下完全想不到我要下什麼關鍵字（在 [IoT Final Project 1 - The Beginning](/posts/iotproject) 中，我有提到 M2M 是我自己寫的），所以只好當機立斷，直接變更整個架構，故最終架構如下圖所示：

![Final structure](./FinalStructure.png)

雖然說真的是非常的簡單，但沒辦法嘛！那天距離成果發表就剩三天，進度目前就這樣，還能再搞出什麼瘋狂的東西？反正關於儲存等其他部分，或許未來在還可以在其他物聯網課程中，將這系統直接拿來用，並進行其他改善，或許也是個不錯的選擇。

## Techniques We Use
這次最終有使用到的有以下技術。

不過在此解釋一下，Docker 旁邊標的 `Deprecated` 是代表我們原本有執行一些使用該技術的手續，但是最後在使用時遇到問題，並且不知道怎麼處理，所以只能先放棄使用，非指 Docker 本身是個已被棄用的東西。

![Techniques we use in the project](./Technique.png)

我們使用的技術大概簡述如下：
* **Arduino UNO**：一個義大利公司產的微控制器開發板
* **JavaScript & Jonhhy-five**：JavaScript 是一個用於網頁的程式語言，但 Node.js 出現後，使其也可以用來開發後端。而 Johnny-five 是一個可以透過 JavaScript 來控制 Arduino 的一個 library。
* **Flutter**：一個由 Google 公司所開發的礦平台應用程式開發框架。
* **Docker**：一個可以幫助開發者將其應用程式打包成簡單的 image 並且可直接部署至其他裝置執行的好用工具。

## Sensors We Use​
這次最終有使用到的有以下感應器。
![Sensors we use in the project](./Sensors.png)

用途簡單說明如下：
* **IR 避障感應器**：偵測車位狀態、是否有車子要進去或離開停車場
* **20 x 4 顯示器**：顯示停車場內的車位狀態
* **SG90 迷你伺服馬達**：控制柵欄升降