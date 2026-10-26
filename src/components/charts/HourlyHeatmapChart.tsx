import React from 'react';
import ReactECharts from 'echarts-for-react';
import { CyberNightOwlIcon } from '../common/CyberIcons';

interface HourlyHeatmapChartProps {
  hourlyDistribution: { hour: number; amount: number; count: number }[];
}

export const HourlyHeatmapChart: React.FC<HourlyHeatmapChartProps> = ({ hourlyDistribution }) => {
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  const data = hourlyDistribution.map((item) => ({
    value: Math.round(item.amount * 10) / 10,
    itemStyle: {
      color:
        item.hour >= 23 || item.hour < 5
          ? {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#f72585' },
                { offset: 1, color: '#7209b7' },
              ],
            }
          : {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#00f2fe' },
                { offset: 1, color: '#0284c7' },
              ],
            },
    },
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#00f2fe',
      borderWidth: 1,
      textStyle: { color: '#e2e8f0', fontFamily: 'monospace' },
      formatter: (params: any) => {
        const p = params[0];
        const h = p.dataIndex;
        const isNight = h >= 23 || h < 5;
        return `
          <div style="font-family: monospace;">
            <div style="color: ${isNight ? '#f72585' : '#00f2fe'}; font-weight: bold;">
              ${p.name} ${isNight ? '【深夜警戒时段】' : '【日间常规】'}
            </div>
            <div>消费金额: ￥${p.value}</div>
            <div>交易频次: ${hourlyDistribution[h]?.count || 0} 笔</div>
          </div>
        `;
      },
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '8%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: {
        color: '#64748b',
        fontFamily: 'monospace',
        fontSize: 10,
        interval: 3,
      },
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
        name: '消费金额',
        type: 'bar',
        barWidth: '55%',
        data: data,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
        },
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
          <CyberNightOwlIcon size={18} />
          24小时消费时钟
        </h3>
        <span className="text-[10px] font-mono text-fuchsia-400 px-2 py-0.5 rounded bg-fuchsia-950/60 border border-fuchsia-800/40">
          粉色为深夜警戒
        </span>
      </div>

      <div className="flex-1 w-full min-h-[260px]">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
      </div>
    </div>
  );
};
