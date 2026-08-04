# 翁記麻辣鍋板橋店｜營運情報訂閱網頁

專為 **翁記麻辣鍋－板橋店**（新北市板橋區溪福里篤行路三段 28 號）打造的訂閱制營運情報原型。

## 目標

讓門市管理人願意以每月約 **NT$99** 訂閱網頁服務：持續監控競品、自營外帶、菜單工程、淡季與在地搜尋，後續再疊加神秘客／人工情報與分潤。

## 雲端開發

- Repo：本倉庫
- 建議在 **GitHub Codespaces** 開發與建置，避免舊文書機本機負荷
- 透過 GitHub Actions 部署至 **GitHub Pages**（push `main` 自動部署）

## 本機／Codespace 指令

```bash
npm install
npm run dev
npm run build
```

靜態輸出目錄：`out/`

## 路由

- `/` 訂閱轉換落地頁
- `/dashboard` 本月情報儀表板預覽
