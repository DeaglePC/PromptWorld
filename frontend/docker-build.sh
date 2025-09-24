#!/bin/bash

# 构建和运行 PromptWorld 前端 H5 服务的脚本

echo "🚀 开始构建 PromptWorld 前端 Docker 镜像..."

# 构建 Docker 镜像 (优先使用 Ubuntu 版本)
echo "🔄 尝试使用 Ubuntu 基础镜像构建..."
docker build -f Dockerfile.ubuntu -t promptworld-frontend:latest .

# 如果 Ubuntu 版本失败，尝试 Alpine 版本
if [ $? -ne 0 ]; then
    echo "⚠️  Ubuntu 版本构建失败，尝试 Alpine 版本..."
    docker build -f Dockerfile -t promptworld-frontend:latest .
fi

if [ $? -eq 0 ]; then
    echo "✅ Docker 镜像构建成功！"
    
    echo "🔄 停止并删除现有容器（如果存在）..."
    docker stop promptworld-frontend 2>/dev/null || true
    docker rm promptworld-frontend 2>/dev/null || true
    
    echo "🚀 启动新容器..."
    docker run -d \
        --name promptworld-frontend \
        -p 3000:80 \
        --restart unless-stopped \
        promptworld-frontend:latest
    
    if [ $? -eq 0 ]; then
        echo "✅ 容器启动成功！"
        echo "🌐 前端服务已启动，访问地址: http://localhost:3000"
        echo "📊 查看容器状态: docker ps"
        echo "📋 查看容器日志: docker logs promptworld-frontend"
    else
        echo "❌ 容器启动失败！"
        exit 1
    fi
else
    echo "❌ Docker 镜像构建失败！"
    exit 1
fi