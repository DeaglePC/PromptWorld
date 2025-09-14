# PromptWorld 部署指南

## 项目概述

PromptWorld 是一个基于 Taro + Go + MongoDB 的 AI 提示词分享平台，支持微信小程序和 Web 端。

## 项目结构

```
PromptWorld/
├── promptworld/
│   └── backend/                 # Go 后端服务
│       ├── main.go             # 入口文件
│       ├── controllers/        # 控制器
│       ├── models/            # 数据模型
│       ├── routes/            # 路由配置
│       ├── config/            # 数据库配置
│       └── utils/             # 工具函数
├── promptworld-frontend/        # Taro 前端应用
│   ├── src/
│   │   ├── components/        # 公共组件
│   │   ├── pages/            # 页面
│   │   ├── services/         # API 服务
│   │   ├── types/            # 类型定义
│   │   └── utils/            # 工具函数
│   ├── config/               # 构建配置
│   └── scripts/              # 构建脚本
└── ui-design-optimized.html    # UI 设计稿
```

## 技术栈

### 后端
- **语言**: Go 1.19+
- **框架**: Gin
- **数据库**: MongoDB
- **依赖管理**: Go Modules

### 前端
- **框架**: Taro 4.x
- **语言**: TypeScript
- **样式**: Sass
- **构建工具**: Vite
- **支持平台**: 微信小程序、H5、支付宝小程序等

## 环境要求

### 开发环境
- Node.js 16+
- Go 1.19+
- MongoDB 4.4+
- Git

### 生产环境
- 服务器: Linux/Windows
- 域名和 SSL 证书
- MongoDB 数据库
- Nginx (可选)

## 本地开发

### 1. 克隆项目
```bash
git clone <repository-url>
cd PromptWorld
```

### 2. 启动后端服务
```bash
cd promptworld/backend
go mod tidy
go run main.go
```

后端服务将启动在 `http://localhost:8081`

### 3. 启动前端开发服务器
```bash
cd promptworld-frontend
npm install
npm run dev:h5        # H5 开发
npm run dev:weapp     # 微信小程序开发
```

前端服务将启动在 `http://localhost:10086`

## 生产部署

### 后端部署

#### 1. 编译 Go 程序
```bash
cd promptworld/backend
go build -o promptworld-server main.go
```

#### 2. 配置环境变量
创建 `.env` 文件：
```bash
PORT=8081
MONGODB_URI=mongodb://username:password@host:port/
DB_NAME=promptworld
GIN_MODE=release
```

#### 3. 启动服务
```bash
./promptworld-server
```

#### 4. 使用 systemd 管理服务 (Linux)
创建 `/etc/systemd/system/promptworld.service`：
```ini
[Unit]
Description=PromptWorld API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/promptworld/backend
ExecStart=/path/to/promptworld/backend/promptworld-server
Restart=always
RestartSec=5
Environment=PATH=/usr/bin:/usr/local/bin
Environment=GIN_MODE=release

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
sudo systemctl enable promptworld
sudo systemctl start promptworld
```

### 前端部署

#### 1. H5 网页部署
```bash
cd promptworld-frontend
npm run build:h5
```

将 `dist` 目录部署到 Web 服务器。

#### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/promptworld-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 2. 微信小程序部署
```bash
cd promptworld-frontend
npm run build:weapp
```

使用微信开发者工具打开 `dist` 目录，上传代码。

## 数据库配置

### MongoDB 初始化
项目会自动创建示例数据，包括：
- 文案写作类提示词
- 图像生成类提示词
- 代码编程类提示词
- 商业营销类提示词
- 学习教育类提示词

### 数据备份
```bash
mongodump --uri="mongodb://username:password@host:port/promptworld" --out backup/
```

### 数据恢复
```bash
mongorestore --uri="mongodb://username:password@host:port/promptworld" backup/promptworld/
```

## 域名和 HTTPS 配置

### 1. 申请 SSL 证书
推荐使用 Let's Encrypt 免费证书：
```bash
sudo certbot --nginx -d your-domain.com
```

### 2. 更新 CORS 配置
在后端 `routes/routes.go` 中添加生产域名：
```go
config.AllowOrigins = []string{
    "https://your-domain.com",
    "https://www.your-domain.com",
}
```

## 微信小程序配置

### 1. 申请小程序
在微信公众平台申请小程序账号

### 2. 配置服务器域名
在小程序后台配置：
- request 合法域名: `https://your-api-domain.com`
- uploadFile 合法域名: `https://your-api-domain.com`
- downloadFile 合法域名: `https://your-api-domain.com`

### 3. 更新 AppID
在 `promptworld-frontend/project.config.json` 中更新：
```json
{
  "appid": "your-miniprogram-appid"
}
```

## 监控和日志

### 1. 后端日志
使用 logrus 或其他日志库记录关键操作

### 2. 前端错误监控
集成 Sentry 或其他错误监控服务

### 3. 性能监控
- 使用 Prometheus + Grafana 监控后端性能
- 使用微信小程序性能监控

## 安全配置

### 1. 数据库安全
- 使用强密码
- 启用认证
- 限制网络访问

### 2. API 安全
- 实现 JWT 认证
- 添加请求频率限制
- 输入验证和过滤

### 3. HTTPS
- 强制使用 HTTPS
- 配置 HSTS 头部

## 常见问题

### 1. CORS 错误
确保后端 CORS 配置包含前端域名

### 2. 微信小程序网络请求失败
检查服务器域名配置和 HTTPS 证书

### 3. 数据库连接失败
检查 MongoDB 服务状态和连接字符串

### 4. 构建失败
清除缓存并重新安装依赖：
```bash
rm -rf node_modules package-lock.json
npm install
```

## 性能优化

### 1. 后端优化
- 使用 Redis 缓存
- 数据库索引优化
- 启用 Gzip 压缩

### 2. 前端优化
- 代码分割
- 图片懒加载
- CDN 加速

## 备份策略

### 1. 代码备份
使用 Git 版本控制

### 2. 数据库备份
定期备份 MongoDB 数据

### 3. 配置备份
备份环境配置文件

## 联系方式

如有问题，请联系开发团队或查看项目文档。