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
   - `reference-1.jpg` — 主产品图（白底/场景图均可，用于 rembg 抠图）
   - `reference-2.jpg` ~ `reference-N.jpg` — 多角度/场景图
   - 保留原始分辨率，不做缩放

```bash
mkdir -p public/products/{slug}
curl -sL -o "public/products/{slug}/reference-1.jpg" "{IMAGE_URL}"
```

### Step 2: 产品图抠图 (rembg)

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

### Step 3: 产品缩略图生成

使用 sharp 生成多种尺寸的产品图：

```javascript
const sharp = require('sharp');

// 主图 - 800x800 白底
await sharp('public/products/{slug}/extracted.png')
  .resize(800, 800, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
  .flatten({ background: { r: 255, g: 255, b: 255 } })
  .jpeg({ quality: 92 })
  .toFile('public/products/{slug}/main.jpg');

// 缩略图 - 400x400
await sharp('public/products/{slug}/extracted.png')
  .resize(400, 400, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
  .flatten({ background: { r: 255, g: 255, b: 255 } })
  .jpeg({ quality: 85 })
  .toFile('public/products/{slug}/thumb.jpg');
```

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

### Step 6: 添加 SEO 元数据

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

### Step 7: trendingGeo 热门地区功能

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

### Step 8: 验证

1. TypeScript 编译：`npx tsc --noEmit`
2. ESLint：`pnpm lint --quiet`
3. 产品详情页可访问：`curl -s http://localhost:5000/{slug}`
4. 图片可访问：`curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/products/{slug}/main.jpg`

## 完整检查清单

- [ ] 产品图片已下载到 `public/products/{slug}/`
- [ ] rembg 抠图完成，`extracted.png` 已生成
- [ ] `main.jpg` 和 `thumb.jpg` 已生成
- [ ] `products.ts` 中已添加产品数据
- [ ] `i18n.ts` 中 13 种语言已添加翻译键
- [ ] `seo.ts` 中已添加 SEO 元数据
- [ ] `trendingGeo` 字段已填充
- [ ] TypeScript 编译通过
- [ ] 产品详情页可正常访问
