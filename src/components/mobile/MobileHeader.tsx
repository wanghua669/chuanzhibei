import React, { useState } from 'react';
import { PresetType } from '../../types';
import { PRESET_INFO } from '../../services/presetData';
import { Volume2, VolumeX, RefreshCw, Zap } from 'lucide-react';
import { sound } from '../../services/soundService';

interface MobileHeaderProps {
  currentPreset: PresetType | null;
  onSelectPreset: (preset: PresetType) => void;
  onRefreshAI: () => void;
  isAiGenerating: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentPreset,
  onSelectPreset,
  onRefreshAI,
  isAiGenerating,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  const handleToggleSound = () => {
    const newMuted = sound.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) sound.playSuccess();
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0e1322]/85 backdrop-blur-2xl border-b border-white/10 px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 select-none rounded-b-2xl shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
      {/* 状态栏顶行 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f2fe]" />
          <h1 className="text-sm font-black font-mono tracking-wider bg-gradient-to-r from-cyan-300 via-teal-200 to-fuchsia-400 bg-clip-text text-transparent">
            CYBERPET 赛博分身
          </h1>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/30">
            PRO v3.2
          </span>
        </div>

        {/* 仅在移动端显示的快捷按钮 */}
        <div className="flex md:hidden items-center gap-2 font-mono text-xs">
          <button
            onClick={() => {
              sound.playClick();
              onRefreshAI();
            }}
            disabled={isAiGenerating}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-cyan-300 hover:text-white hover:bg-white/[0.08] transition-all disabled:opacity-40"
            title="刷新大模型推演"
          >
            <RefreshCw size={13} className={isAiGenerating ? 'animate-spin text-fuchsia-400' : ''} />
          </button>

          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
            title="音效开关"
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* 预设场景横滑胶囊与桌面端操作区 */}
      <div className="flex items-center justify-between md:justify-end gap-3 font-mono text-[11px]">
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          {(['student', 'coder', 'moonlight'] as PresetType[]).map((key) => {
            const info = PRESET_INFO[key];
            const isActive = currentPreset === key;
            return (
              <button
                key={key}
                onClick={() => {
                  sound.playClick();
                  onSelectPreset(key);
                }}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-400/40 glow-cyan-sm shadow-sm'
                    : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/5 hover:border-white/10'
                }`}
              >
                <Zap size={11} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
                <span>{info.name}</span>
              </button>
            );
          })}
        </div>

        {/* 桌面端右侧快捷按钮 */}
        <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-3">
          <button
            onClick={() => {
              sound.playClick();
              onRefreshAI();
            }}
            disabled={isAiGenerating}
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-cyan-300 hover:text-white hover:bg-white/[0.08] transition-all disabled:opacity-40 flex items-center gap-1.5"
            title="刷新大模型推演"
          >
            <RefreshCw size={12} className={isAiGenerating ? 'animate-spin text-fuchsia-400' : ''} />
            <span className="text-[10px]">AI推演</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all"
            title="音效开关"
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
