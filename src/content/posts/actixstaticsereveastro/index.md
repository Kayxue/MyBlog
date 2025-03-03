---
title: ActixStaticServe 實戰－架設 Astro 靜態網站
published: 2025-02-26
description: ActixStaticServe 架設 Astro 靜態網站教學
tags: [Docker, Static Site, Hosting]
category: Guide
draft: true
---
[上一篇文章中](/posts/actixstaticserve/)我大概介紹了本人製作的 ActixStatic docker image 簡單的使用方法，但是在實務上，如果每次都要手動將網頁專案 build 好，再將靜態網站檔案放入資料夾，然後自己手動下指令 build image 將打包好的 image 上傳至 registry，這其實是非常麻煩的一件事，所以這次的文章將會以 Astro 靜態網站為例，介紹如何在使用前端框架的專案中，使用此 image 與使用 GitHub Actions 自動化 build image 流程並將 image 上傳至 registry。
::github{repo="Kayxue/ActixStaticServe"}
## Preparation
首先，我們需要一個 Astro 靜態網站的專案，在此我以 [fuwari](https://github.com/saicaca/fuwari) 為例，打開 fuwari 的 GitHub 專案網頁後，點選右上角的 `Use this template` -> `Create repository from template`，以此 repo 為模板建立一個新的 repo。
![RepoPage](./newrepo.png)
進入建立新 repo 的介面後，先確認模板是否正確，然後寫上 repo 名稱等相關資訊，確認填寫的資訊 OK 後即可點選 `Create repository` 建立 repo。
![CreateRepo](./createrepo.png)
建立完成後，請打開終端機，並且使用 `cd` 指令切換到你想存放此專案的資料夾，然後輸入以下指令，將剛剛建立的 repo 複製到資料夾下：
```bash title="Terminal"
git clone https://github.com/<your-username>/<repo-name>.git
```
以上指令中的 `<your-username>` 請替換成你的 GitHub 使用者名稱，`<repo-name>` 請替換成你剛剛建立的 repo 名稱。以我為例，我剛剛建立的 repo 名稱為 `Tutorial`，則指令如下：
```bash title="Terminal"
git clone https://github.com/Kayxue/Tutorial.git
```
複製完成後，請進入專案資料夾下，使用對應指令在編輯器中開啟專案：
```bash title="Terminal"
cd <project-folder> # <project-folder> 請替換成你的專案資料夾名稱
zed .
```
:::note
在此本人使用 [Zed](https://zed.dev/) 編輯器，故在編輯器中開啟專案的指令為 `zed .`，若您使用其他編輯器，請自行替換指令。指令舉例如下：
* [Visual Studio Code](https://code.visualstudio.com/)：`code .`
* [VScodium](https://vscodium.com/)：`codium .`
:::
在編輯器中開啟專案後，若您不是使用 pnpm 作為 package manager，請先打開 `package.json`，並進行修改：
```json title="package.json" {6-10,12} collapse={2-4,17-69} del={11,15,70}
{
  "name": "fuwari",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "bunx --bun astro dev",
    "start": "bunx --bun astro dev",
    "build": "bunx --bun astro build && bunx --bun pagefind --site dist",
    "preview": "bunx --bun astro preview",
    "astro": "bunx --bun astro",
    "type-check": "tsc --noEmit --isolatedDeclarations",
    "new-post": "bun run --bun scripts/new-post.js",
    "format": "biome format --write ./src",
    "lint": "biome check --apply ./src",
    "preinstall": "npx only-allow pnpm"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "@astrojs/rss": "^4.0.11",
    "@astrojs/sitemap": "^3.2.1",
    "@astrojs/svelte": "7.0.3",
    "@astrojs/tailwind": "^5.1.4",
    "@fontsource-variable/jetbrains-mono": "^5.1.1",
    "@fontsource/roboto": "^5.1.0",
    "@iconify-json/fa6-brands": "^1.2.3",
    "@iconify-json/fa6-regular": "^1.2.2",
    "@iconify-json/fa6-solid": "^1.2.2",
    "@iconify-json/material-symbols": "^1.2.8",
    "@iconify/svelte": "^4.0.2",
    "@swup/astro": "^1.5.0",
    "@tailwindcss/typography": "^0.5.15",
    "astro": "5.1.6",
    "astro-compress": "^2.3.5",
    "astro-icon": "^1.1.4",
    "hastscript": "^9.0.0",
    "katex": "^0.16.19",
    "markdown-it": "^14.1.0",
    "mdast-util-to-string": "^4.0.0",
    "overlayscrollbars": "^2.10.1",
    "pagefind": "^1.2.0",
    "photoswipe": "^5.4.4",
    "reading-time": "^1.5.0",
    "rehype-autolink-headings": "^7.1.0",
    "rehype-components": "^0.3.0",
    "rehype-katex": "^7.0.1",
    "rehype-slug": "^6.0.0",
    "remark-directive": "^3.0.0",
    "remark-directive-rehype": "^0.4.2",
    "remark-github-admonitions-to-directives": "^1.0.5",
    "remark-math": "^6.0.0",
    "remark-sectionize": "^2.0.0",
    "sanitize-html": "^2.13.1",
    "sharp": "^0.33.5",
    "stylus": "^0.63.0",
    "svelte": "^5.5.3",
    "tailwindcss": "^3.4.16",
    "typescript": "^5.7.2",
    "unist-util-visit": "^5.0.0"
  },
  "devDependencies": {
    "@astrojs/ts-plugin": "^1.10.4",
    "@biomejs/biome": "1.8.3",
    "@rollup/plugin-yaml": "^4.1.2",
    "@types/markdown-it": "^14.1.2",
    "@types/mdast": "^4.0.4",
    "@types/sanitize-html": "^2.13.0",
    "postcss-import": "^16.1.0",
    "postcss-nesting": "^13.0.1"
  },
  "packageManager": "pnpm@9.14.4"
}
```
:::note
在此以 [Bun](https://bun.sh/) 為例，實際要修改的地方請依據您使用的 package manager 而定。
:::
