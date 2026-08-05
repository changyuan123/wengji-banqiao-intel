# 翁記麻辣鍋板橋店｜營運情報訂閱網頁

專為 **翁記麻辣鍋－板橋店**（新北市板橋區溪福里篤行路三段 28 號）打造的訂閱制營運情報原型。

## 線上預覽（不依賴本機電腦）

網站託管在 **GitHub Pages**。你的文書機關機、壞掉或沒開 Codespace，**公開網址都不會中斷**。

- 落地頁：https://changyuan123.github.io/wengji-banqiao-intel/
- 儀表板：https://changyuan123.github.io/wengji-banqiao-intel/dashboard/
- 原始碼：https://github.com/changyuan123/wengji-banqiao-intel

## 目標

讓門市管理人願意以每月約 **NT$99** 訂閱網頁服務：持續監控競品、自營外帶、菜單工程、淡季與在地搜尋，後續再疊加神秘客／人工情報與分潤。

## 雲端開發（建議）

本機僅作輕量檔案同步；`npm install` / `npm run build` 請優先在 **GitHub Codespaces** 執行。

```bash
# Codespace 內
npm install
BASE_PATH=0 npm run dev          # 開發預覽（無 GitHub Pages 前綴）
npm run build                    # 產出 out/（含 /wengji-banqiao-intel basePath）
```

部署：將 `out/`（含 `.nojekyll`）推到 `gh-pages` 分支。GitHub Pages 會從該分支提供靜態網站。

## 路由

- `/` 訂閱轉換落地頁
- `/dashboard/` 本月情報儀表板預覽
