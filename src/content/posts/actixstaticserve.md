---
title: ActixStaticServe Docker Image 使用教學
published: 2025-02-26
description: ActixStaticServe Docker Image 使用教學
tags: [Docker, Static Site, Hosting]
category: Docker
draft: false
---
這個是一個本人製作的 Docker image，這個 Docker image 可以讓你非常容易在 Docker 上部署您的靜態網站，起初這個部分是我部落格專案的一部分，但為了部署可以順暢，故本人將此部分從本人的部落格專案獨立出來，也順便將打包過後的 image 分享出去，讓可能需要用的人可以使用。並且因為使用 Actix-web，所以執行時所佔資源極低，並且壓縮完 image 只有大約 1.02KB 左右，所以個人感覺此 image 非常適合使用在單板電腦上，各位想試用看看的話非常歡迎喔！
::github{repo="Kayxue/ActixStaticServe"}
:::warning
* **無自訂：** 此 image 目前並不支援自訂任何 server 相關設定。伺服器預設監聽位置為 `0.0.0.0:3000`，並且預設 serving `/public` 資料夾
* **不包含任何終端機：** 此 image 奠基於 Docker 保留的最小映像—scratch，所以此 image 不包含任何終端機！並且只能執行無需任何依賴的執行檔！
:::
## Docker File Usage Example
```dockerfile title="Dockerfile" icon="docker"
FROM ghcr.io/kayxue/actixstaticserve:latest

WORKDIR /

COPY ./public/ ./public/
```
* 第一行的部分是代表從 `ghcr.io/kayxue/actixstaticserve:latest` 開始一個新的階段
* 第二行代表將工作資料夾設定為根目錄
* 第三行的部分是將您的靜態網站複製至 image 中的 `/public` 資料夾

沒錯，用起來非常簡單吧！以下順便再給各位一個範例
## Example: Using with an Astro Static Site Project
:::note
在此以 Bun 為例，實際 first stage 使用哪個 image 請依據您使用的程式語言與 package manager 而定。
:::

```dockerfile title="Dockerfile" icon="docker"
FROM oven/bun:alpine AS builder

WORKDIR /app
COPY . .

RUN bun install
RUN bun run build

FROM ghcr.io/kayxue/actixstaticserve:latest

WORKDIR /

COPY --from=builder /app/dist/ ./public/
```

## Contribution
此 repo 歡迎各位進行貢獻，若您想要貢獻，請遵守 [Code of Conduct](https://www.rust-lang.org/policies/code-of-conduct)
