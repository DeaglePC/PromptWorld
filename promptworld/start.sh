#!/bin/bash

# PromptWorld 启动脚本

echo "🚀 启动 PromptWorld 项目..."

# 检查Go环境
if ! command -v go &> /dev/null; then
    echo "❌ 错误: 未找到Go环境，请先安装Go 1.21+"
    exit 1
fi

# 检查MongoDB连接
echo "📡 检查MongoDB连接..."
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  警告: 未找到MongoDB客户端，请确保MongoDB服务正在运行"
fi

# 进入后端目录
cd backend

# 检查go.mod文件
if [ ! -f "go.mod" ]; then
    echo "❌ 错误: 未找到go.mod文件"
    exit 1
fi

# 安装依赖
echo "📦 安装Go依赖..."
go mod tidy

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚠️  警告: 未找到.env文件，使用默认配置"
fi

# 启动后端服务
echo "🔥 启动后端服务..."
echo "📍 服务地址: http://localhost:8080"
echo "📍 API地址: http://localhost:8080/api/v1"
echo "📍 前端页面: http://localhost:8080"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

go run main.go