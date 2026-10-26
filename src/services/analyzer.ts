import { TransactionRecord, BillAnalytics, CategorySummary, FiveDimensionScores } from '../types';

export function analyzeTransactions(records: TransactionRecord[]): BillAnalytics {
  if (!records || records.length === 0) {
    return {
      totalExpense: 0,
      totalIncome: 0,
      netSavings: 0,
      transactionCount: 0,
      avgDailyExpense: 0,
      maxExpenseItem: null,
      engelCoefficient: 0,
      midnightExpenseRatio: 0,
      midnightCount: 0,
      topCategories: [],
      dailyTrends: [],
      hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({ hour: i, amount: 0, count: 0 })),
      fiveScores: { foodWarrior: 50, nightOwl: 50, techGeek: 50, impulseBuyer: 50, wealthKeeper: 50 },
    };
  }

  let totalExpense = 0;
  let totalIncome = 0;
  let foodExpense = 0;
  let midnightExpense = 0;
  let midnightCount = 0;
  let maxExpenseItem: TransactionRecord | null = null;

  const categoryMap = new Map<string, { amount: number; count: number }>();
  const dailyMap = new Map<string, { expense: number; income: number }>();
  const hourlyDistribution: { hour: number; amount: number; count: number }[] = Array.from(
    { length: 24 },
    (_, i) => ({ hour: i, amount: 0, count: 0 })
  );

  records.forEach((rec) => {
    // 解析小时
    let hour = 12;
    if (rec.time) {
      const parts = rec.time.split(':');
      if (parts.length > 0) {
        hour = parseInt(parts[0], 10) || 12;
      }
    }
    const isMidnight = rec.isMidnight ?? (hour >= 23 || hour < 5);

    if (rec.type === 'expense') {
      totalExpense += rec.amount;

      // 食神 / 恩格尔相关
      if (rec.category === '餐饮美食') {
        foodExpense += rec.amount;
      }

      // 深夜消费
      if (isMidnight) {
        midnightExpense += rec.amount;
        midnightCount++;
      }

      // 最大单笔
      if (!maxExpenseItem || rec.amount > maxExpenseItem.amount) {
        maxExpenseItem = rec;
      }

      // 统计分类
      const cat = rec.category || '其他杂项';
      const curCat = categoryMap.get(cat) || { amount: 0, count: 0 };
      categoryMap.set(cat, {
        amount: curCat.amount + rec.amount,
        count: curCat.count + 1,
      });

      // 统计时段
      if (hour >= 0 && hour < 24) {
        hourlyDistribution[hour].amount += rec.amount;
        hourlyDistribution[hour].count += 1;
      }

      // 每日走势
      const curDaily = dailyMap.get(rec.date) || { expense: 0, income: 0 };
      dailyMap.set(rec.date, { ...curDaily, expense: curDaily.expense + rec.amount });
    } else {
      totalIncome += rec.amount;
      const curDaily = dailyMap.get(rec.date) || { expense: 0, income: 0 };
      dailyMap.set(rec.date, { ...curDaily, income: curDaily.income + rec.amount });
    }
  });

  const netSavings = totalIncome - totalExpense;
  const engelCoefficient = totalExpense > 0 ? (foodExpense / totalExpense) * 100 : 0;
  const midnightExpenseRatio = totalExpense > 0 ? (midnightExpense / totalExpense) * 100 : 0;

  // 分类排行
  const topCategories: CategorySummary[] = Array.from(categoryMap.entries())
    .map(([name, data]) => ({
      name,
      amount: Math.round(data.amount * 100) / 100,
      count: data.count,
      percentage: totalExpense > 0 ? Math.round((data.amount / totalExpense) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // 每日走势排序
  const dailyTrends = Array.from(dailyMap.entries())
    .map(([date, val]) => ({
      date,
      expense: Math.round(val.expense * 100) / 100,
      income: Math.round(val.income * 100) / 100,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const daysCount = Math.max(1, dailyTrends.length);
  const avgDailyExpense = Math.round((totalExpense / daysCount) * 100) / 100;

  // 计算五维雷达评分 (0 - 100)
  const techExpense =
    (categoryMap.get('数码数码')?.amount || 0) + (categoryMap.get('学习提升')?.amount || 0);
  const techRatio = totalExpense > 0 ? (techExpense / totalExpense) * 100 : 0;

  // 恩格尔食神度
  const foodWarrior = Math.min(100, Math.round(engelCoefficient * 1.5));
  // 赛博夜猫指数
  const nightOwl = Math.min(100, Math.round(midnightExpenseRatio * 2.2 + midnightCount * 6));
  // 极客充值力
  const techGeek = Math.min(100, Math.round(techRatio * 2.0));
  // 冲动剁手值
  const impulseCount = records.filter((r) => r.isImpulse).length;
  const maxAmt = maxExpenseItem ? (maxExpenseItem as TransactionRecord).amount : 0;
  const impulseBuyer = Math.min(100, Math.round(impulseCount * 22 + (maxAmt > 0 ? (maxAmt / (avgDailyExpense || 1)) * 12 : 20)));
  // 守财奴防御力
  let savingsRate = 50;
  if (totalIncome > 0) {
    savingsRate = Math.max(5, Math.min(95, Math.round((netSavings / totalIncome) * 100)));
  } else {
    savingsRate = totalExpense < 1000 ? 75 : 30;
  }
  const wealthKeeper = savingsRate;

  const fiveScores: FiveDimensionScores = {
    foodWarrior: Math.max(15, foodWarrior),
    nightOwl: Math.max(10, nightOwl),
    techGeek: Math.max(15, techGeek),
    impulseBuyer: Math.max(15, impulseBuyer),
    wealthKeeper: Math.max(10, wealthKeeper),
  };

  return {
    totalExpense: Math.round(totalExpense * 100) / 100,
    totalIncome: Math.round(totalIncome * 100) / 100,
    netSavings: Math.round(netSavings * 100) / 100,
    transactionCount: records.length,
    avgDailyExpense,
    maxExpenseItem,
    engelCoefficient: Math.round(engelCoefficient * 10) / 10,
    midnightExpenseRatio: Math.round(midnightExpenseRatio * 10) / 10,
    midnightCount,
    topCategories,
    dailyTrends,
    hourlyDistribution,
    fiveScores,
  };
}
