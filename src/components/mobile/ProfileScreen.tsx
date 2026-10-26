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
    <div className="pb-28 font-mono text-xs">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 左侧：手机软件内核与系统工具 (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* 头部卡 */}
          <div className="tech-card p-4 border-l-4 border-cyan-400 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Smartphone size={16} className="text-cyan-400" />
                手机软件内核与 HBuilder 打包设置
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                APP READY
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              已配置 HBuilder X App-plus 标准清单 (`manifest.json`) 与基路径相对引用
            </p>
          </div>

          {/* 模块 1: HBuilder X 手机打包指引卡 */}
          <div className="tech-card p-4 space-y-2.5">
            <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 pb-2 border-b border-white/5">
              <Smartphone size={14} />
              HBuilder X 手机打包流程说明
            </div>
            <div className="text-[11px] text-slate-300 leading-relaxed space-y-2">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-white/[0.06] text-cyan-300 flex items-center justify-center shrink-0 text-[10px]">1</span>
                <span>打开 HBuilder X，点击「文件」→「从本地目录导入」选择本项目的 <code className="text-cyan-300 bg-white/[0.05] px-1 py-0.5 rounded">dist</code> 目录。</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-white/[0.06] text-cyan-300 flex items-center justify-center shrink-0 text-[10px]">2</span>
                <span>根目录下已为您内置好标准的 <code className="text-cyan-300 bg-white/[0.05] px-1 py-0.5 rounded">manifest.json</code> 手机应用配置文件。</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-white/[0.06] text-cyan-300 flex items-center justify-center shrink-0 text-[10px]">3</span>
                <span>点击顶部「发行」→「原生 App-云打包」即可生成 Android APK 或 iOS 手机安装包！</span>
              </div>
            </div>
          </div>

          {/* 模块 3: 系统功能快速操作 */}
          <div className="tech-card p-4 space-y-2.5">
            <div className="text-xs font-bold text-white mb-1 pb-2 border-b border-white/5">系统实用工具与竞赛文档</div>

            <button
              onClick={handleToggleSound}
              className="w-full p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 flex items-center justify-between text-slate-300 transition-all text-xs group"
            >
              <span className="flex items-center gap-2.5">
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-cyan-400 group-hover:scale-110 transition-transform" />}
                <span>原生合成音效反馈系统</span>
              </span>
              <span className="text-cyan-400 font-bold">{isMuted ? '已静音' : '开启中'}</span>
            </button>

            <button
              onClick={onOpenVibeDocs}
              className="w-full p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 flex items-center justify-between text-slate-300 transition-all text-xs group"
            >
              <span className="flex items-center gap-2.5">
                <FileCode2 size={15} className="text-fuchsia-400 group-hover:scale-110 transition-transform" />
                <span>查看 Vibe Coding 研发全记录文档</span>
              </span>
              <span className="text-fuchsia-400 font-bold">评审佐证</span>
            </button>
          </div>
        </div>

        {/* 右侧：DeepSeek 大模型配置中枢 (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="tech-card p-4 space-y-3.5">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 pb-2 border-b border-white/5">
              <Key size={14} className="text-amber-400" />
              DeepSeek-V3 决策中枢配置
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/70 border border-white/10 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-400 transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">运行模式</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-white/10 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-400 transition-all font-mono"
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
                    className="w-full px-3 py-2 bg-slate-950/70 border border-white/10 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-400 transition-all font-mono"
                  >
                    <option value="deepseek-chat">deepseek-chat</option>
                    <option value="deepseek-flash">deepseek-flash</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={handleTest}
                  disabled={testStatus === 'testing'}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-cyan-300 font-bold border border-white/10 text-xs active:scale-95 transition-all"
                >
                  {testStatus === 'testing' ? '握手中...' : '测试 API 连通性'}
                </button>

                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(0,242,254,0.25)] active:scale-95 transition-all"
                >
                  保存参数
                </button>
              </div>

              {testMsg && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    testStatus === 'success'
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950/50 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {testStatus === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  <span>{testMsg}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
