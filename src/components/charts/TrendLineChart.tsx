import React from 'react';
import ReactECharts from 'echarts-for-react';
import { CyberImpulseIcon } from '../common/CyberIcons';

interface TrendLineChartProps {
  dailyTrends: { date: string; expense: number; income: number }[];
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ dailyTrends }) => {
  const dates = dailyTrends.map((d) => d.date.slice(5)); // MM-DD
  const expenses = dailyTrends.map((d) => d.expense);
  const incomes = dailyTrends.map((d) => d.income);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#00f2fe',
      borderWidth: 1,
      textStyle: { color: '#e2e8f0', fontFamily: 'monospace' },
    },
    legend: {
      data: ['每日流出', '每日流入'],
      top: '2%',
      right: '2%',
      textStyle: { color: '#94a3b8', fontFamily: 'monospace', fontSize: 11 },
    },
    grid: {
      top: '18%',
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#64748b', fontFamily: 'monospace', fontSize: 10 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(51, 65, 85, 0.4)', type: 'dashed' } },
      axisLabel: {
        color: '#64748b',
        fontFamily: 'monospace',
        fontSize: 10,
        formatter: '￥{value}',
      },
    },
    series: [
      {
        name: '每日流出',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#f72585', borderColor: '#fff', borderWidth: 1 },
        lineStyle: { color: '#f72585', width: 2.5, shadowColor: 'rgba(247, 37, 133, 0.6)', shadowBlur: 8 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(247, 37, 133, 0.35)' },
              { offset: 1, color: 'rgba(247, 37, 133, 0.02)' },
            ],
          },
        },
        data: expenses,
      },
      {
        name: '每日流入',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#00f2fe' },
        lineStyle: { color: '#00f2fe', width: 2, type: 'dashed' },
        data: incomes,
      },
    ],
  };

  return (
    <div className="cyber-box rounded-xl p-4 relative flex flex-col h-full">
      <div className="cyber-corner cyber-corner-tl" />
      <div className="cyber-corner cyber-corner-tr" />
      <div className="cyber-corner cyber-corner-bl" />
      <div className="cyber-corner cyber-corner-br" />

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-mono text-cyan-400 flex items-center gap-2 font-bold tracking-wide">
          <CyberImpulseIcon size={18} />
          资金脉冲波动
        </h3>
        <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">
          DAILY PULSE
        </span>
      </div>

      <div className="flex-1 w-full min-h-[260px]">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
      </div>
    </div>
  );
};
