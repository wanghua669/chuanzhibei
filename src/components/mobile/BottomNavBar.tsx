import React from 'react';
import { Bot, Compass, Scale, Receipt, Settings } from 'lucide-react';
import { sound } from '../../services/soundService';

export type MobileTab = 'pet' | 'parallel' | 'court' | 'ledger' | 'settings';

interface BottomNavBarProps {
  currentTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  recordCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  recordCount,
}) => {
  const tabs = [
    { id: 'pet' as MobileTab, label: '3D分身', icon: Bot, badge: '3D' },
    { id: 'parallel' as MobileTab, label: '平行时空', icon: Compass },
    { id: 'court' as MobileTab, label: '法庭战报', icon: Scale },
    { id: 'ledger' as MobileTab, label: '微信对账', icon: Receipt, badge: `${recordCount}` },
    { id: 'settings' as MobileTab, label: '我的设置', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-lg select-none">
      <div className="bg-[#0e1320]/85 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(0,242,254,0.12)] flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onSelectTab(tab.id);
              }}
              className={`flex-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 group ${
                isActive
                  ? 'text-cyan-300 font-bold bg-white/[0.06] shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
              )}

              <div className="relative">
                <Icon
                  size={19}
                  className={`transition-all duration-200 ${
                    isActive
                      ? 'scale-110 text-cyan-300 drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3.5 text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold shadow-sm ${
                      tab.badge === '3D'
                        ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white'
                        : 'bg-slate-800/90 text-cyan-300 border border-white/10'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] font-mono mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
