# 故障排除指南

## 無法載入擴充應用程式

### 錯誤：無法載入圖標文件

**症狀：**
- 點擊「載入未封裝項目」後出現錯誤
- 錯誤訊息包含 "Could not load icon 'icons/icon16.png'"

**解決方案：**
1. 確保已執行構建：
   ```bash
   npm run build:extension
   ```

2. 當前版本已自動處理：如果圖標文件不存在，manifest.json 會自動移除圖標配置，Chrome 會使用預設圖標

3. 如果想要自定義圖標：
   - 在 `icons/` 資料夾中添加以下圖標文件：
     - `icon16.png` (16x16 像素)
     - `icon48.png` (48x48 像素)
     - `icon128.png` (128x128 像素)
   - 重新構建：
     ```bash
     npm run build:extension
     ```

### 錯誤：找不到 popup.html

**症狀：**
- 錯誤訊息："Could not load popup.html"

**解決方案：**
1. 確認 `public/popup.html` 文件存在
2. 重新構建擴充應用程式
3. 檢查 `dist` 資料夾中是否有 `popup.html`

### 錯誤：找不到 JavaScript 文件

**症狀：**
- 彈出視窗為空白
- 控制台顯示 404 錯誤

**解決方案：**
1. 確認構建成功完成
2. 檢查 `dist/assets/` 資料夾中是否有 JavaScript 文件
3. 確認 `dist/popup.html` 中的腳本路徑正確（應為 `./assets/popup.js`）

### 其他問題

如果遇到其他問題：
1. 檢查 Chrome 擴充應用程式管理頁面的錯誤訊息
2. 打開 Chrome 開發者工具查看控制台錯誤
3. 確認所有文件都在 `dist` 資料夾中
4. 嘗試重新構建：
   ```bash
   rm -rf dist
   npm run build:extension
   ```