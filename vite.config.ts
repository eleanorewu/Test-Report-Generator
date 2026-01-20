import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// 插件：自動添加 .nojekyll 文件到構建輸出目錄
function noJekyllPlugin(): Plugin {
  return {
    name: 'no-jekyll',
    closeBundle() {
      const noJekyllPath = path.resolve(__dirname, 'dist', '.nojekyll');
      if (!fs.existsSync(noJekyllPath)) {
        fs.writeFileSync(noJekyllPath, '');
        console.log('✓ Created .nojekyll file for GitHub Pages');
      }
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // 如果是生產環境，使用環境變數或默認使用倉庫名稱作為 base 路徑
    // 如果倉庫名是 Test-Report-Generator，則 base 應該是 '/Test-Report-Generator/'
    // 如果部署在根目錄（username.github.io），則 base 應該是 '/'
    const base = mode === 'production' 
      ? (env.VITE_BASE_PATH || '/Test-Report-Generator/')
      : '/';
    
    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        ...(mode === 'production' ? [noJekyllPlugin()] : [])
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
      }
    };
});
