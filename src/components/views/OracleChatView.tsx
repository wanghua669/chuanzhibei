import React, { useState, useRef, useEffect } from 'react';
import { BillAnalytics, FortuneDiagnosis, LLMConfig, ChatMessage } from '../../types';
import { sendChatMessageToDeepSeek } from '../../services/chatService';
import {
  CyberCompassIcon,
  QuantumChipIcon,
  CyberAmuletIcon,
} from '../common/CyberIcons';
import { Send, Trash2, Sparkles, Bot, User, RefreshCw, Terminal } from 'lucide-react';
import { sound } from '../../services/soundService';

interface OracleChatViewProps {
  analytics: BillAnalytics;
  fortune: FortuneDiagnosis | null;
  llmConfig: LLMConfig;
}

export const OracleChatView: React.FC<OracleChatViewProps> = ({
  analytics,
  fortune,
  llmConfig,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-0',
      role: 'assistant',
      content: `赛博门人已就绪。吾已解析尔之账单：命格为「${fortune?.cyberTitle || '赛博行者'}」，恩格尔系数 ${analytics.engelCoefficient}%，深夜消费占比 ${analytics.midnightExpenseRatio}%。施主有何财务困惑或命理疑虑，尽管直言，吾必以毒舌与真知指引迷津。`,
      timestamp: '刚刚',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const quickPrompts = [
    '大师，下周四怎么克制疯狂星期四？',
    '帮我制定一个下月的止损存钱应急计划',
    '为什么我总是在半夜产生冲动消费？',
    '我命盘里最严重的破财黑洞是什么？',
    '我适合养什么数码宠物来镇财？',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isSending) return;

    sound.playClick();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toTimeString().slice(0, 5),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsSending(true);

    try {
      const reply = await sendChatMessageToDeepSeek(text, messages, analytics, fortune, llmConfig);
      sound.playSuccess();
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toTimeString().slice(0, 5),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      sound.playAlert();
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = () => {
    sound.playClick();
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: `命盘对话已重启清零。当前监测到你的结余为 ￥${analytics.netSavings}。请发问。`,
        timestamp: '刚刚',
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      {/* 左侧：命盘当前状态上下文卡片 */}
      <div className="lg:w-80 cyber-box rounded-xl p-4 relative flex flex-col justify-between shrink-0">
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        <div className="space-y-4 font-mono">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <CyberAmuletIcon size={20} className="text-amber-400" />
            <div>
              <h3 className="text-xs font-bold text-white">ORACLE CONTEXT</h3>
              <p className="text-[10px] text-slate-500">命理推演实时环境</p>
            </div>
          </div>

          {/* 命盘封号徽标 */}
          <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/30">
            <div className="text-[10px] text-cyan-400 font-bold mb-1">当前推演命盘</div>
            <div className="text-sm font-black text-white text-glow-cyan">
              {fortune?.cyberTitle || '赛博行者'}
            </div>
            <div className="text-[11px] text-fuchsia-400 font-bold mt-1">
              运势: {fortune?.fortuneLevel || '中平·量入为出'}
            </div>
          </div>

          {/* 实时注入大模型的数据指标 */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">总消耗流水:</span>
              <span className="text-cyan-300 font-bold">￥{analytics.totalExpense}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">资金蓄水结余:</span>
              <span className={analytics.netSavings >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                ￥{analytics.netSavings}
              </span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">恩格尔食神度:</span>
              <span className="text-emerald-400 font-bold">{analytics.engelCoefficient}%</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">深夜消费占比:</span>
              <span className="text-fuchsia-400 font-bold">{analytics.midnightExpenseRatio}%</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <span className="text-cyan-400 font-bold">[架构说明]:</span>{' '}
            每次提问均自动将上述财务指标注入 DeepSeek 上下文，保证每一句回答皆基于你的真实流水切中要害。
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="mt-4 w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 flex items-center justify-center gap-1.5 text-xs font-mono transition-all"
        >
          <Trash2 size={13} />
          <span>重置清空对话历史</span>
        </button>
      </div>

      {/* 右侧：交互式聊天主终端 */}
      <div className="flex-1 cyber-box rounded-xl p-4 relative flex flex-col overflow-hidden">
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        {/* 终端头部 */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0 font-mono">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-cyan-400" />
            <h2 className="text-sm font-bold text-white">AI ORACLE INTERACTIVE TERMINAL // 对话终端</h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">{llmConfig.model}</span>
          </div>
        </div>

        {/* 消息滚动流 */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 font-mono text-xs pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* 头像徽标 */}
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white shadow-neon-pink'
                    : 'bg-gradient-to-br from-cyan-950 to-slate-900 text-cyan-400 border border-cyan-400/40 shadow-neon-cyan'
                }`}
              >
                {msg.role === 'user' ? <User size={16} /> : <CyberCompassIcon size={16} />}
              </div>

              {/* 消息气泡 */}
              <div
                className={`max-w-[80%] rounded-2xl p-3.5 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-fuchsia-950/60 border border-fuchsia-500/40 text-slate-100 rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-700/80 text-slate-200 rounded-tl-none shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-bold text-cyan-400">
                    {msg.role === 'user' ? 'YOU // 施主' : 'CYBER ORACLE // 命盘大师'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap text-xs md:text-sm">{msg.content}</div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/40 animate-pulse">
                <CyberCompassIcon size={16} className="animate-spin" />
              </div>
              <div className="p-3 rounded-2xl rounded-tl-none bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-2">
                <RefreshCw size={12} className="animate-spin" />
                <span>大师正在推演星轨与对账数据中...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* 快捷推荐提示词胶囊 */}
        <div className="pt-2 pb-2 shrink-0 overflow-x-auto flex gap-2 font-mono text-xs">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              disabled={isSending}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 whitespace-nowrap transition-all text-[11px] disabled:opacity-40"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* 底部输入框 */}
        <div className="pt-2 border-t border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="向赛博命理大师提问关于你的消费、避坑或搞钱计划..."
              disabled={isSending}
              className="flex-1 p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white font-mono text-xs font-bold shadow-neon-cyan flex items-center gap-2 transition-all shrink-0"
            >
              <Send size={14} />
              <span className="hidden sm:inline">发送问诊</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
