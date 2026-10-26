import React, { useState } from 'react';
import { TransactionRecord } from '../types';
import { Search, Moon } from 'lucide-react';
import { QuantumChipIcon } from './common/CyberIcons';

interface TransactionListProps {
  records: TransactionRecord[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyMidnight, setOnlyMidnight] = useState(false);

  const categories = ['all', ...Array.from(new Set(records.map((r) => r.category)))];

  const filteredRecords = records.filter((rec) => {
    const matchSearch =
      rec.counterparty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || rec.category === selectedCategory;
    const matchMidnight = !onlyMidnight || rec.isMidnight;
    return matchSearch && matchCategory && matchMidnight;
  });

  return (
    <div className="cyber-box rounded-xl p-4 lg:p-5 relative">
      <div className="cyber-corner cyber-corner-tl" />
      <div className="cyber-corner cyber-corner-tr" />
      <div className="cyber-corner cyber-corner-bl" />
      <div className="cyber-corner cyber-corner-br" />

      {/* 头部与过滤栏 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <QuantumChipIcon size={18} className="text-cyan-400" />
          <h3 className="text-sm font-mono text-cyan-300 font-bold tracking-wide">
            账单流水溯源表 ({filteredRecords.length}/{records.length})
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* 搜索框 */}
          <div className="relative flex-1 md:w-44">
            <Search size={13} className="absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="搜索商户/备注..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 bg-slate-900/90 border border-slate-700 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          {/* 分类下拉 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2 py-1.5 bg-slate-900/90 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? '全部分类' : c}
              </option>
            ))}
          </select>

          {/* 深夜筛选开关 */}
          <button
            onClick={() => setOnlyMidnight(!onlyMidnight)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-mono border transition-all ${
              onlyMidnight
                ? 'bg-fuchsia-950/80 border-fuchsia-500 text-fuchsia-300'
                : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon size={12} className={onlyMidnight ? 'text-fuchsia-400' : 'text-slate-500'} />
            <span>只看深夜</span>
          </button>
        </div>
      </div>

      {/* 流水明细列表 */}
      <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900/80 text-slate-400 sticky top-0 border-b border-slate-800">
            <tr>
              <th className="py-2 px-3">时序 / 标记</th>
              <th className="py-2 px-3">商户 / 交易对象</th>
              <th className="py-2 px-3">领域分类</th>
              <th className="py-2 px-3">详细描述</th>
              <th className="py-2 px-3 text-right">流向金额</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  未检索到符合条件的账单流水
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span>{item.date.slice(5)} {item.time.slice(0, 5)}</span>
                      {item.isMidnight && (
                        <span className="px-1 py-0.2 rounded bg-fuchsia-950 text-fuchsia-400 text-[10px] border border-fuchsia-800/60" title="深夜消费">
                          夜
                        </span>
                      )}
                      {item.isImpulse && (
                        <span className="px-1 py-0.2 rounded bg-rose-950 text-rose-400 text-[10px] border border-rose-800/60" title="冲动大额">
                          冲
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                    {item.counterparty}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700/60 text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">
                    {item.description}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-bold whitespace-nowrap ${item.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                    {item.type === 'income' ? `+￥${item.amount}` : `-￥${item.amount}`}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
