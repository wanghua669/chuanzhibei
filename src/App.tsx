import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TransactionRecord, PresetType, FortuneDiagnosis, LLMConfig } from './types';
import { PRESET_INFO, studentTransactions } from './services/presetData';
import { analyzeTransactions } from './services/analyzer';
import { fetchDeepSeekFortune, DEFAULT_LLM_CONFIG } from './services/llmService';

import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { FortuneConsole } from './components/FortuneConsole';
import { RadarChart } from './components/charts/RadarChart';
import { CategoryPieChart } from './components/charts/CategoryPieChart';
import { HourlyHeatmapChart } from './components/charts/HourlyHeatmapChart';
import { TrendLineChart } from './components/charts/TrendLineChart';
import { TransactionList } from './components/TransactionList';

import { ImportModal } from './components/modals/ImportModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { PosterModal } from './components/modals/PosterModal';
import { VibeDocsModal } from './components/modals/VibeDocsModal';

export const App: React.FC = () => {
  const [currentPreset, setCurrentPreset] = useState<PresetType | null>('student');
  const [records, setRecords] = useState<TransactionRecord[]>(studentTransactions);
  const [llmConfig, setLlmConfig] = useState<LLMConfig>(DEFAULT_LLM_CONFIG);

  const [fortune, setFortune] = useState<FortuneDiagnosis | null>(null);
  const [fortuneSource, setFortuneSource] = useState<'ai' | 'fallback' | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // 弹窗状态
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [isVibeDocsOpen, setIsVibeDocsOpen] = useState(false);

  // 实时分析指标计算
  const analytics = useMemo(() => analyzeTransactions(records), [records]);

  // 触发大模型算命
  const runFortuneDiagnosis = useCallback(
    async (curAnalytics = analytics, config = llmConfig) => {
      setIsAiGenerating(true);
      try {
        const result = await fetchDeepSeekFortune(curAnalytics, config);
        setFortune(result.diagnosis);
        setFortuneSource(result.source);
      } catch (err) {
        console.error('Diagnosis failed:', err);
      } finally {
        setIsAiGenerating(false);
      }
    },
    [analytics, llmConfig]
  );

  // 初始化时自动推演首次命盘
  useEffect(() => {
    runFortuneDiagnosis(analytics, llmConfig);
  }, []);

  // 切换预设场景
  const handleSelectPreset = (preset: PresetType) => {
    setCurrentPreset(preset);
    const newRecords = PRESET_INFO[preset].transactions;
    setRecords(newRecords);
    const newAnalytics = analyzeTransactions(newRecords);
    runFortuneDiagnosis(newAnalytics, llmConfig);
  };

  // 导入自定义记录
  const handleImportRecords = (newRecords: TransactionRecord[]) => {
    setCurrentPreset(null);
    setRecords(newRecords);
    const newAnalytics = analyzeTransactions(newRecords);
    runFortuneDiagnosis(newAnalytics, llmConfig);
  };

  // 保存 API 配置并重新推演
  const handleSaveConfig = (newConfig: LLMConfig) => {
    setLlmConfig(newConfig);
    runFortuneDiagnosis(analytics, newConfig);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a13] text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* 顶部赛博科技导航 */}
      <Header
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenVibeDocs={() => setIsVibeDocsOpen(true)}
        onOpenPoster={() => setIsPosterOpen(true)}
        isAiGenerating={isAiGenerating}
        fortuneSource={fortuneSource}
      />

      {/* 主界面画布 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* 指标大屏总览卡片 */}
        <StatCards analytics={analytics} />

        {/* 核心第一行: 赛博命盘控制台 (占大半屏) + 五维性格矩阵雷达 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-8 flex flex-col">
            <FortuneConsole
              fortune={fortune}
              isGenerating={isAiGenerating}
              onRefreshFortune={() => runFortuneDiagnosis(analytics, llmConfig)}
              fortuneSource={fortuneSource}
            />
          </div>
          <div className="lg:col-span-4 flex flex-col">
            <RadarChart scores={analytics.fiveScores} />
          </div>
        </div>

        {/* 核心第二行: 消费流向结构 + 24小时时钟 + 资金脉冲折线 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="h-80">
            <CategoryPieChart categories={analytics.topCategories} />
          </div>
          <div className="h-80">
            <HourlyHeatmapChart hourlyDistribution={analytics.hourlyDistribution} />
          </div>
          <div className="h-80">
            <TrendLineChart dailyTrends={analytics.dailyTrends} />
          </div>
        </div>

        {/* 核心第三行: 明细流水溯源列表 */}
        <div className="mb-6">
          <TransactionList records={records} />
        </div>
      </main>

      {/* 底部比赛信息栏 */}
      <footer className="w-full bg-[#050811] border-t border-slate-800/80 py-4 px-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>全国高校AI创新应用开发赛 · 软件开发挑战赛参赛作品</span>
            <span className="mx-2 text-cyan-600">|</span>
            <span className="text-cyan-400">重塑范式: 基于 Vibe Coding 的全栈应用速成</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>支持 HBuilder 一键移动端/桌面端打包</span>
            <span>•</span>
            <span>Zero-Crash 双轨容灾引擎</span>
          </div>
        </div>
      </footer>

      {/* 弹窗组件群 */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportRecords={handleImportRecords}
        onSelectPreset={handleSelectPreset}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={llmConfig}
        onSaveConfig={handleSaveConfig}
      />

      <PosterModal
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
        fortune={fortune}
        analytics={analytics}
      />

      <VibeDocsModal
        isOpen={isVibeDocsOpen}
        onClose={() => setIsVibeDocsOpen(false)}
      />
    </div>
  );
};

export default App;
