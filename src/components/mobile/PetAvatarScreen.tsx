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
import { Sparkles, ShieldCheck, Heart, BatteryCharging, Zap } from 'lucide-react';
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
      particleCount: 15,
      spread: 45,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#00f2fe', '#f72585', '#ffb703'],
    });
  };

  const scores = analytics.fiveScores;

  return (
    <div className="space-y-4 pb-20 font-mono text-xs">
      {/* 3D 赛博电子宠物画布舞台 */}
      <div className="relative">
        <CyberPetCanvas
          scores={scores}
          petName={fortune?.cyberTitle || '赛博小幽 (CyberPet)'}
          onPetClick={() => sound.playSuccess()}
        />

        {/* 浮动文字粒子 */}
        {floatingText && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-base font-black text-amber-300 drop-shadow-[0_0_10px_#ffb703] animate-bounce z-20">
            {floatingText.text}
          </div>
        )}
      </div>

      {/* 互动投喂与抚摸操作栏 */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
        <div className="flex items-center gap-2">
          <BatteryCharging size={16} className="text-cyan-400" />
          <span className="text-slate-300 text-[11px]">赛博功德能量:</span>
          <span className="text-amber-400 font-bold text-sm text-glow-amber">{merit}</span>
        </div>

        <button
          onClick={handleFeedPet}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/40 text-amber-300 font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,183,3,0.25)] active:scale-95 transition-all"
        >
          <CyberMuyuIcon size={14} className="text-amber-400" />
          <span>叩击投喂分身</span>
        </button>
      </div>

      {/* 3D 分身状态机属性矩阵 */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-800">
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <Zap size={13} />
            分身 DNA 属性矩阵 (根据微信流水自适应)
          </span>
          <span className="text-slate-500">MORPHING STATS</span>
        </div>

        {/* 属性 1: 食神碳水 */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <EngelArmorIcon size={12} className="text-amber-400" />
              碳水饱腹能量 (恩格尔)
            </span>
            <span className="text-amber-400 font-bold">{analytics.engelCoefficient}% ({scores.foodWarrior}分)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, analytics.engelCoefficient)}%` }}
            />
          </div>
        </div>

        {/* 属性 2: 暗夜超频 */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <CyberNightOwlIcon size={12} className="text-fuchsia-400" />
              暗夜超频过载度 (23-05点)
            </span>
            <span className="text-fuchsia-400 font-bold">{analytics.midnightExpenseRatio}% ({scores.nightOwl}分)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-fuchsia-500 to-purple-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, analytics.midnightExpenseRatio)}%` }}
            />
          </div>
        </div>

        {/* 属性 3: 极客算力 */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <QuantumChipIcon size={12} className="text-cyan-400" />
              数码极客装甲力
            </span>
            <span className="text-cyan-400 font-bold">{scores.techGeek} / 100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, scores.techGeek)}%` }}
            />
          </div>
        </div>

        {/* 属性 4: 防御结界 */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-300 mb-1">
            <span className="flex items-center gap-1">
              <CyberVaultIcon size={12} className="text-emerald-400" />
              当期结余护盾值
            </span>
            <span className="text-emerald-400 font-bold">￥{analytics.netSavings} ({scores.wealthKeeper}分)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, scores.wealthKeeper)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3D 宠物伴侣实时吐露心声 (DeepSeek AI 赋能) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-slate-900 border-l-4 border-cyan-400 text-slate-200">
        <div className="text-[10px] text-cyan-400 font-bold mb-1 flex items-center gap-1">
          <Sparkles size={12} />
          分身心理共鸣 // SOUL VERDICT
        </div>
        <p className="text-xs leading-relaxed text-white font-medium">
          “{fortune?.motto || '消费是镜子，照出深夜失控的数字游民。'}”
        </p>
        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
          {fortune?.deepAnalysis || '系统正根据你的流水时钟与消费类目计算自适应形态。'}
        </p>
      </div>

      {/* 核心避险与开运清单 */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30">
          <div className="text-rose-400 font-bold mb-1">避坑警戒</div>
          <p className="text-slate-300 leading-tight">
            {fortune?.warnings[0] || '深夜23:00后务必锁定电商软件，防止多巴胺失控。'}
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30">
          <div className="text-amber-400 font-bold mb-1">开运神器</div>
          <p className="text-slate-300 leading-tight">
            {fortune?.luckyItem || '降噪耳机'}
          </p>
          <div className="text-[9px] text-amber-500/80 mt-1 truncate">
            {fortune?.fleeAdvice || '付款前数三秒'}
          </div>
        </div>
      </div>
    </div>
  );
};
