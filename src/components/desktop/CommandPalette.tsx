import React, { useState, useEffect } from 'react';
import { SoftwareView, PresetType } from '../../types';
import {
  Search,
  LayoutDashboard,
  LineChart,
  MessageSquareCode,
  TableProperties,
  Sparkles,
  Settings,
  Upload,
  RefreshCw,
  Volume2,
  X,
  FileCode2,
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: SoftwareView) => void;
  onSelectPreset: (preset: PresetType) => void;
  onOpenImport: () => void;
  onRefreshDiagnosis: () => void;
  onOpenVibeDocs: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onSelectPreset,
  onOpenImport,
  onRefreshDiagnosis,
  onOpenVibeDocs,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          sound.playClick();
          // open
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'v-cockpit', label: '打开 赛博总控驾驶舱', group: '导航', icon: LayoutDashboard, run: () => onSelectView('cockpit') },
    { id: 'v-analytics', label: '打开 深度数据透视工坊', group: '导航', icon: LineChart, run: () => onSelectView('analytics') },
    { id: 'v-chat', label: '打开 AI 命理大师实时问诊终端', group: '导航', icon: MessageSquareCode, run: () => onSelectView('chat') },
    { id: 'v-ledger', label: '打开 全资产账单明细流水网格', group: '导航', icon: TableProperties, run: () => onSelectView('ledger') },
    { id: 'v-poster', label: '打开 签文海报设计所', group: '导航', icon: Sparkles, run: () => onSelectView('poster') },
    { id: 'v-settings', label: '打开 内核引擎与参数配置', group: '导航', icon: Settings, run: () => onSelectView('settings') },

    { id: 'p-student', label: '切换预设: 当代大学生特种兵 (食堂/疯狂星期四/拼好饭)', group: '预设场景', icon: Sparkles, run: () => onSelectPreset('student') },
    { id: 'p-coder', label: '切换预设: 苦逼赛博攻城狮 (云服务器/客制化外设/夜间打车)', group: '预设场景', icon: Sparkles, run: () => onSelectPreset('coder') },
    { id: 'p-moonlight', label: '切换预设: 精致月光打工人 (精品咖啡/盲盒潮玩/微醺小酒)', group: '预设场景', icon: Sparkles, run: () => onSelectPreset('moonlight') },

    { id: 'a-refresh', label: '重新调用 DeepSeek 进行命盘推演', group: '快捷动作', icon: RefreshCw, run: onRefreshDiagnosis },
    { id: 'a-import', label: '导入 微信/支付宝 CSV 账单或粘贴记账', group: '快捷动作', icon: Upload, run: onOpenImport },
    { id: 'a-vibe', label: '查看 Vibe Coding 全栈工程评审报告', group: '快捷动作', icon: FileCode2, run: onOpenVibeDocs },
    { id: 'a-sound', label: '切换系统合成音效开关', group: '快捷动作', icon: Volume2, run: () => sound.toggleMute() },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) || a.group.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="cyber-box rounded-2xl w-full max-w-xl p-4 relative border border-cyan-400/50 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        {/* 搜索框 */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <Search size={18} className="text-cyan-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入指令、模块名或预设场景 (例如: 驾驶舱, 攻城狮, 刷新, 声音)..."
            className="w-full bg-transparent text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded text-slate-500 hover:text-white">
            <X size={16} />
          </button>
        </div>

        {/* 指令列表 */}
        <div className="mt-3 max-h-80 overflow-y-auto space-y-1 font-mono text-xs">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-500">未检索到匹配的系统指令</div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    item.run();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 text-left text-slate-300 hover:text-cyan-300 transition-all group border border-transparent hover:border-cyan-500/30"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon size={15} className="text-slate-500 group-hover:text-cyan-400 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 shrink-0">
                    {item.group}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* 底部提示 */}
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>提示：按 ESC 或点击空白处关闭</span>
          <span>CYBER COMMAND PALETTE</span>
        </div>
      </div>
    </div>
  );
};
