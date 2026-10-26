import React, { useState } from 'react';
import { BillAnalytics, FortuneDiagnosis } from '../../types';
import { CyberPetCanvas } from '../pet3d/CyberPetCanvas';
import {
  EngelArmorIcon,
  CyberNightOwlIcon,
  CyberVaultIcon,
  QuantumChipIcon,
  CyberImpulseIcon,
  CyberMuyuIcon,
} from '../common/CyberIcons';
import {
  Sparkles,
  ShieldCheck,
  BatteryCharging,
  Zap,
  Activity,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import { sound } from '../../services/soundService';
import confetti from 'canvas-confetti';

interface PetAvatarScreenProps {
  analytics: BillAnalytics;
  fortune: FortuneDiagnosis | null;
  onRefreshAI: () => void;
  isAiGenerating: boolean;
}

export const PetAvatarScreen: React.FC<PetAvatarScreenProps> = ({
  analytics,
  fortune,
  onRefreshAI,
  isAiGenerating,
}) => {
  const [merit, setMerit] = useState(fortune?.cyberMerit || 999);
  const [floatingText, setFloatingText] = useState<{ id: number; text: string } | null>(null);

  const handleFeedPet = (e: React.MouseEvent) => {
    sound.playMuyu();
    setMerit((prev) => prev + 1);

    const compliments = ['功德 +1', '机体过载 -1', '护盾充能 +1', '理智 SAN +1', 'BUG -1'];
    const chosen = compliments[Math.floor(Math.random() * compliments.length)];
    const id = Date.now();
    setFloatingText({ id, text: chosen });
    setTimeout(() => setFloatingText(null), 900);

    confetti({
      particleCount: 16,
      spread: 50,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#00f2fe', '#f72585', '#ffb703'],
    });
  };

  const scores = analytics.fiveScores;

  return (
    <div className="space-y-5 pb-28 font-mono text-xs">
      {/* 生产级宽屏响应式布局容器：桌面端双栏工作台，移动端自适应单栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ===================== 左侧区域：3D 全息主舞台 & 交互中枢 (7 Cols) ===================== */}
        <div className="lg:col-span-7 space-y-4">
          {/* 3D 赛博电子宠物全息投影舞台 */}
          <div className="relative">
            <CyberPetCanvas
              scores={scores}
              petName={fortune?.cyberTitle || '赛博小幽 (CyberPet)'}
              onPetClick={() => sound.playSuccess()}
            />

            {/* 点击浮动粒子文字 */}
            {floatingText && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-base font-black text-amber-300 drop-shadow-[0_0_12px_#ffb703] animate-bounce z-20">
                {floatingText.text}
              </div>
            )}
          </div>

          {/* 舞台底部：高能交互控制与能量条卡片 */}
          <div className="tech-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <BatteryCharging size={20} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                  CYBER MERIT // 分身功德蓄池
                </div>
                <div className="text-lg font-black font-mono text-amber-300 text-glow-amber">
                  +{merit} <span className="text-[10px] text-slate-500 font-normal">pts</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleFeedPet}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/30 text-amber-300 font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,183,3,0.18)]"
              >
                <CyberMuyuIcon size={16} className="text-amber-400" />
                <span>叩击投喂分身 (+1功德)</span>
              </button>
            </div>
          </div>

          {/* 心理共鸣与灵魂判词 Banner */}
          <div className="tech-card p-4 border-l-4 border-cyan-400">
            <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-bold uppercase tracking-wider mb-1.5">
              <Sparkles size={13} />
              <span>SOUL VERDICT // 心理共鸣判词</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed tracking-wide">
              “{fortune?.motto || '消费是镜子，照出深夜失控的数字游民。'}”
            </p>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              {fortune?.deepAnalysis || '系统正根据你的近期流水时钟与各领域类目计算自适应形态。'}
            </p>

            {/* 属性标签 */}
            {fortune?.traits && fortune.traits.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-white/5">
                {fortune.traits.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] text-cyan-300 font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===================== 右侧区域：属性矩阵 & 战术监视仪表 (5 Cols) ===================== */}
        <div className="lg:col-span-5 space-y-4">
          {/* 实时核心流水遥测简标 */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="tech-card p-3">
              <div className="text-[10px] text-slate-400 font-mono">当期资金消耗</div>
              <div className="text-base font-black font-mono text-cyan-300 mt-0.5">
                ￥{analytics.totalExpense.toLocaleString()}
              </div>
              <div className="text-[9px] text-slate-500 mt-1">流水共 {analytics.transactionCount} 笔</div>
            </div>

            <div className="tech-card p-3">
              <div className="text-[10px] text-slate-400 font-mono">结余蓄能池</div>
              <div
                className={`text-base font-black font-mono mt-0.5 ${
                  analytics.netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                ￥{analytics.netSavings.toLocaleString()}
              </div>
              <div className="text-[9px] text-slate-500 mt-1">
                {analytics.netSavings >= 0 ? '顺差蓄能中' : '赛博赤字预警'}
              </div>
            </div>
          </div>

          {/* DNA 属性状态矩阵卡片 (升级为高科技流动能量槽) */}
          <div className="tech-card p-4 space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Activity size={14} className="text-cyan-400" />
                分身 DNA 能量状态机
              </span>
              <span className="text-[10px] font-mono text-slate-500">REALTIME MATRIX</span>
            </div>

            {/* 能量条 1: 碳水饱腹能量 (恩格尔) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <EngelArmorIcon size={13} className="text-amber-400" />
                  碳水饱腹能量 (恩格尔)
                </span>
                <span className="font-bold text-amber-300">
                  {analytics.engelCoefficient}%{' '}
                  <span className="text-slate-500 font-normal">({scores.foodWarrior}分)</span>
                </span>
              </div>
              <div className="w-full bg-slate-900/90 h-2 rounded-full overflow-hidden p-[1px] border border-white/5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-400 energy-gauge-striped h-full rounded-full transition-all duration-700 relative"
                  style={{ width: `${Math.min(100, analytics.engelCoefficient)}%` }}
                />
              </div>
            </div>

            {/* 能量条 2: 暗夜超频过载度 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <CyberNightOwlIcon size={13} className="text-fuchsia-400" />
                  暗夜超频过载度 (23-05点)
                </span>
                <span className="font-bold text-fuchsia-400">
                  {analytics.midnightExpenseRatio}%{' '}
                  <span className="text-slate-500 font-normal">({scores.nightOwl}分)</span>
                </span>
              </div>
              <div className="w-full bg-slate-900/90 h-2 rounded-full overflow-hidden p-[1px] border border-white/5">
                <div
                  className="bg-gradient-to-r from-fuchsia-500 to-purple-600 energy-gauge-striped h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, analytics.midnightExpenseRatio)}%` }}
                />
              </div>
            </div>

            {/* 能量条 3: 极客算力装甲 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <QuantumChipIcon size={13} className="text-cyan-400" />
                  数码极客装甲力
                </span>
                <span className="font-bold text-cyan-300">{scores.techGeek} / 100</span>
              </div>
              <div className="w-full bg-slate-900/90 h-2 rounded-full overflow-hidden p-[1px] border border-white/5">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 energy-gauge-striped h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, scores.techGeek)}%` }}
                />
              </div>
            </div>

            {/* 能量条 4: 冲动消费脉冲 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <CyberImpulseIcon size={13} className="text-rose-400" />
                  冲动剁手脉冲值
                </span>
                <span className="font-bold text-rose-400">{scores.impulseBuyer} / 100</span>
              </div>
              <div className="w-full bg-slate-900/90 h-2 rounded-full overflow-hidden p-[1px] border border-white/5">
                <div
                  className="bg-gradient-to-r from-rose-500 to-red-600 energy-gauge-striped h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, scores.impulseBuyer)}%` }}
                />
              </div>
            </div>

            {/* 能量条 5: 结余护盾值 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <CyberVaultIcon size={13} className="text-emerald-400" />
                  当期结余护盾值
                </span>
                <span className="font-bold text-emerald-400">{scores.wealthKeeper} / 100</span>
              </div>
              <div className="w-full bg-slate-900/90 h-2 rounded-full overflow-hidden p-[1px] border border-white/5">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 energy-gauge-striped h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, scores.wealthKeeper)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 战术避险与开运神器监视卡 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="tech-card p-3 border-rose-500/20 bg-rose-950/15">
              <div className="text-rose-400 font-bold text-[11px] mb-1 flex items-center gap-1">
                <AlertTriangle size={13} />
                <span>避坑破财预警</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {fortune?.warnings[0] || '深夜 23:00 后务必锁定电商软件，防止多巴胺失控。'}
              </p>
            </div>

            <div className="tech-card p-3 border-amber-500/20 bg-amber-950/15">
              <div className="text-amber-400 font-bold text-[11px] mb-1 flex items-center gap-1">
                <Compass size={13} />
                <span>本命开运神器</span>
              </div>
              <div className="text-white font-bold text-xs truncate">
                {fortune?.luckyItem || '降噪耳机'}
              </div>
              <div className="text-[10px] text-amber-400/80 mt-1 truncate">
                口诀: {fortune?.fleeAdvice || '付款前默数三秒'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
