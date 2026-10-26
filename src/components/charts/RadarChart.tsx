import React from 'react';
import ReactECharts from 'echarts-for-react';
import { FiveDimensionScores } from '../../types';
import { CyberCompassIcon } from '../common/CyberIcons';

interface RadarChartProps {
  scores: FiveDimensionScores;
}

export const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: '#00f2fe',
      borderWidth: 1,
      textStyle: { color: '#e2e8f0', fontFamily: 'monospace' },
    },
    radar: {
      indicator: [
        { name: '恩格尔食神', max: 100 },
        { name: '赛博夜猫', max: 100 },
        { name: '极客充值', max: 100 },
        { name: '冲动剁手', max: 100 },
        { name: '守财防御', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: '#38bdf8',
        fontFamily: 'monospace',
        fontSize: 12,
        fontWeight: 'bold',
      },
      splitLine: {
        lineStyle: {
          color: [
            'rgba(0, 242, 254, 0.1)',
            'rgba(0, 242, 254, 0.2)',
            'rgba(0, 242, 254, 0.3)',
            'rgba(0, 242, 254, 0.5)',
          ],
          width: 1,
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: [
            'rgba(15, 23, 42, 0.6)',
            'rgba(14, 165, 233, 0.05)',
            'rgba(15, 23, 42, 0.8)',
            'rgba(247, 37, 133, 0.06)',
          ],
        },
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 242, 254, 0.3)',
        },
      },
    },
    series: [
      {
        name: '赛博命盘五维',
        type: 'radar',
        data: [
          {
            value: [
              scores.foodWarrior,
              scores.nightOwl,
              scores.techGeek,
              scores.impulseBuyer,
              scores.wealthKeeper,
            ],
            name: '当前命盘评分',
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              color: '#00f2fe',
              borderColor: '#f72585',
              borderWidth: 2,
            },
            lineStyle: {
              color: '#00f2fe',
              width: 2.5,
              shadowColor: 'rgba(0, 242, 254, 0.8)',
              shadowBlur: 10,
            },
            areaStyle: {
              color: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.5,
                colorStops: [
                  { offset: 0, color: 'rgba(0, 242, 254, 0.55)' },
                  { offset: 1, color: 'rgba(247, 37, 133, 0.25)' },
                ],
              },
            },
          },
        ],
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
          <CyberCompassIcon size={18} />
          五维性格矩阵
        </h3>
        <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">
          RADAR MATRIX
        </span>
      </div>

      <div className="flex-1 w-full min-h-[260px]">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
      </div>
    </div>
  );
};
