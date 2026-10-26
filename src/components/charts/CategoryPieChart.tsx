import React from 'react';
import ReactECharts from 'echarts-for-react';
import { CategorySummary } from '../../types';
import { QuantumChipIcon } from '../common/CyberIcons';

interface CategoryPieChartProps {
  categories: CategorySummary[];
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ categories }) => {
  const chartData = categories.slice(0, 6).map((cat) => ({
    name: cat.name,
    value: cat.amount,
  }));

  const colors = ['#00f2fe', '#4facfe', '#7209b7', '#f72585', '#ffb703', '#10b981'];

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: '#00f2fe',
      borderWidth: 1,
      textStyle: { color: '#e2e8f0', fontFamily: 'monospace' },
      formatter: '{b}: ￥{c} ({d}%)',
    },
    legend: {
      bottom: '2%',
      left: 'center',
      textStyle: {
        color: '#94a3b8',
        fontFamily: 'monospace',
        fontSize: 11,
      },
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        name: '消费结构',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#070a13',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
            color: '#00f2fe',
            fontFamily: 'monospace',
            formatter: '{b}\n{d}%',
          },
        },
        labelLine: {
          show: false,
        },
        data: chartData,
        color: colors,
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
          <QuantumChipIcon size={18} />
          资金流向构成
        </h3>
        <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700">
          FLOW TOPO
        </span>
      </div>

      <div className="flex-1 w-full min-h-[260px]">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} opts={{ renderer: 'svg' }} />
      </div>
    </div>
  );
};
