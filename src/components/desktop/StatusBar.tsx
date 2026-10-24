import React from 'react';
import { BillAnalytics, FortuneDiagnosis } from '../../types';
import { GitBranch, Activity, ShieldCheck, Zap, HardDrive, CheckCircle2 } from 'lucide-react';

interface StatusBarProps {
  analytics: BillAnalytics;
  fortune: FortuneDiagnosis | null;
  fortuneSource: 'ai' | 'fallback' | null;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  analytics,
  fortune,
  fortuneSource,
}) => {
  return (
    <footer className="h-7 w-full bg-[#050811] border-t border-cyan-500/15 px-3 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none shrink-0 z-30">
      {/* 左侧：内核与环境遥测 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-cyan-400 font-semibold">
          <GitBranch size={12} />
          <span>master</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-bold">DeepSeek-V3</span>
          <span className="text-slate-500">[{fortuneSource === 'ai' ? 'LIVE HTTP' : 'FALLBACK ENGINE'}]</span>
        </div>

        <div className="hidden md:flex items-center gap-1 text-slate-400 pl-3 border-l border-slate-800">
          <HardDrive size={12} />
          <span>{analytics.transactionCount} 流水节点</span>
        </div>
      </div>

      {/* 中间：命盘运势摘要 */}
      <div className="hidden lg:flex items-center gap-2 text-slate-400 truncate max-w-md">
        <Activity size={12} className="text-fuchsia-400 animate-pulse" />
        <span className="text-cyan-300 font-bold">[{fortune?.cyberTitle || '命盘就绪'}]</span>
        <span className="truncate text-slate-500">
          {fortune ? `“${fortune.motto}”` : '系统正在收敛财务拓扑...'}
        </span>
      </div>

      {/* 右侧：关键指标标尺与打包兼容性 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck size={12} />
          <span>恩格尔: {analytics.engelCoefficient}%</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-amber-400 pl-3 border-l border-slate-800">
          <Zap size={12} />
          <span>功德: {fortune?.cyberMerit || 999}</span>
        </div>

        <div className="flex items-center gap-1 text-cyan-400 font-semibold pl-3 border-l border-slate-800">
          <CheckCircle2 size={12} />
          <span className="hidden sm:inline">HBuilder APP就绪</span>
          <span className="sm:hidden">Ready</span>
        </div>
      </div>
    </footer>
  );
};
