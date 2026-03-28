#!/usr/bin/env node

// 简单的翻译API测试
const https = require('https');

function testTranslation() {
  const text = 'hello';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
  
  console.log('测试翻译API...');
  console.log('URL:', url);
  
  https.get(url, (resp) => {
    let data = '';
    
    resp.on('data', (chunk) => {
      data += chunk;
    });
    
    resp.on('end', () => {
      console.log('API响应:', data);
      try {
        const result = JSON.parse(data);
        console.log('解析结果:', result);
        if (result && result[0] && result[0][0]) {
          console.log('翻译结果:', result[0][0][0]);
          console.log('✅ 翻译API工作正常');
        } else {
          console.log('❌ 无法解析翻译结果');
        }
      } catch (e) {
        console.error('❌ 解析错误:', e.message);
      }
    });
  }).on('error', (err) => {
    console.error('❌ 网络错误:', err.message);
  });
}

// 测试中文检测
function testChineseDetection() {
  console.log('\n测试中文检测...');
  
  const testCases = [
    { text: 'hello', expected: false },
    { text: '你好', expected: true },
    { text: 'This is English', expected: false },
    { text: '这是中文', expected: true },
    { text: 'Mixed 你好', expected: false }
  ];
  
  testCases.forEach(({ text, expected }) => {
    const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g;
    const chineseChars = text.match(chineseRegex);
    const cleanedText = text.replace(/[\s\p{P}]/gu, '');
    const chineseRatio = chineseChars ? chineseChars.length / cleanedText.length : 0;
    const isChinese = chineseRatio > 0.5;
    
    const status = isChinese === expected ? '✅' : '❌';
    console.log(`${status} "${text}" -> ${isChinese} (预期: ${expected})`);
  });
}

// 运行测试
console.log('=== X.com 中文翻译插件测试 ===\n');
testChineseDetection();
testTranslation();