---
title: Discord.js-Framwork-Typescript 使用教學
published: 2021-08-10
description: Discord.js-Framwork-Typescript 框架使用教學
tags: [Discord, Discordjs, Framwork, TypeScript]
category: Guide
draft: false
---

## 簡介與製作動機
此專案改寫自 [xiaoxigua-1](https://github.com/xiaoxigua-1) 的 [Discord.js-Framwork](https://github.com/xiaoxigua-1/Discord.js-framework)，這專案同時也是我正式開始 Typescript 旅程的第一步。當初因為 Discord.js 沒有指令處理器，讓我不是很想跨入 Discord.js ，後來感謝 [xiaoxigua-1](https://github.com/xiaoxigua-1) 介紹了他製作的 [Discord.js-Framwork](https://github.com/xiaoxigua-1/Discord.js-framework)，讓我可以不用苦惱指令處理器的撰寫，可以直接開始寫指令。

後來接觸到了 TypeScript，發掘到 TypeScript 相較於 Javascript，TypeScript 還有強大的型別註記與語法提示，所以便將 [xiaoxigua-1](https://github.com/xiaoxigua-1) 的 [Discord.js-Framwork](https://github.com/xiaoxigua-1/Discord.js-framework) 稍微優化並改寫成此專案。


順便附上 [Discord.js-Framwork](https://github.com/xiaoxigua-1/Discord.js-framework) 專案的README：
* 單純隨便寫的
* 恩~~如果覺得好用ㄉ話歡迎使用?
* 寫得很爛別介意

## 下載方式：
```sh
git clone https://github.com/Kayxue/Discord.js-Framwork-Typescript.git
```

## 使用方式：

### 1.先以 vscode 打開專案資料夾

### 2.安裝模組：
輸入以下指令安裝專案所有所需模組：
```sh
#使用npm
npm i                            #安裝專案所需模組
npm install --global typescript  #安裝 TypeScript

#使用yarn
yarn                             #安裝專案所需模組
yarn global add typescript       #安裝 TypeScript
```

### 3.編輯設定檔：
打開 `src/Config.ts` 並編輯設定
```typescript=
export const prefix = "";     //你想要的機器人前綴
export const owner_id = "";   //機器人擁有者 ID
export const token = "";      //機器人的 token
export const youtubeapitoken = ""; //YoutubeAPIToken，若不使用音樂功能則免填
export const blacklist = [];  //使用指令黑名單，將使用者ID填入後該使用者使用指令時將不會有反應
```

### 4.執行專案：
#### 方法1：使用 tsc 編譯
打開終端機輸入：
```sh
tsc         #編譯程式碼
cd dist     #切換到 dist 資料夾(程式碼編譯結果輸出處)
node .      #執行專案
```

#### 方法2：使用 ts-node 直接執行
:::info
若未安裝 ts-node 請使用下面指令安裝：
```sh
#使用 npm
npm install --global ts-node

#使用 yarn
yarn global add ts-node
```
:::

打開終端機輸入：
```sh
cd src      #切換到 src 資料夾(專案資料夾)
ts-node .   #執行專案
```

## 指令與事件監聽器撰寫方式：
### 新增類別部分：
#### 1.在 Command 資料夾下新增 `[檔名].ts`
#### 2.匯入模組：
```typescript=
import Commands from "../core/commands";
import { Client, Message } from "discord.js";
...
```
#### 3.宣告類別
```typescript=
class w extends Commands { //類別名稱可自取

}
```

#### 4.宣告匯出函數
```typescript=
export default function setup(bot: Client) {
    //實例化類別，此例類別為w(bot 必要傳入參數)，classname 非必要傳入(該 cog 名稱)
    let commands = new w(bot, "classname")
    
    /*指令與事件監聽器撰寫處*/
    
    bot.AddCog(commands)
}
```

### 撰寫指令部分：
```typescript=
    /*撰寫指令*/
    let w2 = commands.command(async function w(msg: Message, ...text: string[]) {
        await msg.channel.send(text.join(" "))
    }, { aliases: ["ee", "ww"] })
    
    /*發生錯誤處理*/
    w2.error((msg:Message, error) => {
        console.log(error)
        msg.channel.send(error)
    })
```
1. command 函式第一個參數為該指令程式碼撰寫處，傳入型別為函式
2. command 函式第一個參數之傳入參數部分：第一個傳入參數為 Message 物件，第二個以後之傳入參數則是指令參數
3. command 函式第二個參數部分為指令相關資訊：
    * `name`：型別為字串，指令名稱
    * `aliases`：型別為字串陣列，指令別名
    * `help`：型別為字串，完整指令幫助
    * `brief`：型別為字串，簡短指令幫助

:::warning
command函式第一個傳入參數可為具名函式或匿名函式（含箭頭函式）：
*  若**傳入具名函式**，指令相關資訊的 **name 欄位可留空**
* 若**傳入匿名函式**，指令相關資訊的 **name 欄位則必須填寫**，若無填寫該欄位，則**該指令將無法被載入、觸發**
* 若**傳入具名函式**，指令相關資訊的 **name 欄位也有填寫**，則該指令之**指令名稱為該指令相關資訊的 name 欄位值**
:::
:::info
**<類別實體之名稱>.bot** 可以傳回機器人物件：
```typescript=
    commands.command((msg: Message) => {
        console.log(commands.bot.user.username) //在終端機中印出機器人名稱
    }, { name: "botname" })
```
:::

### 撰寫指令群組部分：
```typescript=
    /*宣告指令群組*/
    let e = commands.group(async function wq(msg: Message) {
        console.log(msg.content)
    }, { aliases: ["ep", "qq"] })

    /*撰寫指令群組錯誤處理*/
    e.error(async function (msg: Message, error) {
        msg.channel.send(error.toString())
    })
    
    /*撰寫指令群組指令*/
    let r = e.command(async function rr(msg: Message, x: string) {
        commands.is_owner(msg)
        commands.bot
        await msg.channel.send("e.r")
    }, { aliases: ["ep", "qq"] })
    
    /*撰寫指令群組指令錯誤處理*/
    r.error((msg: Message, error) => {
        msg.channel.send(error.toString())
    })
    
    /*撰寫指令群組指令*/
    e.command(function ww(message: Message) {
        message.member.voice.channel.join().then(voicechannel => {
            let w = voicechannel.play(youtubedl("https://www.youtube.com/watch?v=jIpiLvkDIK8", { quality: 'highestaudio' }), { volume: 0.5 })
            w.pause()
            voicechannel.play(youtubedl("https://www.youtube.com/watch?v=7i2knHE7ofQ", { quality: 'highestaudio' }), { volume: 0.5 })
        })
    })
```

1. group 函式的作用：宣告一個指令群組
2. group 函式第一個參數為當該指令無輸入子指令時所執行之函式
3. group 函式第二個參數部分為指令相關資訊：
    * `name`：型別為字串，指令名稱
    * `aliases`：型別為字串陣列，指令別名
    * `help`：型別為字串，完整指令幫助
    * `brief`：型別為字串，簡短指令幫助
4. group函式會傳回Group物件：
    * Group.command 函式用法：與上方 command 函式相同
:::warning
* Group**沒有 Listener 函式！** 您**無辦法在指令群組內建立事件監聽器！**
* group函式第一個傳入參數可為具名函式或匿名函式（含箭頭函式）：
    *  若**傳入具名函式**，指令群組相關資訊的 **name 欄位可留空**
    * 若**傳入匿名函式**，指令群組相關資訊的 **name 欄位則必須填寫**，若無填寫該欄位，則**該指令群組將無法被載入、觸發**
    * 若**傳入具名函式**，指令群組相關資訊的 **name 欄位也有填寫**，則該指令群組之**指令群組名稱為該指令群組相關資訊的 name 欄位值**
:::

### 撰寫事件監聽器部分：
```typescript=
    /*撰寫事件監聽器*/
    commands.listener(function message(message: Message) {
        console.log(`on_message:${message.author.tag}:${message.content}`)
    })
    
    commands.listener((msg: Message) => {
        console.log("OK")
    }, { event: "message" })
```
1. listener 函式第一個參數為該事件程式碼撰寫處，傳入型別為函式
2. listener 函式第一個參數之傳入參數部分請查看 [Discord.js 官方文件的 client 事件](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=channelCreate)，因為不同 client 之事件會傳入不同參數，在此就不一一列舉
3. listener 函式第二個參數部分為監聽事件相關資訊：
    * `event`：型別為字串，事件名稱

:::warning
* 若**傳入具名函式**，監聽事件相關資訊的 **event 欄位可留空**
* 若**傳入匿名函式**，監聽事件相關資訊的 **event 欄位則必須填寫**，若無填寫該欄位，則**該事件函式將無法被觸發**
* 若**傳入具名函式**，監聽事件相關資訊的 **event 欄位也有填寫**，則該事件函式之**監聽事件名稱為監聽事件相關資訊的 event 欄位值**
:::

:::info
以此範例為例，該事件函式會在機器人偵測到有人發訊息時被觸發。當該事件被觸發時，函式會傳入 Message 物件，並且執行事件函式裡的內容（印出指定內容）

### 官方文件：
![](https://i.imgur.com/0HUF5om.png)
:::


    










