#!/bin/bash

# X.com 中文翻译插件启动脚本

echo "正在启动X.com中文翻译插件测试..."

# 检查是否安装了Node.js
if ! command -v node &> /dev/null; then
    echo "错误：未找到Node.js，请先安装Node.js"
    exit 1
fi

# 运行测试
echo "运行功能测试..."
node test-plugin.js

echo ""
echo "测试完成！"
echo ""
echo "下一步："
echo "1. 按照安装指南安装插件"
echo "2. 访问 https://x.com 查看效果"
echo "3. 打开 demo.html 查看演示"
echo ""
echo "安装指南："
echo "1. 打开Chrome浏览器"
echo "2. 访问 chrome://extensions/"
echo "3. 开启'开发者模式'"
echo "4. 点击'加载已解压的扩展程序'"
echo "5. 选择当前目录"
echo ""
echo "祝您使用愉快！"