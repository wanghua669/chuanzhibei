import React, { useState } from 'react';
import { LLMConfig } from '../../types';
import { X, Settings, Key, Globe, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LLMConfig;
  onSaveConfig: (newConfig: LLMConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [baseURL, setBaseURL] = useState(config.baseURL);
  const [model, setModel] = useState(config.model);
  const [mode, setMode] = useState<LLMConfig['mode']>(config.mode);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle');
  const [testMsg, setTestMsg] = useState('');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMsg('正在向 DeepSeek API 节点发送测试握手请求...');

    try {
      const res = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: model || 'deepseek-chat',
          messages: [{ role: 'user', content: 'ping' }],
          max_tokens: 5,
        }),
      });

      if (res.ok) {
        setTestStatus('success');
        setTestMsg('DeepSeek API 握手成功！模型节点响应正常。');
      } else {
        const errorText = await res.text();
        setTestStatus('fail');
        setTestMsg(`API 响应异常 [HTTP ${res.status}]: ${errorText.slice(0, 100)}`);
      }
    } catch (err: any) {
      setTestStatus('fail');
      setTestMsg(`网络或跨域限制连接失败: ${err.message || '网络无法连通'}`);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      apiKey,
      baseURL,
      model,
      mode,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="cyber-box rounded-2xl w-full max-w-lg p-5 relative border border-cyan-400/40 shadow-2xl">
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-cyan-400" />
            <h3 className="text-base font-mono text-white font-bold">赛博大模型引擎配置</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 py-3 text-xs font-mono">
          {/* 运行模式 */}
          <div>
            <label className="text-slate-300 font-bold mb-1.5 block">推演引擎模式</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('ai')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  mode === 'ai'
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-neon-cyan'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold">DeepSeek 实时推理</div>
                <div className="text-[10px] text-slate-500 mt-0.5">调用大模型真实生成算命判词</div>
              </button>
              <button
                type="button"
                onClick={() => setMode('mock')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  mode === 'mock'
                    ? 'bg-fuchsia-950/80 border-fuchsia-400 text-fuchsia-300 shadow-neon-pink'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold">本地赛博规则引擎</div>
                <div className="text-[10px] text-slate-500 mt-0.5">0延迟纯离线，断网高保真保底</div>
              </button>
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="text-slate-300 font-bold mb-1 flex items-center gap-1">
              <Key size={13} className="text-cyan-400" />
              DeepSeek API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              默认已预填你的专属 DeepSeek API Key
            </span>
          </div>

          {/* Base URL */}
          <div>
            <label className="text-slate-300 font-bold mb-1 flex items-center gap-1">
              <Globe size={13} className="text-cyan-400" />
              API 接口端点 (Base URL)
            </label>
            <input
              type="text"
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Model */}
          <div>
            <label className="text-slate-300 font-bold mb-1 flex items-center gap-1">
              <Cpu size={13} className="text-cyan-400" />
              模型标识 (Model)
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* 测试连接提示 */}
          <div className="pt-1">
            <button
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30"
            >
              {testStatus === 'testing' ? '正在测试通信...' : '测试 API 连通性'}
            </button>
            {testMsg && (
              <div
                className={`mt-2 p-2 rounded text-xs flex items-center gap-1.5 ${
                  testStatus === 'success'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                }`}
              >
                {testStatus === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{testMsg}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <button onClick={onClose} className="px-3 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-white">
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-xs font-mono font-bold text-white shadow-neon-cyan transition-all"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};
