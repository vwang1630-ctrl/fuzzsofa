# 组件映射：product-client.tsx 区块位置

## 文件位置
`src/app/[slug]/product-client.tsx`

## 区块结构（从上到下）

| 区块 | 大致行号 | 说明 | 产品特定逻辑 |
|------|---------|------|-------------|
| Hero 图片画廊 | ~240-330 | 左侧大图+缩略图+右侧信息 | productImages 数组驱动 |
| 颜色变体选择 | ~460-490 | 圆形色块切换 | materialOptions 数组驱动 |
| Add to Cart / Buy Now | ~530-550 | 主 CTA 按钮 | 通用逻辑 |
| 分享弹窗 | ~390-430 | 胶囊式社交分享 | 通用逻辑 |
| Story 区块 | ~660-745 | 左文右图，THE STORY | 需配置 story-sketch.webp 路径 |
| 尺寸标签 | ~726-740 | W/D/H/Seat + CM/IN 切换 | specifications 对象驱动 |
| Materials 区块 | ~775-830 | 4卡片+背景图 | 需配置 materials-bg.webp 路径 |
| 工艺标签 | ~835-860 | 4个标签行 | craftTags 数组驱动 |
| 空间展示区 | ~865-895 | 3张场景卡片 | 需配置 3 张 space 图片路径 |
| Delivered Worldwide | ~900-940 | 配送信息 | 通用逻辑 |
| Product Data | ~960-1000 | 规格表 | specifications 对象驱动 |
| You May Also Like | ~1020-1080 | 推荐产品 | 自动排除当前产品 |

## 产品特定图片配置位置

在 product-client.tsx 中搜索 `owl-sofa` 找到所有条件分支。新产品需在同位置添加并列条件：

### 1. Story 区块产品图（约 L710）
```tsx
// 条件：product.slug === '<slug>'
// 替换为对应路径
src="/products/<slug>/story-sketch.webp"
```

### 2. Materials 区块背景图（约 L768）
```tsx
// 条件：product.slug === '<slug>'
// 替换为对应路径
src="/products/<slug>/materials-bg.webp"
```

### 3. 空间展示区图片（约 L870-890）
```tsx
// 条件：product.slug === '<slug>'
// 替换为对应路径
[
  '/products/spaces/<slug>-space-1.jpg',
  '/products/spaces/<slug>-space-2.jpg',
  '/products/spaces/<slug>-space-3.jpg',
]
```

## 去背图映射

文件位置：`src/lib/cutout-images.ts`

```typescript
// 添加新产品映射
'<slug>': {
  '<color-name-1>': '/products/<slug>/cutout/<color-name-1>.png',
  '<color-name-2>': '/products/<slug>/cutout/<color-name-2>.png',
  ...
}
```

## 首页产品卡片

文件位置：`src/app/page.tsx`

首页的 Featured Works 区块自动从 products 数组渲染，无需手动添加。新增产品后自动出现在首页。

## 注意

- 行号为近似值，随代码迭代可能偏移，以区块关键词搜索为准
- 通用区块（Add to Cart、分享、配送等）不需要产品特定配置
- 所有产品共享同一个组件模板，差异仅通过数据驱动和条件分支实现
