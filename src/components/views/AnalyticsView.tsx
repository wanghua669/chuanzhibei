import React from 'react';
import { BillAnalytics } from '../../types';
import { CategoryPieChart } from '../charts/CategoryPieChart';
import { HourlyHeatmapChart } from '../charts/HourlyHeatmapChart';
import { TrendLineChart } from '../charts/TrendLineChart';
import {
  CyberNightOwlIcon,
  QuantumChipIcon,
  CyberImpulseIcon,
  EngelArmorIcon,
} from '../common/CyberIcons';
import { AlertTriangle, Moon, ArrowUpRight, Flame } from 'lucide-react';

interface AnalyticsViewProps {
  analytics: BillAnalytics;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  const {
    totalExpense,
    topCategories,
    hourlyDistribution,
    dailyTrends,
    maxExpenseItem,
    midnightExpenseRatio,
    midnightCount,
    engelCoefficient,
    fiveScores,
  } = analytics;

  return (
    <div className="space-y-6">
      {/* 模块头部 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black font-mono tracking-wider text-white flex items-center gap-2">
            <QuantumChipIcon size={22} className="text-cyan-400" />
            深度数据透视与多维图表工坊
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            ANALYTICS STUDIO // 针对账单结构、时钟分布、单日资金脉冲与异常支出的深度解构
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            总支出基数: <span className="text-cyan-300 font-bold">￥{totalExpense}</span>
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            采样样本: <span className="text-fuchsia-300 font-bold">{analytics.transactionCount} 笔</span>
          </span>
        </div>
      </div>

      {/* 第一行: 分类环形图 + 消费结构明细排行表 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 h-80">
          <CategoryPieChart categories={topCategories} />
        </div>

        {/* 消费结构排行表格 */}
        <div className="lg:col-span-6 cyber-box rounded-xl p-4 relative flex flex-col justify-between">
          <div className="cyber-corner cyber-corner-tl" />
          <div className="cyber-corner cyber-corner-tr" />
          <div className="cyber-corner cyber-corner-bl" />
          <div className="cyber-corner cyber-corner-br" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono text-cyan-400 font-bold tracking-wider flex items-center gap-1.5">
                <EngelArmorIcon size={16} />
                各领域资金消耗量度与渗透率
              </h3>
              <span className="text-[10px] font-mono text-slate-500">CATEGORY RANKING</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-56 pr-1 font-mono text-xs">
              {topCategories.map((cat, idx) => (
                <div key={cat.name} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-200 flex items-center gap-2">
                      <span className="text-[10px] text-cyan-400 font-mono">#{idx + 1}</span>
                      {cat.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">{cat.count} 笔</span>
                      <span className="font-bold text-cyan-300">￥{cat.amount}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                        {cat.percentage}%
                      </span>
                    </div>
                  </div>
                  {/* 进度条 */}
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, cat.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>恩格尔系数: <span className="text-emerald-400 font-bold">{engelCoefficient}%</span></span>
            <span className="text-slate-500">主宰分类: {topCategories[0]?.name || '其他'}</span>
          </div>
        </div>
      </div>

      {/* 第二行: 24小时时钟柱图 + 深夜消费聚光灯分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-80">
          <HourlyHeatmapChart hourlyDistribution={hourlyDistribution} />
        </div>

        {/* 深夜消费聚光灯卡片 */}
        <div className="lg:col-span-5 cyber-box rounded-xl p-4 relative flex flex-col justify-between">
          <div className="cyber-corner cyber-corner-tl" />
          <div className="cyber-corner cyber-corner-tr" />
          <div className="cyber-corner cyber-corner-bl" />
          <div className="cyber-corner cyber-corner-br" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono text-fuchsia-400 font-bold tracking-wider flex items-center gap-1.5">
                <CyberNightOwlIcon size={16} />
                深夜多巴胺消费脉冲透视
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800/40">
                23:00 - 05:00
              </span>
            </div>

            <div className="p-3 rounded-lg bg-fuchsia-950/20 border border-fuchsia-500/30 text-xs font-mono space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">深夜时段交易笔数:</span>
                <span className="text-fuchsia-300 font-bold">{midnightCount} 笔流水</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">深夜资金消耗占比:</span>
                <span className="text-fuchsia-300 font-bold text-glow-pink">{midnightExpenseRatio}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">夜猫指数评估:</span>
                <span className="text-amber-400 font-bold">{fiveScores.nightOwl} / 100</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              神经生物学研究表明，子时（午夜）人体前额叶抑制能力下降约 40%，外卖重油重盐、游戏打折抽卡极易发生在此区间。系统已自动在时钟图表中以
              <span className="text-fuchsia-400 font-bold mx-1">霓虹粉色</span>
              予以警戒标记。
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-fuchsia-400">
            <span className="flex items-center gap-1">
              <Moon size={12} />
              建议设限时段: 23:00 - 02:00
            </span>
            <span className="text-slate-500">避险率 +65%</span>
          </div>
        </div>
      </div>

      {/* 第三行: 每日脉冲折线图 + 突发大额/冲动消费探针 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-80">
          <TrendLineChart dailyTrends={dailyTrends} />
        </div>

        {/* 突发大额消费探针卡片 */}
        <div className="lg:col-span-4 cyber-box rounded-xl p-4 relative flex flex-col justify-between">
          <div className="cyber-corner cyber-corner-tl" />
          <div className="cyber-corner cyber-corner-tr" />
          <div className="cyber-corner cyber-corner-bl" />
          <div className="cyber-corner cyber-corner-br" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono text-rose-400 font-bold tracking-wider flex items-center gap-1.5">
                <CyberImpulseIcon size={16} />
                大额脉冲与冲动消费探针
              </h3>
              <span className="text-[10px] font-mono text-slate-500">SPIKE DETECTOR</span>
            </div>

            {maxExpenseItem ? (
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 font-mono text-xs space-y-2">
                <div className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                  <Flame size={13} />
                  周期内单笔最大流出
                </div>
                <div className="text-base font-bold text-white truncate">
                  {maxExpenseItem.counterparty}
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-400">{maxExpenseItem.date} {maxExpenseItem.time}</span>
                  <span className="text-lg font-black text-rose-400 font-mono">
                    ￥{maxExpenseItem.amount}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-rose-900/40 truncate">
                  备注: {maxExpenseItem.description}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-slate-500 font-mono text-xs">
                未检测到异常大额脉冲支出
              </div>
            )}

            <div className="mt-3 text-xs text-slate-400 font-mono space-y-1">
              <div className="flex justify-between">
                <span>日均消耗基准:</span>
                <span className="text-slate-200">￥{analytics.avgDailyExpense}</span>
              </div>
              <div className="flex justify-between">
                <span>冲动剁手评分:</span>
                <span className="text-rose-400 font-bold">{fiveScores.impulseBuyer} / 100</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>算法策略: 3-Sigma 离群值侦测</span>
            <span className="text-rose-400">PULSE MONITORED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
