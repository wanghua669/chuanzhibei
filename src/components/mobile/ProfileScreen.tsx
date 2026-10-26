import React, { useState } from 'react';
import { LLMConfig, PresetType } from '../../types';
import { Settings, Key, Cpu, CheckCircle2, AlertCircle, FileCode2, RefreshCw, Smartphone, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../../services/soundService';

interface ProfileScreenProps {
  config: LLMConfig;
  onSaveConfig: (newConfig: LLMConfig) => void;
  onReloadPreset: (preset: PresetType) => void;
  onOpenVibeDocs: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  config,
  onSaveConfig,
  onReloadPreset,
  onOpenVibeDocs,
}) => {
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [model, setModel] = useState(config.model);
  const [mode, setMode] = useState<LLMConfig['mode']>(config.mode);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle');
  const [testMsg, setTestMsg] = useState('');
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleTest = async () => {
    sound.playClick();
    setTestStatus('testing');
    setTestMsg('正在测试 DeepSeek 节点连通性...');

    try {
      const res = await fetch(config.baseURL || 'https://api.deepseek.com/chat/completions', {
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
        sound.playSuccess();
        setTestStatus('success');
        setTestMsg('DeepSeek API 握手成功 (HTTP 200 OK)！');
      } else {
        sound.playAlert();
        setTestStatus('fail');
        setTestMsg(`API 响应异常 [HTTP ${res.status}]`);
      }
    } catch (e: any) {
      sound.playAlert();
      setTestStatus('fail');
      setTestMsg(`连接超时或受限: ${e.message}`);
    }
  };

  const handleSave = () => {
    sound.playSuccess();
    onSaveConfig({
      ...config,
      apiKey,
      model,
      mode,
    });
  };

  const handleToggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  return (
    <div className="space-y-4 pb-20 font-mono text-xs">
      {/* 头部卡 */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Smartphone size={16} className="text-cyan-400" />
            手机软件内核与 HBuilder 打包设置
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
            APP READY
          </span>
        </div>
        <p className="text-[10px] text-slate-400">
          已配置 HBuilder X App-plus 标准清单 (`manifest.json`) 与基路径相对引用
        </p>
      </div>

      {/* 模块 1: HBuilder X 手机打包指引卡 */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-2">
        <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
          <Smartphone size={14} />
          HBuilder X 手机打包说明
        </div>
        <div className="text-[11px] text-slate-300 leading-relaxed space-y-1">
          <div>1. 打开 HBuilder X，点击「文件」→「从本地目录导入」选择本项目的 <code className="text-cyan-400">dist</code> 目录。</div>
          <div>2. 根目录下已为您内置好标准的 <code className="text-cyan-400">manifest.json</code> 手机应用配置文件。</div>
          <div>3. 点击顶部「发行」→「原生 App-云打包」即可生成 Android APK 或 iOS 手机安装包！</div>
        </div>
      </div>

      {/* 模块 2: DeepSeek 大模型配置 */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="text-xs font-bold text-white flex items-center gap-1.5">
          <Key size={14} className="text-amber-400" />
          DeepSeek-V3 决策中枢配置
        </div>

        <div className="space-y-2.5">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">运行模式</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="ai">DeepSeek 实时推理</option>
                <option value="mock">离线规则保底</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">模型</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="deepseek-chat">deepseek-chat</option>
                <option value="deepseek-flash">deepseek-flash</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleTest}
              disabled={testStatus === 'testing'}
              className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 text-xs"
            >
              {testStatus === 'testing' ? '握手中...' : '测试 API 连通性'}
            </button>

            <button
              onClick={handleSave}
              className="flex-1 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-neon-cyan"
            >
              保存参数
            </button>
          </div>

          {testMsg && (
            <div
              className={`p-2 rounded text-xs flex items-center gap-1.5 ${
                testStatus === 'success'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {testStatus === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
              <span>{testMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* 模块 3: 系统功能快速操作 */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="text-xs font-bold text-white mb-2">系统实用工具</div>

        <button
          onClick={handleToggleSound}
          className="w-full p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-300 transition-all text-xs"
        >
          <span className="flex items-center gap-2">
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-cyan-400" />}
            <span>原生合成音效反馈</span>
          </span>
          <span className="text-cyan-400 font-bold">{isMuted ? '已静音' : '开启中'}</span>
        </button>

        <button
          onClick={onOpenVibeDocs}
          className="w-full p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-slate-300 transition-all text-xs"
        >
          <span className="flex items-center gap-2">
            <FileCode2 size={15} className="text-fuchsia-400" />
            <span>查看 Vibe Coding 研发全记录文档</span>
          </span>
          <span className="text-fuchsia-400 font-bold">评审佐证</span>
        </button>
      </div>
    </div>
  );
};
