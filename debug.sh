#!/bin/bash

# X.com 中文翻译插件调试脚本

echo "=========================================="
echo "X.com 中文翻译插件 - 调试模式"
echo "=========================================="
echo ""

# 检查文件
echo "1. 检查文件完整性..."
files=("manifest.json" "content.js" "popup.html" "popup.js" "styles.css")
missing=0

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "   ✅ $file"
  else
    echo "   ❌ $file 缺失"
    missing=$((missing + 1))
  fi
done

# 检查图标
echo ""
echo "2. 检查图标文件..."
for size in 16 48 128; do
  if [ -f "icons/icon${size}.svg" ]; then
    echo "   ✅ icons/icon${size}.svg"
  else
    echo "   ❌ icons/icon${size}.svg 缺失"
    missing=$((missing + 1))
  fi
done

if [ $missing -gt 0 ]; then
  echo ""
  echo "❌ 有 $missing 个文件缺失，请检查"
  exit 1
fi

# 检查语法
echo ""
echo "3. 检查JavaScript语法..."
for file in content.js background.js popup.js; do
  if node -c "$file" 2>/dev/null; then
    echo "   ✅ $file 语法正确"
  else
    echo "   ❌ $file 语法错误"
    node -c "$file"
  fi
done

# 检查JSON
echo ""
echo "4. 检查JSON格式..."
if node -e "JSON.parse(require('fs').readFileSync('manifest.json', 'utf8'))" 2>/dev/null; then
  echo "   ✅ manifest.json 格式正确"
else
  echo "   ❌ manifest.json 格式错误"
  node -e "JSON.parse(require('fs').readFileSync('manifest.json', 'utf8'))"
fi

# 安装指南
echo ""
echo "=========================================="
echo "安装步骤："
echo "=========================================="
echo ""
echo "1. 打开Chrome浏览器"
echo "2. 访问 chrome://extensions/"
echo "3. 开启右上角的'开发者模式'"
echo "4. 点击'加载已解压的扩展程序'"
echo "5. 选择当前目录: $(pwd)"
echo ""
echo "=========================================="
echo "调试步骤："
echo "=========================================="
echo ""
echo "1. 打开 X.com 页面"
echo "2. 按 F12 打开开发者工具"
echo "3. 查看 Console 标签页"
echo "4. 查找 [X-Translator] 日志"
echo "5. 点击插件图标，点击'检查状态'"
echo ""
echo "=========================================="
echo "测试页面："
echo "=========================================="
echo ""
echo "- 打开 test-page.html 进行功能测试"
echo "- 打开 demo.html 查看演示效果"
echo ""
echo "=========================================="
echo "常见问题："
echo "=========================================="
echo ""
echo "如果插件不工作："
echo "1. 确认在 x.com 或 twitter.com 页面"
echo "2. 刷新页面"
echo "3. 检查控制台错误"
echo "4. 重新加载插件"
echo ""
echo "详细调试信息请查看 DEBUG.md"
echo ""
echo "=========================================="

# 运行测试
echo ""
echo "运行功能测试..."
node test-plugin.js

echo ""
echo "调试准备完成！"
echo ""
echo "下一步："
echo "1. 按照上述步骤安装插件"
echo "2. 打开 X.com 页面"
echo "3. 按 F12 查看控制台日志"
echo "4. 如有问题，查看 DEBUG.md"
echo ""