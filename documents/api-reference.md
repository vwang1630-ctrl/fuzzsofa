# API 接口完整文档

> 本文档供前台项目开发者对接后台 API 使用。

## 基础信息

| 项目 | 值 |
|------|-----|
| Base URL | 由环境变量 `COZE_PROJECT_DOMAIN_DEFAULT` 提供 |
| 认证方式 | `x-session` header 传递 token |
| 数据格式 | JSON |
| 字符编码 | UTF-8 |

## 认证说明

- **公开接口** (`/api/public/*`)：无需认证，访客可用
- **用户接口** (`/api/user/*`)：需要 `x-session` header
- **管理接口** (`/api/admin/*`)：需要管理员权限，生产环境禁用

### 获取 Token

1. 调用 `POST /api/public/auth/login` 或 `POST /api/public/auth/register`
2. 响应中返回 `token` 字段
3. 后续请求在 header 中添加：`x-session: <token>`

### 错误响应格式

```json
{ "error": "错误描述信息" }
```

---

## 一、公开接口（/api/public）

### 1.1 获取商品列表

```
GET /api/public/products
```

**参数（Query）：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| animal | string | 否 | 动物类型：gorilla, owl, polar-bear, hedgehog, penguin, chameleon, eagle, rhino, snow-leopard, crocodile, whale, shark, octopus, lion, seahorse, jellyfish, flamingo, toucan, panda, swan, wolf, peacock, zebra, bat, snake, parrot, hippo, tiger, bear, frog, monkey, sloth, giraffe, elephant, rabbit, cat, dog, horse, bull, camel, kangaroo, koala |
| search | string | 否 | 搜索关键词（匹配名称/描述） |
| page | number | 否 | 页码，默认 1 |
| pageSize | number | 否 | 每页条数，默认 20 |

**响应：**

```json
{
  "products": [
    {
      "id": 1,
      "slug": "gorilla-sofa",
      "name": "Gorilla Sofa",
      "animal": "gorilla",
      "tagline": "Built to Hold You Like the Earth Holds Mountains.",
      "description": "Full product description...",
      "priceRange": { "americas": 4299, "europe": 3899, "asia": 3599, "oceania": 4099 },
      "specifications": { "dimensions": { "width": 84, "depth": 38, "height": 33, "seatHeight": 18 }, "weight": "125 lbs" },
      "materials": ["Full-Grain Leather", "Solid Walnut Frame"],
      "materialOptions": [{ "name": "Full-Grain Leather", "hex": "#5C3A1E" }],
      "images": { "hero": "/products/gorilla-sofa/hero.jpg", "gallery": [...] },
      "status": "active",
      "stockStatus": "in_stock"
    }
  ],
  "total": 38,
  "page": 1,
  "pageSize": 20
}
```

### 1.2 获取商品详情

```
GET /api/public/products/[slug]
```

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| slug | string | 是 | 商品唯一标识（URL路径参数） |

**响应：**

```json
{
  "product": {
    "id": 1,
    "slug": "gorilla-sofa",
    "name": "Gorilla Sofa",
    "animal": "gorilla",
    "tagline": "Built to Hold You Like the Earth Holds Mountains.",
    "concept": "Design concept text...",
    "description": "Full description...",
    "priceRange": { "americas": 4299, "europe": 3899, "asia": 3599, "oceania": 4099 },
    "specifications": { "dimensions": {...}, "weight": "125 lbs", "materials": "..." },
    "materials": ["Full-Grain Leather", "Solid Walnut Frame"],
    "materialOptions": [{ "name": "Full-Grain Leather", "hex": "#5C3A1E", "description": "..." }],
    "images": { "hero": "...", "gallery": [...], "detail": [...] },
    "faq": [{ "question": "...", "answer": "..." }],
    "relatedProducts": [{ "slug": "...", "name": "...", "heroImage": "..." }],
    "interiorContext": "...",
    "metaDescription": "..."
  }
}
```

**404 响应：**

```json
{ "error": "Product not found" }
```

### 1.3 用户登录

```
POST /api/public/auth/login
Content-Type: application/json
```

**请求体：**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

或使用手机号：

```json
{
  "phone": "+1234567890",
  "password": "password123"
}
```

**响应：**

```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "phone": null,
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "token": "eyJ1c2VySWQiOi..."
}
```

**错误：**

```json
{ "error": "Invalid credentials" }
```

### 1.4 用户注册

```
POST /api/public/auth/register
Content-Type: application/json
```

**请求体：**

```json
{
  "email": "new@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**响应：** 同登录响应格式。

---

## 二、用户接口（/api/user）

> 所有接口需要在 header 中携带 `x-session: <token>`

### 2.1 获取购物车

```
GET /api/user/cart
```

**响应：**

```json
{
  "cart": {
    "id": "uuid",
    "items": [
      {
        "id": "uuid",
        "productSlug": "gorilla-sofa",
        "productName": "Gorilla Sofa",
        "material": "Full-Grain Leather",
        "colorName": "Espresso",
        "colorHex": "#3C2415",
        "quantity": 1,
        "unitPrice": 4299.00,
        "imageUrl": "/products/gorilla-sofa/hero.jpg"
      }
    ],
    "itemCount": 1,
    "total": 4299.00
  }
}
```

### 2.2 添加购物车商品

```
POST /api/user/cart/items
Content-Type: application/json
```

**请求体：**

```json
{
  "productSlug": "gorilla-sofa",
  "material": "Full-Grain Leather",
  "colorName": "Espresso",
  "colorHex": "#3C2415",
  "quantity": 1,
  "unitPrice": 4299,
  "imageUrl": "/products/gorilla-sofa/hero.jpg"
}
```

**响应：**

```json
{
  "item": { "id": "uuid", "productSlug": "gorilla-sofa", "quantity": 1 },
  "cartId": "uuid"
}
```

### 2.3 获取订单列表

```
GET /api/user/orders?status=pending
```

**参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | 否 | pending/confirmed/processing/shipped/delivered/cancelled |

**响应：**

```json
{
  "orders": [
    {
      "id": "uuid",
      "orderNumber": "FUZZ-20260315-0001",
      "status": "pending",
      "paymentStatus": "pending_payment",
      "paymentMethod": "credit_card",
      "subtotal": 4299.00,
      "shippingFee": 0,
      "total": 4299.00,
      "currency": "USD",
      "items": [
        { "productSlug": "gorilla-sofa", "productName": "Gorilla Sofa", "quantity": 1, "unitPrice": 4299.00 }
      ],
      "createdAt": "2026-03-15T10:00:00.000Z"
    }
  ]
}
```

### 2.4 创建订单

```
POST /api/user/orders
Content-Type: application/json
```

**请求体：**

```json
{
  "paymentMethod": "credit_card",
  "shippingMethod": "standard",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "country": "US",
    "addressLine": "123 Main Street",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

**响应：**

```json
{
  "order": {
    "id": "uuid",
    "orderNumber": "FUZZ-20260315-0001",
    "status": "pending",
    "paymentStatus": "pending_payment",
    "total": 4299.00
  }
}
```

### 2.5 获取收藏列表

```
GET /api/user/favorites
```

**响应：**

```json
{
  "favorites": [
    { "id": "uuid", "productSlug": "gorilla-sofa", "createdAt": "2026-03-15T10:00:00.000Z" }
  ]
}
```

### 2.6 添加收藏

```
POST /api/user/favorites
Content-Type: application/json
```

**请求体：**

```json
{ "productSlug": "gorilla-sofa" }
```

### 2.7 删除收藏

```
DELETE /api/user/favorites?productSlug=gorilla-sofa
```

### 2.8 获取地址列表

```
GET /api/user/addresses
```

**响应：**

```json
{
  "addresses": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "country": "US",
      "addressLine": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "isDefault": true
    }
  ]
}
```

### 2.9 添加地址

```
POST /api/user/addresses
Content-Type: application/json
```

**请求体：**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "country": "US",
  "addressLine": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "isDefault": true
}
```

### 2.10 获取用户信息

```
GET /api/user/profile
```

**响应：**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### 2.11 更新用户信息

```
PUT /api/user/profile
Content-Type: application/json
```

**请求体（部分更新）：**

```json
{
  "firstName": "Jane",
  "lastName": "Smith"
}
```
