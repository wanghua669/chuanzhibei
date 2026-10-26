# CyberFortune 一键启动脚本 (PowerShell)
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  CYBER FORTUNE 赛博账单算命师" -ForegroundColor White
Write-Host "  全国高校AI创新应用挑战赛 · Vibe Coding全栈实验级作品" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "node_modules")) {
    Write-Host "[提示] 正在安装依赖..." -ForegroundColor DarkCyan
    pnpm install
}

Write-Host "[启动中] 本地服务启动中，浏览器打开: http://localhost:3000" -ForegroundColor Green
pnpm dev
