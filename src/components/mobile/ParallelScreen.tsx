import React, { useState } from 'react';
import { BillAnalytics, TransactionRecord } from '../../types';
import { Compass, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { sound } from '../../services/soundService';

interface ParallelScreenProps {
  analytics: BillAnalytics;
  records: TransactionRecord[];
}

export const ParallelScreen: React.FC<ParallelScreenProps> = ({ analytics, records }) => {
  const [plannedExpense, setPlannedExpense] = useState('399');
  const [plannedItem, setPlannedItem] = useState('降噪耳机 / 游戏限定手办');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  // 计算平行宇宙挽回的冲动资金
  const impulseWasted = Math.round(
    records
      .filter((r) => r.isImpulse || r.isMidnight)
      .reduce((sum, r) => sum + r.amount, 0) * 10
  ) / 10;

  const parallelSavings = Math.round((analytics.netSavings + impulseWasted) * 10) / 10;

  const handleSimulate = () => {
    sound.playClick();
    setIsSimulating(true);
    setTimeout(() => {
      sound.playSuccess();
      setIsSimulating(false);
      setSimulationResult(
        `【平行时空推演结论】：如果你此刻克制买「${plannedItem}」(￥${plannedExpense})，30天后你将直接保全 ￥${plannedExpense} 现金流。平行时空的你利用这笔钱作为基础备用金，理智度提升至 88%，且在月底面对意外支出时免于透支；反之若冲动下单，前3天多巴胺满足，第7天即沦为闲置吃灰，并导致下月财务防御力下降 24%。`
      );
    }, 800);
  };

  return (
    <div className="space-y-4 pb-20 font-mono text-xs">
      {/* 头部标题卡 */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border border-cyan-500/30">
        <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
          <Compass size={16} />
          <span>平行宇宙时空穿梭镜 // PARALLEL DIVERGENCE</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          每次轻佻花出去的几十块，都在把你的命运分流。如果把深夜冲动和非必要开支挽回，平行世界的你现在过得如何？
        </p>
      </div>

      {/* 现实宇宙 vs 平行宇宙 双轨对比 */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* 现实宇宙 A */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-2">
          <div className="text-[10px] text-rose-400 font-bold flex items-center justify-between">
            <span>现实宇宙 A (当前)</span>
            <Clock size={11} />
          </div>
          <div className="text-lg font-black text-white font-mono">
            ￥{analytics.netSavings}
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            冲动与深夜流失: <span className="text-rose-400 font-bold">￥{impulseWasted}</span>
          </div>
          <div className="text-[9px] text-slate-500">
            状态: 月底结余紧绷
          </div>
        </div>

        {/* 平行宇宙 B */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/40 space-y-2 relative overflow-hidden">
          <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-between">
            <span>平行宇宙 B (理性)</span>
            <Sparkles size={11} />
          </div>
          <div className="text-lg font-black text-emerald-400 font-mono">
            ￥{parallelSavings}
          </div>
          <div className="text-[10px] text-slate-300 leading-tight">
            避坑收益累计: <span className="text-emerald-300 font-bold">+￥{impulseWasted}</span>
          </div>
          <div className="text-[9px] text-emerald-500">
            状态: 蓄水池充盈，心境从容
          </div>
        </div>
      </div>

      {/* 平行宇宙心愿物资转化榜 (如果不乱花钱，你已经拥有了...) */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <TrendingUp size={13} />
            平行宇宙心愿物资兑换进度
          </span>
          <span className="text-slate-500">WISH MILESTONES</span>
        </div>

        {/* 目标 1: 客制化机械键盘 */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span>全铝客制化客制外设 (￥890)</span>
            <span className="text-emerald-400 font-bold">
              {parallelSavings >= 890 ? '已完全达成解锁！' : `${Math.round((parallelSavings / 890) * 100)}%`}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
              style={{ width: `${Math.min(100, (parallelSavings / 890) * 100)}%` }}
            />
          </div>
        </div>

        {/* 目标 2: 暑期近郊旅行基金 */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span>海岛放空双人游基金 (￥2,400)</span>
            <span className="text-cyan-300 font-bold">{Math.round((parallelSavings / 2400) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
              style={{ width: `${Math.min(100, (parallelSavings / 2400) * 100)}%` }}
            />
          </div>
        </div>

        {/* 目标 3: 专业相机定焦镜头 */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span>全画幅定焦相机镜头 (￥3,600)</span>
            <span className="text-purple-400 font-bold">{Math.round((parallelSavings / 3600) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-full rounded-full"
              style={{ width: `${Math.min(100, (parallelSavings / 3600) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 时空穿梭镜模拟器 */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-3">
        <div className="text-[11px] text-cyan-400 font-bold flex items-center gap-1">
          <Sparkles size={13} />
          未来 30 天时空走向模拟器
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">正在纠结想买的物品</label>
            <input
              type="text"
              value={plannedItem}
              onChange={(e) => setPlannedItem(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">预计花费金额 (元)</label>
            <input
              type="number"
              value={plannedExpense}
              onChange={(e) => setPlannedExpense(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold text-xs shadow-neon-cyan active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <Compass size={14} className={isSimulating ? 'animate-spin' : ''} />
            <span>{isSimulating ? '量子时空演算中...' : '推演平行时空走向'}</span>
          </button>
        </div>

        {simulationResult && (
          <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/40 text-slate-200 text-[11px] leading-relaxed animate-in fade-in">
            {simulationResult}
          </div>
        )}
      </div>
    </div>
  );
};
