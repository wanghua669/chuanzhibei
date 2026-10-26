export interface TransactionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  category: string; // 餐饮美食, 数码数码, 休闲娱乐, 交通出行, 学习提升, 医疗保健, 居家日用, 充值理财
  counterparty: string; // 交易对方 / 商户
  amount: number; // 金额 (支出为正数)
  type: 'expense' | 'income';
  description: string;
  isMidnight?: boolean; // 23:00 - 05:00
  isImpulse?: boolean; // 突发大额/冲动消费
}

export interface FiveDimensionScores {
  foodWarrior: number; // 恩格尔食神度 (0-100)
  nightOwl: number; // 赛博夜猫指数 (0-100)
  techGeek: number; // 极客充值力 (0-100)
  impulseBuyer: number; // 冲动剁手值 (0-100)
  wealthKeeper: number; // 守财奴防御力 (0-100)
}

export interface CategorySummary {
  name: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface BillAnalytics {
  totalExpense: number;
  totalIncome: number;
  netSavings: number;
  transactionCount: number;
  avgDailyExpense: number;
  maxExpenseItem: TransactionRecord | null;
  engelCoefficient: number; // 餐饮支出占比 (%)
  midnightExpenseRatio: number; // 深夜消费占比 (%)
  midnightCount: number;
  topCategories: CategorySummary[];
  dailyTrends: { date: string; expense: number; income: number }[];
  hourlyDistribution: { hour: number; amount: number; count: number }[];
  fiveScores: FiveDimensionScores;
}

export interface FortuneDiagnosis {
  cyberTitle: string; // 赛博命盘封号，例如：“五行缺钱·疯狂星期四编外护法”
  fortuneLevel: '大吉·赛博暴富' | '中平·量入为出' | '下下·赛博破产劫' | '超然·极简隐者';
  motto: string; // 毒舌判词 / 灵魂拷问
  deepAnalysis: string; // 命理深度剖析
  traits: string[]; // 性格标签
  warnings: string[]; // 避坑破财预警清单
  goodDeeds: string[]; // 赛博积德转运指南
  cyberMerit: number; // 赛博功德分
  luckyItem: string; // 本命开运物件
  fleeAdvice: string; // 紧急避险口诀
}

export interface LLMConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  mode: 'ai' | 'mock'; // mock模式零延迟纯离线，ai模式调用大模型
}

export type PresetType = 'student' | 'coder' | 'moonlight';
