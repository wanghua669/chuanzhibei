import React, { useState } from 'react';
import { BillAnalytics, LLMConfig } from '../../types';
import { Scale, Swords, Gavel, ShieldAlert, Sparkles, Send, Award, Zap } from 'lucide-react';
import { sound } from '../../services/soundService';

interface CourtQuestScreenProps {
  analytics: BillAnalytics;
  llmConfig: LLMConfig;
}

export const CourtQuestScreen: React.FC<CourtQuestScreenProps> = ({ analytics, llmConfig }) => {
  const [activeSubTab, setActiveSubTab] = useState<'court' | 'quest'>('court');

  // 法庭状态
  const [itemName, setItemName] = useState('最新款客制化金属机械键盘');
  const [itemPrice, setItemPrice] = useState('899');
  const [itemReason, setItemReason] = useState('敲代码手感更好，提升工作效率');
  const [isJudging, setIsJudging] = useState(false);
  const [verdict, setVerdict] = useState<{
    status: '驳回' | '缓刑执行';
    prosecutorArg: string;
    judgeRuling: string;
    punishment: string;
  } | null>(null);

  // 地下城状态
  const hpTotal = Math.max(2000, analytics.totalIncome || 3000);
  const hpRemaining = Math.max(0, hpTotal - analytics.totalExpense);
  const hpRatio = Math.round((hpRemaining / hpTotal) * 100);

  const handleStartTrial = () => {
    sound.playAlert();
    setIsJudging(true);

    setTimeout(() => {
      sound.playSuccess();
      setIsJudging(false);
      const isRejected = parseFloat(itemPrice) > 300 || analytics.fiveScores.impulseBuyer > 60;
      setVerdict({
        status: isRejected ? '驳回' : '缓刑执行',
        prosecutorArg: `公诉人直击痛点：被告声称「买 ${itemName} 是为了提升效率」，经调取流水，被告上个月购买的外设目前闲置率高达 70%，且当前恩格尔系数已达 ${analytics.engelCoefficient}%。这是典型的「消费主义伪需求掩护懒惰」！`,
        judgeRuling: isRejected
          ? `法庭当庭裁定【驳回剁手申请】。即刻没收购买冲动，禁止在 72 小时内打开相关电商链接。`
          : `法庭裁定【准许缓刑执行】。本物品具备一定实用价值，但必须附加惩罚条件后方可解锁。`,
        punishment: isRejected
          ? '强制惩罚：罚做深蹲 30 个，并将 ￥' + itemPrice + ' 转入锁定存钱罐，退庭！'
          : '解锁条件：罚背英语单词 30 个，或连续 3 天自制午餐，方可执行付款。',
      });
    }, 1000);
  };

  // 生成的 TCG 现实战斗卡牌
  const tcgCards = [
    {
      title: '疯狂星期四·暴食法器',
      rarity: 'SSR 级贪欲卡',
      cost: '￥50.0',
      color: 'from-amber-600 to-red-600',
      effect: '造成 50 点现金流暴击，瞬间提升 30% 恩格尔系数，赋予一过性多巴胺。',
    },
    {
      title: '早八冰美式·苦涩续命剂',
      rarity: 'SR 级生存卡',
      cost: '￥9.9',
      color: 'from-blue-600 to-cyan-600',
      effect: '强制抵消早八困倦负面状态，但长期饮用可能对胃黏膜造成微量法术伤害。',
    },
    {
      title: '午夜暗影·打折入库卷轴',
      rarity: 'SSR 级冲动卡',
      cost: '￥198.0',
      color: 'from-purple-600 to-fuchsia-600',
      effect: '在子时触发「买了等于玩了」幻术，导致月底储蓄护盾产生严重裂隙。',
    },
  ];

  return (
    <div className="space-y-4 pb-20 font-mono text-xs">
      {/* 顶部二级切换 */}
      <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => {
            sound.playClick();
            setActiveSubTab('court');
          }}
          className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'court'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-neon-pink'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gavel size={14} />
          <span>赛博消费法庭 (审判)</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveSubTab('quest');
          }}
          className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'quest'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-neon-cyan'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Swords size={14} />
          <span>地下城战报 & TCG卡牌</span>
        </button>
      </div>

      {/* 视图 1: 赛博消费法庭 */}
      {activeSubTab === 'court' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-rose-400">
              <span className="flex items-center gap-1.5">
                <Gavel size={15} />
                消费主义公诉开庭登记
              </span>
              <span className="text-[10px] text-slate-500">CYBER COURT</span>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">拟购涉案物品</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-100 text-xs focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">涉案金额 (元)</label>
                <input
                  type="number"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-100 text-xs focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">被告辩护理由</label>
                <input
                  type="text"
                  value={itemReason}
                  onChange={(e) => setItemReason(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-100 text-xs focus:outline-none focus:border-rose-400"
                />
              </div>

              <button
                onClick={handleStartTrial}
                disabled={isJudging}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-neon-pink flex items-center justify-center gap-1.5 active:scale-98 transition-all"
              >
                <Gavel size={14} className={isJudging ? 'animate-bounce' : ''} />
                <span>{isJudging ? '法官与公诉人激烈辩驳中...' : '启动赛博开庭审判'}</span>
              </button>
            </div>
          </div>

          {/* 判决书 */}
          {verdict && (
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/50 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">赛博法庭民事裁决书</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    verdict.status === '驳回'
                      ? 'bg-red-950 text-red-300 border border-red-700'
                      : 'bg-amber-950 text-amber-300 border border-amber-700'
                  }`}
                >
                  【{verdict.status}】
                </span>
              </div>

              <div className="text-slate-300 text-[11px] leading-relaxed">
                <span className="text-rose-400 font-bold block mb-0.5">[公诉人抗辩]:</span>
                {verdict.prosecutorArg}
              </div>

              <div className="text-slate-300 text-[11px] leading-relaxed">
                <span className="text-cyan-400 font-bold block mb-0.5">[法庭判决结论]:</span>
                {verdict.judgeRuling}
              </div>

              <div className="p-2.5 rounded bg-rose-950/30 border border-rose-800/40 text-amber-300 text-[11px] font-bold">
                ⚖️ {verdict.punishment}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 视图 2: 地下城战报 & TCG 卡牌 */}
      {activeSubTab === 'quest' && (
        <div className="space-y-4">
          {/* 当月生命值 HP 卡片 */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <ShieldAlert size={14} />
                现实地下城生存血量 (HP)
              </span>
              <span className="text-white font-bold">{hpRemaining} / {hpTotal} HP</span>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  hpRatio > 50
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                    : hpRatio > 20
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-rose-600 to-red-600'
                }`}
                style={{ width: `${Math.min(100, hpRatio)}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>受创总额: -￥{analytics.totalExpense}</span>
              <span>剩余生存力: {hpRatio}%</span>
            </div>
          </div>

          {/* 掉落的 TCG 现实战力卡牌 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white px-1">
              <span className="flex items-center gap-1 text-fuchsia-400">
                <Award size={14} />
                账单掉落专属 TCG 战斗卡牌
              </span>
              <span className="text-[10px] text-slate-500">COLLECTIBLES</span>
            </div>

            <div className="space-y-2.5">
              {tcgCards.map((card, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 relative overflow-hidden group hover:border-cyan-400/50 transition-all"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${card.color} opacity-10 rounded-bl-full pointer-events-none`} />

                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-xs">{card.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-fuchsia-300 border border-slate-700 font-bold">
                      {card.rarity}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 leading-relaxed mb-2">
                    {card.effect}
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/80 font-mono">
                    <span className="text-slate-500">消耗法力: <span className="text-cyan-400 font-bold">{card.cost}</span></span>
                    <span className="text-slate-400">已收录于分身卡册</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
