import React, { useRef, useEffect, useState } from 'react';
import { FortuneDiagnosis, BillAnalytics } from '../../types';
import { Download, Copy, Check, Sparkles, Sliders, ShieldCheck, RefreshCw } from 'lucide-react';
import { sound } from '../../services/soundService';

interface PosterStudioViewProps {
  fortune: FortuneDiagnosis | null;
  analytics: BillAnalytics;
}

export const PosterStudioView: React.FC<PosterStudioViewProps> = ({ fortune, analytics }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [sealText, setSealText] = useState('DEEPSEEK AI');
  const [showRadarSummary, setShowRadarSummary] = useState(true);
  const [verificationHash] = useState(() => Math.random().toString(36).substring(2, 14).toUpperCase());

  const renderPoster = () => {
    if (!fortune) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 750;
    const height = 1334;
    canvas.width = width;
    canvas.height = height;

    // 1. 深色赛博底色
    ctx.fillStyle = '#070a13';
    ctx.fillRect(0, 0, width, height);

    // 科技网格背景
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 38) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 38) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 顶部发光
    const glowTop = ctx.createRadialGradient(width / 2, 0, 10, width / 2, 0, 420);
    glowTop.addColorStop(0, 'rgba(0, 242, 254, 0.28)');
    glowTop.addColorStop(1, 'transparent');
    ctx.fillStyle = glowTop;
    ctx.fillRect(0, 0, width, 420);

    // 底部发光
    const glowBottom = ctx.createRadialGradient(width / 2, height, 10, width / 2, height, 420);
    glowBottom.addColorStop(0, 'rgba(247, 37, 133, 0.22)');
    glowBottom.addColorStop(1, 'transparent');
    ctx.fillStyle = glowBottom;
    ctx.fillRect(0, height - 420, width, 420);

    // 外层边框与四角
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    const cornerSize = 25;
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 4;
    // TL
    ctx.beginPath();
    ctx.moveTo(25, 25 + cornerSize); ctx.lineTo(25, 25); ctx.lineTo(25 + cornerSize, 25);
    ctx.stroke();
    // TR
    ctx.beginPath();
    ctx.moveTo(width - 25 - cornerSize, 25); ctx.lineTo(width - 25, 25); ctx.lineTo(width - 25, 25 + cornerSize);
    ctx.stroke();
    // BL
    ctx.beginPath();
    ctx.moveTo(25, height - 25 - cornerSize); ctx.lineTo(25, height - 25); ctx.lineTo(25 + cornerSize, height - 25);
    ctx.stroke();
    // BR
    ctx.beginPath();
    ctx.moveTo(width - 25 - cornerSize, height - 25); ctx.lineTo(width - 25, height - 25); ctx.lineTo(width - 25, height - 25 - cornerSize);
    ctx.stroke();

    // 标题
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('// 全国高校AI创新应用开发赛 · VIBE CODING 全栈实验出品 //', width / 2, 80);

    ctx.fillStyle = '#00f2fe';
    ctx.font = '900 38px monospace';
    ctx.fillText('CYBER FORTUNE 赛博命盘', width / 2, 135);

    ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(70, 165);
    ctx.lineTo(width - 70, 165);
    ctx.stroke();

    // 运势等级
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(width / 2 - 130, 195, 260, 44);
    ctx.strokeStyle = '#f72585';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(width / 2 - 130, 195, 260, 44);

    ctx.fillStyle = '#f72585';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`【 ${fortune.fortuneLevel} 】`, width / 2, 225);

    // 封号
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px monospace';
    ctx.fillText(fortune.cyberTitle, width / 2, 290);

    // 判词
    ctx.fillStyle = 'rgba(247, 37, 133, 0.12)';
    ctx.fillRect(60, 330, width - 120, 90);
    ctx.strokeStyle = 'rgba(247, 37, 133, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 330, width - 120, 90);

    ctx.fillStyle = '#fbcfe8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`“${fortune.motto}”`, width / 2, 382);

    // 核心数据
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(60, 450, width - 120, 180);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 450, width - 120, 180);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('累计消耗流水', 95, 495);
    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`￥${analytics.totalExpense}`, 95, 535);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('恩格尔食神度', 290, 495);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`${analytics.engelCoefficient}%`, 290, 535);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('深夜剁手狂热度', 485, 495);
    ctx.fillStyle = '#f72585';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`${analytics.midnightExpenseRatio}%`, 485, 535);

    if (showRadarSummary) {
      ctx.fillStyle = '#64748b';
      ctx.font = '15px monospace';
      ctx.fillText(
        `五维评分: 食神 ${analytics.fiveScores.foodWarrior} | 夜猫 ${analytics.fiveScores.nightOwl} | 极客 ${analytics.fiveScores.techGeek} | 冲动 ${analytics.fiveScores.impulseBuyer} | 守财 ${analytics.fiveScores.wealthKeeper}`,
        95,
        595
      );
    }

    // 避坑预警
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('// 下月避坑破财预警清单 //', 60, 675);

    fortune.warnings.forEach((warn, i) => {
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '17px monospace';
      ctx.fillText(`0${i + 1}. ${warn}`, 70, 715 + i * 36);
    });

    // 积德指南
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('// 赛博积德转运行动指南 //', 60, 850);

    fortune.goodDeeds.forEach((deed, i) => {
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '17px monospace';
      ctx.fillText(`0${i + 1}. ${deed}`, 70, 890 + i * 36);
    });

    // 开运神器
    ctx.fillStyle = 'rgba(255, 183, 3, 0.15)';
    ctx.fillRect(60, 1010, width - 120, 80);
    ctx.strokeStyle = '#ffb703';
    ctx.strokeRect(60, 1010, width - 120, 80);

    ctx.fillStyle = '#ffb703';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`★ 本命开运神器: ${fortune.luckyItem}`, 85, 1045);
    ctx.fillStyle = '#fde68a';
    ctx.font = '16px monospace';
    ctx.fillText(`避险口诀: ${fortune.fleeAdvice}`, 85, 1075);

    // 官方防伪章印
    ctx.save();
    ctx.translate(width - 170, 1190);
    ctx.rotate((-12 * Math.PI) / 180);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.8)';
    ctx.lineWidth = 3;
    ctx.strokeRect(-80, -35, 160, 70);
    ctx.fillStyle = 'rgba(0, 242, 254, 0.85)';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(sealText, 0, -8);
    ctx.fillText('OFFICIAL STAMP', 0, 12);
    ctx.font = '10px monospace';
    ctx.fillText('VERIFIED 2026', 0, 26);
    ctx.restore();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.font = '13px monospace';
    ctx.fillText(`VERIFICATION HASH: ${verificationHash}`, 60, 1210);
    ctx.fillText(`GEN-TIMESTAMP: ${new Date().toISOString()}`, 60, 1230);
    ctx.fillText('全国高校计算机能力挑战赛 - Vibe Coding 专项应用', 60, 1250);

    setDownloadUrl(canvas.toDataURL('image/png'));
  };

  useEffect(() => {
    renderPoster();
  }, [fortune, analytics, sealText, showRadarSummary]);

  const handleDownload = () => {
    if (!downloadUrl) return;
    sound.playSuccess();
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `CyberFortune_${fortune?.cyberTitle.replace(/\s+/g, '_') || 'Poster'}.png`;
    a.click();
  };

  const handleCopyText = () => {
    if (!fortune) return;
    sound.playSuccess();
    const text = `【CyberFortune 赛博命盘】\n封号：${fortune.cyberTitle}\n运势：${fortune.fortuneLevel}\n判词：“${fortune.motto}”\n开运物：${fortune.luckyItem}\n口诀：${fortune.fleeAdvice}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black font-mono tracking-wider text-white flex items-center gap-2">
            <Sparkles size={22} className="text-fuchsia-400" />
            官方命盘签文报告与海报工坊
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            POSTER & AUDIT STUDIO // 渲染 750×1334 像素高清数字命盘认证书，支持原生下载与社交分享
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? '已复制判词' : '复制判词摘要'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold shadow-neon-pink transition-all"
          >
            <Download size={14} />
            <span>保存高清长图 (PNG)</span>
          </button>
        </div>
      </div>

      {/* 工作台双栏布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：画布实时预览 */}
        <div className="lg:col-span-7 flex justify-center cyber-box rounded-xl p-4 relative overflow-hidden bg-slate-950/80">
          <div className="cyber-corner cyber-corner-tl" />
          <div className="cyber-corner cyber-corner-tr" />
          <div className="cyber-corner cyber-corner-bl" />
          <div className="cyber-corner cyber-corner-br" />

          <div className="max-h-[680px] overflow-y-auto rounded-lg shadow-2xl p-2 border border-slate-800">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded" />
          </div>
        </div>

        {/* 右侧：海报自定义控制台 */}
        <div className="lg:col-span-5 space-y-4 font-mono text-xs">
          <div className="cyber-box rounded-xl p-5 relative">
            <div className="cyber-corner cyber-corner-tl" />
            <div className="cyber-corner cyber-corner-tr" />
            <div className="cyber-corner cyber-corner-bl" />
            <div className="cyber-corner cyber-corner-br" />

            <h3 className="text-sm font-bold text-cyan-300 mb-4 flex items-center gap-2">
              <Sliders size={16} />
              海报参数与印章定制
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-slate-300 block mb-1">官方印章标题标识</label>
                <input
                  type="text"
                  value={sealText}
                  onChange={(e) => setSealText(e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-slate-100 focus:outline-none focus:border-cyan-400 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-300">包含五维雷达评分摘要</span>
                <input
                  type="checkbox"
                  checked={showRadarSummary}
                  onChange={(e) => setShowRadarSummary(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>防伪验真哈希:</span>
                  <span className="text-cyan-400 font-bold">{verificationHash}</span>
                </div>
                <div className="flex justify-between">
                  <span>画布标准规格:</span>
                  <span className="text-slate-200">750 × 1334 (9:16)</span>
                </div>
                <div className="flex justify-between">
                  <span>色彩空间:</span>
                  <span className="text-slate-200">sRGB 32-bit</span>
                </div>
              </div>

              <button
                onClick={renderPoster}
                className="w-full py-2.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-bold flex items-center justify-center gap-2 transition-all shadow-neon-cyan"
              >
                <RefreshCw size={14} />
                <span>立即重新渲染海报</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs leading-relaxed">
            <span className="text-emerald-400 font-bold flex items-center gap-1 mb-1">
              <ShieldCheck size={14} />
              纯原生离线渲染保证
            </span>
            海报完全基于 HTML5 2D Context 在本地客户端动态绘制，无需调用任何第三方截图服务，即使在没有网络连接或通过 HBuilder 打包为原生手机应用后，也可秒级生成高清原图！
          </div>
        </div>
      </div>
    </div>
  );
};
