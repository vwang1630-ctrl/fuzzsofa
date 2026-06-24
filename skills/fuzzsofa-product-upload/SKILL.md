# Fuzz Sofa 产品上传 Skill

> 将新产品录入 Fuzz Sofa 电商网站的完整工作流，涵盖图片处理、数据录入、i18n 翻译、SEO 元数据、热门地区标记。

## 输入要求

从用户处获取以下信息：
- **产品名称**：中文名 + 英文名（如：陨石环形沙发椅 / Meteorite Ring Sofa Chair）
- **slug**：URL 路径标识符（如：`meteorite-ring-sofa`）
- **尺寸**：宽 × 高 × 深（cm）
- **重量**：产品重量 + 附加件重量（kg）
- **价格**：数字，单位 CNY
- **颜色变体**：色名列表
- **产品图片**：至少 1 张参考图（用户直接提供或 URL 下载）
- **简短描述**：一句话卖点
- **详细描述**：产品故事 / 设计理念
- **热门地区** (trendingGeo)：该产品在哪些地区/城市热门（用于搜索和推荐）

## 工作流步骤

### Step 1: 图片下载与准备

1. 将用户提供的图片下载到 `public/products/{slug}/` 目录
2. 命名规范：
   - `reference-1.jpg` — 正面主产品图（展示产品真实颜色，也作为 rembg 抠图源）
   - `reference-2.jpg` ~ `reference-N.jpg` — 多角度/颜色变体/场景图
   - 保留原始分辨率，不做缩放

```bash
mkdir -p public/products/{slug}
curl -sL -o "public/products/{slug}/reference-1.jpg" "{IMAGE_URL}"
```

### Step 2: 产品图抠图 (rembg) — 仅用于 AI in My Room

> **重要**：抠图结果 `extracted.png` 仅用于 "AI in My Room" 合成功能，**不显示在产品画廊中**。产品画廊使用原始照片展示真实颜色和质感。

使用 Python rembg 库进行背景移除，提取纯净产品 PNG：

```python
from rembg import remove, new_session
from PIL import Image

session = new_session('silueta')
input_img = Image.open('public/products/{slug}/reference-1.jpg')
output = remove(input_img, session=session, alpha_matting=True, alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=10)
output.save('public/products/{slug}/extracted.png')
```

安装依赖（如未安装）：
```bash
pip install rembg pillow 2>/dev/null
```

### Step 3: 产品主图与缩略图生成

> **重要**：`main.jpg` 使用**原图**（reference-1.jpg）生成，不用抠图版本。这样产品展示真实颜色和背景。抠图仅用于 `extracted.png`（AI in My Room）。

使用 sharp 生成多种尺寸的产品图：

```javascript
const sharp = require('sharp');

// 主图 - 800x800 使用原图（非抠图），展示真实颜色
await sharp('public/products/{slug}/reference-1.jpg')
  .resize(800, 800, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
  .jpeg({ quality: 92 })
  .toFile('public/products/{slug}/main.jpg');

// 缩略图 - 400x400 使用原图
await sharp('public/products/{slug}/reference-1.jpg')
  .resize(400, 400, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
  .jpeg({ quality: 85 })
  .toFile('public/products/{slug}/thumb.jpg');
```

**图片用途总结**：
| 文件 | 来源 | 用途 | 是否展示 |
|------|------|------|----------|
| `extracted.png` | rembg 抠图 | AI in My Room 合成 | 否 |
| `main.jpg` | 原图缩放 | 产品详情页主图 | 是 |
| `thumb.jpg` | 原图缩放 | 产品列表缩略图 | 是 |
| `reference-*.jpg` | 用户原图 | 产品详情页画廊 | 是 |

### Step 4: 添加产品数据到 products.ts

在 `src/lib/products.ts` 的 `products` 数组中新增产品对象。

**关键字段**：

```typescript
{
  slug: 'meteorite-ring-sofa',
  name: 'Meteorite Ring Sofa Chair',
  nameZh: '陨石环形沙发椅',
  category: 'chairs',
  price: 3500,
  currency: 'CNY',
  images: [
    '/products/meteorite-ring-sofa/main.jpg',
    '/products/meteorite-ring-sofa/reference-3.jpg',
    '/products/meteorite-ring-sofa/reference-5.jpg',
  ],
  thumbnail: '/products/meteorite-ring-sofa/thumb.jpg',
  description: 'Short tagline in English',
  descriptionZh: '中文一句话卖点',
  details: 'Full English description paragraph',
  detailsZh: '完整中文描述段落',
  specifications: {
    dimensions: { width: 110, height: 80, depth: 80, unit: 'cm' },
    weight: 30,
    weightUnit: 'kg',
    additionalWeight: 10,
    additionalWeightNote: 'stand weight',
    colors: [{ name: 'Meteorite Grey', nameZh: '陨石灰', hex: '#4A4A4A' }],
    materials: ['High-density foam', 'Premium fabric'],
    materialsZh: ['高密度海绵', '优质面料'],
  },
  trendingGeo: ['shanghai', 'beijing', 'shenzhen', 'chengdu', 'hangzhou'],
  inStock: true,
}
```

### Step 5: 更新 i18n 翻译

在 `src/lib/i18n.ts` 中为所有 13 种语言添加产品相关的翻译键：

**需要添加的键**（以 `product{PascalSlug}` 为前缀）：

```
productMeteoriteRingName        — 产品名称
productMeteoriteRingDesc        — 一句话卖点
productMeteoriteRingDetails     — 详细描述
productMeteoriteRingMaterial    — 材质
productMeteoriteRingColor       — 颜色
productMeteoriteRingSpec        — 规格参数文本
```

**13 种语言**：en, zh, ja, fr, de, es, it, pt, pt-BR, ar, fa, hi, ko

### Step 6: 产品页面 i18n 映射（语言切换翻译）

> **重要**：添加 i18n 翻译键后，必须在 `src/app/[slug]/product-client.tsx` 的 `slugToPrefix` 映射中注册新产品，否则切换语言后产品名称/描述仍显示英文。

在 `product-client.tsx` 中找到 `slugToPrefix` 对象，添加新产品的 slug → i18n 前缀映射：

```typescript
const slugToPrefix: Record<string, string> = {
  "bear-sofa": "bearSofa",
  "lion-sofa": "lionSofa",
  "tiger-sofa": "tigerSofa",
  "gorilla-sofa": "gorillaSofa",
  "silverback-sofa": "silverbackSofa",
  "owl-sofa": "owlChair",
  "meteorite-ring-sofa": "meteoriteRingSofa",
  // 新增产品: "{slug}": "{i18nPrefix}",
};
```

**验证方法**：切换语言到中文，检查产品详情页的名称和描述是否显示对应语言翻译。如果仍显示英文，说明 `slugToPrefix` 映射缺失或 i18n 键名不匹配。

### Step 7: 添加 SEO 元数据

在 `src/lib/seo.ts` 的 `seoData` 对象中添加新产品：

```typescript
'meteorite-ring-sofa': {
  title: 'Meteorite Ring Sofa Chair | Fuzz Sofa',
  titleZh: '陨石环形沙发椅 | Fuzz Sofa',
  description: 'English meta description...',
  descriptionZh: '中文 meta description...',
  keywords: ['meteorite ring sofa', '环形沙发椅', 'designer chair', ...],
  ogImage: '/products/meteorite-ring-sofa/main.jpg',
},
```

### Step 8: trendingGeo 热门地区功能

**数据模型**：在 `src/lib/products.ts` 的 Product 类型中添加：

```typescript
trendingGeo?: string[];  // 热门城市/地区 slug 列表
```

**使用场景**：
- 产品详情页展示"该产品在 XX 地区热销"标签
- 搜索/筛选时可按地区热度排序
- 首页推荐模块可按用户地区匹配热门产品

**地区 slug 列表**（统一小写拼音）：

| slug | 中文名 | 英文名 |
|------|--------|--------|
| shanghai | 上海 | Shanghai |
| beijing | 北京 | Beijing |
| shenzhen | 深圳 | Shenzhen |
| guangzhou | 广州 | Guangzhou |
| chengdu | 成都 | Chengdu |
| hangzhou | 杭州 | Hangzhou |
| nanjing | 南京 | Nanjing |
| wuhan | 武汉 | Wuhan |
| chongqing | 重庆 | Chongqing |
| xiamen | 厦门 | Xiamen |
| suzhou | 苏州 | Suzhou |
| tianjin | 天津 | Tianjin |
| xian | 西安 | Xi'an |
| changsha | 长沙 | Changsha |
| qingdao | 青岛 | Qingdao |

### Step 9: 验证

1. TypeScript 编译：`npx tsc --noEmit`
2. ESLint：`pnpm lint --quiet`
3. 产品详情页可访问：`curl -s http://localhost:5000/{slug}`
4. 图片可访问：`curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/products/{slug}/main.jpg`

## 完整检查清单

- [ ] 产品图片已下载到 `public/products/{slug}/`
- [ ] rembg 抠图完成，`extracted.png` 已生成（仅用于 AI in My Room，不展示）
- [ ] `main.jpg` 和 `thumb.jpg` 已从**原图**生成（非抠图，展示真实颜色）
- [ ] `products.ts` 中已添加产品数据
- [ ] `i18n.ts` 中 13 种语言已添加翻译键
- [ ] `product-client.tsx` 的 `slugToPrefix` 映射已添加（语言切换翻译必需）
- [ ] `seo.ts` 中已添加 SEO 元数据
- [ ] `trendingGeo` 字段已填充
- [ ] TypeScript 编译通过
- [ ] 产品详情页可正常访问
