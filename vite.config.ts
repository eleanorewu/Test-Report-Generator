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

// 插件：複製 Chrome 擴充應用程式文件
function chromeExtensionPlugin(): Plugin {
  return {
    name: 'chrome-extension',
    closeBundle() {
      const distPath = path.resolve(__dirname, 'dist');
      const manifestPath = path.resolve(__dirname, 'manifest.json');
      const publicPath = path.resolve(__dirname, 'public');
      const iconsPath = path.resolve(__dirname, 'icons');
      
      // 複製 manifest.json
      if (fs.existsSync(manifestPath)) {
        // 讀取 manifest.json
        let manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        
        // 檢查圖標文件是否存在
        if (manifestContent.icons && fs.existsSync(iconsPath)) {
          const iconFiles = fs.readdirSync(iconsPath).filter(file => 
            file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
          );
          
          if (iconFiles.length === 0) {
            // 如果沒有圖標文件，從 manifest 中移除 icons 配置
            delete manifestContent.icons;
            console.log('⚠ No icon files found, removed icons from manifest');
          } else {
            // 複製圖標文件
            const iconsDest = path.resolve(distPath, 'icons');
            if (!fs.existsSync(iconsDest)) {
              fs.mkdirSync(iconsDest, { recursive: true });
            }
            iconFiles.forEach(file => {
              fs.copyFileSync(
                path.resolve(iconsPath, file),
                path.resolve(iconsDest, file)
              );
            });
            console.log('✓ Copied icons');
          }
        } else if (manifestContent.icons && !fs.existsSync(iconsPath)) {
          // 如果 icons 資料夾不存在，移除 icons 配置
          delete manifestContent.icons;
          console.log('⚠ Icons folder not found, removed icons from manifest');
        }
        
        // 寫入處理後的 manifest.json
        fs.writeFileSync(
          path.resolve(distPath, 'manifest.json'),
          JSON.stringify(manifestContent, null, 2)
        );
        console.log('✓ Copied manifest.json');
      }
      
      // 複製並處理 popup.html（添加 CSS link）
      const popupSource = path.resolve(publicPath, 'popup.html');
      if (fs.existsSync(popupSource)) {
        let popupContent = fs.readFileSync(popupSource, 'utf-8');
        
        // 查找 CSS 文件
        const assetsPath = path.resolve(distPath, 'assets');
        if (fs.existsSync(assetsPath)) {
          const cssFiles = fs.readdirSync(assetsPath).filter(file => file.endsWith('.css'));
          if (cssFiles.length > 0) {
            const cssFile = cssFiles[0]; // 使用第一個找到的 CSS 文件
            // 在 </head> 前插入 CSS link
            const cssLink = `  <link rel="stylesheet" href="./assets/${cssFile}">\n`;
            popupContent = popupContent.replace('</head>', cssLink + '</head>');
            console.log(`✓ Added CSS link: ${cssFile}`);
          }
        }
        
        fs.writeFileSync(path.resolve(distPath, 'popup.html'), popupContent);
        console.log('✓ Copied and processed popup.html');
      }
      
      // 複製 background.js
      const backgroundSource = path.resolve(publicPath, 'background.js');
      if (fs.existsSync(backgroundSource)) {
        fs.copyFileSync(backgroundSource, path.resolve(distPath, 'background.js'));
        console.log('✓ Copied background.js');
      }
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isExtension = env.VITE_BUILD_MODE === 'extension';
    
    // 如果是 Chrome 擴充應用程式模式，base 設為相對路徑
    const base = isExtension ? './' : (mode === 'production' 
      ? (env.VITE_BASE_PATH || '/Test-Report-Generator/')
      : '/');
    
    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        ...(mode === 'production' && !isExtension ? [noJekyllPlugin()] : []),
        ...(isExtension ? [chromeExtensionPlugin()] : [])
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        '__IS_CHROME_EXTENSION__': JSON.stringify(isExtension),
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
        cssCodeSplit: false, // 確保 CSS 被正確打包
        rollupOptions: isExtension ? {
          input: path.resolve(__dirname, 'src/popup.tsx'),
          output: {
            entryFileNames: 'assets/[name].js',
            chunkFileNames: 'assets/[name].js',
            assetFileNames: (assetInfo) => {
              // CSS 文件也放在 assets 資料夾
              if (assetInfo.name?.endsWith('.css')) {
                return 'assets/[name][extname]';
              }
              return 'assets/[name].[ext]';
            },
          },
        } : undefined,
      }
    };
});
