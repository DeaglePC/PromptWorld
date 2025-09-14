// 模拟数据
export const mockPrompts = [
  {
    id: '1',
    title: '专业文案创作大师',
    description: '帮助您创作引人入胜的营销文案，提升品牌影响力和转化率。',
    content: `你是一位资深的文案创作专家，擅长撰写各种类型的营销文案。请根据以下要求创作一份吸引人的文案：

产品/服务：[在此输入产品或服务名称]
目标受众：[描述目标客户群体]
核心卖点：[列出主要优势]

要求：
1. 标题要有冲击力，能够立即抓住注意力
2. 内容要突出产品价值和用户利益
3. 语言要生动有趣，避免枯燥的描述
4. 结尾要有明确的行动号召`,
    type: '文案写作',
    category: 'writing',
    likes: 1200,
    comments: 89,
    rating: 4.8,
    preview_images: []
  },
  {
    id: '2',
    title: 'AI图像生成大师',
    description: '专业的AI艺术创作提示词，帮您生成高质量的艺术作品和设计素材。',
    content: `Create a stunning digital artwork featuring [主题描述], in the style of [艺术风格], with [色彩方案] color palette. The composition should be [构图描述], with dramatic lighting and intricate details. High resolution, professional quality, trending on ArtStation.

参数建议：
- 分辨率：1024x1024
- 采样步数：50
- CFG Scale：7-12`,
    type: '图像生成',
    category: 'design',
    likes: 2100,
    comments: 156,
    rating: 4.9,
    preview_images: [
      'https://picsum.photos/300/300?random=1',
      'https://picsum.photos/300/300?random=2'
    ]
  },
  {
    id: '3',
    title: '代码优化专家',
    description: '智能代码审查和优化建议，提升代码质量和性能。',
    content: `作为一位经验丰富的软件工程师，请帮我分析以下代码并提供优化建议：

[在此粘贴您的代码]

请从以下几个方面进行分析：
1. 代码可读性和结构
2. 性能优化机会
3. 潜在的bug和安全问题
4. 最佳实践建议
5. 重构建议（如果需要）

请提供具体的改进代码示例。`,
    type: '代码编程',
    category: 'code',
    likes: 856,
    comments: 67,
    rating: 4.7,
    preview_images: []
  },
  {
    id: '4',
    title: '市场分析顾问',
    description: '深度市场分析和商业策略制定，助力企业决策。',
    content: `你是一位资深的商业分析师，请对以下市场进行深度分析：

行业/市场：[输入目标行业]
地区：[输入目标地区]
时间范围：[分析时间段]

请提供：
1. 市场规模和增长趋势
2. 主要竞争对手分析
3. 目标客户画像
4. 市场机会和威胁
5. 进入策略建议
6. 风险评估和应对措施`,
    type: '市场分析',
    category: 'business',
    likes: 743,
    comments: 45,
    rating: 4.6,
    preview_images: []
  },
  {
    id: '5',
    title: '个性化学习导师',
    description: '根据学习者特点制定个性化学习计划，提升学习效率。',
    content: `作为一位经验丰富的教育专家，请为学习者制定个性化学习计划：

学习目标：[具体学习目标]
当前水平：[现有知识基础]
可用时间：[每日/每周学习时间]
学习偏好：[学习方式偏好]

请提供：
1. 详细的学习路径规划
2. 阶段性学习目标
3. 推荐的学习资源
4. 学习方法和技巧
5. 进度评估标准
6. 激励和坚持策略`,
    type: '学习教育',
    category: 'education',
    likes: 1500,
    comments: 123,
    rating: 4.8,
    preview_images: []
  },
  {
    id: '6',
    title: '专业摄影师',
    description: '专业摄影构图和后期处理指导，提升摄影作品质量。',
    content: `Professional photography of [拍摄主题], shot with [相机型号], [镜头规格], in [拍摄环境]. 

技术参数：
- 光圈：f/[数值]
- 快门：1/[数值]s
- ISO：[数值]
- 焦距：[数值]mm

构图要求：[构图描述]
光线条件：[光线描述]
后期风格：[后期处理风格]

High resolution, sharp focus, professional lighting, award-winning photography.`,
    type: '创意设计',
    category: 'design',
    likes: 967,
    comments: 78,
    rating: 4.7,
    preview_images: [
      'https://picsum.photos/300/300?random=3',
      'https://picsum.photos/300/300?random=4',
      'https://picsum.photos/300/300?random=5'
    ]
  },
  {
    id: '7',
    title: 'Logo设计专家',
    description: '专业品牌标识设计，打造独特的视觉识别系统。',
    content: `Design a modern, minimalist logo for [公司/品牌名称], a [行业类型] company. 

设计要求：
- 风格：[现代/经典/创意等]
- 颜色：[主色调偏好]
- 元素：[希望包含的设计元素]
- 应用场景：[使用场合]

The logo should be:
- Scalable and readable at any size
- Memorable and distinctive
- Appropriate for digital and print media
- Timeless design that won't quickly become outdated`,
    type: '创意设计',
    category: 'design',
    likes: 1234,
    comments: 91,
    rating: 4.9,
    preview_images: [
      'https://picsum.photos/300/300?random=6',
      'https://picsum.photos/300/300?random=7'
    ]
  },
  {
    id: '8',
    title: '数据分析专家',
    description: '深度数据挖掘和可视化分析，洞察业务趋势。',
    content: `作为数据分析专家，请对以下数据进行深度分析：

数据类型：[描述数据来源和类型]
分析目标：[明确分析目的]
业务背景：[相关业务场景]

分析要求：
1. 数据清洗和预处理
2. 探索性数据分析
3. 统计分析和假设检验
4. 数据可视化
5. 业务洞察和建议
6. 预测模型构建（如需要）

请提供详细的分析报告和可视化图表。`,
    type: '数据分析',
    category: 'data',
    likes: 678,
    comments: 34,
    rating: 4.5,
    preview_images: []
  }
]

export const mockCategories = [
  { id: '1', name: '文案写作' },
  { id: '2', name: '图像生成' },
  { id: '3', name: '代码编程' },
  { id: '4', name: '商业营销' },
  { id: '5', name: '学习教育' },
  { id: '6', name: '创意设计' },
  { id: '7', name: '数据分析' }
]