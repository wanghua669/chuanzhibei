import React, { useState } from 'react';
import { TransactionRecord, PresetType } from '../../types';
import { parseCSVBill, parseQuickText } from '../../services/parser';
import { PRESET_INFO } from '../../services/presetData';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import { QuantumChipIcon } from '../common/CyberIcons';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportRecords: (records: TransactionRecord[], sourceName: string) => void;
  onSelectPreset: (preset: PresetType) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportRecords,
  onSelectPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'csv' | 'text' | 'preset'>('preset');
  const [pastedText, setPastedText] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedPreview, setParsedPreview] = useState<TransactionRecord[]>([]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const records = parseCSVBill(content);
        setParsedPreview(records);
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleParseText = () => {
    if (!pastedText.trim()) return;
    const records = parseQuickText(pastedText);
    setParsedPreview(records);
  };

  const handleConfirmImport = () => {
    if (parsedPreview.length > 0) {
      onImportRecords(parsedPreview, fileName || '自定义导入数据');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="cyber-box rounded-2xl w-full max-w-xl p-5 relative border border-cyan-400/40 shadow-2xl">
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        {/* 标题 */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-cyan-400" />
            <h3 className="text-base font-mono text-white font-bold">导入与切换数据源</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* 标签栏 */}
        <div className="flex gap-2 my-3 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-1.5 rounded transition-all ${
              activeTab === 'preset'
                ? 'bg-cyan-600 text-white font-bold shadow-neon-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            一键载入场景样本
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`flex-1 py-1.5 rounded transition-all ${
              activeTab === 'csv'
                ? 'bg-cyan-600 text-white font-bold shadow-neon-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            上传 CSV 账单
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-1.5 rounded transition-all ${
              activeTab === 'text'
                ? 'bg-cyan-600 text-white font-bold shadow-neon-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            粘贴记账文本
          </button>
        </div>

        {/* Tab 1: 预设样本 */}
        {activeTab === 'preset' && (
          <div className="space-y-3 py-2">
            <p className="text-xs text-slate-400 font-mono">
              比赛评审推荐：直接点击载入典型场景，0门槛秒级体验全链路：
            </p>
            {(['student', 'coder', 'moonlight'] as PresetType[]).map((key) => {
              const info = PRESET_INFO[key];
              return (
                <div
                  key={key}
                  onClick={() => {
                    onSelectPreset(key);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-cyan-400/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-cyan-300 flex items-center gap-2">
                      <QuantumChipIcon size={14} className="text-cyan-400" />
                      {info.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-1">{info.desc}</div>
                  </div>
                  <button className="px-3 py-1.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-xs font-mono group-hover:bg-cyan-600 group-hover:text-white transition-all whitespace-nowrap">
                    立即载入
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: CSV 上传 */}
        {activeTab === 'csv' && (
          <div className="py-2">
            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-400/60 rounded-xl p-6 text-center transition-all bg-slate-900/40">
              <Upload size={32} className="mx-auto text-slate-500 mb-2" />
              <p className="text-xs text-slate-300 font-mono mb-1">
                支持导入 微信支付 / 支付宝 导出的 CSV 明细账单
              </p>
              <p className="text-[11px] text-slate-500 mb-4">
                数据全在本地浏览器完成清洗解析，无任何服务器上传，保障个人隐私
              </p>
              <label className="inline-block px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold cursor-pointer shadow-neon-cyan transition-all">
                选择 CSV 文件
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            {fileName && (
              <div className="mt-3 p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-300">
                <span>已解析文件: {fileName}</span>
                <span className="text-emerald-400 font-bold">{parsedPreview.length} 条有效记录</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: 快速粘贴记账 */}
        {activeTab === 'text' && (
          <div className="py-2 space-y-2">
            <p className="text-xs text-slate-400 font-mono">
              直接粘贴多行记账文本，系统将智能提取日期、商户与金额：
            </p>
            <textarea
              rows={5}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="示例：&#10;10-01 肯德基疯狂星期四 50元&#10;10-02 瑞幸生椰拿铁 9.9&#10;10-03 深夜烧烤 68元 烤冷面"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleParseText}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-cyan-500/30"
            >
              执行智能匹配提取
            </button>
            {parsedPreview.length > 0 && (
              <div className="p-2 rounded bg-slate-900 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                成功提取到 {parsedPreview.length} 笔消费记录！
              </div>
            )}
          </div>
        )}

        {/* 底部按钮 */}
        {activeTab !== 'preset' && (
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800 mt-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-white"
            >
              取消
            </button>
            <button
              onClick={handleConfirmImport}
              disabled={parsedPreview.length === 0}
              className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-xs font-mono font-bold text-white shadow-neon-cyan transition-all"
            >
              确定导入并渲染大屏
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
