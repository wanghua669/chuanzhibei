import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TransactionRecord,
  PresetType,
  FortuneDiagnosis,
  LLMConfig,
  SoftwareView,
} from './types';
import { PRESET_INFO, studentTransactions } from './services/presetData';
import { analyzeTransactions } from './services/analyzer';
import { fetchDeepSeekFortune, DEFAULT_LLM_CONFIG } from './services/llmService';

// 桌面软件外壳组件
import { TitleBar } from './components/desktop/TitleBar';
import { Sidebar } from './components/desktop/Sidebar';
import { StatusBar } from './components/desktop/StatusBar';
import { CommandPalette } from './components/desktop/CommandPalette';

// 6 大核心模块视图
import { CockpitView } from './components/views/CockpitView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { OracleChatView } from './components/views/OracleChatView';
import { LedgerView } from './components/views/LedgerView';
import { PosterStudioView } from './components/views/PosterStudioView';
import { SettingsView } from './components/views/SettingsView';

// 弹窗
import { ImportModal } from './components/modals/ImportModal';
import { VibeDocsModal } from './components/modals/VibeDocsModal';

export const App: React.FC = () => {
  // 软件主视图与侧边栏折叠状态
  const [currentView, setCurrentView] = useState<SoftwareView>('cockpit');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // 账单数据与预设
  const [currentPreset, setCurrentPreset] = useState<PresetType | null>('student');
  const [records, setRecords] = useState<TransactionRecord[]>(studentTransactions);
  const [llmConfig, setLlmConfig] = useState<LLMConfig>(DEFAULT_LLM_CONFIG);

  // 命理诊断结果
  const [fortune, setFortune] = useState<FortuneDiagnosis | null>(null);
  const [fortuneSource, setFortuneSource] = useState<'ai' | 'fallback' | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // 弹窗状态
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isVibeDocsModalOpen, setIsVibeDocsModalOpen] = useState(false);

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
        console.error('Diagnosis error:', err);
      } finally {
        setIsAiGenerating(false);
      }
    },
    [analytics, llmConfig]
  );

  // 初始化执行首轮诊断推演
  useEffect(() => {
    runFortuneDiagnosis(analytics, llmConfig);
  }, []);

  // 快捷键支持 (Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 切换场景
  const handleSelectPreset = (preset: PresetType) => {
    setCurrentPreset(preset);
    const newRecords = PRESET_INFO[preset].transactions;
    setRecords(newRecords);
    const newAnalytics = analyzeTransactions(newRecords);
    runFortuneDiagnosis(newAnalytics, llmConfig);
  };

  // 手动新增记账
  const handleAddRecord = (newRec: TransactionRecord) => {
    const updated = [newRec, ...records];
    setRecords(updated);
    setCurrentPreset(null);
    const newAnalytics = analyzeTransactions(updated);
    runFortuneDiagnosis(newAnalytics, llmConfig);
  };

  // 手动删除某笔记账
  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    setCurrentPreset(null);
    const newAnalytics = analyzeTransactions(updated);
    runFortuneDiagnosis(newAnalytics, llmConfig);
  };

  // 导入数据
  const handleImportRecords = (newRecords: TransactionRecord[]) => {
    setRecords(newRecords);
    setCurrentPreset(null);
    const newAnalytics = analyzeTransactions(newRecords);
    runFortuneDiagnosis(newAnalytics, llmConfig);
  };

  // 保存设置
  const handleSaveConfig = (newConfig: LLMConfig) => {
    setLlmConfig(newConfig);
    runFortuneDiagnosis(analytics, newConfig);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#060a14] text-slate-100 overflow-hidden select-none">
      {/* 顶部桌面软件标题栏 */}
      <TitleBar
        currentView={currentView}
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onRefreshDiagnosis={() => runFortuneDiagnosis(analytics, llmConfig)}
        isAiGenerating={isAiGenerating}
        fortuneSource={fortuneSource}
      />

      {/* 中部核心工作台：左侧导航 + 右侧模块视图 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧可收起软件导航栏 */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          recordCount={records.length}
          onOpenImport={() => setIsImportModalOpen(true)}
          onOpenVibeDocs={() => setIsVibeDocsModalOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* 右侧主工作区容器 */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-[#060a14] via-[#090e1c] to-[#060a14]">
          <div className="max-w-7xl mx-auto">
            {currentView === 'cockpit' && (
              <CockpitView
                analytics={analytics}
                fortune={fortune}
                fortuneSource={fortuneSource}
                isAiGenerating={isAiGenerating}
                onRefreshDiagnosis={() => runFortuneDiagnosis(analytics, llmConfig)}
                onNavigate={setCurrentView}
              />
            )}

            {currentView === 'analytics' && (
              <AnalyticsView analytics={analytics} />
            )}

            {currentView === 'chat' && (
              <OracleChatView
                analytics={analytics}
                fortune={fortune}
                llmConfig={llmConfig}
              />
            )}

            {currentView === 'ledger' && (
              <LedgerView
                records={records}
                analytics={analytics}
                onAddRecord={handleAddRecord}
                onDeleteRecord={handleDeleteRecord}
                onOpenImport={() => setIsImportModalOpen(true)}
              />
            )}

            {currentView === 'poster' && (
              <PosterStudioView
                fortune={fortune}
                analytics={analytics}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                config={llmConfig}
                onSaveConfig={handleSaveConfig}
                onReloadPreset={handleSelectPreset}
              />
            )}
          </div>
        </main>
      </div>

      {/* 底部 IDE 风格遥测状态栏 */}
      <StatusBar
        analytics={analytics}
        fortune={fortune}
        fortuneSource={fortuneSource}
      />

      {/* 快捷指令命令面板 */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectView={setCurrentView}
        onSelectPreset={handleSelectPreset}
        onOpenImport={() => setIsImportModalOpen(true)}
        onRefreshDiagnosis={() => runFortuneDiagnosis(analytics, llmConfig)}
        onOpenVibeDocs={() => setIsVibeDocsModalOpen(true)}
      />

      {/* 导入 CSV 账单弹窗 */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportRecords={handleImportRecords}
        onSelectPreset={handleSelectPreset}
      />

      {/* 竞赛 Vibe Coding 评审设计文档弹窗 */}
      <VibeDocsModal
        isOpen={isVibeDocsModalOpen}
        onClose={() => setIsVibeDocsModalOpen(false)}
      />
    </div>
  );
};

export default App;
