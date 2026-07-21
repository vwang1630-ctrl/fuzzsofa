# 业务流程说明

## 1. 用户认证流程

```
用户访问前台 → 浏览商品（无需登录）
                ↓
            点击登录/注册
                ↓
    POST /api/public/auth/login 或 /register
                ↓
        获取 token，存入 localStorage/cookie
                ↓
    后续请求携带 x-session: <token> header
                ↓
        访问购物车、订单、收藏等用户功能
```

### Token 管理
- 登录后将 token 存储到 `localStorage` 或 `cookie`
- 每次 API 请求在 header 中添加 `x-session: <token>`
- Token 有效期 7 天，过期后需重新登录
- 401 响应表示 token 无效或过期

## 2. 商品浏览流程（SSR）

```
用户访问首页/商品列表页
        ↓
  服务端调用 GET /api/public/products
  （带 animal/search/page 参数）
        ↓
  SSR 渲染商品列表 HTML
        ↓
  客户端 hydration 后可交互
        ↓
  点击商品 → 访问 /products/[slug]
        ↓
  服务端调用 GET /api/public/products/[slug]
        ↓
  SSR 渲染商品详情页
```

### SSR 要点
- 商品列表和详情页使用 `getServerSideProps` 或 Server Components
- 服务端调用 API 时不需要 x-session header
- 图片 URL 使用对象存储的完整 URL 或相对路径

## 3. 购物车流程

```
用户登录 → 浏览商品详情页
              ↓
          选择材质/颜色 → 点击"加入购物车"
              ↓
      POST /api/user/cart/items
      { productSlug, material, colorName, colorHex, quantity, unitPrice, imageUrl }
              ↓
          购物车数量 +1
              ↓
          查看购物车 → GET /api/user/cart
              ↓
          修改数量 → POST /api/user/cart (整体替换)
              ↓
          删除商品 → 重新 POST 不含该商品的列表
              ↓
          点击"去结算"
              ↓
          进入结账页面
```

### 购物车数据结构
- 每个购物车项包含：商品slug、材质、颜色名、颜色hex、数量、单价、图片URL
- 相同商品+颜色组合会自动合并数量
- 价格以添加时的价格为准（不会自动更新）

## 4. 订单流程

```
结账页面
    ↓
填写/选择收货地址
    ↓
选择支付方式（credit_card / paypal / bank_transfer）
    ↓
POST /api/user/orders
{ paymentMethod, shippingMethod, shippingAddress }
    ↓
订单创建成功，购物车清空
    ↓
订单状态流转：
  pending → confirmed → processing → shipped → delivered
                                      ↓
                                  cancelled（任意阶段可取消）
```

### 订单状态说明

| 状态 | 含义 | 触发条件 |
|------|------|---------|
| pending | 待付款 | 刚创建订单 |
| confirmed | 已确认 | 付款成功 |
| processing | 生产中 | 管理员确认 |
| shipped | 已发货 | 管理员填写物流信息 |
| delivered | 已送达 | 物流确认送达 |
| cancelled | 已取消 | 用户或管理员取消 |
| refunded | 已退款 | 退款完成 |

### 支付状态

| 状态 | 含义 |
|------|------|
| pending_payment | 待付款 |
| paid | 已付款 |
| refunded | 已退款 |
| failed | 支付失败 |

## 5. 收藏流程

```
用户登录 → 浏览商品
              ↓
          点击收藏按钮（心形图标）
              ↓
      POST /api/user/favorites { productSlug }
              ↓
          收藏成功，按钮变为实心
              ↓
          再次点击 → DELETE /api/user/favorites?productSlug=xxx
              ↓
          取消收藏，按钮变为空心
              ↓
          查看收藏列表 → GET /api/user/favorites
```

## 6. 地址管理流程

```
用户登录 → 进入地址管理页
              ↓
          GET /api/user/addresses
              ↓
          显示地址列表（默认地址置顶）
              ↓
          添加新地址 → POST /api/user/addresses
              ↓
          设为默认 → POST 时 isDefault: true（自动取消其他默认）
```

## 7. 区域检测

```
用户首次访问
    ↓
GET /api/public/detect-region（通过 IP 判断区域）
    ↓
返回区域信息（americas/europe/asia/oceania）
    ↓
根据区域显示对应价格
```

## 8. 图片资源

- 商品图片存储在 MinIO 对象存储中
- 访问路径：`http://124.221.15.233:9000/fuzzsofa/<key>`
- 商品图片 key 格式：`products/<slug>/hero.jpg`、`products/<slug>/gallery-01.jpg` 等
- 前台项目可通过完整 URL 或配置 CDN 代理访问
