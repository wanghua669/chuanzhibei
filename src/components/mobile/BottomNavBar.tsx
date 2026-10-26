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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070b16]/95 backdrop-blur-lg border-t border-cyan-500/20 pb-[max(env(safe-area-inset-bottom),8px)] pt-1 px-2 select-none">
      <div className="max-w-md mx-auto flex items-center justify-around">
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
              className={`flex-1 py-1 flex flex-col items-center justify-center relative transition-all ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
              )}

              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,242,254,0.6)]' : ''
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[9px] font-mono px-1 py-0.2 rounded-full font-bold ${
                      tab.badge === '3D'
                        ? 'bg-fuchsia-600 text-white'
                        : 'bg-slate-800 text-cyan-300 border border-slate-700'
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
