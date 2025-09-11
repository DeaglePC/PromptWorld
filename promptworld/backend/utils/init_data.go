package utils

import (
	"context"
	"log"
	"time"

	"promptworld/config"
	"promptworld/models"

	"go.mongodb.org/mongo-driver/bson"
)

// InitSampleData 初始化示例数据
func InitSampleData() {
	collection := config.GetCollection("prompts")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 检查是否已有数据
	count, err := collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		log.Printf("检查数据失败: %v", err)
		return
	}

	if count > 0 {
		log.Println("数据库已有数据，跳过初始化")
		return
	}

	// 示例数据
	samplePrompts := []models.Prompt{
		{
			Title:       "专业文案创作大师",
			Description: "帮助您创作引人入胜的营销文案，提升品牌影响力和转化率。",
			Content: `你是一位资深的文案创作专家，擅长撰写各种类型的营销文案。请根据以下要求创作一份吸引人的文案：

产品/服务：[在此输入产品或服务名称]
目标受众：[描述目标客户群体]
核心卖点：[列出主要优势]

要求：
1. 标题要有冲击力，能够立即抓住注意力
2. 内容要突出产品价值和用户利益
3. 语言要生动有趣，避免枯燥的描述
4. 结尾要有明确的行动号召`,
			Category:      "文案写作",
			Type:          "营销文案",
			Tags:          []string{"营销", "创意", "转化", "新手友好"},
			PreviewImages: []string{},
			Usage:         "适用于各种营销场景，包括产品介绍、广告文案、社交媒体内容等。",
			Likes:         1200,
			Comments:      89,
			Rating:        4.8,
			Views:         5600,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
		{
			Title:       "AI图像生成大师",
			Description: "专业的AI艺术创作提示词，帮您生成高质量的艺术作品和设计素材。",
			Content: `Create a stunning digital artwork featuring [主题描述], in the style of [艺术风格], with [色彩方案] color palette. The composition should be [构图描述], with dramatic lighting and intricate details. High resolution, professional quality, trending on ArtStation.

参数建议：
- 分辨率：1024x1024
- 采样步数：50
- CFG Scale：7-12`,
			Category:      "图像生成",
			Type:          "艺术创作",
			Tags:          []string{"AI绘画", "艺术", "设计", "专业"},
			PreviewImages: []string{"https://picsum.photos/300/300?random=1", "https://picsum.photos/300/300?random=2"},
			Usage:         "适用于Midjourney、Stable Diffusion、DALL-E等AI绘画工具。",
			Likes:         2100,
			Comments:      156,
			Rating:        4.9,
			Views:         8900,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
		{
			Title:       "代码优化专家",
			Description: "智能代码审查和优化建议，提升代码质量和性能。",
			Content: `作为一位经验丰富的软件工程师，请帮我分析以下代码并提供优化建议：

[在此粘贴您的代码]

请从以下几个方面进行分析：
1. 代码可读性和结构
2. 性能优化机会
3. 潜在的bug和安全问题
4. 最佳实践建议
5. 重构建议（如果需要）

请提供具体的改进代码示例。`,
			Category:      "代码编程",
			Type:          "代码审查",
			Tags:          []string{"编程", "代码审查", "优化", "最佳实践"},
			PreviewImages: []string{},
			Usage:         "适用于各种编程语言的代码审查和优化场景。",
			Likes:         856,
			Comments:      67,
			Rating:        4.7,
			Views:         3400,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
		{
			Title:       "市场分析顾问",
			Description: "深度市场分析和商业策略制定，助力企业决策。",
			Content: `你是一位资深的商业分析师，请对以下市场进行深度分析：

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
			Category:      "商业营销",
			Type:          "市场分析",
			Tags:          []string{"市场分析", "商业策略", "咨询", "决策支持"},
			PreviewImages: []string{},
			Usage:         "适用于企业市场调研、投资决策、商业计划制定等场景。",
			Likes:         743,
			Comments:      45,
			Rating:        4.6,
			Views:         2800,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
		{
			Title:       "个性化学习导师",
			Description: "根据学习者特点制定个性化学习计划，提升学习效率。",
			Content: `作为一位经验丰富的教育专家，请为学习者制定个性化学习计划：

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
			Category:      "学习教育",
			Type:          "学习规划",
			Tags:          []string{"教育", "学习计划", "个性化", "效率提升"},
			PreviewImages: []string{},
			Usage:         "适用于各种学科和技能的学习规划，包括语言学习、职业技能提升等。",
			Likes:         1500,
			Comments:      123,
			Rating:        4.8,
			Views:         6200,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
		{
			Title:       "专业摄影师",
			Description: "专业摄影构图和后期处理指导，提升摄影作品质量。",
			Content: `Professional photography of [拍摄主题], shot with [相机型号], [镜头规格], in [拍摄环境]. 

技术参数：
- 光圈：f/[数值]
- 快门：1/[数值]s
- ISO：[数值]
- 焦距：[数值]mm

构图要求：[构图描述]
光线条件：[光线描述]
后期风格：[后期处理风格]

High resolution, sharp focus, professional lighting, award-winning photography.`,
			Category:      "创意设计",
			Type:          "摄影指导",
			Tags:          []string{"摄影", "构图", "后期", "专业技巧"},
			PreviewImages: []string{"https://picsum.photos/300/300?random=3", "https://picsum.photos/300/300?random=4", "https://picsum.photos/300/300?random=5"},
			Usage:         "适用于各种摄影场景，包括人像、风景、产品摄影等。",
			Likes:         967,
			Comments:      78,
			Rating:        4.7,
			Views:         4100,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
		{
			Title:       "Logo设计专家",
			Description: "专业品牌标识设计，打造独特的视觉识别系统。",
			Content: `Design a modern, minimalist logo for [公司/品牌名称], a [行业类型] company. 

设计要求：
- 风格：[现代/经典/创意等]
- 颜色：[主色调偏好]
- 元素：[希望包含的设计元素]
- 应用场景：[使用场合]

The logo should be:
- Scalable and readable at any size
- Memorable and distinctive
- Appropriate for digital and print media
- Timeless design that won't quickly become outdated

Vector format, clean lines, professional appearance.`,
			Category:      "创意设计",
			Type:          "Logo设计",
			Tags:          []string{"Logo设计", "品牌", "视觉设计", "企业形象"},
			PreviewImages: []string{"https://picsum.photos/300/300?random=6", "https://picsum.photos/300/300?random=7"},
			Usage:         "适用于企业品牌设计、个人品牌建设、产品标识设计等。",
			Likes:         1300,
			Comments:      92,
			Rating:        4.9,
			Views:         5500,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
		{
			Title:       "数据科学家",
			Description: "专业数据分析和机器学习模型构建指导。",
			Content: `作为一位资深数据科学家，请帮我分析以下数据问题：

数据集描述：[数据集基本信息]
业务目标：[要解决的业务问题]
数据规模：[数据量和维度]

请提供：
1. 数据探索和清洗策略
2. 特征工程建议
3. 适合的机器学习算法
4. 模型评估指标
5. 结果解释和业务建议
6. 可视化展示方案

请包含具体的Python代码示例。`,
			Category:      "数据分析",
			Type:          "机器学习",
			Tags:          []string{"数据科学", "机器学习", "Python", "算法"},
			PreviewImages: []string{},
			Usage:         "适用于数据分析项目、机器学习模型开发、业务数据洞察等场景。",
			Likes:         654,
			Comments:      34,
			Rating:        4.5,
			Views:         2900,
			CreatedAt:     time.Now(),
			UpdatedAt:     time.Now(),
		},
	}

	// 插入示例数据
	for _, prompt := range samplePrompts {
		_, err := collection.InsertOne(ctx, prompt)
		if err != nil {
			log.Printf("插入示例数据失败: %v", err)
		}
	}

	log.Printf("成功初始化 %d 条示例数据", len(samplePrompts))
}
