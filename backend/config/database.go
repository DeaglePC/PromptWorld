package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

// ConnectDatabase 连接MongoDB数据库
func ConnectDatabase() {
	// 从环境变量获取MongoDB连接字符串，如果没有则使用默认值
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "promptworld"
	}

	// 设置客户端选项
	clientOptions := options.Client().ApplyURI(mongoURI)

	// 连接到MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal("连接MongoDB失败:", err)
	}

	// 检查连接
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("MongoDB连接测试失败:", err)
	}

	DB = client.Database(dbName)
	fmt.Println("成功连接到MongoDB数据库:", dbName)
}

// GetCollection 获取指定集合
func GetCollection(collectionName string) *mongo.Collection {
	return DB.Collection(collectionName)
}
