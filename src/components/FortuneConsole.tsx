import React, { useState } from 'react';
import { FortuneDiagnosis } from '../types';
import {
  CyberCompassIcon,
  CyberAmuletIcon,
  CyberMuyuIcon,
  QuantumChipIcon,
} from './common/CyberIcons';
import { Sparkles, RefreshCw, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FortuneConsoleProps {
  fortune: FortuneDiagnosis | null;
  isGenerating: boolean;
  onRefreshFortune: () => void;
  fortuneSource: 'ai' | 'fallback' | null;
}

export const FortuneConsole: React.FC<FortuneConsoleProps> = ({
  fortune,
  isGenerating,
  onRefreshFortune,
  fortuneSource,
}) => {
  const [meritCount, setMeritCount] = useState<number>(fortune?.cyberMerit || 999);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  // 播放极简合成蜂鸣音 (Web Audio API，纯原生无资源依赖)
  const playKnockSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch (e) {
      // 容错静音
    }
  };

  const handleKnockMuyu = (e: React.MouseEvent<HTMLButtonElement>) => {
    playKnockSound();
    setMeritCount((prev) => prev + 1);

    const rect = e.currentTarget.getBoundingClientRect();
    const texts = ['功德 +1', 'BUG -1', '气运 +1', '防破财 +1', '结余 +1'];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    const id = Date.now() + Math.random();

    setFloatingTexts((prev) => [
      ...prev,
      { id, text: randomText, x: e.clientX - rect.left - 20, y: e.clientY - rect.top - 20 },
    ]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1000);

    // 庆祝粒子
    if (Math.random() > 0.7) {
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        colors: ['#00f2fe', '#f72585', '#ffb703'],
      });
    }
  };

  if (!fortune) {
    return (
      <div className="cyber-box rounded-xl p-8 text-center relative">
        <CyberCompassIcon size={36} className="mx-auto text-cyan-400 animate-spin" />
        <p className="mt-4 text-sm font-mono text-cyan-300">正在链接 DeepSeek 赛博命盘算力节点...</p>
      </div>
    );
  }

  const levelColorMap = {
    '大吉·赛博暴富': 'from-emerald-500 to-teal-400 text-emerald-300 border-emerald-500/50',
    '中平·量入为出': 'from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/50',
    '下下·赛博破产劫': 'from-rose-600 to-pink-500 text-rose-300 border-rose-500/50',
    '超然·极简隐者': 'from-purple-500 to-indigo-500 text-purple-300 border-purple-500/50',
  };

  return (
    <div className="cyber-box rounded-2xl p-5 lg:p-6 relative overflow-hidden mb-6 border border-cyan-500/30 shadow-2xl">
      <div className="cyber-corner cyber-corner-tl" />
      <div className="cyber-corner cyber-corner-tr" />
      <div className="cyber-corner cyber-corner-bl" />
      <div className="cyber-corner cyber-corner-br" />

      {/* 顶部状态与运势条 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-950 to-slate-900 border border-cyan-400/30 text-cyan-400">
            <CyberAmuletIcon size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-400 border border-slate-700">
                CYBER DESTINY MATRIX
              </span>
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded border font-bold ${
                  levelColorMap[fortune.fortuneLevel] || 'border-cyan-500/50 text-cyan-300'
                }`}
              >
                {fortune.fortuneLevel}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {fortuneSource === 'ai' ? '[DeepSeek-V3 驱动]' : '[赛博规则引擎兜底]'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-wide text-white mt-1 text-glow-cyan">
              {fortune.cyberTitle}
            </h2>
          </div>
        </div>

        {/* 重新推演与木鱼快捷操作 */}
        <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
          <button
            onClick={onRefreshFortune}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-400/40 text-xs font-mono text-cyan-300 transition-all shadow-neon-cyan disabled:opacity-50"
          >
            <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
            <span>{isGenerating ? '深度推理中...' : '重新算命'}</span>
          </button>
        </div>
      </div>

      {/* 毒舌判词与灵魂拷问 Banner */}
      <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-fuchsia-950/40 via-purple-950/20 to-slate-900/60 border-l-4 border-fuchsia-500 text-slate-200">
        <div className="flex items-start gap-3">
          <Zap size={20} className="text-fuchsia-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] font-mono text-fuchsia-400 tracking-wider font-semibold">
              SOUL QUERY // 毒舌判词
            </div>
            <p className="text-sm md:text-base font-medium text-white tracking-wide mt-0.5">
              “{fortune.motto}”
            </p>
          </div>
        </div>
      </div>

      {/* 命盘深度剖析 */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs md:text-sm leading-relaxed mb-4 font-mono">
        <span className="text-cyan-400 font-bold mr-1">[命理拓扑解构]:</span>
        {fortune.deepAnalysis}
      </div>

      {/* 属性标签 */}
      <div className="flex flex-wrap gap-2 mb-5">
        {fortune.traits.map((trait, idx) => (
          <span
            key={idx}
            className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800/90 text-cyan-300 border border-cyan-500/20 flex items-center gap-1"
          >
            <QuantumChipIcon size={12} className="text-cyan-400" />
            {trait}
          </span>
        ))}
        <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-800/90 text-amber-300 border border-amber-500/20 flex items-center gap-1">
          <Sparkles size={12} className="text-amber-400" />
          本命开运: {fortune.luckyItem}
        </span>
      </div>

      {/* 下月避坑预警 与 赛博积德指南 双栏 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 避坑预警 */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
          <div className="flex items-center gap-2 mb-2.5 text-xs font-mono text-rose-400 font-bold">
            <AlertTriangle size={15} />
            <span>下月避坑破财预警</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {fortune.warnings.map((warn, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold font-mono">0{i + 1}.</span>
                <span>{warn}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 赛博积德与木鱼互动 */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2.5 text-xs font-mono text-emerald-400 font-bold">
              <ShieldCheck size={15} />
              <span>赛博积德转运指南</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {fortune.goodDeeds.map((deed, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold font-mono">0{i + 1}.</span>
                  <span>{deed}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 叩响赛博木鱼按键 */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between relative">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">赛博功德蓄池:</span>
              <span className="text-sm font-mono font-bold text-amber-400 text-glow-amber">
                {meritCount}
              </span>
            </div>

            <button
              onClick={handleKnockMuyu}
              className="relative px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-[0_0_12px_rgba(255,183,3,0.3)]"
            >
              <CyberMuyuIcon size={16} className="text-amber-400 animate-pulse" />
              <span>叩击积功德</span>
            </button>

            {/* 浮动文字粒子 */}
            {floatingTexts.map((item) => (
              <span
                key={item.id}
                style={{ left: item.x, top: item.y }}
                className="absolute pointer-events-none text-xs font-mono font-black text-amber-300 animate-bounce transition-all drop-shadow-[0_0_8px_#ffb703]"
              >
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
