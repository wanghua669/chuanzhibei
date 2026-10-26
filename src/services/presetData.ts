import { TransactionRecord } from '../types';

// 当代大学生特种兵账单 (充满校园梗、考研、疯狂星期四、拼好饭)
export const studentTransactions: TransactionRecord[] = [
  { id: 'st-01', date: '2026-10-01', time: '12:15:20', category: '餐饮美食', counterparty: '一食堂二楼麻辣烫', amount: 18.5, type: 'expense', description: '午餐麻辣烫+加两包方便面' },
  { id: 'st-02', date: '2026-10-01', time: '18:40:11', category: '餐饮美食', counterparty: '蜜雪冰城(大学城店)', amount: 7.0, type: 'expense', description: '冰鲜柠檬水+棒打鲜橙' },
  { id: 'st-03', date: '2026-10-02', time: '23:45:10', category: '餐饮美食', counterparty: '东门堕落街烤冷面', amount: 15.0, type: 'expense', description: '豪华烤冷面加金针菇辣条', isMidnight: true },
  { id: 'st-04', date: '2026-10-03', time: '09:20:05', category: '充值理财', counterparty: '校园一卡通银校转账', amount: 1500.0, type: 'income', description: '家里打来本月生活费' },
  { id: 'st-05', date: '2026-10-03', time: '10:05:00', category: '居家日用', counterparty: '校园水费电费代扣', amount: 50.0, type: 'expense', description: '寝室电费分摊' },
  { id: 'st-06', date: '2026-10-04', time: '14:22:18', category: '餐饮美食', counterparty: '美团拼好饭', amount: 11.9, type: 'expense', description: '拼好饭隆江猪脚饭双拼' },
  { id: 'st-07', date: '2026-10-05', time: '16:50:30', category: '学习提升', counterparty: '当当网图书专营', amount: 78.0, type: 'expense', description: '2027考研数学真题全解+草稿纸' },
  { id: 'st-08', date: '2026-10-06', time: '01:15:42', category: '休闲娱乐', counterparty: 'Steam游戏平台充值', amount: 198.0, type: 'expense', description: '打折入手开放世界新游DLC', isMidnight: true, isImpulse: true },
  { id: 'st-09', date: '2026-10-08', time: '12:00:00', category: '餐饮美食', counterparty: '肯德基V我50狂欢', amount: 50.0, type: 'expense', description: '疯狂星期四热辣香骨鸡+蛋挞' },
  { id: 'st-10', date: '2026-10-09', time: '17:30:22', category: '交通出行', counterparty: '哈啰单车月卡续费', amount: 15.8, type: 'expense', description: '抢早八通勤月卡' },
  { id: 'st-11', date: '2026-10-10', time: '20:10:45', category: '休闲娱乐', counterparty: '网易云音乐黑胶VIP', amount: 9.0, type: 'expense', description: '学生特惠深夜云村EMO会员' },
  { id: 'st-12', date: '2026-10-11', time: '12:30:19', category: '餐饮美食', counterparty: '二食堂瓦香鸡饭', amount: 16.0, type: 'expense', description: '微辣瓦香鸡配大米饭' },
  { id: 'st-13', date: '2026-10-12', time: '23:55:01', category: '餐饮美食', counterparty: '美团外卖-绝味鸭脖', amount: 38.5, type: 'expense', description: '寝室夜聊卤味配可乐', isMidnight: true },
  { id: 'st-14', date: '2026-10-14', time: '15:40:00', category: '居家日用', counterparty: '拼多多官方旗舰店', amount: 24.9, type: 'expense', description: '宿舍超大提抽纸40包' },
  { id: 'st-15', date: '2026-10-15', time: '18:15:33', category: '餐饮美食', counterparty: '瑞幸咖啡校园自提店', amount: 9.9, type: 'expense', description: '9.9生椰拿铁早八续命' },
  { id: 'st-16', date: '2026-10-16', time: '02:30:15', category: '数码数码', counterparty: '淘宝-二手Switch游戏卡带', amount: 210.0, type: 'expense', description: '通关后可回血卡带', isMidnight: true, isImpulse: true },
  { id: 'st-17', date: '2026-10-18', time: '19:00:00', category: '餐饮美食', counterparty: '海底捞火锅学生69折', amount: 89.0, type: 'expense', description: '期中考试后宿舍聚餐' },
  { id: 'st-18', date: '2026-10-20', time: '11:45:00', category: '学习提升', counterparty: '打印店论文与课件装订', amount: 14.5, type: 'expense', description: '课程结课大作业彩印' },
  { id: 'st-19', date: '2026-10-21', time: '21:10:00', category: '充值理财', counterparty: '闲鱼二手转卖收益', amount: 120.0, type: 'income', description: '出掉上学期旧教材与台灯' },
  { id: 'st-20', date: '2026-10-22', time: '12:20:10', category: '餐饮美食', counterparty: '沙县小吃(北门)', amount: 14.0, type: 'expense', description: '飘香拌面+扁肉套餐' },
];

// 苦逼赛博攻城狮/硬核开发者账单 (极客硬件、云服务、咖啡因、防脱发、夜间打车)
export const coderTransactions: TransactionRecord[] = [
  { id: 'cd-01', date: '2026-10-01', time: '10:00:00', category: '充值理财', counterparty: '某科技公司工资发放', amount: 16800.0, type: 'income', description: '本月赛博牛马劳动所得' },
  { id: 'cd-02', date: '2026-10-01', time: '11:30:20', category: '数码数码', counterparty: '阿里云/腾讯云算力实例续费', amount: 320.0, type: 'expense', description: '自建DeepSeek本地推理API服务器' },
  { id: 'cd-03', date: '2026-10-02', time: '09:15:00', category: '餐饮美食', counterparty: 'Manner Coffee精品烘焙', amount: 20.0, type: 'expense', description: '双份意式浓缩Espresso' },
  { id: 'cd-04', date: '2026-10-02', time: '23:50:12', category: '交通出行', counterparty: '滴滴企业版超额自费', amount: 68.0, type: 'expense', description: '上线大版本加班深夜打车', isMidnight: true },
  { id: 'cd-05', date: '2026-10-03', time: '14:20:11', category: '学习提升', counterparty: 'GitHub Copilot 年度订阅', amount: 699.0, type: 'expense', description: 'AI写代码人类负责Debug', isImpulse: true },
  { id: 'cd-06', date: '2026-10-04', time: '19:40:00', category: '餐饮美食', counterparty: '柳州肥汁螺蛳粉加炸蛋', amount: 28.0, type: 'expense', description: '高碳水多巴胺犒赏自己' },
  { id: 'cd-07', date: '2026-10-05', time: '01:30:45', category: '数码数码', counterparty: 'zFrontier客制化外设', amount: 890.0, type: 'expense', description: '全CNC铝坨坨套件+海棠轴体', isMidnight: true, isImpulse: true },
  { id: 'cd-08', date: '2026-10-06', time: '12:10:00', category: '餐饮美食', counterparty: '园区大厦自选快餐', amount: 35.0, type: 'expense', description: '两荤一素例汤无限续' },
  { id: 'cd-09', date: '2026-10-07', time: '16:00:20', category: '医疗保健', counterparty: '同仁堂大药房防脱洗发水', amount: 168.0, type: 'expense', description: '防脱发滋养液与护肝片' },
  { id: 'cd-10', date: '2026-10-08', time: '10:30:00', category: '居家日用', counterparty: '自如房屋租金代扣', amount: 3500.0, type: 'expense', description: '离公司3公里单间房租' },
  { id: 'cd-11', date: '2026-10-09', time: '15:20:15', category: '餐饮美食', counterparty: '瑞幸咖啡企业专送', amount: 19.8, type: 'expense', description: '下午茶加浓美式两杯' },
  { id: 'cd-12', date: '2026-10-10', time: '22:15:30', category: '医疗保健', counterparty: 'SKG颈椎按摩仪配件', amount: 299.0, type: 'expense', description: '拯救僵硬颈椎' },
  { id: 'cd-13', date: '2026-10-12', time: '00:45:00', category: '休闲娱乐', counterparty: 'Epic Games 限时大促', amount: 135.0, type: 'expense', description: '赛博朋克2077往日之影', isMidnight: true },
  { id: 'cd-14', date: '2026-10-14', time: '12:40:00', category: '餐饮美食', counterparty: '肯德基工作日午市套', amount: 39.5, type: 'expense', description: '老北京鸡肉卷+九龙金玉' },
  { id: 'cd-15', date: '2026-10-16', time: '20:30:10', category: '数码数码', counterparty: '京东自营-4K显示器悬臂支架', amount: 249.0, type: 'expense', description: '双屏代码流扩展' },
  { id: 'cd-16', date: '2026-10-18', time: '18:50:00', category: '交通出行', counterparty: '地铁交通卡NFC充值', amount: 200.0, type: 'expense', description: '通勤充值' },
  { id: 'cd-17', date: '2026-10-19', time: '02:10:00', category: '数码数码', counterparty: 'OpenAI API 消耗预付', amount: 142.0, type: 'expense', description: '测试提示词编排调用', isMidnight: true },
  { id: 'cd-18', date: '2026-10-21', time: '13:00:00', category: '餐饮美食', counterparty: '赛百味金枪鱼潜水艇', amount: 36.0, type: 'expense', description: '健康减脂轻食午餐' },
];

// 精致月光族打工人账单 (潮玩盲盒、轻奢餐饮、健身房、微醺小酒馆、即兴打车)
export const moonlightTransactions: TransactionRecord[] = [
  { id: 'ml-01', date: '2026-10-01', time: '10:00:00', category: '充值理财', counterparty: '薪酬发放', amount: 8500.0, type: 'income', description: '到手工资' },
  { id: 'ml-02', date: '2026-10-01', time: '11:45:00', category: '餐饮美食', counterparty: '星巴克臻选店', amount: 42.0, type: 'expense', description: '太妃榛果拿铁+可颂' },
  { id: 'ml-03', date: '2026-10-01', time: '19:30:00', category: '休闲娱乐', counterparty: '泡泡玛特盲盒自动贩卖机', amount: 138.0, type: 'expense', description: 'Skullpanda系列连抽2个' },
  { id: 'ml-04', date: '2026-10-02', time: '23:30:15', category: '休闲娱乐', counterparty: '海伦司微醺小酒馆', amount: 286.0, type: 'expense', description: '周末跟闺蜜小酌精酿', isMidnight: true, isImpulse: true },
  { id: 'ml-05', date: '2026-10-03', time: '01:10:00', category: '交通出行', counterparty: '滴滴专车(夜间加价)', amount: 72.0, type: 'expense', description: '微醺打车回家', isMidnight: true },
  { id: 'ml-06', date: '2026-10-04', time: '14:00:00', category: '休闲娱乐', counterparty: '乐刻运动健身年卡分期', amount: 399.0, type: 'expense', description: '决心健身(实则只洗澡一次)', isImpulse: true },
  { id: 'ml-07', date: '2026-10-05', time: '17:20:00', category: '医疗保健', counterparty: '丝芙兰专柜', amount: 680.0, type: 'expense', description: '抗初老精华霜与补水面膜', isImpulse: true },
  { id: 'ml-08', date: '2026-10-06', time: '12:30:00', category: '餐饮美食', counterparty: 'Wagas轻食能量碗', amount: 68.0, type: 'expense', description: '减脂沙拉+鲜榨胡萝卜汁' },
  { id: 'ml-09', date: '2026-10-08', time: '10:00:00', category: '居家日用', counterparty: '精装公寓房租', amount: 3200.0, type: 'expense', description: '青年社区月租' },
  { id: 'ml-10', date: '2026-10-09', time: '19:15:00', category: '餐饮美食', counterparty: '太二酸菜鱼', amount: 156.0, type: 'expense', description: '工作日犒赏晚餐' },
  { id: 'ml-11', date: '2026-10-10', time: '23:45:00', category: '休闲娱乐', counterparty: '小红书种草香薰蜡烛', amount: 188.0, type: 'expense', description: '情绪价值提升好物', isMidnight: true },
  { id: 'ml-12', date: '2026-10-12', time: '13:00:00', category: '餐饮美食', counterparty: '喜茶HEYTEA', amount: 22.0, type: 'expense', description: '多肉葡萄去冰少甜' },
  { id: 'ml-13', date: '2026-10-14', time: '00:20:00', category: '居家日用', counterparty: '淘宝李佳琦直播间', amount: 450.0, type: 'expense', description: '囤积洗护用品与香氛', isMidnight: true, isImpulse: true },
  { id: 'ml-14', date: '2026-10-16', time: '18:40:00', category: '餐饮美食', counterparty: '日式居酒屋定食', amount: 120.0, type: 'expense', description: '蒲烧鳗鱼饭套餐' },
  { id: 'ml-15', date: '2026-10-18', time: '15:30:00', category: '交通出行', counterparty: '周末近郊打车往返', amount: 140.0, type: 'expense', description: '网红露营地打卡' },
  { id: 'ml-16', date: '2026-10-20', time: '20:10:00', category: '休闲娱乐', counterparty: '脱口秀剧场现场门票', amount: 280.0, type: 'expense', description: '快乐解压现场票' },
];

export const PRESET_INFO = {
  student: {
    name: '当代大学生特种兵',
    tag: '校园一卡通·疯狂星期四·拼好饭',
    desc: '预算极其有限但恩格尔系数爆棚，主要支出为食堂、夜宵烧烤、考研真题与特价游戏。',
    transactions: studentTransactions,
  },
  coder: {
    name: '苦逼赛博攻城狮',
    tag: '云服务·机械键盘·防脱发·夜行打车',
    desc: '高收入但重度加班，消费充满硬核数码外设、AI订阅、浓缩咖啡和颈椎理疗。',
    transactions: coderTransactions,
  },
  moonlight: {
    name: '精致月光打工人',
    tag: '精品咖啡·潮玩盲盒·微醺小酒·即兴剁手',
    desc: '为情绪价值高频买单，生活精致但月底银行卡余额经常处于赛博归零状态。',
    transactions: moonlightTransactions,
  },
};
