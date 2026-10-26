import { TransactionRecord } from '../types';

// 类别自动推断规则库
function inferCategory(text: string): string {
  const t = text.toLowerCase();
  if (/外卖|麦当劳|肯德基|汉堡|食堂|饭|面|麻辣烫|烧烤|火锅|奶茶|咖啡|星巴克|瑞幸|蜜雪|水果|超市|便利店|饿了么|美团|菜|吃|餐/.test(t)) {
    return '餐饮美食';
  }
  if (/steam|游戏|任天堂|switch|ps5|盲盒|泡泡玛特|电影|演出|剧场|酒馆|唱吧|网吧|娱乐|会员|网易云|bilibili|爱奇艺|腾讯视频/.test(t)) {
    return '休闲娱乐';
  }
  if (/电脑|手机|耳机|键盘|显示器|服务器|云|算力|数码|电子|ipad|iphone|外设|显卡|api|github/.test(t)) {
    return '数码数码';
  }
  if (/打车|滴滴|高德|地铁|公交|单车|火车|机票|铁路|加油|高速|交通/.test(t)) {
    return '交通出行';
  }
  if (/书|课程|教材|培训|考试|考研|四六级|论文|打印|学费/.test(t)) {
    return '学习提升';
  }
  if (/房租|水电|物业|纸巾|洗衣|日用|家居|百货|淘宝|拼多多|京东/.test(t)) {
    return '居家日用';
  }
  if (/药|医院|门诊|体检|洗牙|健身|护肤|面膜|理疗/.test(t)) {
    return '医疗保健';
  }
  if (/工资|收益|分红|理财|转账|还款|红包/.test(t)) {
    return '充值理财';
  }
  return '餐饮美食'; // 默认最常见
}

// 解析微信或支付宝导出的 CSV 文本
export function parseCSVBill(csvContent: string): TransactionRecord[] {
  const lines = csvContent.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const records: TransactionRecord[] = [];

  let headerIndex = -1;

  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    const line = lines[i];
    if (line.includes('交易时间') || line.includes('交易创建时间') || line.includes('时间,') || line.includes('金额')) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) {
    // 尝试直接逐行容错解析
    headerIndex = 0;
  }

  const headerLine = lines[headerIndex] || '';
  const headers = headerLine.split(',').map((h) => h.replace(/["'\s]/g, ''));

  // 识别关键列索引
  const timeIdx = headers.findIndex((h) => h.includes('时间'));
  const counterpartyIdx = headers.findIndex((h) => h.includes('交易对方') || h.includes('商品说明') || h.includes('商户'));
  const amountIdx = headers.findIndex((h) => h.includes('金额') || h.includes('金额(元)'));
  const typeIdx = headers.findIndex((h) => h.includes('收/支') || h.includes('收支') || h.includes('收/付款方式'));
  const descIdx = headers.findIndex((h) => h.includes('商品') || h.includes('备注') || h.includes('说明'));

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // 处理带逗号的双引号
    const tokens: string[] = [];
    let insideQuote = false;
    let currentToken = '';

    for (let charIdx = 0; charIdx < rawLine.length; charIdx++) {
      const char = rawLine[charIdx];
      if (char === '"' || char === "'") {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        tokens.push(currentToken.trim().replace(/^["']|["']$/g, ''));
        currentToken = '';
      } else {
        currentToken += char;
      }
    }
    tokens.push(currentToken.trim().replace(/^["']|["']$/g, ''));

    if (tokens.length < 3) continue;

    const rawTime = (timeIdx >= 0 && tokens[timeIdx]) ? tokens[timeIdx] : tokens[0];
    const counterparty = (counterpartyIdx >= 0 && tokens[counterpartyIdx]) ? tokens[counterpartyIdx] : (tokens[1] || '未知商户');
    const rawAmount = (amountIdx >= 0 && tokens[amountIdx]) ? tokens[amountIdx] : tokens[tokens.length - 1];
    const rawType = (typeIdx >= 0 && tokens[typeIdx]) ? tokens[typeIdx] : '';
    const desc = (descIdx >= 0 && tokens[descIdx]) ? tokens[descIdx] : counterparty;

    // 清理金额
    const cleanAmountStr = rawAmount.replace(/[¥￥,\s]/g, '');
    const amount = parseFloat(cleanAmountStr);
    if (isNaN(amount) || amount <= 0) continue;

    // 分离日期与时间
    let date = '2026-10-01';
    let time = '12:00:00';
    if (rawTime.includes(' ')) {
      const parts = rawTime.split(' ');
      date = parts[0];
      time = parts[1] || '12:00:00';
    } else if (rawTime.includes('T')) {
      const parts = rawTime.split('T');
      date = parts[0];
      time = parts[1].replace('Z', '') || '12:00:00';
    } else if (/\d{4}-\d{2}-\d{2}/.test(rawTime)) {
      date = rawTime;
    }

    // 判断收支
    let type: 'expense' | 'income' = 'expense';
    if (rawType.includes('收入') || rawType.includes('入账') || rawLine.includes('收入')) {
      type = 'income';
    }

    const hour = parseInt(time.split(':')[0] || '12', 10);
    const isMidnight = hour >= 23 || hour < 5;
    const category = inferCategory(counterparty + ' ' + desc);
    const isImpulse = amount >= 200 || (isMidnight && amount >= 50);

    records.push({
      id: `imp-${records.length + 1}-${Date.now()}`,
      date,
      time,
      category,
      counterparty,
      amount,
      type,
      description: desc || counterparty,
      isMidnight,
      isImpulse,
    });
  }

  return records;
}

// 快速智能文本解析（例如粘贴："10-15 瑞幸咖啡 19.9" 或 "麦当劳 35元"）
export function parseQuickText(text: string): TransactionRecord[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const records: TransactionRecord[] = [];

  const today = new Date().toISOString().split('T')[0];

  lines.forEach((line, idx) => {
    // 匹配金额：找出浮点数或整数
    const amountMatch = line.match(/(\d+(\.\d{1,2})?)\s*(元|块|RMB|￥)?/i);
    if (!amountMatch) return;

    const amount = parseFloat(amountMatch[1]);
    if (isNaN(amount) || amount <= 0) return;

    // 剔除金额后提取商户/内容
    const cleanText = line.replace(amountMatch[0], '').replace(/[¥￥]/g, '').trim();

    // 检查是否有时间日期
    let date = today;
    let time = '12:30:00';

    const dateMatch = cleanText.match(/(\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2})/);
    if (dateMatch) {
      date = dateMatch[1].replace('/', '-');
      if (date.length <= 5) {
        date = `2026-${date.padStart(5, '0')}`;
      }
    }

    const timeMatch = cleanText.match(/(\d{1,2}:\d{2}(:\d{2})?)/);
    if (timeMatch) {
      time = timeMatch[1].length === 5 ? `${timeMatch[1]}:00` : timeMatch[1];
    }

    const counterparty = cleanText
      .replace(dateMatch ? dateMatch[0] : '', '')
      .replace(timeMatch ? timeMatch[0] : '', '')
      .replace(/[,，:：]/g, ' ')
      .trim() || '日常消费';

    const hour = parseInt(time.split(':')[0] || '12', 10);
    const isMidnight = hour >= 23 || hour < 5;
    const category = inferCategory(counterparty);
    const isIncome = /工资|收入|兼职|转账收入|中奖|卖出/.test(cleanText);

    records.push({
      id: `txt-${idx + 1}-${Date.now()}`,
      date,
      time,
      category,
      counterparty,
      amount,
      type: isIncome ? 'income' : 'expense',
      description: counterparty,
      isMidnight,
      isImpulse: amount >= 150 || (isMidnight && amount >= 40),
    });
  });

  return records;
}
