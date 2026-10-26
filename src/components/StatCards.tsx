import React from 'react';
import { BillAnalytics } from '../types';
import {
  EngelArmorIcon,
  CyberNightOwlIcon,
  CyberVaultIcon,
  QuantumChipIcon,
} from './common/CyberIcons';

interface StatCardsProps {
  analytics: BillAnalytics;
}

export const StatCards: React.FC<StatCardsProps> = ({ analytics }) => {
  const {
    totalExpense,
    totalIncome,
    netSavings,
    transactionCount,
    avgDailyExpense,
    engelCoefficient,
    midnightExpenseRatio,
    midnightCount,
    maxExpenseItem,
    fiveScores,
  } = analytics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 卡片 1: 资金流出总纲 */}
      <div className="cyber-box rounded-xl p-4 relative overflow-hidden">
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
            <QuantumChipIcon size={16} />
            资金消耗总额
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
            {transactionCount} 笔流水
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-sm font-mono text-cyan-500 font-bold">￥</span>
          <span className="text-2xl lg:text-3xl font-black font-mono tracking-tight text-white text-glow-cyan">
            {totalExpense.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>日均燃烧: ￥{avgDailyExpense}</span>
          <span className="text-slate-500">周期核算</span>
        </div>
      </div>

      {/* 卡片 2: 财富结余防御力 */}
      <div className="cyber-box rounded-xl p-4 relative overflow-hidden">
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-sky-400 flex items-center gap-1.5">
            <CyberVaultIcon size={16} />
            结余蓄水池
          </span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              netSavings >= 0
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/40'
                : 'bg-rose-950/80 text-rose-300 border-rose-800/40'
            }`}
          >
            {netSavings >= 0 ? '顺差蓄能' : '赛博赤字'}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-sm font-mono text-sky-500 font-bold">￥</span>
          <span
            className={`text-2xl lg:text-3xl font-black font-mono tracking-tight ${
              netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {netSavings.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>总入账: ￥{totalIncome}</span>
          <span className="text-sky-400">防御值: {fiveScores.wealthKeeper}%</span>
        </div>
      </div>

      {/* 卡片 3: 恩格尔食神指数 */}
      <div className="cyber-box rounded-xl p-4 relative overflow-hidden">
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <EngelArmorIcon size={16} />
            恩格尔食神度
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
            {engelCoefficient > 50 ? '碳水主宰' : '营养平衡'}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl lg:text-3xl font-black font-mono tracking-tight text-white">
            {engelCoefficient}
          </span>
          <span className="text-sm font-mono text-emerald-400 font-bold">%</span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, engelCoefficient)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
            <span>餐饮占大头</span>
            <span>食力值: {fiveScores.foodWarrior}</span>
          </div>
        </div>
      </div>

      {/* 卡片 4: 赛博夜猫幽灵度 */}
      <div className="cyber-box rounded-xl p-4 relative overflow-hidden">
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-indigo-400 flex items-center gap-1.5">
            <CyberNightOwlIcon size={16} />
            深夜剁手频率
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/40">
            23:00 - 05:00
          </span>
        </div>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl lg:text-3xl font-black font-mono tracking-tight text-white">
            {midnightExpenseRatio}
          </span>
          <span className="text-sm font-mono text-indigo-400 font-bold">%</span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, midnightExpenseRatio)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
            <span>深夜共 {midnightCount} 笔</span>
            <span className="text-fuchsia-400">
              单笔峰值: ￥{maxExpenseItem ? maxExpenseItem.amount : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
