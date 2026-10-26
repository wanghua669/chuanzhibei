import React, { useRef, useEffect, useState } from 'react';
import { FortuneDiagnosis, BillAnalytics } from '../../types';
import { X, Download, Share2 } from 'lucide-react';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  fortune: FortuneDiagnosis | null;
  analytics: BillAnalytics;
}

export const PosterModal: React.FC<PosterModalProps> = ({
  isOpen,
  onClose,
  fortune,
  analytics,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !fortune) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 高清画布 750 x 1334 (标准手机长图海报比例)
    const width = 750;
    const height = 1334;
    canvas.width = width;
    canvas.height = height;

    // 1. 深度暗夜赛博底色
    ctx.fillStyle = '#070a13';
    ctx.fillRect(0, 0, width, height);

    // 科技网格背景
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 顶部与底部光晕
    const glowTop = ctx.createRadialGradient(width / 2, 0, 10, width / 2, 0, 400);
    glowTop.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
    glowTop.addColorStop(1, 'transparent');
    ctx.fillStyle = glowTop;
    ctx.fillRect(0, 0, width, 400);

    const glowBottom = ctx.createRadialGradient(width / 2, height, 10, width / 2, height, 400);
    glowBottom.addColorStop(0, 'rgba(247, 37, 133, 0.2)');
    glowBottom.addColorStop(1, 'transparent');
    ctx.fillStyle = glowBottom;
    ctx.fillRect(0, height - 400, width, 400);

    // 外层霓虹科技边框
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // 四角强化标识
    const cornerSize = 25;
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 4;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(25, 25 + cornerSize);
    ctx.lineTo(25, 25);
    ctx.lineTo(25 + cornerSize, 25);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(width - 25 - cornerSize, 25);
    ctx.lineTo(width - 25, 25);
    ctx.lineTo(width - 25, 25 + cornerSize);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(25, height - 25 - cornerSize);
    ctx.lineTo(25, height - 25);
    ctx.lineTo(25 + cornerSize, height - 25);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(width - 25 - cornerSize, height - 25);
    ctx.lineTo(width - 25, height - 25);
    ctx.lineTo(width - 25, height - 25 - cornerSize);
    ctx.stroke();

    // 2. 顶部竞赛与系统标头
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('// 全国高校AI创新应用开发赛 · VIBE CODING 全栈出品 //', width / 2, 80);

    ctx.fillStyle = '#00f2fe';
    ctx.font = '900 38px monospace';
    ctx.fillText('CYBER FORTUNE 赛博命盘', width / 2, 135);

    // 分割线
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(70, 165);
    ctx.lineTo(width - 70, 165);
    ctx.stroke();

    // 3. 运势等级徽章
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(width / 2 - 130, 195, 260, 44);
    ctx.strokeStyle = '#f72585';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(width / 2 - 130, 195, 260, 44);

    ctx.fillStyle = '#f72585';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`【 ${fortune.fortuneLevel} 】`, width / 2, 225);

    // 4. 赛博命盘封号
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px monospace';
    ctx.fillText(fortune.cyberTitle, width / 2, 290);

    // 5. 毒舌判词金句
    ctx.fillStyle = 'rgba(247, 37, 133, 0.12)';
    ctx.fillRect(60, 330, width - 120, 90);
    ctx.strokeStyle = 'rgba(247, 37, 133, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 330, width - 120, 90);

    ctx.fillStyle = '#fbcfe8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`“${fortune.motto}”`, width / 2, 382);

    // 6. 核心数据仪表展示面板
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(60, 450, width - 120, 180);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 450, width - 120, 180);

    // 数据项 1: 总支出
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('累计消耗流水', 95, 495);
    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`￥${analytics.totalExpense}`, 95, 535);

    // 数据项 2: 恩格尔食神度
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('恩格尔食神度', 290, 495);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`${analytics.engelCoefficient}%`, 290, 535);

    // 数据项 3: 深夜剁手率
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('深夜剁手狂热度', 485, 495);
    ctx.fillStyle = '#f72585';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`${analytics.midnightExpenseRatio}%`, 485, 535);

    // 下半部数据小指标
    ctx.fillStyle = '#64748b';
    ctx.font = '15px monospace';
    ctx.fillText(`五维评分: 食神 ${analytics.fiveScores.foodWarrior} | 夜猫 ${analytics.fiveScores.nightOwl} | 极客 ${analytics.fiveScores.techGeek} | 冲动 ${analytics.fiveScores.impulseBuyer} | 守财 ${analytics.fiveScores.wealthKeeper}`, 95, 595);

    // 7. 避坑预警
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('// 下月避坑破财预警清单 //', 60, 675);

    fortune.warnings.forEach((warn, i) => {
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '17px monospace';
      ctx.fillText(`0${i + 1}. ${warn}`, 70, 715 + i * 36);
    });

    // 8. 积德指南与开运
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('// 赛博积德转运行动指南 //', 60, 850);

    fortune.goodDeeds.forEach((deed, i) => {
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '17px monospace';
      ctx.fillText(`0${i + 1}. ${deed}`, 70, 890 + i * 36);
    });

    // 开运物与避险口诀
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

    // 9. 底部官方防伪章印
    ctx.save();
    ctx.translate(width - 170, 1190);
    ctx.rotate((-12 * Math.PI) / 180);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.8)';
    ctx.lineWidth = 3;
    ctx.strokeRect(-80, -35, 160, 70);
    ctx.fillStyle = 'rgba(0, 242, 254, 0.85)';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DEEPSEEK AI', 0, -8);
    ctx.fillText('OFFICIAL STAMP', 0, 12);
    ctx.font = '10px monospace';
    ctx.fillText('VERIFIED 2026', 0, 26);
    ctx.restore();

    // 底部文字
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.font = '13px monospace';
    ctx.fillText('VERIFICATION HASH: ' + Math.random().toString(36).substring(2, 15).toUpperCase(), 60, 1210);
    ctx.fillText('GEN-TIMESTAMP: ' + new Date().toISOString(), 60, 1230);
    ctx.fillText('全国高校计算机能力挑战赛 - Vibe Coding 专项应用', 60, 1250);

    // 输出为图片 URL
    const url = canvas.toDataURL('image/png');
    setDownloadUrl(url);
  }, [isOpen, fortune, analytics]);

  if (!isOpen || !fortune) return null;

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `CyberFortune_${fortune.cyberTitle.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="cyber-box rounded-2xl w-full max-w-lg p-5 relative border border-cyan-400/50 shadow-2xl my-auto">
        <div className="cyber-corner cyber-corner-tl" />
        <div className="cyber-corner cyber-corner-tr" />
        <div className="cyber-corner cyber-corner-bl" />
        <div className="cyber-corner cyber-corner-br" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-cyan-400" />
            <h3 className="text-base font-mono text-white font-bold">赛博签文分享长图</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* 画布预览容器 */}
        <div className="my-4 max-h-[60vh] overflow-y-auto rounded-xl border border-slate-700/80 p-2 bg-slate-950/60 flex justify-center">
          <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg shadow-2xl" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-mono">
            高清 PNG 格式 · 原生离线渲染
          </span>

          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-white">
              关闭
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-mono font-bold text-white shadow-neon-cyan flex items-center gap-1.5 transition-all"
            >
              <Download size={14} />
              <span>保存海报图片</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
