import React, { useState, useEffect } from 'react';
import { PresetType, SoftwareView } from '../../types';
import { PRESET_INFO } from '../../services/presetData';
import { CyberCompassIcon, QuantumChipIcon } from '../common/CyberIcons';
import { Volume2, VolumeX, Sparkles, Terminal, Command, RefreshCw } from 'lucide-react';
import { sound } from '../../services/soundService';

interface TitleBarProps {
  currentView: SoftwareView;
  currentPreset: PresetType | null;
  onSelectPreset: (preset: PresetType) => void;
  onOpenCommandPalette: () => void;
  onRefreshDiagnosis: () => void;
  isAiGenerating: boolean;
  fortuneSource: 'ai' | 'fallback' | null;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  currentView,
  currentPreset,
  onSelectPreset,
  onOpenCommandPalette,
  onRefreshDiagnosis,
  isAiGenerating,
  fortuneSource,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const newMuted = sound.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      sound.playSuccess();
    }
  };

  const viewNameMap: Record<SoftwareView, string> = {
    cockpit: '赛博驾驶舱',
    analytics: '数据透视工坊',
    chat: 'AI 命理大师问诊',
    ledger: '全资产账单明细',
    poster: '签文海报设计所',
    settings: '内核与引擎配置',
  };

  return (
    <header className="h-12 w-full bg-[#070b14] border-b border-cyan-500/20 px-3 md:px-5 flex items-center justify-between select-none z-30 shrink-0 text-xs font-mono">
      {/* 左侧：软件窗口控制徽章 + 软件名 + 面包屑 */}
      <div className="flex items-center gap-3">
        {/* 桌面软件三色控制点 */}
        <div className="flex items-center gap-1.5 px-1 py-1 rounded bg-slate-900/80 border border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 hover:bg-rose-400 cursor-pointer shadow-[0_0_6px_rgba(244,63,94,0.6)]" title="关闭窗口" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-400 cursor-pointer shadow-[0_0_6px_rgba(245,158,11,0.6)]" title="最小化" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-400 cursor-pointer shadow-[0_0_6px_rgba(16,185,129,0.6)]" title="全屏最大化" />
        </div>

        {/* 软件标识 */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <CyberCompassIcon size={18} className="text-cyan-400 animate-spin-slow" />
          <span className="font-black tracking-wider bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent font-bold">
            CYBER FORTUNE
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/50">
            PRO v2.4
          </span>
        </div>

        {/* 面包屑导航 */}
        <div className="hidden lg:flex items-center gap-1.5 text-slate-500 pl-3 border-l border-slate-800">
          <span>Studio</span>
          <span>/</span>
          <span className="text-cyan-300 font-semibold">{viewNameMap[currentView]}</span>
        </div>
      </div>

      {/* 中间：场景快速切换胶囊 */}
      <div className="hidden md:flex items-center gap-1 p-0.5 bg-slate-950/90 rounded-lg border border-slate-800">
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
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                isActive
                  ? 'bg-cyan-600/90 text-white font-bold shadow-neon-cyan border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <QuantumChipIcon size={12} className={isActive ? 'text-white' : 'text-slate-500'} />
              <span>{info.name}</span>
            </button>
          );
        })}
      </div>

      {/* 右侧：遥测状态 + 快捷键 + 音效 + 刷新 */}
      <div className="flex items-center gap-2">
        {/* 大模型节点状态 */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold hidden sm:inline">DeepSeek-V3</span>
          <span className="text-slate-500">{fortuneSource === 'ai' ? '实时' : '离线引擎'}</span>
        </div>

        {/* 重新推演算命 */}
        <button
          onClick={() => {
            sound.playClick();
            onRefreshDiagnosis();
          }}
          disabled={isAiGenerating}
          className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 hover:text-cyan-200 transition-all disabled:opacity-40"
          title="重新请求 AI 命理推演"
        >
          <RefreshCw size={13} className={isAiGenerating ? 'animate-spin text-fuchsia-400' : ''} />
        </button>

        {/* Ctrl + K 命令面板快捷键 */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenCommandPalette();
          }}
          className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-all"
          title="打开快捷命令面板"
        >
          <Command size={12} />
          <span className="text-[10px]">Ctrl+K</span>
        </button>

        {/* 音效开关 */}
        <button
          onClick={handleToggleSound}
          className={`p-1.5 rounded border transition-all ${
            isMuted
              ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-400 shadow-neon-cyan'
          }`}
          title={isMuted ? '点击开启系统音效' : '点击静音'}
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>

        {/* 实时时间 */}
        <div className="hidden sm:block text-slate-400 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
          {timeStr}
        </div>
      </div>
    </header>
  );
};
