# GitHub Pages 部署指南

## 問題診斷

如果網站顯示空白或出現 404 錯誤，請檢查以下幾點：

### 1. 確認部署方式

**方式一：使用 GitHub Actions（推薦）**

1. 確保 `.github/workflows/deploy.yml` 文件存在
2. 在 GitHub 倉庫設定中：
   - 前往 **Settings** → **Pages**
   - **Source** 選擇 **"GitHub Actions"**
   - 不要選擇 "Deploy from a branch"

3. 推送代碼到 main/master 分支：
```bash
git add .
git commit -m "Fix deployment"
git push
```

4. 在 GitHub 倉庫中，前往 **Actions** 標籤頁，確認工作流程成功執行

**方式二：手動部署**

1. 本地構建：
```bash
npm run build
```

2. 將 `dist` 目錄的**內容**（不是 dist 目錄本身）部署到 `gh-pages` 分支：
```bash
# 方法 1: 使用 gh-pages 工具
npm install -g gh-pages
gh-pages -d dist

# 方法 2: 手動推送
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

3. 在 GitHub 倉庫設定中：
   - 前往 **Settings** → **Pages**
   - **Source** 選擇 **"Deploy from a branch"**
   - **Branch** 選擇 **"gh-pages"** 或您部署的分支
   - **Folder** 選擇 **"/ (root)"**

### 2. 確認 base 路徑配置

如果您的 GitHub Pages URL 是：
- `https://username.github.io/Test-Report-Generator/` → base 應該是 `/Test-Report-Generator/`
- `https://username.github.io/` → base 應該是 `/`

修改 `vite.config.ts` 中的 base 路徑：
```typescript
const base = mode === 'production' 
  ? (env.VITE_BASE_PATH || '/您的倉庫名稱/')  // 修改這裡
  : '/';
```

或者在構建時設置環境變數：
```bash
VITE_BASE_PATH=/您的倉庫名稱/ npm run build
```

### 3. 常見問題

**問題：網站顯示空白**
- ✅ 確認部署的是 `dist` 目錄的內容，不是源文件
- ✅ 確認 GitHub Pages 設定正確
- ✅ 檢查瀏覽器控制台的錯誤訊息

**問題：資源 404 錯誤**
- ✅ 確認 base 路徑配置正確
- ✅ 確認 `.nojekyll` 文件存在於 dist 目錄
- ✅ 確認所有資源路徑使用相對路徑或正確的 base 路徑

**問題：樣式不顯示**
- ✅ 確認 CSS 文件已正確構建
- ✅ 檢查 `dist/assets/` 目錄中是否有 CSS 文件

### 4. 驗證部署

部署完成後，訪問您的 GitHub Pages URL，打開瀏覽器開發者工具（F12），檢查：
- Console 標籤：不應該有 404 錯誤
- Network 標籤：所有資源應該成功載入（狀態碼 200）
