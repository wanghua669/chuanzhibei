# 🔮 CyberFortune 赛博账单算命师

> **全国高校AI创新应用开发赛 · 软件开发全国高校Vibe Coding开发挑战赛 参赛作品**  
> **核心命题**：重塑范式：基于 Vibe Coding 的全栈应用速成挑战赛  
> **参赛方向**：方向六/九【数据探索与“赛博画像”可视化看板】  
> **核心驱动**：DeepSeek-V3 / Flash 大模型 + 现代化全栈数据拓扑可视化  

---

## 🌟 项目亮点与赛项目标对齐

本项目完全契合大赛对 **“高频API组合、重前端交互与视觉、避免硬件死磕、强调10分钟极速复现”** 的全部要求：

1. **AI协同与意图对齐能力（Intent-Driven AI Alignment）**
   - 接入真实的 **DeepSeek-V3 / Flash** 大模型（预置专用 API Key 与结构化 Schema 约束），大模型化身融合赛博朋克与毒舌财务学士的“命盘大师”，输出高能命盘称号、灵魂拷问判词与下月破财消灾预警。
   - 内置高质量的 Prompt 模板与 Few-Shot 上下文工程，杜绝幻觉与无用回答。

2. **工程架构与黑盒掌控力（Robust Clean Architecture）**
   - 采用严密的模块化分层：
     - `src/services/parser.ts`：微信/支付宝 CSV 解析引擎与文本智能提取；
     - `src/services/analyzer.ts`：恩格尔系数、深夜消费率、五维赛博性格雷达统计引擎；
     - `src/services/llmService.ts`：DeepSeek API 客户端与**双轨容灾降级引擎**；
     - `src/components/charts/`：ECharts 响应式霓虹深色大屏（雷达图、时钟热力图、分类环图、波动折线）；
     - `src/components/modals/PosterModal.tsx`：HTML5 Canvas 纯原生高清长图海报导出。
   - 全链路 TypeScript 强类型约束，拒绝一次性难以维护的代码。

3. **过程鲁棒性与可复现性（Zero-Crash & Zero-Dependency）**
   - **双轨容灾机制**：正常网络下实时调用 DeepSeek 大模型推理；若遇到网络断连、API 超时或无网环境，自动无缝降级为**高保真赛博规则引擎**，演示 **100% 零报错、零白屏**！
   - **原创矢量图符体系**：全站使用原创高科技 SVG 矢量徽标与 Lucide 图标，**彻底摒弃幼稚 Emoji 与外部图床**，离线打包零损坏。
   - **HBuilder / 移动端极速打包**：Vite 产物配置 `base: './'` 相对路径，一键打包为 Android APK、iOS 或独立桌面应用。

4. **敏捷交付与产品闭环（Complete Product Lifecycle）**
   - 内置三套典型现实场景（**当代大学生特种兵**、**苦逼赛博攻城狮**、**精致月光族**），评委一键点击即可秒速体验全流程。
   - 交互亮点：支持真实的“**赛博木鱼（叩响积功德）**”，具备 Web Audio 原生蜂鸣音效与粒子动画，沉浸感拉满。
   - 一键生成长图海报，支持下载保存至本地与移动端分享。

---

## 🛠️ 技术栈

| 模块 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **基础工程** | Vite 8 + React 19 + TypeScript | 毫秒级热更新，极速编译 |
| **视觉与样式** | Tailwind CSS 3 + Cyberpunk Theme | 暗黑黑客风、霓虹发光动效 |
| **数据可视化** | ECharts 6 (`echarts-for-react`) | 五维雷达图、24h时钟、资金流向 |
| **AI 智能中枢** | DeepSeek-V3 / Flash API (`deepseek-chat`) | 赛博命理推演、结构化 JSON 输出 |
| **音效与动效** | Web Audio API + `canvas-confetti` | 纯原生合成音效与粒子系统 |
| **海报生成** | HTML5 2D Canvas | 750×1334 高清签文长图原生渲染 |

---

## 🚀 极速启动与运行指南

### 方式一：双击一键启动（推荐）
在 Windows 资源管理器中直接双击根目录下的 **`run.bat`** 即可自动检测依赖并拉起浏览器！

### 方式二：命令行启动
```bash
# 1. 安装依赖
pnpm install   # 或 npm install

# 2. 启动本地开发服务
pnpm dev

# 浏览器访问：http://localhost:3000
```

### 方式三：编译生产版本（用于 HBuilder 打包）
```bash
pnpm build
```
编译产物位于 `dist/` 目录中，直接将 `dist` 目录导入 **HBuilder X**，选择「发行」$\to$「原生 App 离线/在线打包」或「桌面端应用」即可！

---

## 📁 目录结构

```text
chuanzhibei/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── CyberIcons.tsx        # 原创赛博矢量图标库 (罗盘/金符/木鱼/芯片/战甲)
│   │   ├── charts/
│   │   │   ├── RadarChart.tsx        # 五维性格矩阵雷达图
│   │   │   ├── CategoryPieChart.tsx  # 资金流向环图
│   │   │   ├── HourlyHeatmapChart.tsx# 24小时消费时钟 (深夜警戒标记)
│   │   │   └── TrendLineChart.tsx    # 每日收支脉冲折线图
│   │   ├── modals/
│   │   │   ├── ImportModal.tsx       # 账单导入与场景切换弹窗
│   │   │   ├── SettingsModal.tsx     # DeepSeek API 密钥与模式配置
│   │   │   ├── PosterModal.tsx       # Canvas 赛博签文长图导出海报
│   │   │   └── VibeDocsModal.tsx     # Vibe Coding 全栈架构评审说明
│   │   ├── FortuneConsole.tsx        # 核心算命控制台 & 赛博木鱼积功德
│   │   ├── Header.tsx                # 顶部赛博科技栏与场景切换
│   │   ├── StatCards.tsx             # 核心指标看板卡片
│   │   └── TransactionList.tsx       # 流水明细溯源表
│   ├── services/
│   │   ├── analyzer.ts               # 数据清洗与五维雷达数学分析引擎
│   │   ├── parser.ts                 # CSV / 文本解析器
│   │   ├── presetData.ts             # 当代大学生/攻城狮/月光族预置数据
│   │   └── llmService.ts             # DeepSeek API 客户端与双轨规则引擎
│   ├── types/
│   │   └── index.ts                  # 全局 TypeScript 强类型定义
│   ├── App.tsx                       # 主界面装配与全局响应式状态
│   ├── index.css                     # 赛博朋克深色样式与霓虹滤镜
│   └── main.tsx                      # 应用挂载入口
├── index.html                        # 页面入口模板
├── vite.config.ts                    # Vite 编译配置 (base: './')
├── tailwind.config.js                # Tailwind 霓虹配色配置
├── run.bat                           # Windows 一键启动脚本
├── start.ps1                         # PowerShell 一键启动脚本
├── VIBE_CODING_PLAYBOOK.md           # 竞赛 Vibe Coding 研发手册
└── README.md                         # 项目主说明文档
```

---

## 🏆 竞赛版权与说明
- **作品名称**：CyberFortune 赛博账单算命师
- **大赛名称**：全国高校AI创新应用开发赛
- **开发范式**：Vibe Coding（意图驱动与AI全流程协同）
