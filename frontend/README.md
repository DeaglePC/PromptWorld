# PromptWorld Frontend

基于 Taro 框架开发的 AI 提示词分享平台前端应用，支持微信小程序和 Web 端。

## 功能特性

- 🌟 **多端支持**: 支持微信小程序和 Web 端
- 🎨 **精美UI**: 参考设计稿实现的毛玻璃效果界面
- 🔍 **智能搜索**: 支持提示词内容搜索
- 📂 **分类浏览**: 按分类筛选提示词
- 📋 **一键复制**: 快速复制提示词内容
- 🖼️ **效果预览**: 支持图片预览功能
- 📱 **响应式设计**: 适配不同屏幕尺寸

## 技术栈

- **框架**: Taro 4.x
- **语言**: TypeScript
- **样式**: Sass
- **构建工具**: Vite
- **状态管理**: React Hooks
- **UI组件**: 自定义组件

## 项目结构

```
src/
├── components/          # 公共组件
│   ├── SearchBar/      # 搜索栏组件
│   ├── CategoryNav/    # 分类导航组件
│   └── PromptCard/     # 提示词卡片组件
├── pages/              # 页面
│   ├── index/          # 首页
│   └── detail/         # 详情页
├── services/           # API服务
│   └── api.ts          # API接口定义
├── types/              # 类型定义
│   └── index.ts        # 通用类型
├── utils/              # 工具函数
│   └── index.ts        # 通用工具
├── app.config.ts       # 应用配置
├── app.scss           # 全局样式
└── app.ts             # 应用入口
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 微信小程序
npm run dev:weapp

# H5 网页
npm run dev:h5
```

### 构建生产版本

```bash
# 微信小程序
npm run build:weapp

# H5 网页
npm run build:h5
```

## API 接口

### 基础配置

- 开发环境: `http://localhost:8081/api/v1`
- 生产环境: 需要配置实际的API地址

### 主要接口

1. **获取提示词列表**
   - `GET /prompts`
   - 支持分类、搜索、分页参数

2. **获取提示词详情**
   - `GET /prompts/:id`

3. **获取分类列表**
   - `GET /categories`

## 组件说明

### SearchBar 搜索栏
- 支持实时搜索
- 防抖处理
- 毛玻璃效果

### CategoryNav 分类导航
- 横向滚动
- 分类切换
- 活跃状态显示

### PromptCard 提示词卡片
- 卡片式布局
- 图片预览
- 一键复制
- 统计信息显示

## 样式特性

- **毛玻璃效果**: 使用 backdrop-filter 实现
- **渐变背景**: 多色渐变动态背景
- **响应式设计**: 适配移动端和桌面端
- **动画效果**: 平滑的交互动画

## 环境配置

在 `.env.development` 文件中配置开发环境变量：

```bash
TARO_APP_API=http://localhost:8081/api/v1
```

## 注意事项

1. 确保后端服务已启动并运行在 8081 端口
2. 微信小程序开发需要配置合法域名
3. 图片资源需要使用 HTTPS 协议
4. 部分 CSS 特性在小程序中可能不支持

## 部署说明

### 微信小程序部署
1. 使用微信开发者工具打开 `dist` 目录
2. 配置小程序 AppID
3. 上传代码并提交审核

### Web 端部署
1. 构建生产版本
2. 将 `dist` 目录部署到静态服务器
3. 配置 Nginx 或其他 Web 服务器

## 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 代码规范
- 使用 Prettier 格式化代码
- 组件采用函数式组件 + Hooks
- 样式使用 BEM 命名规范