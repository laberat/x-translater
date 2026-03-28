#!/bin/bash

# X.com 中文翻译插件安装脚本

echo "=========================================="
echo "X.com 中文翻译插件安装指南"
echo "=========================================="
echo ""
echo "安装步骤："
echo "1. 打开 Chrome 浏览器"
echo "2. 在地址栏输入: chrome://extensions/"
echo "3. 开启右上角的'开发者模式'"
echo "4. 点击'加载已解压的扩展程序'"
echo "5. 选择当前目录: $(pwd)"
echo ""
echo "插件文件："
ls -la *.json *.js *.css *.html 2>/dev/null
echo ""
echo "图标文件："
ls -la icons/ 2>/dev/null
echo ""
echo "安装完成后，请访问 X.com (https://x.com) 查看效果。"
echo ""
echo "注意事项："
echo "- 插件仅在 x.com 域名下工作"
echo "- 使用谷歌翻译免费接口，可能有请求限制"
echo "- 如需修改设置，点击浏览器工具栏中的插件图标"
echo ""
echo "=========================================="