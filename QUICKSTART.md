# 快速安装和调试指南

## 1. 安装插件

```bash
# 运行调试脚本
./debug.sh
```

按照提示：
1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择当前目录

## 2. 调试插件

### 打开 X.com
1. 在浏览器中访问 https://x.com
2. 登录您的账户

### 查看控制台日志
1. 按 F12 打开开发者工具
2. 点击 "Console" 标签
3. 查找 `[X-Translator]` 开头的日志

### 检查插件状态
1. 点击浏览器工具栏中的插件图标
2. 点击 "检查状态" 按钮
3. 查看状态信息

## 3. 测试功能

### 测试翻译API
在控制台运行：
```javascript
fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=hello')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

### 测试插件功能
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

## 4. 常见问题

### 插件未加载
- 刷新页面
- 重新加载插件（在扩展页面点击刷新按钮）
- 检查控制台是否有错误

### 找不到推文
- 查看控制台日志，确认选择器是否正确
- 尝试使用测试页面 `test-page.html`

### 翻译API失败
- 检查网络连接
- 可能有请求限制
- 查看网络请求状态

## 5. 测试页面

### 功能测试
打开 `test-page.html` 进行：
- 翻译API测试
- 插件状态检查
- 推文元素查找

### 演示页面
打开 `demo.html` 查看插件效果演示

## 6. 获取帮助

如果还有问题，请提供：
1. Chrome 版本
2. 控制台错误信息
3. 插件状态检查结果
4. 网络请求状态

详细调试指南请查看 `DEBUG.md`