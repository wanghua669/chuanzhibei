import React, { useState, useEffect } from 'react';
import { TransactionRecord, BillAnalytics } from '../../types';
import { parseCSVBill, parseQuickText } from '../../services/parser';
import {
  Upload,
  Receipt,
  Search,
  Sparkles,
  Radio,
  FileSpreadsheet,
  Trash2,
  CheckCircle2,
  Plus,
  Zap,
} from 'lucide-react';
import { sound } from '../../services/soundService';

interface SmartLedgerScreenProps {
  records: TransactionRecord[];
  analytics: BillAnalytics;
  onAddRecord: (rec: TransactionRecord) => void;
  onDeleteRecord: (id: string) => void;
  onBulkImport: (newRecords: TransactionRecord[]) => void;
}

export const SmartLedgerScreen: React.FC<SmartLedgerScreenProps> = ({
  records,
  analytics,
  onAddRecord,
  onDeleteRecord,
  onBulkImport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSimulatingLivePush, setIsSimulatingLivePush] = useState(false);
  const [pasteInput, setPasteInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // 微信实时推送模拟器 (每8秒模拟一笔真实微信扣款)
  useEffect(() => {
    if (!isSimulatingLivePush) return;

    const samplePool = [
      { name: '美团外卖-黄焖鸡米饭', amount: 21.5, cat: '餐饮美食', desc: '午餐外卖' },
      { name: '瑞幸咖啡-生椰拿铁', amount: 9.9, cat: '餐饮美食', desc: '早八续命' },
      { name: '哈啰单车-骑行代扣', amount: 1.5, cat: '交通出行', desc: '地铁接驳' },
      { name: '肯德基-热辣香骨鸡', amount: 19.9, cat: '餐饮美食', desc: '下午茶加餐' },
      { name: '京东到家-日用百货', amount: 35.8, cat: '居家日用', desc: '抽纸与洗发水' },
    ];

    const interval = setInterval(() => {
      const item = samplePool[Math.floor(Math.random() * samplePool.length)];
      sound.playSuccess();
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const isMidnight = now.getHours() >= 23 || now.getHours() < 5;

      const newRec: TransactionRecord = {
        id: `sim-${Date.now()}`,
        date: now.toISOString().slice(0, 10),
        time: timeStr,
        category: item.cat,
        counterparty: item.name,
        amount: item.amount,
        type: 'expense',
        description: item.desc,
        isMidnight,
        isImpulse: item.amount > 50,
      };

      onAddRecord(newRec);
      setImportStatus(`【微信支付扣款到账】: -￥${item.amount} (${item.name})`);
      setTimeout(() => setImportStatus(null), 3500);
    }, 8000);

    return () => clearInterval(interval);
  }, [isSimulatingLivePush, onAddRecord]);

  // 上传微信官方 CSV
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseCSVBill(content);
        if (parsed.length > 0) {
          sound.playSuccess();
          onBulkImport(parsed);
          setImportStatus(`成功同步微信官方账单 ${parsed.length} 笔流水！0 手动输入！`);
          setTimeout(() => setImportStatus(null), 4000);
        }
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  // 粘贴快捷提取
  const handleQuickPaste = () => {
    if (!pasteInput.trim()) return;
    const parsed = parseQuickText(pasteInput);
    if (parsed.length > 0) {
      sound.playSuccess();
      parsed.forEach((r) => onAddRecord(r));
      setPasteInput('');
      setImportStatus(`已从复制内容中提取并入账 ${parsed.length} 笔消费！`);
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  const filtered = records.filter(
    (r) =>
      r.counterparty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-20 font-mono text-xs">
      {/* 头部智能无感说明卡 */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/30 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <Receipt size={16} />
            微信支付无感智能对账中枢
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
            0 手动敲键
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          支持微信官方对账单 CSV 极速导入，或复制微信支付通知文本一秒解析，彻底解决手动记账烦恼！
        </p>
      </div>

      {/* 状态通知气泡 */}
      {importStatus && (
        <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* 功能卡 1: 微信官方账单 CSV 一键导入 */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-white">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <FileSpreadsheet size={15} />
            方式一：同步微信/支付宝官方账单文件
          </span>
        </div>

        <p className="text-[10px] text-slate-400 leading-relaxed">
          手机微信点击：<span className="text-slate-200">【我】→【服务】→【钱包】→【账单】→右上角【常见问题】→【下载账单】</span>，直接导入微信生成的明细文件：
        </p>

        <label className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-neon-cyan transition-all text-xs">
          <Upload size={14} />
          <span>选择微信导出的 CSV 账单文件 (全自动读入)</span>
          <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
        </label>
      </div>

      {/* 功能卡 2: 复制微信扣款通知一键识别 */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-white">
          <span className="flex items-center gap-1.5 text-fuchsia-400">
            <Sparkles size={15} />
            方式二：复制微信支付通知文本快速入账
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={pasteInput}
            onChange={(e) => setPasteInput(e.target.value)}
            placeholder="粘贴微信通知或记账，如: 肯德基 50元 或 瑞幸 9.9"
            className="flex-1 p-2 bg-slate-950 border border-slate-700 rounded text-slate-100 text-xs focus:outline-none focus:border-fuchsia-400"
          />
          <button
            onClick={handleQuickPaste}
            className="px-3.5 py-2 rounded bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs shrink-0 shadow-neon-pink"
          >
            智能入账
          </button>
        </div>
      </div>

      {/* 功能卡 3: 微信实时支付流模拟器 (演示杀手锏) */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Radio size={14} className={isSimulatingLivePush ? 'text-emerald-400 animate-pulse' : 'text-slate-500'} />
            <span>模拟微信支付实时流水广播 (Webhook 流)</span>
          </div>
          <div className="text-[10px] text-slate-400">
            开启后每隔几秒模拟一笔微信扣款，3D分身与图表动态联动
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setIsSimulatingLivePush(!isSimulatingLivePush);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            isSimulatingLivePush
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {isSimulatingLivePush ? '广播运行中' : '点击开启'}
        </button>
      </div>

      {/* 流水明细列表 */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-bold text-white text-xs">
            当前账本流水明细 ({filtered.length}/{records.length})
          </span>
          <div className="relative w-36">
            <Search size={12} className="absolute left-2.5 top-2 text-slate-500" />
            <input
              type="text"
              placeholder="搜索商户..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-2 py-1 bg-slate-900 border border-slate-800 rounded text-[11px] text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-0.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all"
            >
              <div className="space-y-0.5 truncate pr-2">
                <div className="font-bold text-white text-xs truncate flex items-center gap-1.5">
                  <span>{item.counterparty}</span>
                  {item.isMidnight && (
                    <span className="px-1 py-0.2 rounded bg-fuchsia-950 text-fuchsia-400 text-[9px] border border-fuchsia-800">
                      深夜
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-2">
                  <span>{item.date.slice(5)} {item.time.slice(0, 5)}</span>
                  <span className="text-cyan-400">#{item.category}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`font-mono font-bold text-xs ${
                    item.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                  }`}
                >
                  {item.type === 'income' ? `+￥${item.amount}` : `-￥${item.amount}`}
                </span>

                <button
                  onClick={() => {
                    sound.playAlert();
                    onDeleteRecord(item.id);
                  }}
                  className="p-1 rounded text-slate-500 hover:text-rose-400"
                  title="删除"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
