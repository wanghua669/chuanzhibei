import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TransactionRecord,
  PresetType,
  FortuneDiagnosis,
  LLMConfig,
} from './types';
import { PRESET_INFO, studentTransactions } from './services/presetData';
import { analyzeTransactions } from './services/analyzer';
import { fetchDeepSeekFortune, DEFAULT_LLM_CONFIG } from './services/llmService';

// 移动端专用组件
import { MobileHeader } from './components/mobile/MobileHeader';
import { BottomNavBar, MobileTab } from './components/mobile/BottomNavBar';
import { PetAvatarScreen } from './components/mobile/PetAvatarScreen';
import { ParallelScreen } from './components/mobile/ParallelScreen';
import { CourtQuestScreen } from './components/mobile/CourtQuestScreen';
import { SmartLedgerScreen } from './components/mobile/SmartLedgerScreen';
import { ProfileScreen } from './components/mobile/ProfileScreen';

// 弹窗
import { VibeDocsModal } from './components/modals/VibeDocsModal';

export const App: React.FC = () => {
  // 移动端当前底部激活标签
  const [currentTab, setCurrentTab] = useState<MobileTab>('pet');

  // 场景与数据
  const [currentPreset, setCurrentPreset] = useState<PresetType | null>('student');
  const [records, setRecords] = useState<TransactionRecord[]>(studentTransactions);
  const [llmConfig, setLlmConfig] = useState<LLMConfig>(DEFAULT_LLM_CONFIG);

  // 命理诊断结果
  const [fortune, setFortune] = useState<FortuneDiagnosis | null>(null);
  const [fortuneSource, setFortuneSource] = useState<'ai' | 'fallback' | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // 弹窗
  const [isVibeDocsOpen, setIsVibeDocsOpen] = useState(false);

  // 实时分析指标计算
  const analytics = useMemo(() => {
    const res = analyzeTransactions(records);
    // 注入 records 方便子页面取用
    (res as any).records = records;
    return res;
  }, [records]);

  // 触发大模型算命与性格诊断
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

  // 初始化
  useEffect(() => {
    runFortuneDiagnosis(analytics, llmConfig);
  }, []);

  // 切换预设场景
  const handleSelectPreset = (preset: PresetType) => {
    setCurrentPreset(preset);
    const newRecords = PRESET_INFO[preset].transactions;
    setRecords(newRecords);
    const newAnalytics = analyzeTransactions(newRecords);
    (newAnalytics as any).records = newRecords;
    runFortuneDiagnosis(newAnalytics, llmConfig);
  };

  // 记账新增
  const handleAddRecord = (newRec: TransactionRecord) => {
    const updated = [newRec, ...records];
    setRecords(updated);
    setCurrentPreset(null);
    const newAnalytics = analyzeTransactions(updated);
    (newAnalytics as any).records = updated;
    runFortuneDiagnosis(newAnalytics, llmConfig);
  };

  // 记账删除
  const handleDeleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    setCurrentPreset(null);
    const newAnalytics = analyzeTransactions(updated);
    (newAnalytics as any).records = updated;
    runFortuneDiagnosis(newAnalytics, llmConfig);
  };

  // 批量导入
  const handleBulkImport = (newRecords: TransactionRecord[]) => {
    setRecords(newRecords);
    setCurrentPreset(null);
    const newAnalytics = analyzeTransactions(newRecords);
    (newAnalytics as any).records = newRecords;
    runFortuneDiagnosis(newAnalytics, llmConfig);
  };

  // 保存设置
  const handleSaveConfig = (newConfig: LLMConfig) => {
    setLlmConfig(newConfig);
    runFortuneDiagnosis(analytics, newConfig);
  };

  return (
    <div className="min-h-screen w-full bg-[#03060d] flex justify-center selection:bg-cyan-500 selection:text-black">
      {/* 手机移动端主容器 (PC上居中模拟手机旗舰屏，移动端及HBuilder打包后自适应撑满整屏) */}
      <div className="w-full max-w-md min-h-screen bg-[#070b16] flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.8)] border-x border-slate-800/40">
        {/* 顶部移动端导航 */}
        <MobileHeader
          currentPreset={currentPreset}
          onSelectPreset={handleSelectPreset}
          onRefreshAI={() => runFortuneDiagnosis(analytics, llmConfig)}
          isAiGenerating={isAiGenerating}
        />

        {/* 核心主滚动内容区 */}
        <main className="flex-1 overflow-y-auto px-3.5 pt-3">
          {currentTab === 'pet' && (
            <PetAvatarScreen
              analytics={analytics}
              fortune={fortune}
              onRefreshAI={() => runFortuneDiagnosis(analytics, llmConfig)}
              isAiGenerating={isAiGenerating}
            />
          )}

          {currentTab === 'parallel' && (
            <ParallelScreen analytics={analytics} records={records} />
          )}

          {currentTab === 'court' && (
            <CourtQuestScreen
              analytics={analytics}
              llmConfig={llmConfig}
            />
          )}

          {currentTab === 'ledger' && (
            <SmartLedgerScreen
              records={records}
              analytics={analytics}
              onAddRecord={handleAddRecord}
              onDeleteRecord={handleDeleteRecord}
              onBulkImport={handleBulkImport}
            />
          )}

          {currentTab === 'settings' && (
            <ProfileScreen
              config={llmConfig}
              onSaveConfig={handleSaveConfig}
              onReloadPreset={handleSelectPreset}
              onOpenVibeDocs={() => setIsVibeDocsOpen(true)}
            />
          )}
        </main>

        {/* 底部移动端原生风格导航栏 */}
        <BottomNavBar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          recordCount={records.length}
        />

        {/* 竞赛设计文档弹窗 */}
        <VibeDocsModal
          isOpen={isVibeDocsOpen}
          onClose={() => setIsVibeDocsOpen(false)}
        />
      </div>
    </div>
  );
};

export default App;
