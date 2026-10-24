import { BillAnalytics, FortuneDiagnosis, LLMConfig, ChatMessage } from '../types';
import { DEFAULT_LLM_CONFIG } from './llmService';

// 与赛博命盘大师交互对话服务
export async function sendChatMessageToDeepSeek(
  userQuery: string,
  history: ChatMessage[],
  analytics: BillAnalytics,
  fortune: FortuneDiagnosis | null,
  config: LLMConfig = DEFAULT_LLM_CONFIG
): Promise<string> {
  if (config.mode === 'mock') {
    return generateFallbackChatResponse(userQuery, analytics, fortune);
  }

  const systemContext = `
你是一位融合了赛博朋克世界观、后现代命理学与毒舌财务分析的【赛博命盘算命大师】。
你正在与一位数字用户进行一对一财务命理答疑。请用犀利、幽默、充满网感与大学/职场黑话的口吻回复。
切勿使用 Emoji，保持纯文字的高级科技感。

【当前用户的实时财务命盘数据】
- 命盘封号: ${fortune?.cyberTitle || '赛博散财行者'}
- 运势等级: ${fortune?.fortuneLevel || '中平·量入为出'}
- 总支出: ￥${analytics.totalExpense} (共 ${analytics.transactionCount} 笔)
- 总结余: ￥${analytics.netSavings}
- 恩格尔系数 (餐饮占比): ${analytics.engelCoefficient}%
- 深夜 (23:00-05:00) 消费占比: ${analytics.midnightExpenseRatio}%
- 最大单笔消费: ${analytics.maxExpenseItem ? `${analytics.maxExpenseItem.counterparty} (￥${analytics.maxExpenseItem.amount})` : '无'}
- 五维评分: 食神 ${analytics.fiveScores.foodWarrior}, 夜猫 ${analytics.fiveScores.nightOwl}, 极客 ${analytics.fiveScores.techGeek}, 冲动 ${analytics.fiveScores.impulseBuyer}, 守财 ${analytics.fiveScores.wealthKeeper}

请根据用户的具体提问，结合其上述账单真实痛点给予一针见血、毒舌但又具有可行性的赛博转运/避坑建议。控制在150字以内。
`;

  // 构建历史上下文
  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemContext },
  ];

  history.slice(-6).forEach((msg) => {
    if (msg.role === 'user' || msg.role === 'assistant') {
      messages.push({ role: msg.role, content: msg.content });
    }
  });

  messages.push({ role: 'user', content: userQuery });

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(config.baseURL || 'https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: config.model || 'deepseek-chat',
        messages,
        temperature: 0.85,
        max_tokens: 400,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      return generateFallbackChatResponse(userQuery, analytics, fortune);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || generateFallbackChatResponse(userQuery, analytics, fortune);
  } catch (err) {
    console.warn('Chat request failed, fallback to offline rules:', err);
    return generateFallbackChatResponse(userQuery, analytics, fortune);
  }
}

// 离线高能对话兜底规则库
function generateFallbackChatResponse(
  query: string,
  analytics: BillAnalytics,
  fortune: FortuneDiagnosis | null
): string {
  const q = query.toLowerCase();

  if (/星期四|kfc|疯狂星期四|肯德基|炸鸡/.test(q)) {
    return `命盘检测到你的食神度高达 ${analytics.fiveScores.foodWarrior}，每到周四脑神经就被吮指原味鸡绑架。大师送你一计：周四上午11点前把微信零钱全部转入锁定存钱罐，卸载外卖，默念'穷鬼套餐保平安'三次，方可化解此劫。`;
  }
  if (/省钱|存钱|储蓄|结余|搞钱/.test(q)) {
    return `根据你当前结余 ￥${analytics.netSavings} 的命盘走向：你的漏财玄关在「${analytics.topCategories[0]?.name || '冲动消费'}」。开源不如节流，下月强制执行'三日冷静期结界'——凡超过 ￥100 的非必需品，放购物车放置72小时，90%的冲动都会随多巴胺冷却而自行退散。`;
  }
  if (/熬夜|深夜|晚上|外卖|宵夜/.test(q)) {
    return `你深夜消费占比高达 ${analytics.midnightExpenseRatio}%，子时（23:00后）你的理性防御直接归零。听大师劝：晚上11点准时开启手机极简灰度模式，床头放一杯凉白开代替刷手机，能直接帮你守住每月至少 30% 的血汗钱。`;
  }
  if (/买|剁手|值得|推荐|拔草/.test(q)) {
    return `命盘警示：你当前的冲动剁手指数为 ${analytics.fiveScores.impulseBuyer}。在付款前摸摸钱包，问自己三个灵魂问题：1. 不买会死吗？2. 买了能产出代码或金钱吗？3. 查查上月买的闲置积灰了没有？答案如果都是否，请立刻拔掉网线保平安。`;
  }

  return `施主卦象清奇。你当前的命盘封号为「${fortune?.cyberTitle || '数字游民'}」，总账消耗 ￥${analytics.totalExpense}。命理显示：你缺的不是赚钱的法子，而是对即时多巴胺诱惑的防御结界。下月切记量入为出，戒骄戒躁，赛博功德自会为你辟邪护体。`;
}
