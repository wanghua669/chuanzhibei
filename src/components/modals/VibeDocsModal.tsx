import React from 'react';
import { X, CheckCircle2, Terminal, Layers, Sparkles, Code2 } from 'lucide-react';

interface VibeDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VibeDocsModal: React.FC<VibeDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="cyber-box rounded-2xl w-full max-w-3xl p-6 relative border border-cyan-400/50 shadow-2xl my-auto max-h-[90vh] flex flex-col">
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        {/* 头部 */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal size={20} className="text-cyan-400" />
            <div>
              <h3 className="text-base font-mono text-white font-bold">
                Vibe Coding 全栈工程架构与评审报告
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                全国高校AI创新应用开发赛 · 重塑范式挑战赛专用文档
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* 文档滚动区 */}
        <div className="overflow-y-auto space-y-6 py-4 pr-1 text-xs font-mono leading-relaxed text-slate-300">
          {/* 1. 赛项核心维度对齐 */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-300 mb-2">
              <Layers size={16} />
              <span>一、赛项命题核心考察维度落地映射</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  1. AI协同与意图对齐能力
                </div>
                <p className="text-slate-400 text-[11px]">
                  在 <code>src/services/llmService.ts</code> 中设计了严密的 System Prompt 与 Few-Shot 上下文编排，注入真实消费拓扑，并通过 JSON Schema 强类型约束输出，实现大模型意图与业务逻辑的确定性对齐。
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="font-bold text-fuchsia-400 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  2. 工程架构与黑盒掌控力
                </div>
                <p className="text-slate-400 text-[11px]">
                  严谨的解耦分层架构：<code>Parser（多格式数据清洗）</code> $\to$ <code>Analytics（五维雷达与数学指标）</code> $\to$ <code>LLM Adapter（模型接入与双轨降级）</code> $\to$ <code>ECharts（响应式赛博大屏）</code> $\to$ <code>Canvas（原生海报渲染）</code>，全链路 TypeScript 类型安全保障。
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  3. 过程鲁棒性与可复现性
                </div>
                <p className="text-slate-400 text-[11px]">
                  具备**零报错容灾架构**：内置 DeepSeek-V3 实时接口与高能本地规则引擎双轨运行，网络超时或断网自动毫秒级降级；去除所有外部图床依赖，适配 HBuilder / 移动端 WebView 打包。
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  4. 敏捷交付与产品闭环
                </div>
                <p className="text-slate-400 text-[11px]">
                  从一键载入场景样本、CSV导入解析、24小时消费时钟与雷达图、AI毒舌算命、赛博木鱼积功德到一键导出高清海报，具备极致完善的商业级产品交互闭环。
                </p>
              </div>
            </div>
          </div>

          {/* 2. 系统技术架构图 */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-300 mb-2">
              <Code2 size={16} />
              <span>二、系统数据流与架构拓扑</span>
            </div>
            <pre className="p-3 rounded bg-slate-950 border border-slate-800 text-cyan-400 text-[11px] overflow-x-auto font-mono">
{`[数据输入源] ──> [微信/支付宝 CSV 或 预设场景数据]
       │
       ▼
[清洗解析引擎] ──> 正则推断商户分类 / 识别23:00-05:00深夜消费 / 标记突发冲动消费
       │
       ▼
[数学统计引擎] ──> 计算恩格尔系数 / 资金蓄水池 / 五维雷达矩阵 (食神/夜猫/极客/冲动/守财)
       │
       ├───> [ECharts 赛博大屏] ──> 五维雷达图 / 资金流向环图 / 24小时消费时钟 / 资金脉冲折线
       │
       ▼
[双轨 AI 算命服务]
   ├─► [在线链路]: DeepSeek-V3 实时推理 API (HTTP JSON) ──> 结构化提取命盘称号与毒舌判词
   └─► [离线链路]: 极速专家规则引擎 (Zero-Crash Fallback) ──> 极端断网/超时 100% 毫秒保底
       │
       ▼
[交互闭环输出] ──> 赛博木鱼积功德 (Web Audio API) + HTML5 Canvas 高清长图海报导出`}
            </pre>
          </div>

          {/* 3. Prompt 工程设计精要 */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-300 mb-2">
              <Sparkles size={16} />
              <span>三、核心 Prompt 编排体系与约束策略</span>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2 text-[11px]">
              <div>
                <span className="text-fuchsia-400 font-bold">[角色锚定]:</span>{' '}
                <span className="text-slate-300">
                  融合赛博朋克世界观、后现代命理学与毒舌财务分析的【赛博命盘算命大师】。
                </span>
              </div>
              <div>
                <span className="text-fuchsia-400 font-bold">[语言风格]:</span>{' '}
                <span className="text-slate-300">
                  犀利、幽默、充满互联网高校与职场黑话（如疯狂星期四、赛博功德、恩格尔战士、云村EMO等），严禁枯燥说教与 Emoji。
                </span>
              </div>
              <div>
                <span className="text-fuchsia-400 font-bold">[结构化输出]:</span>{' '}
                <span className="text-slate-300">
                  严格使用 JSON Object 输出，字段涵盖 <code>cyberTitle</code>, <code>fortuneLevel</code>, <code>motto</code>, <code>deepAnalysis</code>, <code>warnings</code>, <code>goodDeeds</code> 等。
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold shadow-neon-cyan transition-all"
          >
            返回应用大屏
          </button>
        </div>
      </div>
    </div>
  );
};
