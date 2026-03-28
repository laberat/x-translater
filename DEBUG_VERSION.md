# X.com 中文翻译插件 - 调试版本完成

## 调试版本改进

### 1. 详细调试日志
- 所有操作都会输出到浏览器控制台
- 查找 `[X-Translator]` 开头的日志
- 显示插件加载、推文检测、翻译请求等详细信息

### 2. 状态检查功能
- 点击插件图标查看状态
- 显示找到的推文数量
- 显示翻译缓存大小
- 显示页面状态

### 3. 多种选择器支持
- 尝试多种方式查找推文元素
- 适应不同的DOM结构
- 支持 X.com 和 twitter.com

### 4. 测试页面
- `test-page.html` - 功能测试
- `demo.html` - 效果演示
- 支持手动测试翻译API

### 5. 调试工具
- `debug.sh` - 检查文件和安装
- `DEBUG.md` - 详细调试指南
- `QUICKSTART.md` - 快速开始指南

## 使用步骤

### 1. 安装插件
```bash
./debug.sh
```

按照提示：
1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择当前目录

### 2. 调试插件
1. 打开 X.com 页面
2. 按 F12 打开开发者工具
3. 查看 Console 标签页
4. 查找 `[X-Translator]` 日志
5. 点击插件图标，点击"检查状态"

### 3. 测试功能
1. 打开 `test-page.html` 进行功能测试
2. 打开 `demo.html` 查看演示效果
3. 在控制台运行测试命令

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

## 调试信息

### 全局调试函数
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

### 测试翻译API
```javascript
fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=hello')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

## 文件结构

### 核心文件
- `manifest.json` - 插件配置
- `content.js` - 核心翻译逻辑
- `popup.html` - 用户界面
- `popup.js` - 界面逻辑
- `styles.css` - 翻译样式

### 调试文件
- `debug.sh` - 调试脚本
- `DEBUG.md` - 调试指南
- `test-page.html` - 功能测试
- `demo.html` - 效果演示

### 文档
- `README.md` - 项目说明
- `QUICKSTART.md` - 快速开始
- `USAGE.md` - 使用说明
- `SUMMARY.md` - 开发总结
- `INSTALL.md` - 安装指南

## 如果还有问题

请提供以下信息：
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
- 添加调试脚本和指南