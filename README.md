# X.com 中文翻译插件

[![GitHub](https://img.shields.io/badge/GitHub-x--translater-blue)](https://github.com/laberat/x-translater)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

X.com (Twitter) 中文翻译 Chrome 浏览器插件 - 自动将推文翻译为中文

## 功能特点

- ✅ 自动翻译非中文推文
- ✅ 智能识别中文推文，避免重复翻译
- ✅ 使用谷歌翻译免费服务
- ✅ 支持动态加载的推文
- ✅ 详细的调试日志和状态检查
- ✅ 多种选择器支持，适应不同DOM结构

## 快速开始

### 安装插件
1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择当前目录

### 调试插件
1. 打开 X.com 页面
2. 按 F12 打开开发者工具
3. 查看 Console 标签页中的 `[X-Translator]` 日志
4. 点击插件图标，点击"检查状态"

## 文件说明

### 核心文件
- `manifest.json` - 插件配置
- `content.js` - 核心翻译逻辑（带调试日志）
- `popup.html` - 用户界面（带状态检查）
- `popup.js` - 界面逻辑
- `styles.css` - 翻译样式

### 调试文件
- `test-page.html` - 功能测试页面
- `debug.sh` - 调试脚本
- `DEBUG.md` - 详细调试指南

### 文档
- `README.md` - 本文件
- `INSTALL.md` - 安装指南
- `USAGE.md` - 使用说明
- `SUMMARY.md` - 开发总结

## 调试步骤

### 1. 检查插件状态
1. 点击浏览器工具栏中的插件图标
2. 点击"检查状态"按钮
3. 查看状态信息

### 2. 查看控制台日志
1. 按 F12 打开开发者工具
2. 点击 Console 标签
3. 查找 `[X-Translator]` 开头的日志
4. 查看是否有错误信息

### 3. 测试翻译API
在控制台运行：
```javascript
fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=hello')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

### 4. 测试插件功能
在 X.com 页面的控制台运行：
```javascript
// 检查插件是否加载
console.log('xTranslator:', window.xTranslator);

// 获取状态
if (window.xTranslator) {
  console.log('状态:', window.xTranslator.getStatus());
  window.xTranslator.processTweets();
}
```

## 常见问题

### 插件未加载
- 刷新页面
- 重新加载插件
- 检查控制台错误

### 找不到推文
- 查看控制台日志
- 确认选择器是否正确
- 使用测试页面验证

### 翻译API失败
- 检查网络连接
- 可能有请求限制
- 查看网络请求状态

## 测试页面

### 功能测试
打开 `test-page.html` 进行：
- 翻译API测试
- 插件状态检查
- 推文元素查找

### 演示页面
打开 `demo.html` 查看插件效果演示

## 技术细节

### 调试日志
插件会输出详细日志：
- `[X-Translator] 插件开始加载...`
- `[X-Translator] 设置已加载:`
- `[X-Translator] 找到 X 个推文`
- `[X-Translator] 翻译请求:`
- `[X-Translator] 翻译成功:`

### 全局调试函数
在控制台使用：
```javascript
// 获取插件状态
window.xTranslator.getStatus()

// 手动触发推文处理
window.xTranslator.processTweets()

// 测试翻译
window.xTranslator.translateText('hello')
```

### 选择器
插件尝试多种选择器：
- `[data-testid="tweet"]`
- `article[role="article"]`
- `[role="article"]`

## 如果仍然不工作

请提供：
1. Chrome 版本
2. 控制台错误信息
3. 插件状态检查结果
4. 网络请求状态

## 更新日志

### v1.1 (调试版本)
- 添加详细调试日志
- 添加状态检查功能
- 添加多种选择器支持
- 添加测试页面