package main

import (
	"log"
	"os"

	"promptworld/config"
	"promptworld/routes"
	"promptworld/utils"

	"github.com/joho/godotenv"
)

func main() {
	// 加载环境变量
	if err := godotenv.Load(); err != nil {
		log.Println("未找到.env文件，使用默认配置")
	}

	// 连接数据库
	config.ConnectDatabase()

	// 初始化示例数据
	utils.InitSampleData()

	// 设置路由
	router := routes.SetupRoutes()

	// 获取端口号
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("服务器启动在端口: %s", port)
	log.Fatal(router.Run(":" + port))
}
