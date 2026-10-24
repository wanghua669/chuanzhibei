import React from 'react';
import { SoftwareView } from '../../types';
import {
  LayoutDashboard,
  LineChart,
  MessageSquareCode,
  TableProperties,
  Sparkles,
  Settings,
  Upload,
  FileCode2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface SidebarProps {
  currentView: SoftwareView;
  onSelectView: (view: SoftwareView) => void;
  recordCount: number;
  onOpenImport: () => void;
  onOpenVibeDocs: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  recordCount,
  onOpenImport,
  onOpenVibeDocs,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    {
      id: 'cockpit' as SoftwareView,
      label: '驾驶舱',
      fullName: '赛博驾驶舱',
      desc: '命盘总览 & 核心指标',
      icon: LayoutDashboard,
    },
    {
      id: 'analytics' as SoftwareView,
      label: '透视工坊',
      fullName: '数据透视工坊',
      desc: '时钟/环图/异常脉冲',
      icon: LineChart,
    },
    {
      id: 'chat' as SoftwareView,
      label: 'AI 问诊',
      fullName: 'AI 命理大师问诊',
      desc: 'DeepSeek 交互追问',
      icon: MessageSquareCode,
      badge: 'LIVE',
    },
    {
      id: 'ledger' as SoftwareView,
      label: '流水明细',
      fullName: '全资产账单明细',
      desc: '专业级数据对账网格',
      icon: TableProperties,
      badge: `${recordCount}`,
    },
    {
      id: 'poster' as SoftwareView,
      label: '签文工坊',
      fullName: '签文海报设计所',
      desc: '高清长图与官方认证印',
      icon: Sparkles,
    },
    {
      id: 'settings' as SoftwareView,
      label: '引擎配置',
      fullName: '内核与引擎配置',
      desc: 'API Key & 模式切换',
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`bg-[#080d19] border-r border-cyan-500/15 flex flex-col justify-between transition-all duration-300 z-20 shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* 顶部主导航列表 */}
      <div className="p-2 space-y-1">
        <div className={`px-2 py-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-widest ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? 'APP' : 'WORKSPACES // 模块'}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                onSelectView(item.id);
              }}
              title={isCollapsed ? item.fullName : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-all text-left group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/50 text-cyan-300 border border-cyan-400/40 shadow-neon-cyan font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
              )}

              <Icon
                size={18}
                className={`shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 truncate">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          item.id === 'chat'
                            ? 'bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-700/60'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5 font-normal">
                    {item.desc}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 底部辅助操作区 */}
      <div className="p-2 border-t border-slate-800/80 space-y-1">
        {/* 导入账单入口 */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenImport();
          }}
          title={isCollapsed ? '导入账单' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all"
        >
          <Upload size={16} className="text-cyan-400 shrink-0" />
          {!isCollapsed && <span className="truncate">导入/切换数据源</span>}
        </button>

        {/* 竞赛 Vibe 设计文档 */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenVibeDocs();
          }}
          title={isCollapsed ? 'Vibe Coding 架构' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-cyan-300 bg-slate-900/30 hover:bg-slate-800/50 border border-slate-800/60 transition-all"
        >
          <FileCode2 size={16} className="text-fuchsia-400 shrink-0" />
          {!isCollapsed && <span className="truncate">Vibe Coding 架构</span>}
        </button>

        {/* 折叠/展开侧边栏 */}
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900/60 transition-all"
          title={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
};
