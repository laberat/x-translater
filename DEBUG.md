# X.com 中文翻译插件 - 调试版本

## 问题诊断

如果插件不工作，请按以下步骤检查：

### 1. 检查插件是否正确安装
1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 确认插件已启用（开关打开）
4. 检查是否有错误提示

### 2. 检查页面
1. 确认在 `x.com` 或 `twitter.com` 页面
2. 刷新页面
3. 等待页面完全加载

### 3. 查看控制台日志
1. 按 F12 打开开发者工具
2. 点击 "Console" 标签
3. 查找 `[X-Translator]` 开头的日志
4. 查看是否有红色错误信息

### 4. 使用插件状态检查
1. 点击浏览器工具栏中的插件图标
2. 点击 "检查状态" 按钮
3. 查看状态信息

### 5. 常见问题

#### 插件未加载
- 刷新页面
- 重新加载插件（在扩展页面点击刷新按钮）
- 检查控制台是否有错误

#### 找不到推文
- X.com 可能更新了 DOM 结构
- 查看控制台日志，确认选择器是否正确
- 尝试使用测试页面 `test-page.html`

#### 翻译API失败
- 检查网络连接
- 可能有请求限制
- 查看控制台网络请求

### 6. 手动测试

#### 测试翻译API
在浏览器控制台运行：
```javascript
fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=hello')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

#### 测试插件功能
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

### 7. 重新安装插件

1. 打开 `chrome://extensions/`
2. 找到插件，点击 "删除"
3. 点击 "加载已解压的扩展程序"
4. 选择插件目录

### 8. 测试页面

打开 `test-page.html` 进行功能测试：
- 测试翻译API
- 检查插件状态
- 查找推文元素

## 调试信息

插件会输出详细日志到浏览器控制台：
- `[X-Translator] 插件开始加载...`
- `[X-Translator] 设置已加载:`
- `[X-Translator] 找到 X 个推文`
- `[X-Translator] 翻译请求:`
- `[X-Translator] 翻译成功:`

## 如果仍然不工作

请提供以下信息：
1. Chrome 版本
2. 控制台错误信息
3. 插件状态检查结果
4. 网络请求状态