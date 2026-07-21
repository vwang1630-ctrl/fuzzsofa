# 新会话开发提示词

> 将本文档提供给新会话，作为前台项目开发的完整上下文。

---

## 项目背景

你正在开发一个**动物灵感高端家具品牌**（FUZZ SOFA）的前台消费者网站。后台服务已经搭建完成，提供完整的 API 接口和数据存储。你的任务是开发前台页面，对接后台 API。

## 技术栈要求

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI**: shadcn/ui + Tailwind CSS 4
- **包管理**: pnpm（严禁 npm/yarn）

## 后台 API 信息

### 连接信息

- **Base URL**: 由环境变量 `NEXT_PUBLIC_API_BASE_URL` 提供
- **对象存储 URL**: `http://124.221.15.233:9000/fuzzsofa/`

### 认证方式

- 公开接口（`/api/public/*`）：无需认证
- 用户接口（`/api/user/*`）：header `x-session: <token>`
- 登录获取 token：`POST /api/public/auth/login`

### 接口概览

| 模块 | 路径前缀 | 认证 | 用途 |
|------|---------|------|------|
| 公开接口 | `/api/public/*` | 无 | SSR渲染、登录注册 |
| 用户接口 | `/api/user/*` | x-session | 购物车、订单、收藏、地址 |

详细接口文档请阅读：`documents/api-reference.md`
数据模型定义请阅读：`documents/data-models.md`
业务流程说明请阅读：`documents/business-logic.md`
设计规范请阅读：`documents/design-specification.md`
环境配置请阅读：`documents/environment-config.md`

## 页面清单

### 公开页面（SSR，SEO 友好）

1. **首页** (`/`) - 品牌展示、精选商品、场景图
2. **商品列表** (`/products`) - 按动物类型分类浏览
3. **商品详情** (`/products/[slug]`) - 完整商品信息、加购
4. **关于我们** (`/about`) - 品牌故事
5. **杂志** (`/magazine`) - 品牌内容

### 用户页面（需登录）

6. **购物车** (`/cart`) - 查看/修改购物车
7. **结账** (`/checkout`) - 填写地址、选择支付、下单
8. **我的订单** (`/orders`) - 订单列表和详情
9. **收藏** (`/favorites`) - 收藏的商品
10. **地址管理** (`/addresses`) - 收货地址 CRUD
11. **个人中心** (`/account`) - 用户信息

### 公共组件

12. **登录/注册** - 弹窗或独立页面
13. **导航栏** - 品牌Logo、菜单、购物车图标、用户头像
14. **Footer** - 品牌信息、链接

## 开发规范

### SSR 要求
- 首页、商品列表、商品详情必须使用 SSR（Server Components）
- 服务端直接调用 API 获取数据，无需 x-session
- 客户端 hydration 后处理交互逻辑

### 认证管理
- 使用 React Context 管理用户状态
- Token 存储在 localStorage
- 提供 `useAuth()` hook 获取用户信息和 token
- API 请求封装统一的 fetch wrapper，自动添加 x-session header

### 图片处理
- 商品图片使用对象存储 URL：`http://124.221.15.233:9000/fuzzsofa/products/<slug>/hero.jpg`
- 使用 Next.js `<Image>` 组件，配置远程图片域名
- 首屏关键图片使用 `priority` 属性

### 响应式
- 桌面端优先设计
- 支持移动端适配（断点：sm/md/lg/xl）

### 性能
- 商品列表使用分页加载
- 图片使用 WebP 格式 + lazy loading
- 避免客户端重复请求

## 数据模型

TypeScript 类型定义已准备好，请直接复制使用：
- 阅读 `documents/data-models.md` 获取完整类型定义
- 关键类型：`Product`、`Cart`、`Order`、`Address`、`Favorite`、`User`

## 设计风格

- 暗色奢华风格（参考 `documents/design-specification.md`）
- 主背景：#0A0A0A（深黑）
- 品牌金：#C9A96E
- 字体：Playfair Display（标题）+ system-ui（正文）
- 大量留白、大图展示、滚动叙事

## 开发顺序建议

1. 项目初始化 + 基础布局（导航栏 + Footer）
2. 认证系统（登录/注册 + Context + hook）
3. 首页（SSR）
4. 商品列表页（SSR）
5. 商品详情页（SSR）
6. 购物车页面
7. 结账页面
8. 订单页面
9. 收藏/地址/个人中心
10. 响应式优化 + 性能优化

## 注意事项

1. **不要直接访问数据库**，所有数据通过 API 获取
2. **不要使用 Supabase**，后台已迁移到 MySQL + MinIO
3. **价格按区域显示**，需要根据用户区域选择 priceRange 中的对应价格
4. **商品 slug 是唯一的标识符**，用于 URL 和 API 调用
5. **Token 过期处理**：401 响应时清除 token，跳转登录
