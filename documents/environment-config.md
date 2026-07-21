# 环境配置

## 后台服务信息

| 项目 | 值 |
|------|-----|
| 后台管理地址 | `https://<your-domain>/admin` |
| API Base URL | `https://<your-domain>/api` |
| 管理员邮箱 | admin@fuzzsofa.com |
| 管理员密码 | admin123 |

## 数据库（MySQL 8.4）

| 项目 | 值 |
|------|-----|
| Host | 124.221.15.233 |
| Port | 3311 |
| Database | fuzzsofa |
| Username | fuzzsofa |
| Password | WjqCrvxZ@8 |

### 数据表

| 表名 | 说明 |
|------|------|
| users | 用户（含管理员） |
| products | 商品（38条数据已迁移） |
| cart | 购物车 |
| cart_items | 购物车商品 |
| orders | 订单 |
| order_items | 订单商品 |
| shipping_events | 物流事件 |
| user_addresses | 收货地址 |
| favorites | 收藏 |
| user_preferences | 用户偏好 |
| assets | 资源文件记录 |

## 对象存储（MinIO）

| 项目 | 值 |
|------|-----|
| S3 Endpoint (API) | http://124.221.15.233:9000 |
| Console | http://124.221.15.233:9090 |
| AccessKey | IYn5raEN1RleeYRQwhnu |
| SecretKey | WjqCrvxZHTTS1W8Ly6wdDE5QE9zk5C1Scyjq4E43 |
| Bucket | fuzzsofa |
| Region | cn-beijing |
| 公开访问 URL | http://124.221.15.233:9000/fuzzsofa/ |

### 已迁移资源

- 96 个文件，143.6MB
- 路径格式：`products/<slug>/hero.jpg`、`products/<slug>/gallery-01.jpg` 等
- 首页 Hero 图：`home/hero-animal-sofas.jpg`
- 场景图：`home/scenes/`、`scenes/`

## 环境变量

前台项目需要配置的环境变量：

```bash
# 后台 API 地址
NEXT_PUBLIC_API_BASE_URL=https://<backend-domain>

# 对象存储公开 URL
NEXT_PUBLIC_STORAGE_URL=http://124.221.15.233:9000/fuzzsofa
```

## 认证方式

- Header: `x-session`
- Token 格式: `<base64-payload>.<hmac-signature>`
- 有效期: 7 天
- 获取方式: `POST /api/public/auth/login`
