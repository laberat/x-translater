// X.com 中文翻译插件 - 调试版本
(function() {
  'use strict';
  
  console.log('[X-Translator] 插件开始加载...');
  
  // 翻译缓存
  const translationCache = new Map();
  
  // 设置
  let settings = {
    enableTranslation: true,
    showOriginal: true
  };
  
  // 调试模式
  const DEBUG = true;
  
  function log(...args) {
    if (DEBUG) {
      console.log('[X-Translator]', ...args);
    }
  }
  
  // 加载设置
  function loadSettings() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get({
          enableTranslation: true,
          showOriginal: true
        }, (items) => {
          settings = items;
          log('设置已加载:', settings);
          resolve(settings);
        });
      } else {
        log('Chrome storage 不可用，使用默认设置');
        resolve(settings);
      }
    });
  }
  
  // 检测是否为中文
  function isChinese(text) {
    const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g;
    const chineseChars = text.match(chineseRegex);
    if (!chineseChars) return false;
    
    const cleanedText = text.replace(/[\s\p{P}]/gu, '');
    const chineseRatio = chineseChars.length / cleanedText.length;
    return chineseRatio > 0.3; // 降低阈值到30%
  }
  
  // 使用谷歌翻译API
  async function translateText(text) {
    if (translationCache.has(text)) {
      log('使用缓存:', text.substring(0, 30) + '...');
      return translationCache.get(text);
    }
    
    try {
      log('翻译请求:', text.substring(0, 50) + '...');
      
      // 使用多个翻译API作为备选
      const apis = [
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`,
        `https://translate.googleapis.com/translate_a/single?client=at&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`
      ];
      
      let translatedText = '';
      
      for (const url of apis) {
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          if (!response.ok) continue;
          
          const data = await response.json();
          log('API 响应:', data);
          
          if (data && data[0]) {
            data[0].forEach(item => {
              if (item && item[0]) {
                translatedText += item[0];
              }
            });
          }
          
          if (translatedText) break;
        } catch (e) {
          log('API 调用失败:', e.message);
          continue;
        }
      }
      
      if (translatedText) {
        translationCache.set(text, translatedText);
        log('翻译成功:', translatedText);
        return translatedText;
      }
      
      throw new Error('所有翻译API都失败');
    } catch (error) {
      log('翻译错误:', error);
      throw error;
    }
  }
  
  // 多种选择器尝试查找推文
  function findTweetElements() {
    const selectors = [
      '[data-testid="tweet"]',
      'article[role="article"]',
      '[role="article"]',
      '.tweet',
      '.css-1dbjc4n [data-testid="tweet"]'
    ];
    
    let tweets = [];
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        log(`找到 ${elements.length} 个推文，使用选择器: ${selector}`);
        tweets = Array.from(elements);
        break;
      }
    }
    
    return tweets;
  }
  
  // 查找推文文本元素
  function findTweetTextElement(tweetElement) {
    const selectors = [
      '[data-testid="tweetText"]',
      '[lang]',
      '.css-1qaijid', // 常见的推文文本类
      'div[lang]',
      'span[lang]'
    ];
    
    for (const selector of selectors) {
      const element = tweetElement.querySelector(selector);
      if (element && element.textContent.trim().length > 5) {
        log(`找到推文文本，使用选择器: ${selector}`);
        return element;
      }
    }
    
    return null;
  }
  
  // 为推文添加翻译
  async function addTranslationToTweet(tweetElement) {
    if (!settings.enableTranslation) {
      return;
    }
    
    // 检查是否已经添加过翻译
    if (tweetElement.querySelector('.x-translator-translation')) {
      return;
    }
    
    // 查找推文文本
    const textElement = findTweetTextElement(tweetElement);
    if (!textElement) {
      log('未找到推文文本元素');
      return;
    }
    
    const text = textElement.textContent.trim();
    if (!text || text.length < 5) {
      log('推文文本太短或为空');
      return;
    }
    
    log('检测到推文:', text.substring(0, 50) + '...');
    
    // 检查是否为中文
    if (isChinese(text)) {
      log('跳过中文推文');
      return;
    }
    
    // 创建翻译容器
    const translationDiv = document.createElement('div');
    translationDiv.className = 'x-translator-translation translating';
    translationDiv.textContent = '翻译中...';
    translationDiv.style.cssText = `
      margin-top: 8px;
      padding: 8px 12px;
      background-color: rgba(29, 161, 242, 0.1);
      border-left: 3px solid #1da1f2;
      border-radius: 4px;
      font-size: 14px;
      line-height: 1.4;
      color: #536471;
    `;
    
    // 插入到推文文本后面
    textElement.parentNode.insertBefore(translationDiv, textElement.nextSibling);
    
    try {
      const translatedText = await translateText(text);
      translationDiv.className = 'x-translator-translation translated';
      translationDiv.textContent = translatedText;
      translationDiv.style.color = '#0f1419';
    } catch (error) {
      translationDiv.className = 'x-translator-translation error';
      translationDiv.textContent = '翻译失败: ' + error.message;
      translationDiv.style.color = '#e0245e';
    }
  }
  
  // 处理所有推文
  function processTweets() {
    log('开始处理推文...');
    const tweets = findTweetElements();
    log(`找到 ${tweets.length} 个推文元素`);
    
    tweets.forEach((tweet, index) => {
      log(`处理推文 ${index + 1}/${tweets.length}`);
      addTranslationToTweet(tweet);
    });
  }
  
  // 设置观察器
  function setupObserver() {
    log('设置 DOM 观察器...');
    
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 检查是否是推文元素
              if (node.matches && (
                node.matches('[data-testid="tweet"]') ||
                node.matches('article[role="article"]') ||
                node.matches('[role="article"]')
              )) {
                shouldProcess = true;
              }
              // 检查是否包含推文元素
              else if (node.querySelector && (
                node.querySelector('[data-testid="tweet"]') ||
                node.querySelector('article[role="article"]') ||
                node.querySelector('[role="article"]')
              )) {
                shouldProcess = true;
              }
            }
          });
        }
      });
      
      if (shouldProcess) {
        log('检测到新推文，准备处理...');
        setTimeout(processTweets, 500);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    log('DOM 观察器已启动');
  }
  
  // 初始化
  async function init() {
    log('初始化插件...');
    
    await loadSettings();
    
    // 等待页面完全加载
    await new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });
    
    // 额外等待一段时间确保 X.com 的 SPA 加载完成
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    log('页面已加载，开始处理推文');
    processTweets();
    setupObserver();
    
    // 定期检查
    setInterval(processTweets, 5000);
    
    log('插件初始化完成');
  }
  
  // 启动
  init().catch(error => {
    console.error('[X-Translator] 初始化失败:', error);
  });
  
  // 监听消息
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      log('收到消息:', request);
      
      if (request.action === 'refreshTranslations') {
        translationCache.clear();
        processTweets();
        sendResponse({ success: true });
      } else if (request.action === 'updateSettings') {
        settings = request.settings;
        sendResponse({ success: true });
      } else if (request.action === 'getStatus') {
        sendResponse({
          enabled: settings.enableTranslation,
          cacheSize: translationCache.size,
          tweetsFound: findTweetElements().length
        });
      }
    });
  }
  
  // 暴露全局调试函数
  window.xTranslator = {
    processTweets,
    translateText,
    getStatus: () => ({
      enabled: settings.enableTranslation,
      cacheSize: translationCache.size,
      tweetsFound: findTweetElements().length
    })
  };
  
  log('全局调试函数已暴露: window.xTranslator');
})();