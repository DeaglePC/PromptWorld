# PromptWorld 前端 Docker 部署指南

本指南介绍如何使用 Docker 部署 PromptWorld 前端 H5 服务。

## 📋 文件说明

- `Dockerfile` - Docker 镜像构建文件 (Alpine 版本)
- `Dockerfile.ubuntu` - Docker 镜像构建文件 (Ubuntu 版本，推荐)
- `nginx.conf` - Nginx 配置文件
- `.dockerignore` - Docker 构建忽略文件
- `docker-compose.yml` - Docker Compose 配置文件
- `docker-build.sh` - Linux/Mac 构建脚本
- `docker-build.bat` - Windows 构建脚本

## 🚀 快速开始

### 方法一：使用构建脚本（推荐）

**Windows 用户：**
```bash
# 双击运行或在命令行执行
docker-build.bat
```

**Linux/Mac 用户：**
```bash
# 给脚本执行权限
chmod +x docker-build.sh

# 运行脚本
./docker-build.sh
```

### 方法二：使用 Docker Compose

```bash
# 构建并启动服务
docker-compose up -d --build

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 方法三：手动 Docker 命令

**推荐使用 Ubuntu 版本（更稳定）：**
```bash
# 1. 构建镜像
docker build -f Dockerfile.ubuntu -t promptworld-frontend:latest .

# 2. 运行容器
docker run -d \
  --name promptworld-frontend \
  -p 3000:80 \
  --restart unless-stopped \
  promptworld-frontend:latest
```

**如果 Ubuntu 版本有问题，可以尝试 Alpine 版本：**
```bash
# 1. 构建镜像
docker build -f Dockerfile -t promptworld-frontend:latest .

# 2. 运行容器
docker run -d \
  --name promptworld-frontend \
  -p 3000:80 \
  --restart unless-stopped \
  promptworld-frontend:latest
```

## 🌐 访问服务

服务启动成功后，可以通过以下地址访问：

- **本地访问：** http://localhost:3000
- **局域网访问：** http://[你的IP地址]:3000

## 📊 常用命令

```bash
# 查看运行中的容器
docker ps

# 查看容器日志
docker logs promptworld-frontend

# 进入容器内部
docker exec -it promptworld-frontend sh

# 停止容器
docker stop promptworld-frontend

# 删除容器
docker rm promptworld-frontend

# 删除镜像
docker rmi promptworld-frontend:latest
```

## 🔧 配置说明

### Nginx 配置特性

- **Gzip 压缩：** 减少传输大小，提高加载速度
- **静态资源缓存：** 1年缓存期，提高性能
- **SPA 路由支持：** 支持前端路由，刷新页面不会404
- **健康检查：** `/health` 端点用于容器健康检查
- **API 代理：** 预留了后端 API 代理配置（需要时取消注释）

### 端口配置

- **容器内部端口：** 80 (Nginx)
- **映射到主机端口：** 3000
- **可自定义端口：** 修改 `docker-compose.yml` 或运行命令中的端口映射

## 🛠️ 自定义配置

### 修改端口

**方法1：修改 docker-compose.yml**
```yaml
ports:
  - "8080:80"  # 改为8080端口
```

**方法2：修改运行命令**
```bash
docker run -d --name promptworld-frontend -p 8080:80 promptworld-frontend:latest
```

### 添加环境变量

在 `docker-compose.yml` 中添加：
```yaml
environment:
  - NODE_ENV=production
  - API_BASE_URL=http://your-api-server
```

### 配置 API 代理

编辑 `nginx.conf`，取消注释并修改 API 代理部分：
```nginx
location /api/ {
    proxy_pass http://your-backend-server:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 🐛 故障排除

### 常见问题

1. **Taro 构建失败 (MODULE_NOT_FOUND)**
   - 这通常是因为 Alpine Linux 缺少必要的 native binding
   - **解决方案：** 使用 Ubuntu 版本的 Dockerfile
   ```bash
   docker build -f Dockerfile.ubuntu -t promptworld-frontend:latest .
   ```

2. **Node.js 版本不兼容**
   - Taro v4.1.6 需要 Node.js 20 或更高版本
   - 已在 Dockerfile 中使用 Node.js 20

3. **端口被占用**
   ```bash
   # 查看端口占用
   netstat -tulpn | grep :3000
   # 或者使用其他端口
   docker run -p 3001:80 promptworld-frontend:latest
   ```

4. **构建失败**
   ```bash
   # 清理 Docker 缓存
   docker system prune -a
   # 重新构建 (使用 Ubuntu 版本)
   docker build --no-cache -f Dockerfile.ubuntu -t promptworld-frontend:latest .
   ```

3. **容器无法启动**
   ```bash
   # 查看详细错误信息
   docker logs promptworld-frontend
   ```

4. **访问404**
   - 检查容器是否正常运行：`docker ps`
   - 检查端口映射是否正确
   - 查看 nginx 日志：`docker logs promptworld-frontend`

### 性能优化

1. **启用多阶段构建缓存**
   ```bash
   # 使用 BuildKit
   DOCKER_BUILDKIT=1 docker build -t promptworld-frontend:latest .
   ```

2. **资源限制**
   ```yaml
   # 在 docker-compose.yml 中添加
   deploy:
     resources:
       limits:
         memory: 512M
         cpus: '0.5'
   ```

## 📝 注意事项

1. 确保 Docker 已正确安装并运行
2. 构建过程需要网络连接下载依赖
3. 首次构建可能需要较长时间
4. 生产环境建议使用具体版本标签而非 `latest`
5. 定期更新基础镜像以获得安全补丁

## 🔄 更新部署

```bash
# 1. 停止现有容器
docker-compose down

# 2. 拉取最新代码
git pull

# 3. 重新构建并启动
docker-compose up -d --build