# PromptWorld - AI提示词分享平台

一个现代化的AI提示词分享平台，采用Go后端 + HTML/CSS/JS前端的架构。

## 项目特性

- 🌟 现代化毛玻璃UI设计
- 📱 响应式布局，支持移动端
- 🔍 智能搜索和分类筛选
- 🎨 支持图片预览功能
- 📋 一键复制提示词
- 💾 MongoDB数据存储
- 🚀 高性能Go后端API

## 技术栈

### 后端
- **Go 1.21+** - 主要编程语言
- **Gin** - Web框架
- **MongoDB** - 数据库
- **CORS** - 跨域支持

### 前端
- **HTML5** - 页面结构
- **CSS3** - 样式设计（毛玻璃效果、动画）
- **JavaScript** - 交互逻辑
- **Fetch API** - 数据请求

## 项目结构

```
promptworld/
├── backend/                 # 后端代码
│   ├── config/             # 配置文件
│   │   └── database.go     # 数据库配置
│   ├── controllers/        # 控制器
│   │   └── prompt_controller.go
│   ├── models/             # 数据模型
│   │   └── prompt.go
│   ├── routes/             # 路由配置
│   │   └── routes.go
│   ├── utils/              # 工具函数
│   │   └── init_data.go    # 初始化示例数据
│   ├── main.go             # 程序入口
│   ├── go.mod              # Go模块文件
│   └── .env                # 环境变量
├── frontend/               # 前端代码
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css   # 样式文件
│   │   └── js/
│   │       └── app.js      # JavaScript逻辑
│   └── templates/
│       └── index.html      # 主页模板
└── docs/                   # 文档
```

## 快速开始

### 环境要求

- Go 1.21+
- MongoDB 4.4+
- 现代浏览器

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd promptworld
```

2. **安装Go依赖**
```bash
cd backend
go mod tidy
```

3. **启动MongoDB**
```bash
# 使用Docker启动MongoDB
docker run -d --name mongodb -p 27017:27017 mongo:latest

# 或使用本地MongoDB服务
mongod
```

4. **配置环境变量**
```bash
cd backend
cp .env.example .env
# 编辑.env文件，配置数据库连接等信息
```

5. **启动后端服务**
```bash
cd backend
go run main.go
```

6. **访问应用**
打开浏览器访问: http://localhost:8080

## API接口

### 获取提示词列表
```
GET /api/v1/prompts
参数:
- page: 页码 (默认: 1)
- limit: 每页数量 (默认: 20)
- category: 分类筛选
- search: 搜索关键词
```

### 获取提示词详情
```
GET /api/v1/prompts/:id
```

### 获取分类列表
```
GET /api/v1/categories
```

## 数据模型

### Prompt (提示词)
```go
type Prompt struct {
    ID            primitive.ObjectID `json:"id" bson:"_id,omitempty"`
    Title         string             `json:"title" bson:"title"`
    Description   string             `json:"description" bson:"description"`
    Content       string             `json:"content" bson:"content"`
    Category      string             `json:"category" bson:"category"`
    Type          string             `json:"type" bson:"type"`
    Tags          []string           `json:"tags" bson:"tags"`
    PreviewImages []string           `json:"preview_images" bson:"preview_images"`
    Usage         string             `json:"usage" bson:"usage"`
    Likes         int                `json:"likes" bson:"likes"`
    Comments      int                `json:"comments" bson:"comments"`
    Rating        float64            `json:"rating" bson:"rating"`
    Views         int                `json:"views" bson:"views"`
    CreatedAt     time.Time          `json:"created_at" bson:"created_at"`
    UpdatedAt     time.Time          `json:"updated_at" bson:"updated_at"`
}
```

## 功能特性

### 第一阶段功能 ✅
- [x] 提示词浏览和展示
- [x] 分类筛选
- [x] 搜索功能
- [x] 响应式设计
- [x] 图片预览
- [x] 一键复制
- [x] 详情页展示

### 后续规划功能
- [ ] 用户注册登录
- [ ] 提示词收藏
- [ ] 评论系统
- [ ] 点赞功能
- [ ] 提示词上传
- [ ] 用户个人中心

## 开发指南

### 添加新的提示词分类
1. 在数据库中添加新分类的提示词
2. 前端会自动从API获取并显示新分类

### 自定义样式
- 修改 `frontend/static/css/style.css`
- 支持CSS变量自定义主题色彩

### 添加新的API接口
1. 在 `models/` 中定义数据模型
2. 在 `controllers/` 中实现业务逻辑
3. 在 `routes/routes.go` 中注册路由

## 部署

### Docker部署
```bash
# 构建镜像
docker build -t promptworld .

# 运行容器
docker run -d -p 8080:8080 --name promptworld promptworld
```

### 生产环境配置
1. 设置环境变量 `GIN_MODE=release`
2. 配置反向代理 (Nginx)
3. 设置HTTPS证书
4. 配置MongoDB集群

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目链接: [https://github.com/your-username/promptworld](https://github.com/your-username/promptworld)
- 问题反馈: [Issues](https://github.com/your-username/promptworld/issues)

## 致谢

感谢所有为这个项目做出贡献的开发者！