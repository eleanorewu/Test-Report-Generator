// Chrome 擴充應用程式工具函數

export const isChromeExtension = (): boolean => {
  return typeof chrome !== 'undefined' && 
         chrome.runtime && 
         chrome.runtime.id !== undefined &&
         chrome.downloads !== undefined;
};

export const downloadImage = async (dataUrl: string, filename: string): Promise<void> => {
  if (isChromeExtension()) {
    // 使用 Chrome API 下載
    try {
      // 將 base64 轉換為 Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // 創建對象 URL
      const url = URL.createObjectURL(blob);
      
      // 使用 Chrome downloads API
      return new Promise((resolve, reject) => {
        chrome.downloads.download({
          url: url,
          filename: filename,
          saveAs: true,
        }, (downloadId) => {
          // 清理對象 URL
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Chrome download failed:', error);
      throw error;
    }
  } else {
    // 回退到傳統的下載方式
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

declare global {
  interface Window {
    chrome?: typeof chrome;
  }
}