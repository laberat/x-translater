document.addEventListener('DOMContentLoaded', function() {
  const enableTranslation = document.getElementById('enableTranslation');
  const refreshBtn = document.getElementById('refreshBtn');
  const checkStatusBtn = document.getElementById('checkStatusBtn');
  const pageStatus = document.getElementById('pageStatus');
  const tweetsFound = document.getElementById('tweetsFound');
  const cacheSize = document.getElementById('cacheSize');
  
  // 检查当前页面
  function checkCurrentPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (!tabs[0]) {
        updateStatus('无法获取标签页', 'error');
        return;
      }
      
      const url = tabs[0].url;
      if (url.includes('x.com') || url.includes('twitter.com')) {
        updateStatus('X.com 页面 ✓', 'ok');
      } else {
        updateStatus('非 X.com 页面', 'error');
        refreshBtn.disabled = true;
        refreshBtn.textContent = '请在X.com页面使用';
      }
    });
  }
  
  // 更新状态显示
  function updateStatus(text, type) {
    pageStatus.textContent = text;
    pageStatus.className = 'status-value ' + (type === 'ok' ? 'status-ok' : 'status-error');
  }
  
  // 加载保存的设置
  chrome.storage.sync.get({
    enableTranslation: true
  }, function(items) {
    enableTranslation.checked = items.enableTranslation;
  });
  
  // 保存设置
  function saveSettings() {
    const settings = {
      enableTranslation: enableTranslation.checked
    };
    
    chrome.storage.sync.set(settings);
    
    // 通知内容脚本
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0] && (tabs[0].url.includes('x.com') || tabs[0].url.includes('twitter.com'))) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'updateSettings',
          settings: settings
        }, function(response) {
          if (chrome.runtime.lastError) {
            console.log('发送消息失败:', chrome.runtime.lastError.message);
          }
        });
      }
    });
  }
  
  // 监听设置变化
  enableTranslation.addEventListener('change', saveSettings);
  
  // 刷新翻译按钮
  refreshBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0] && (tabs[0].url.includes('x.com') || tabs[0].url.includes('twitter.com'))) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'refreshTranslations' }, function(response) {
          if (chrome.runtime.lastError) {
            alert('发送消息失败: ' + chrome.runtime.lastError.message);
          } else if (response && response.success) {
            alert('翻译已刷新');
          }
        });
      }
    });
  });
  
  // 检查状态按钮
  checkStatusBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (!tabs[0]) {
        updateStatus('无法获取标签页', 'error');
        return;
      }
      
      const url = tabs[0].url;
      if (!url.includes('x.com') && !url.includes('twitter.com')) {
        updateStatus('非 X.com 页面', 'error');
        tweetsFound.textContent = '-';
        cacheSize.textContent = '-';
        return;
      }
      
      // 发送消息获取状态
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getStatus' }, function(response) {
        if (chrome.runtime.lastError) {
          console.log('获取状态失败:', chrome.runtime.lastError.message);
          updateStatus('插件未加载', 'error');
          tweetsFound.textContent = '-';
          cacheSize.textContent = '-';
          return;
        }
        
        if (response) {
          updateStatus('插件运行中 ✓', 'ok');
          tweetsFound.textContent = response.tweetsFound || 0;
          cacheSize.textContent = response.cacheSize || 0;
        } else {
          updateStatus('无响应', 'error');
        }
      });
    });
  });
  
  // 初始化
  checkCurrentPage();
  
  // 自动检查状态
  setTimeout(function() {
    checkStatusBtn.click();
  }, 500);
});