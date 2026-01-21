# Chrome 擴充應用程式版本

本分支 (`chrome-extension`) 包含將測試報告產生器轉換為 Chrome 擴充應用程式的所有修改。

## 主要變更

### 1. 新增文件
- `manifest.json` - Chrome 擴充應用程式配置文件
- `public/popup.html` - 擴充應用程式的彈出視窗 HTML
- `src/popup.tsx` - 擴充應用程式的入口點
- `src/utils/chrome.ts` - Chrome API 工具函數
- `CHROME_EXTENSION.md` - 詳細的使用說明

### 2. 修改的文件
- `App.tsx` - 整合 html2canvas 和 Chrome 下載 API
- `vite.config.ts` - 新增擴充應用程式構建配置
- `package.json` - 新增構建腳本和依賴
- `components/ReportForm.tsx` - 增強文件上傳錯誤處理
- `components/ReportPreview.tsx` - 修復重複的 null 檢查

### 3. Bug 修復
- ✅ 修復 `ReportPreview.tsx` 中 `getPercentPos` 函數的重複 null 檢查
- ✅ 增強文件上傳的錯誤處理和文件大小驗證
- ✅ 改進 Chrome API 的錯誤處理

## 構建和使用

詳細說明請參考 `CHROME_EXTENSION.md`

快速開始：
```bash
npm install
npm run build:extension
```

然後在 Chrome 中載入 `dist` 資料夾作為未封裝的擴充應用程式。

## 注意事項

1. **圖標文件**：擴充應用程式可以在沒有自定義圖標的情況下運行，但建議添加圖標文件到 `icons/` 資料夾
2. **向後兼容**：代碼同時支持網頁版本和擴充應用程式版本，會自動檢測運行環境
3. **權限**：目前僅請求 `downloads` 和 `storage` 權限，未來可根據需求添加更多權限