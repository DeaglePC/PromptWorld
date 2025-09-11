package controllers

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"promptworld/config"
	"promptworld/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// GetPrompts 获取提示词列表
func GetPrompts(c *gin.Context) {
	collection := config.GetCollection("prompts")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 获取查询参数
	category := c.Query("category")
	search := c.Query("search")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	// 构建查询条件
	filter := bson.M{}
	if category != "" && category != "全部" {
		filter["category"] = category
	}
	if search != "" {
		filter["$or"] = []bson.M{
			{"title": bson.M{"$regex": search, "$options": "i"}},
			{"description": bson.M{"$regex": search, "$options": "i"}},
			{"content": bson.M{"$regex": search, "$options": "i"}},
		}
	}

	// 计算跳过的文档数
	skip := (page - 1) * limit

	// 设置查询选项
	opts := options.Find()
	opts.SetLimit(int64(limit))
	opts.SetSkip(int64(skip))
	opts.SetSort(bson.D{{"created_at", -1}}) // 按创建时间倒序

	// 执行查询
	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.PromptResponse{
			Success: false,
			Message: "查询提示词失败: " + err.Error(),
			Data:    []models.Prompt{},
		})
		return
	}
	defer cursor.Close(ctx)

	// 解析结果
	var prompts []models.Prompt
	if err = cursor.All(ctx, &prompts); err != nil {
		c.JSON(http.StatusInternalServerError, models.PromptResponse{
			Success: false,
			Message: "解析提示词数据失败: " + err.Error(),
			Data:    []models.Prompt{},
		})
		return
	}

	// 获取总数
	total, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		total = 0
	}

	c.JSON(http.StatusOK, models.PromptResponse{
		Success: true,
		Message: "获取提示词列表成功",
		Data:    prompts,
		Total:   total,
	})
}

// GetPromptByID 根据ID获取单个提示词详情
func GetPromptByID(c *gin.Context) {
	collection := config.GetCollection("prompts")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 获取ID参数
	idParam := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.PromptDetailResponse{
			Success: false,
			Message: "无效的提示词ID",
		})
		return
	}

	// 查询提示词
	var prompt models.Prompt
	err = collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&prompt)
	if err != nil {
		c.JSON(http.StatusNotFound, models.PromptDetailResponse{
			Success: false,
			Message: "提示词不存在",
		})
		return
	}

	// 增加浏览次数
	go func() {
		updateCtx, updateCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer updateCancel()
		collection.UpdateOne(updateCtx, bson.M{"_id": objectID}, bson.M{"$inc": bson.M{"views": 1}})
	}()

	c.JSON(http.StatusOK, models.PromptDetailResponse{
		Success: true,
		Message: "获取提示词详情成功",
		Data:    prompt,
	})
}

// GetCategories 获取所有分类
func GetCategories(c *gin.Context) {
	collection := config.GetCollection("prompts")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 获取所有不重复的分类
	categories, err := collection.Distinct(ctx, "category", bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "获取分类失败: " + err.Error(),
			"data":    []string{},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "获取分类成功",
		"data":    categories,
	})
}