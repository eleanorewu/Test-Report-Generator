# 快速修復指南

## 問題：網站顯示空白，控制台出現 404 錯誤

### 立即檢查清單

1. **確認 GitHub Pages 設定**
   - 前往：https://github.com/eleanorewu/Test-Report-Generator/settings/pages
   - **Source** 必須選擇 **"GitHub Actions"**（不是 "Deploy from a branch"）
   - 如果沒有看到 "GitHub Actions" 選項，請先推送代碼並觸發工作流程

2. **確認 GitHub Actions 工作流程已執行**
   - 前往：https://github.com/eleanorewu/Test-Report-Generator/actions
   - 確認最新的工作流程顯示 ✅（綠色勾號）
   - 如果顯示 ❌（紅色叉號），點擊查看錯誤詳情

3. **如果工作流程失敗，手動觸發**
   - 在 Actions 頁面，點擊 "Deploy to GitHub Pages" 工作流程
   - 點擊右側的 "Run workflow" 按鈕
   - 選擇分支（main 或 master）並運行

4. **如果使用手動部署方式**
   ```bash
   # 確保已構建
   npm run build
   
   # 使用 gh-pages 部署
   npx gh-pages -d dist
   ```

### 驗證部署

訪問：https://eleanorewu.github.io/Test-Report-Generator/

打開瀏覽器開發者工具（F12），檢查：
- **Console**：不應該有 404 錯誤
- **Network**：所有資源應該成功載入（狀態碼 200）

### 如果仍然有問題

請檢查：
1. 瀏覽器控制台的完整錯誤訊息
2. Network 標籤中哪些資源載入失敗
3. GitHub Actions 的構建日誌
