---
name: product-upload
description: 用于在 Fuzz Sofa 电商网站中上传新产品；当用户需要添加新产品、上传产品图片、配置产品参数或批量创建产品详情页时使用。以 owl-sofa 为标准模板，确保所有新产品页面视觉一致性和数据完整性。
---

## 任务目标

根据用户提供的产品信息（名称、图片、参数等），在 Fuzz Sofa 电商网站中创建完整的产品详情页。所有新产品必须遵循 owl-sofa 建立的标准模板，确保设计系统、排版、交互一致性。

## 何时使用

- 用户要求添加新产品到网站
- 用户提供了新产品图片和参数，需要生成详情页
- 用户要求批量上传多个产品
- 用户要求修改现有产品的图片或参数

## 标准模板参考

owl-sofa (猫头鹰沙发) 是唯一的标准模板。所有新产品必须严格复制其：
- 区块结构顺序
- 排版样式（字体、字号、间距、颜色）
- 交互逻辑（切换、hover、动效）
- 图片处理规范（裁剪、尺寸、命名）

## 操作步骤

### Step 1: 收集产品信息

向用户确认以下信息（缺一不可）：

| 字段 | 说明 | 示例 |
|------|------|------|
| slug | URL 路径标识，小写英文+连字符 | `owl-sofa` |
| name | 产品显示名称 | `Owl Chair` |
| tagline | 一句话描述 | `A quiet presence in the corner of the room.` |
| category | 产品分类 | `Chairs` |
| price | 价格（数字） | `29800` |
| originalPrice | 原价（可选） | `35800` |
| story | 故事文案（2-3段） | 见 owl-sofa 示例 |
| specifications | 尺寸参数（数字） | `{width: 86, depth: 82, height: 76, seatHeight: 44, weight: 50, capacity: 150}` |
| materials | 材质列表（4项） | `[{name, letter, description, svgPath}]` |
| craftTags | 工艺标签（4项） | `[{label, svgPath}]` |

如果用户未提供全部信息，主动追问缺失字段。不可用占位符或假数据填充。

### Step 2: 收集和处理图片

读取 `references/image-spec.md` 获取完整图片规格。

必须的图片清单（每张图都必须用户提供或明确授权 AI 生成）：

```
public/products/<slug>/
├── hero.webp              # 主图（正面展示，1:1，≥800px）
├── detail-1.webp          # 细节图1（材质/工艺特写，1:1，≥800px）
├── detail-2.webp          # 细节图2（另一角度特写，1:1，≥800px）
├── lifestyle.webp         # 场景图（产品在真实空间中，宽幅，≥1920px）
├── lifestyle-square.webp  # 场景图方版（自动从 lifestyle 裁剪，1:1，800px）
├── story-sketch.webp      # Story 区块产品图/手绘图（竖版，≥600px 高）
├── materials-bg.webp      # Materials 区块背景图（宽幅，≥1200px）
└── cutout/                # 各颜色去背图
    ├── <color-name>.png   # 去背产品图（透明背景，≥600px）
    └── ...
```

空间展示图（3张，独立于产品图）：
```
public/products/spaces/
├── <slug>-space-1.jpg     # 场景图1（宽幅，aspect 2:1）
├── <slug>-space-2.jpg     # 场景图2
└── <slug>-space-3.jpg     # 场景图3
```

**关键处理**：
- `lifestyle-square.webp` 必须从 `lifestyle.webp` 自动裁剪为 1:1，裁剪中心点必须对准产品主体（非图片几何中心）
- 所有图片优先 WebP 格式
- 用户上传图片时立即下载到对应目录

### Step 3: 注册产品数据

在 `src/lib/products.ts` 的 `products` 数组中新增产品对象。

读取 `references/data-schema.md` 获取完整字段定义和 owl-sofa 示例。

关键字段清单：
```typescript
{
  slug: string,           // URL 路径
  name: string,           // 显示名称
  tagline: string,        // 一句话描述
  category: string,       // 分类
  price: number,          // 价格（分）
  originalPrice?: number, // 原价（可选）
  description: string,    // 简短描述
  story: string[],        // 故事段落数组（2-3段）
  specifications: {       // 尺寸参数（纯数字，支持 cm/in 切换）
    width: number,
    depth: number,
    height: number,
    seatHeight: number,
    weight: number,
    capacity: number
  },
  materials: [            // 材质列表（固定4项）
    { name: string, description: string, iconLetter: string, svgPath: string },
    ...
  ],
  craftTags: [            // 工艺标签（固定4项）
    { label: string, svgPath: string },
    ...
  ],
  materialOptions: [      // 颜色/材质变体
    { name: string, color: string, cutoutImage: string, price?: number },
    ...
  ],
  productImages: string[], // 产品图路径数组
}
```

### Step 4: 注册去背图映射

在 `src/lib/cutout-images.ts` 中添加新产品的去背图映射：

```typescript
'<slug>': {
  '<color-name>': '/products/<slug>/cutout/<color-name>.png',
  ...
}
```

### Step 5: 添加产品特定图片逻辑

在 `src/app/[slug]/product-client.tsx` 中，找到 owl-sofa 的特有图片引用位置，为新产品的条件分支添加对应路径：

1. **Story 区块产品图**：`story-sketch.webp` 路径
2. **Materials 区块背景图**：`materials-bg.webp` 路径
3. **空间展示区 3 张图**：`spaces/<slug>-space-1/2/3.jpg`

使用 `product.slug === '<slug>'` 条件判断，与 owl-sofa 并列。

### Step 6: 验证

1. 运行 `pnpm ts-check` 确保无类型错误
2. 访问 `/<slug>` 确认页面渲染正常
3. 逐区块核对与 owl-sofa 模板的一致性：
   - [ ] Hero 图片画廊正常切换
   - [ ] 颜色变体切换正常
   - [ ] Story 区块排版一致
   - [ ] 尺寸标签 + CM/IN 切换正常
   - [ ] Materials 区块4卡片显示
   - [ ] 工艺标签显示
   - [ ] 空间展示区3张图
   - [ ] Product Data 规格表
   - [ ] You May Also Like 推荐
   - [ ] Add to Cart / Buy Now 按钮功能正常

## 设计规范速查

所有新产品必须遵循的设计 token：

| Token | 值 | 用途 |
|-------|----|------|
| 背景 | #0A0A0A | 页面主背景 |
| 前景 | #F5F0EB | 正文/标题文字 |
| 辅助灰 | #8A8580 | 次要文字/标签 |
| 边框 | #1A1A1A | 分割线/结构边框 |
| 强调 | #E8B4B8 | 唯一 accent 色 |
| 表面 | #111111 | 卡片/面板背景 |
| 标题字体 | font-serif (Cormorant Garamond) | 产品名、区块标题 |
| 正文字体 | font-sans (Inter) | 正文、标签、按钮 |
| 最小字号 | 12px | 所有可读文字 |
| 圆角 | max 8px | 保持锐利几何感 |

## 资源索引

- `references/data-schema.md`: 产品数据完整字段定义与 owl-sofa 示例。当需要注册新产品数据或修改字段时读取。
- `references/image-spec.md`: 图片规格、命名规范、裁剪要求。当处理产品图片时读取。
- `references/component-map.md`: product-client.tsx 中各区块对应的代码位置和条件逻辑。当需要添加产品特定逻辑时读取。
- `scripts/crop_square.py`: 从宽幅图自动裁剪为 1:1 方形图。当需要生成 lifestyle-square.webp 时调用。

## 注意事项

1. **禁止 Mock 数据**：所有产品信息必须来自用户，禁止用占位符或假数据
2. **禁止硬编码颜色**：必须使用设计 token，不允许出现 #333、#666 等非标准色
3. **最小字号 12px**：任何可读文字不得低于 12px
4. **图片裁剪对准产品**：lifestyle-square 裁剪时中心点必须对准产品主体，不是图片几何中心
5. **4 材质 + 4 标签**：Materials 区固定 4 张卡片，Craft Tags 固定 4 项
6. **slug 唯一性**：新增前检查 products 数组中是否已有同名 slug
7. **去背图必须提供**：每个颜色变体必须有对应的 cutout PNG
