#!/bin/bash

# GitHub Pages 部署腳本
# 這個腳本會構建項目並部署到 gh-pages 分支

set -e

echo "🔨 開始構建項目..."
npm run build

echo "📦 準備部署文件..."
cd dist

# 初始化 git（如果需要的話）
if [ ! -d .git ]; then
  git init
  git checkout -b gh-pages 2>/dev/null || git checkout gh-pages
fi

# 添加所有文件
git add -A
git commit -m "Deploy to GitHub Pages" || echo "沒有變更需要提交"

echo "🚀 部署到 GitHub Pages..."
git push -f origin gh-pages || {
  echo "❌ 部署失敗！請確保已設置遠程倉庫："
  echo "   git remote add origin https://github.com/eleanorewu/Test-Report-Generator.git"
  exit 1
}

echo "✅ 部署完成！"
echo "🌐 網站應該在幾分鐘內可用："
echo "   https://eleanorewu.github.io/Test-Report-Generator/"
