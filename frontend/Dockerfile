# 多阶段构建 Dockerfile for Taro H5 项目

# 第一阶段：构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache python3 make g++

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 清理 npm 缓存并安装依赖
RUN npm cache clean --force && \
    npm ci --only=production=false --no-optional

# 复制源代码
COPY . .

# 构建 H5 项目
RUN npm run build:h5

# 第二阶段：生产阶段
FROM nginx:alpine

# 复制自定义 nginx 配置
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物到 nginx 静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]