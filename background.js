// 后台服务脚本
chrome.runtime.onInstalled.addListener(() => {
  console.log('X.com 中文翻译插件已安装');
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'translationRequest') {
    // 这里可以添加额外的翻译逻辑或统计
    sendResponse({ received: true });
  }
});