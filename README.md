# 🎆 Lightstick - 線上螢光棒

為演唱會和活動打造的數位螢光棒 Progressive Web App。

## 🌟 功能特色

- **輕觸換色**：快速點擊螢幕即可切換螢光棒顏色
- **防止誤觸**：長按不會觸發換色（避免握持時誤觸）
- **全螢幕模式**：自動進入全螢幕，獲得最佳體驗
- **螢幕常亮**：使用 Wake Lock API 保持螢幕開啟
- **離線可用**：PWA 支援，安裝後無需網路即可使用
- **16 種顏色**：精選鮮豔色彩，適合各種場合

## 🚀 技術棧

- **React 19** + **TypeScript**
- **Vite** - 快速開發與建置
- **Tailwind CSS 4** - 現代化樣式設計
- **vite-plugin-pwa** - Progressive Web App 支援
- **Wake Lock API** - 螢幕常亮功能

## 📦 安裝與開發

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview

# 部署到 GitHub Pages
npm run deploy
```

## 🌐 部署

本專案使用 GitHub Actions 自動部署到 GitHub Pages，並使用自訂網域 `lightstick.app`。
專案已設定 GitHub Actions workflow（`.github/workflows/deploy.yml`），當推送到 `main` 分支時會自動建置並部署。

## 📱 PWA 安裝

使用者可以將此應用安裝到手機主畫面：

1. 在行動裝置瀏覽器開啟 https://lightstick.app
2. 點選瀏覽器選單中的「加入主畫面」或「安裝」
3. 安裝後即可離線使用

## 🎨 使用說明

1. 開啟應用後，閱讀使用說明
2. 點擊「開始使用」按鈕
3. 應用會自動進入全螢幕模式並啟用螢幕常亮
4. 輕觸螢幕即可切換顏色（共 16 種顏色循環）
5. 長按不會觸發換色，避免握持時誤觸

## 📄 授權

MIT License

## 🙏 致謝

感謝所有為開源社群貢獻的開發者們。
