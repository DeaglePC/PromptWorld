package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Prompt 提示词模型
type Prompt struct {
	ID            primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title         string             `json:"title" bson:"title"`                   // 提示词标题
	Description   string             `json:"description" bson:"description"`       // 提示词描述
	Content       string             `json:"content" bson:"content"`               // 提示词内容
	Category      string             `json:"category" bson:"category"`             // 主分类（如：文案写作、图像生成、代码编程）
	Type          string             `json:"type" bson:"type"`                     // 具体类型（如：营销文案、Logo设计、Python脚本）
	Tags          []string           `json:"tags" bson:"tags"`                     // 多维标签（如：["营销","创意","短视频"]）
	PreviewImages []string           `json:"preview_images" bson:"preview_images"` // 预览图片URL
	Usage         string             `json:"usage" bson:"usage"`                   // 使用说明
	Likes         int                `json:"likes" bson:"likes"`                   // 点赞数
	Comments      int                `json:"comments" bson:"comments"`             // 评论数
	Rating        float64            `json:"rating" bson:"rating"`                 // 评分
	Views         int                `json:"views" bson:"views"`                   // 浏览次数
	CreatedAt     time.Time          `json:"created_at" bson:"created_at"`         // 创建时间
	UpdatedAt     time.Time          `json:"updated_at" bson:"updated_at"`         // 更新时间
}

// PromptResponse API响应结构
type PromptResponse struct {
	Success bool     `json:"success"`
	Message string   `json:"message"`
	Data    []Prompt `json:"data"`
	Total   int64    `json:"total"`
}

// PromptDetailResponse 单个提示词响应结构
type PromptDetailResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    Prompt `json:"data"`
}
