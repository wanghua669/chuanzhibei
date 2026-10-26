import { BillAnalytics, FortuneDiagnosis, LLMConfig } from '../types';

export const DEFAULT_LLM_CONFIG: LLMConfig = {
  apiKey: 'sk-1f4d8cb766ac43928231c559a0765329',
  baseURL: 'https://api.deepseek.com/chat/completions',
  model: 'deepseek-chat',
  mode: 'ai',
};

// 本地离线高能赛博命理规则引擎（保证极端网络情况下100%零报错）
export function generateLocalRuleFortune(analytics: BillAnalytics): FortuneDiagnosis {
  const { engelCoefficient, midnightExpenseRatio, fiveScores, maxExpenseItem, totalExpense, netSavings } = analytics;

  let title = '赛博散财童子·无意识消费行者';
  let fortuneLevel: FortuneDiagnosis['fortuneLevel'] = '中平·量入为出';
  let motto = '你以为你在对抗消费主义，其实你一直在给资本家打工。';
  let luckyItem = '折叠屏手机保护壳';
  let fleeAdvice = '见好就收，切勿上头';
  const traits: string[] = [];

  if (fiveScores.foodWarrior >= 65 || engelCoefficient >= 55) {
    title = '五行缺钱·疯狂星期四在逃护法';
    fortuneLevel = '下下·赛博破产劫';
    motto = `恩格尔系数高达 ${Math.round(engelCoefficient)}%，你的胃是高精尖黑洞，钱包却在ICU吸氧。`;
    traits.push('碳水信徒', '外卖终身VIP', '周四狂热分子');
    luckyItem = '保温杯装冰美式';
    fleeAdvice = '饭点前三分钟关闭外卖软件，默念恩格尔咒语三次';
  } else if (fiveScores.nightOwl >= 60 || midnightExpenseRatio >= 30) {
    title = '暗夜赛博幽灵·午夜剁手天尊';
    fortuneLevel = '下下·赛博破产劫';
    motto = `夜深人静多巴胺失控，${Math.round(midnightExpenseRatio)}% 的资金在黎明前化作赛博泡沫。`;
    traits.push('晚睡综合征', '午夜情绪化剁手', '凌晨云村包场');
    luckyItem = '防蓝光护目镜';
    fleeAdvice = '晚上十一点半开启手机灰度模式，强制物理锁机';
  } else if (fiveScores.techGeek >= 55) {
    title = '代码炼金术士·数字基建狂魔';
    fortuneLevel = '大吉·赛博暴富';
    motto = '把生活费全换成了算力和外设，代码跑得飞快，存折平得像地平线。';
    traits.push('极客信仰', '算力消耗者', '客制化中毒');
    luckyItem = '青轴机械试轴器';
    fleeAdvice = '切勿在未跑通单元测试前冲动剁手新硬件';
  } else if (fiveScores.impulseBuyer >= 65) {
    title = '多巴胺收割机·即兴消费暴走族';
    fortuneLevel = '下下·赛博破产劫';
    motto = maxExpenseItem
      ? `单笔「${maxExpenseItem.counterparty}」直接击穿防御，冲动让心率和账单一同狂飙。`
      : '每次下单都豪情万丈，每次查余额都怀疑人生。';
    traits.push('情绪买单人', '折扣击中者', '拔草永动机');
    luckyItem = '三日冷静期锁链';
    fleeAdvice = '遇到想买的先放进购物车72小时，大概率就不想要了';
  } else if (fiveScores.wealthKeeper >= 60 || netSavings > 1000) {
    title = '赛博金钟罩·貔貅转世守财仙';
    fortuneLevel = '大吉·赛博暴富';
    motto = '在一片消费主义浪潮中稳坐钓鱼台，结余才是你最硬核的底气。';
    traits.push('结余王者', '防破财结界', '极简生活家');
    luckyItem = '大容量记账本';
    fleeAdvice = '继续保持战略定力，提防大宗投资诱惑';
  } else {
    title = '量子薛定谔·混沌平衡派';
    fortuneLevel = '中平·量入为出';
    motto = '在省钱与挥霍的量子态中反复横跳，收支恰好在崩溃边缘达成奇妙共振。';
    traits.push('随机摇摆', '及格线徘徊', '佛系理财');
    luckyItem = '金属滚珠解压魔方';
    fleeAdvice = '设立应急小金库，防患于未然';
  }

  const warnings = [
    `小心「${analytics.topCategories[0]?.name || '高频消费'}」品类的隐形开销，聚沙成塔极易形成资金黑洞。`,
    '深夜23:00至凌晨2:00之间，大脑前额叶皮层抑制力下降，严禁浏览任何电商大促。',
    '警惕任何打着「对自己好一点」旗号的轻奢消费，通常是情绪消费税。',
  ];

  const goodDeeds = [
    '清空一次未付款的购物车，赛博功德 +66。',
    '自制一顿健康午餐代替外卖重油重盐，赛博功德 +88。',
    '为优秀开源项目点一个 Star，积累开发者赛博气运。',
  ];

  return {
    cyberTitle: title,
    fortuneLevel,
    motto,
    deepAnalysis: `根据你近期的交易拓扑结构推演：总计发生 ${analytics.transactionCount} 笔资金流动，净结余 ￥${netSavings}。恩格尔指数为 ${analytics.engelCoefficient}%，深夜支出占比 ${analytics.midnightExpenseRatio}%。整体命盘呈现典型的后现代数字游民特征，既渴望生活品质的即时满足，又在月底复盘时面临赛博焦虑。`,
    traits,
    warnings,
    goodDeeds,
    cyberMerit: 888 + Math.floor(Math.random() * 200),
    luckyItem,
    fleeAdvice,
  };
}

// 调用 DeepSeek 大模型生成诊断
export async function fetchDeepSeekFortune(
  analytics: BillAnalytics,
  config: LLMConfig = DEFAULT_LLM_CONFIG
): Promise<{ diagnosis: FortuneDiagnosis; source: 'ai' | 'fallback' }> {
  // 如果配置指定纯本地 mock 模式，直接返回规则引擎结果
  if (config.mode === 'mock') {
    return { diagnosis: generateLocalRuleFortune(analytics), source: 'fallback' };
  }

  const promptContent = `
你是一位融合了赛博朋克世界观、后现代命理学与毒舌财务分析的【赛博命盘算命大师】。
请根据以下用户的近期真实账单统计数据，推演其个人赛博命盘与消费性格画像：

【账单统计数据】
- 总支出: ￥${analytics.totalExpense}
- 总收入: ￥${analytics.totalIncome}
- 总结余: ￥${analytics.netSavings}
- 交易总笔数: ${analytics.transactionCount} 笔
- 恩格尔系数 (餐饮占比): ${analytics.engelCoefficient}%
- 深夜时段(23:00-05:00)消费占比: ${analytics.midnightExpenseRatio}% (共 ${analytics.midnightCount} 笔)
- 单笔最大支出: ${analytics.maxExpenseItem ? `${analytics.maxExpenseItem.counterparty} (￥${analytics.maxExpenseItem.amount})` : '无'}
- 消费分类前四名: ${analytics.topCategories.slice(0, 4).map((c) => `${c.name}: ￥${c.amount} (${c.percentage}%)`).join('; ')}
- 五维评分 (0-100): 食神度 ${analytics.fiveScores.foodWarrior}, 夜猫度 ${analytics.fiveScores.nightOwl}, 极客力 ${analytics.fiveScores.techGeek}, 冲动剁手度 ${analytics.fiveScores.impulseBuyer}, 守财力 ${analytics.fiveScores.wealthKeeper}

【生成要求】
1. 风格犀利、毒舌、幽默风趣，充满网感与大学/职场黑话（如疯狂星期四、赛博功德、恩格尔战士、云村EMO等），严禁枯燥说教。
2. 切勿在任何字段中使用 Emoji 表情符号，保持纯粹的文字张力与科技感。
3. 必须输出严格的 JSON 格式（不要包含任何 markdown 代码块外部的废话），字段如下：
{
  "cyberTitle": "不超过16个字的赛博命盘封号，如「五行缺钱·疯狂星期四编外护法」",
  "fortuneLevel": "大吉·赛博暴富 或 中平·量入为出 或 下下·赛博破产劫 或 超然·极简隐者",
  "motto": "一句话毒舌判词/灵魂拷问，30字以内",
  "deepAnalysis": "命理深度剖析（100字左右，结合具体数据与生活痛点）",
  "traits": ["标签1", "标签2", "标签3", "标签4"],
  "warnings": ["避坑预警1", "避坑预警2", "避坑预警3"],
  "goodDeeds": ["赛博积德建议1", "赛博积德建议2", "赛博积德建议3"],
  "cyberMerit": 999,
  "luckyItem": "本命开运物件",
  "fleeAdvice": "一句话紧急避险口诀"
}
`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12秒超时

    const response = await fetch(config.baseURL || 'https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: config.model || 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一位精通数据洞察的赛博命理分析大师。请务必输出纯 JSON。' },
          { role: 'user', content: promptContent },
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`DeepSeek API returned error status: ${response.status}, fallback to rule engine.`);
      return { diagnosis: generateLocalRuleFortune(analytics), source: 'fallback' };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return { diagnosis: generateLocalRuleFortune(analytics), source: 'fallback' };
    }

    // 尝试解析 JSON
    let jsonStr = content.trim();
    // 剔除可能存在的 ```json 代码块
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim();
    }

    const parsed = JSON.parse(jsonStr) as any;

    // 智能键名映射与归一化（防止大模型别名或嵌套返回）
    const cyberTitle =
      parsed.cyberTitle ||
      parsed.title ||
      parsed['赛博命盘']?.['命格'] ||
      parsed['命格'] ||
      parsed['封号'] ||
      '夜行饕餮·赛博散财行者';

    const fortuneLevel =
      parsed.fortuneLevel ||
      parsed.level ||
      (analytics.netSavings >= 500 ? '大吉·赛博暴富' : analytics.midnightExpenseRatio > 30 ? '下下·赛博破产劫' : '中平·量入为出');

    const motto =
      parsed.motto ||
      parsed['毒舌判词'] ||
      parsed['赛博箴言'] ||
      parsed['消费性格']?.['毒舌点评'] ||
      parsed['消费性格']?.['消费人格OS'] ||
      '消费是后现代的镜子，照出深夜失控的数字游民。';

    const deepAnalysis =
      parsed.deepAnalysis ||
      parsed['赛博命盘']?.['盘主画像'] ||
      parsed['赛博命盘']?.['财运批注'] ||
      parsed['维度解析']?.['综合诊断'] ||
      `近期发生 ${analytics.transactionCount} 笔资金流转，恩格尔指数 ${analytics.engelCoefficient}%，深夜消费占比 ${analytics.midnightExpenseRatio}%。`;

    let traits: string[] = [];
    if (Array.isArray(parsed.traits)) {
      traits = parsed.traits;
    } else if (Array.isArray(parsed['消费性格']?.['主标签'])) {
      traits = parsed['消费性格']['主标签'];
    } else if (Array.isArray(parsed.tags)) {
      traits = parsed.tags;
    } else {
      traits = ['数字游民', '即兴买单', '深夜哲学'];
    }

    let warnings: string[] = [];
    if (Array.isArray(parsed.warnings)) {
      warnings = parsed.warnings;
    } else {
      warnings = [
        `警惕「${analytics.topCategories[0]?.name || '高频消费'}」品类的隐性流失。`,
        '子时（23:00-02:00）严禁浏览任何促销或打折游戏。',
        '小心各类「特惠分期」与自动续费服务陷阱。',
      ];
    }

    let goodDeeds: string[] = [];
    if (Array.isArray(parsed.goodDeeds)) {
      goodDeeds = parsed.goodDeeds;
    } else {
      goodDeeds = [
        '清空一次未付款的购物车，赛博功德 +66。',
        '自制一顿健康高纤午餐代替高油外卖，赛博功德 +88。',
        '为优秀开源项目点一个 Star，积累开发者赛博气运。',
      ];
    }

    const cyberMerit = Number(parsed.cyberMerit) || 888 + Math.floor(Math.random() * 150);
    const luckyItem = parsed.luckyItem || parsed['本命开运物'] || '降噪耳机';
    const fleeAdvice = parsed.fleeAdvice || parsed['避险口诀'] || '付款之前默数三秒，心如止水';

    return {
      diagnosis: {
        cyberTitle,
        fortuneLevel,
        motto,
        deepAnalysis,
        traits,
        warnings,
        goodDeeds,
        cyberMerit,
        luckyItem,
        fleeAdvice,
      },
      source: 'ai',
    };
  } catch (err) {
    console.warn('DeepSeek fetch failed or timed out, executing seamless fallback:', err);
    return { diagnosis: generateLocalRuleFortune(analytics), source: 'fallback' };
  }
}
