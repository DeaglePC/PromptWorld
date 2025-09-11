package routes

import (
	"promptworld/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// SetupRoutes 设置路由
func SetupRoutes() *gin.Engine {
	router := gin.Default()

	// 配置CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:8080", "http://127.0.0.1:3000", "http://127.0.0.1:8080"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	router.Use(cors.New(config))

	// API路由组
	api := router.Group("/api/v1")
	{
		// 提示词相关路由
		prompts := api.Group("/prompts")
		{
			prompts.GET("", controllers.GetPrompts)        // 获取提示词列表
			prompts.GET("/:id", controllers.GetPromptByID) // 获取单个提示词详情
		}

		// 分类相关路由
		api.GET("/categories", controllers.GetCategories) // 获取所有分类
	}

	// 静态文件服务
	router.Static("/static", "../frontend/static")
	router.LoadHTMLGlob("../frontend/templates/*")

	// 首页路由
	router.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", gin.H{
			"title": "PromptWorld - AI提示词分享平台",
		})
	})

	return router
}
