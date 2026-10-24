import React, { useState } from 'react';
import { TransactionRecord, BillAnalytics } from '../../types';
import {
  Search,
  Moon,
  Plus,
  Download,
  Upload,
  Trash2,
  Calendar,
  CreditCard,
  CheckCircle2,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface LedgerViewProps {
  records: TransactionRecord[];
  analytics: BillAnalytics;
  onAddRecord: (rec: TransactionRecord) => void;
  onDeleteRecord: (id: string) => void;
  onOpenImport: () => void;
}

export const LedgerView: React.FC<LedgerViewProps> = ({
  records,
  analytics,
  onAddRecord,
  onDeleteRecord,
  onOpenImport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyMidnight, setOnlyMidnight] = useState(false);
  const [onlyImpulse, setOnlyImpulse] = useState(false);

  // 新增流水弹窗
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCounterparty, setNewCounterparty] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('餐饮美食');
  const [newType, setNewType] = useState<'expense' | 'income'>('expense');
  const [newDesc, setNewDesc] = useState('');
  const [newTime, setNewTime] = useState('12:30:00');

  const categories = ['all', '餐饮美食', '数码数码', '休闲娱乐', '交通出行', '学习提升', '医疗保健', '居家日用', '充值理财'];

  const filteredRecords = records.filter((rec) => {
    const matchSearch =
      rec.counterparty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'all' || rec.category === selectedCategory;
    const matchMidnight = !onlyMidnight || rec.isMidnight;
    const matchImpulse = !onlyImpulse || rec.isImpulse;
    return matchSearch && matchCategory && matchMidnight && matchImpulse;
  });

  // 导出为 CSV 账单
  const handleExportCSV = () => {
    sound.playSuccess();
    const headers = ['流水号,交易日期,交易时间,领域分类,交易对方,收支类型,金额,商品说明,深夜标记,冲动标记'];
    const rows = records.map((r) =>
      `"${r.id}","${r.date}","${r.time}","${r.category}","${r.counterparty}","${r.type === 'income' ? '收入' : '支出'}","${r.amount}","${r.description}","${r.isMidnight ? '是' : '否'}","${r.isImpulse ? '是' : '否'}"`
    );
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n'); // 带 BOM 防止 Excel 乱码
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberFortune_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(newAmount);
    if (!newCounterparty || isNaN(amountNum) || amountNum <= 0) return;

    sound.playSuccess();
    const today = new Date().toISOString().slice(0, 10);
    const hour = parseInt(newTime.split(':')[0] || '12', 10);
    const isMidnight = hour >= 23 || hour < 5;
    const isImpulse = amountNum >= 180 || (isMidnight && amountNum >= 50);

    const rec: TransactionRecord = {
      id: `man-${Date.now()}`,
      date: today,
      time: newTime,
      category: newCategory,
      counterparty: newCounterparty,
      amount: Math.round(amountNum * 100) / 100,
      type: newType,
      description: newDesc || newCounterparty,
      isMidnight,
      isImpulse,
    };

    onAddRecord(rec);
    setIsAddModalOpen(false);
    setNewCounterparty('');
    setNewAmount('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* 头部摘要栏 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black font-mono tracking-wider text-white flex items-center gap-2">
            <FileSpreadsheet size={22} className="text-emerald-400" />
            全资产流水账单网格与数据对账
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            ASSET LEDGER // 提供桌面级增删查改、时序筛选、Excel/CSV 双向导出与即时对账
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={onOpenImport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
          >
            <Upload size={14} className="text-cyan-400" />
            <span>导入 CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all hover:border-emerald-500/50"
          >
            <Download size={14} className="text-emerald-400" />
            <span>导出 CSV</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-neon-cyan transition-all"
          >
            <Plus size={14} />
            <span>+ 录入新流水</span>
          </button>
        </div>
      </div>

      {/* 汇总指标栏 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-slate-500 text-[10px]">有效流水总数</div>
          <div className="text-lg font-black text-white mt-0.5">{records.length} 笔</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-slate-500 text-[10px]">累计流出金额</div>
          <div className="text-lg font-black text-cyan-400 mt-0.5">￥{analytics.totalExpense}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-slate-500 text-[10px]">累计流入总额</div>
          <div className="text-lg font-black text-emerald-400 mt-0.5">￥{analytics.totalIncome}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-slate-500 text-[10px]">当期净结余</div>
          <div className={`text-lg font-black mt-0.5 ${analytics.netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ￥{analytics.netSavings}
          </div>
        </div>
      </div>

      {/* 过滤与搜索工具栏 */}
      <div className="cyber-box rounded-xl p-4 relative">
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="按商户名或备注检索流水..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? '全部分类' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs">
            <button
              onClick={() => setOnlyMidnight(!onlyMidnight)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                onlyMidnight
                  ? 'bg-fuchsia-950/80 border-fuchsia-500 text-fuchsia-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon size={13} className={onlyMidnight ? 'text-fuchsia-400' : 'text-slate-500'} />
              <span>只看深夜 (23-05点)</span>
            </button>

            <button
              onClick={() => setOnlyImpulse(!onlyImpulse)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                onlyImpulse
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>只看突发冲动</span>
            </button>
          </div>
        </div>

        {/* 数据对账表格 */}
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-950/90 text-slate-400 sticky top-0 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">流水时序 / 标记</th>
                <th className="py-2.5 px-3">交易商户 / 渠道</th>
                <th className="py-2.5 px-3">领域分类</th>
                <th className="py-2.5 px-3">详细描述</th>
                <th className="py-2.5 px-3">收支属性</th>
                <th className="py-2.5 px-3 text-right">金额 (￥)</th>
                <th className="py-2.5 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    未检索到符合条件的消费流水
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 whitespace-nowrap text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span>{item.date} {item.time}</span>
                        {item.isMidnight && (
                          <span className="px-1.5 py-0.2 rounded bg-fuchsia-950 text-fuchsia-400 text-[10px] border border-fuchsia-800/60">
                            深夜
                          </span>
                        )}
                        {item.isImpulse && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 text-[10px] border border-rose-800/60">
                            冲动
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                      {item.counterparty}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-slate-700/60 text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          item.type === 'income'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {item.type === 'income' ? '入账' : '支出'}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-mono font-bold whitespace-nowrap ${
                        item.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                      }`}
                    >
                      {item.type === 'income' ? `+￥${item.amount}` : `-￥${item.amount}`}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => {
                          sound.playAlert();
                          onDeleteRecord(item.id);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-all"
                        title="删除该条记录"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 新增流水弹窗 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="cyber-box rounded-2xl w-full max-w-md p-5 relative border border-cyan-400/50 shadow-2xl font-mono text-xs">
            <div className="cyber-corner cyber-corner-tl" />
            <div className="cyber-corner cyber-corner-tr" />
            <div className="cyber-corner cyber-corner-bl" />
            <div className="cyber-corner cyber-corner-br" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus size={16} className="text-cyan-400" />
                录入新账单流水节点
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-3.5 my-4">
              <div>
                <label className="text-slate-300 block mb-1">商户 / 交易对象</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 麦当劳、Steam、瑞幸咖啡"
                  value={newCounterparty}
                  onChange={(e) => setNewCounterparty(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">金额 (元)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">交易时间 (HH:mm:ss)</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">领域分类</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    {categories.filter((c) => c !== 'all').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">收支属性</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="expense">支出 (-)</option>
                    <option value="income">收入 (+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">备注说明 (可选)</label>
                <input
                  type="text"
                  placeholder="例如: 午餐穷鬼套餐加脆汁鸡"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded text-slate-400 hover:text-white"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 font-bold text-white shadow-neon-cyan transition-all"
                >
                  确认录入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
