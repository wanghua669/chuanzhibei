import React, { useState, useEffect } from 'react';
import { PresetType } from '../types';
import { PRESET_INFO } from '../services/presetData';
import { CyberCompassIcon, QuantumChipIcon } from './common/CyberIcons';
import { Upload, Settings, FileText, Share2, Sparkles, Terminal } from 'lucide-react';

interface HeaderProps {
  currentPreset: PresetType | null;
  onSelectPreset: (preset: PresetType) => void;
  onOpenImport: () => void;
  onOpenSettings: () => void;
  onOpenVibeDocs: () => void;
  onOpenPoster: () => void;
  isAiGenerating: boolean;
  fortuneSource: 'ai' | 'fallback' | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentPreset,
  onSelectPreset,
  onOpenImport,
  onOpenSettings,
  onOpenVibeDocs,
  onOpenPoster,
  isAiGenerating,
  fortuneSource,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      );
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full bg-[#090d1a]/90 backdrop-blur-md border-b border-cyan-500/20 sticky top-0 z-40 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo 与竞赛副标题 */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="relative p-2 rounded-lg bg-cyan-950/40 border border-cyan-400/40 shadow-neon-cyan flex items-center justify-center">
            <CyberCompassIcon size={26} className="text-cyan-400 animate-spin-slow" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-fuchsia-500 bg-clip-text text-transparent">
                CYBER FORTUNE
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono font-semibold">
                赛博账单算命师
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
              <span>高校AI创新应用开发赛</span>
              <span className="text-cyan-500">•</span>
              <span className="text-slate-300 flex items-center gap-1">
                <Terminal size={12} className="text-fuchsia-400" />
                Vibe Coding 全栈实验级
              </span>
              <span className="hidden sm:inline text-cyan-500">•</span>
              <span className="hidden sm:inline text-slate-500 font-mono">{timeStr}</span>
            </div>
          </div>
        </div>

        {/* 预设场景切换器 (一键即看核心亮点) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-lg border border-slate-700/60 self-stretch md:self-auto justify-center overflow-x-auto">
          {(['student', 'coder', 'moonlight'] as PresetType[]).map((key) => {
            const info = PRESET_INFO[key];
            const isActive = currentPreset === key;
            return (
              <button
                key={key}
                onClick={() => onSelectPreset(key)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-neon-cyan border border-cyan-300/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <QuantumChipIcon size={14} className={isActive ? 'text-white' : 'text-slate-500'} />
                <span>{info.name}</span>
              </button>
            );
          })}
        </div>

        {/* 顶部操作菜单栏 */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* AI 运行指示徽章 */}
          {fortuneSource && (
            <div
              className={`hidden lg:flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border ${
                fortuneSource === 'ai'
                  ? 'bg-fuchsia-950/60 border-fuchsia-500/50 text-fuchsia-300 shadow-neon-pink'
                  : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
              }`}
            >
              <Sparkles size={12} className={isAiGenerating ? 'animate-spin' : ''} />
              <span>{fortuneSource === 'ai' ? 'DeepSeek-V3 驱动' : '极速规则引擎'}</span>
            </div>
          )}

          {/* 导入账单按钮 */}
          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-600/60 text-xs font-medium text-slate-200 transition-all hover:border-cyan-400/50"
            title="导入微信/支付宝CSV或粘贴自定义记录"
          >
            <Upload size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">导入账单</span>
          </button>

          {/* 生成长图海报 */}
          <button
            onClick={onOpenPoster}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-xs font-medium text-white shadow-neon-pink transition-all"
            title="导出赛博签文分享海报"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">命盘海报</span>
          </button>

          {/* 竞赛设计文档与 Prompt 记录 */}
          <button
            onClick={onOpenVibeDocs}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-cyan-300 hover:text-cyan-200 transition-all"
            title="查看 Vibe Coding 架构与参赛 Prompt 工程"
          >
            <FileText size={14} />
            <span className="hidden md:inline">Vibe设计</span>
          </button>

          {/* API 配置 */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="大模型 API 与系统设置"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
