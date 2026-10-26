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
    <header className="sticky top-0 z-30 w-full bg-[#070b16]/95 backdrop-blur-md border-b border-cyan-500/15 px-3 py-2 flex flex-col gap-2 select-none">
      {/* 状态栏顶行 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f2fe]" />
          <h1 className="text-sm font-black font-mono tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-400 bg-clip-text text-transparent">
            CYBERPET 赛博分身
          </h1>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
            APP v3.0
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => {
              sound.playClick();
              onRefreshAI();
            }}
            disabled={isAiGenerating}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-cyan-300 hover:text-white disabled:opacity-40"
            title="刷新大模型推演"
          >
            <RefreshCw size={13} className={isAiGenerating ? 'animate-spin text-fuchsia-400' : ''} />
          </button>

          <button
            onClick={handleToggleSound}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="音效开关"
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* 预设场景横滑胶囊 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar font-mono text-[11px]">
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
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-neon-cyan border border-cyan-400/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Zap size={11} className={isActive ? 'text-white' : 'text-slate-500'} />
              <span>{info.name}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
