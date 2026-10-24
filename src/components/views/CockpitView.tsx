import React from 'react';
import { BillAnalytics, FortuneDiagnosis, SoftwareView } from '../../types';
import { StatCards } from '../StatCards';
import { FortuneConsole } from '../FortuneConsole';
import { RadarChart } from '../charts/RadarChart';
import { CategoryPieChart } from '../charts/CategoryPieChart';
import { HourlyHeatmapChart } from '../charts/HourlyHeatmapChart';
import { LineChart, MessageSquareCode, TableProperties, ArrowRight } from 'lucide-react';
import { sound } from '../../services/soundService';

interface CockpitViewProps {
  analytics: BillAnalytics;
  fortune: FortuneDiagnosis | null;
  fortuneSource: 'ai' | 'fallback' | null;
  isAiGenerating: boolean;
  onRefreshDiagnosis: () => void;
  onNavigate: (view: SoftwareView) => void;
}

export const CockpitView: React.FC<CockpitViewProps> = ({
  analytics,
  fortune,
  fortuneSource,
  isAiGenerating,
  onRefreshDiagnosis,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      {/* 顶部指标卡片 */}
      <StatCards analytics={analytics} />

      {/* 核心第一行: 命盘主控制台 (占8列) + 五维性格雷达 (占4列) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col">
          <FortuneConsole
            fortune={fortune}
            isGenerating={isAiGenerating}
            onRefreshFortune={onRefreshDiagnosis}
            fortuneSource={fortuneSource}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <RadarChart scores={analytics.fiveScores} />
        </div>
      </div>

      {/* 核心第二行: 概览缩略图 + 快速功能导航卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-72">
          <CategoryPieChart categories={analytics.topCategories} />
        </div>
        <div className="h-72">
          <HourlyHeatmapChart hourlyDistribution={analytics.hourlyDistribution} />
        </div>

        {/* 快速工作台导航入口卡片 */}
        <div className="cyber-box rounded-xl p-5 relative flex flex-col justify-between">
          <div className="cyber-corner cyber-corner-tl" />
          <div className="cyber-corner cyber-corner-tr" />
          <div className="cyber-corner cyber-corner-bl" />
          <div className="cyber-corner cyber-corner-br" />

          <div>
            <div className="text-xs font-mono text-cyan-400 font-bold tracking-wider mb-1">
              STUDIO WORKSPACES // 模块速通
            </div>
            <p className="text-xs text-slate-400 font-mono">
              系统已就绪，可无缝跳转至深度图表透视、与 DeepSeek 对话或管理账单明细：
            </p>
          </div>

          <div className="space-y-2 my-3">
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('analytics');
              }}
              className="w-full p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-cyan-300 border border-slate-700/60 flex items-center justify-between text-xs font-mono transition-all group"
            >
              <div className="flex items-center gap-2">
                <LineChart size={15} className="text-cyan-400" />
                <span>进入 深度数据透视工坊</span>
              </div>
              <ArrowRight size={13} className="text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('chat');
              }}
              className="w-full p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-fuchsia-300 border border-slate-700/60 flex items-center justify-between text-xs font-mono transition-all group"
            >
              <div className="flex items-center gap-2">
                <MessageSquareCode size={15} className="text-fuchsia-400" />
                <span>与 AI 命理大师一对一问诊</span>
              </div>
              <ArrowRight size={13} className="text-slate-500 group-hover:text-fuchsia-400 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('ledger');
              }}
              className="w-full p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-emerald-300 border border-slate-700/60 flex items-center justify-between text-xs font-mono transition-all group"
            >
              <div className="flex items-center gap-2">
                <TableProperties size={15} className="text-emerald-400" />
                <span>查看与编辑 {analytics.transactionCount} 条流水账本</span>
              </div>
              <ArrowRight size={13} className="text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span>状态: 遥测数据正常收敛</span>
            <span className="text-cyan-400 font-bold">100% VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
