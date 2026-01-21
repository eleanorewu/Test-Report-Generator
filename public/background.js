// Chrome 擴充應用程式背景腳本
chrome.action.onClicked.addListener((tab) => {
  // 在新視窗中打開應用程式
  chrome.windows.create({
    url: chrome.runtime.getURL('popup.html'),
    type: 'popup',
    width: 1400,
    height: 900,
    focused: true
  });
});