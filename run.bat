@echo off
chcp 65001 >nul
title CyberFortune 赛博账单算命师 - 一键启动器
echo ========================================================
echo   CYBER FORTUNE 赛博账单算命师
echo   全国高校AI创新应用挑战赛 · Vibe Coding全栈实验级作品
echo ========================================================
echo.
echo [1/2] 正在检查依赖环境...
if not exist node_modules (
    echo [提示] 首次运行，正在自动安装依赖包...
    call pnpm install
)

echo [2/2] 正在启动本地开发预览服务器...
echo [访问地址] 请在浏览器中打开: http://localhost:3000
echo.
call pnpm dev
pause
