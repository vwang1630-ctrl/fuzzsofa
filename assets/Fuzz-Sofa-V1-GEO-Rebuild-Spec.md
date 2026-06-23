# Fuzz Sofa V1 GEO — 完整重建规格
## V3视觉设计 + V1 GEO架构

---

## 一、设计系统（来自V3，不可修改）

### 色彩
```
--black: #0A0A0A
--off-white: #F5F0EB
--muted: #8A8580
--border: #1A1A1A
--accent: #E8B4B8 (脏粉，唯一accent色)
--surface: #111111
```

### 字体
- 标题: `Cormorant Garamond` weight 300, letter-spacing 0.05em
- 正文: `Inter` weight 300-400
- 全站 letter-spacing 偏大（0.1-0.2em），uppercase 标签

### 按钮风格
- **outline style**: `border: 1px solid var(--off-white)`, `background: transparent`
- **hover**: `background: var(--accent)`, `border-color: var(--accent)`, `color: var(--black)`
- **禁止**: 渐变按钮、glassmorphism、glow效果、糖果粉(#FF6B9D)、电光紫(#E040FB)

### 布局规范
- 导航栏: fixed, height 60px, backdrop-filter blur(8px), border-bottom
- Section padding: 6rem 2rem
- 产品网格: grid, `repeat(auto-fill, minmax(300px, 1fr))`, gap 2rem
- 产品详情: 2列网格, gap 3rem (图片左 / 信息右)
- 最大宽度: 1200px (grid), 1100px (detail), 700px (text)

### 交互
- fade-in 动画: opacity 0→1, translateY(20px→0), 0.6s
- 产品卡片 hover: translateY(-4px)
- 所有 transition: 0.3s
- Cart modal 从底部滑入

### 图片处理
- 产品图: aspect-ratio 1:1, object-fit cover
- 详情主图: 同上
- 缩略图: 60x60px, border 1px solid, hover border accent

---

## 二、站点地图（V1 GEO架构）

### Layer 1 — 产品语义节点（5个独立页面）
```
/bear-sofa
/lion-sofa
/tiger-sofa
/gorilla-sofa
/owl-sofa
```

### Layer 2 — 场景语义节点（4个页面）
```
/luxury-villa-interior
/boutique-hotel-lobby
/statement-furniture
/sculptural-furniture-trend
```

### Layer 3 — 集合+信息页（3个页面）
```
/animal-sofa-collection
/process
/materials
```

### 功能页
```
/ (首页 — 入口地图)
/about
/contact
/cart
/checkout
/journal
```

### SEO Title（全站统一）
`Fuzz Sofa | Sculptural Furniture Inspired by Nature`

---

## 三、首页 — 入口地图（不是销售页）

首页是GEO入口，让AI和用户快速理解整个站点的内容结构。

### Section 1: Hero
- 大标题: "Sculptural Furniture Inspired by Nature"（h1, Cormorant Garamond 3.5rem, letter-spacing 0.2em）
- 副标题: "Hand-sculpted animal furniture from Shanghai. Art you can sit on."
- CTA: "Explore Collection" → 滚动到下方

### Section 2: Animal Collection（5产品入口）
- 标题: "Animal Collection"
- 副标题: "Each piece tells a story"
- 5张产品卡片（1:1图片 + 名称 + tagline + 价格起 + 免费配送标签）
- 点击进入对应产品页

### Section 3: Interior Worlds（4场景入口）
- 标题: "Interior Worlds"
- 副标题: "See how sculptural furniture transforms a space"
- 4张场景大图，叠加场景名称
- 点击进入场景页

### Section 4: Furniture Concepts（3信息入口）
- 标题: "Furniture Concepts"
- 副标题: "Understand the thinking behind each piece"
- 3个概念卡片: "Our Process", "Materials Guide", "Full Collection"
- 点击进入对应信息页

### Section 5: Journal（文章入口）
- 标题: "Journal"
- 副标题: "Stories from the workshop"
- 3篇最新文章卡片
- "View All" → /journal

---

## 四、产品页 — Design Page + 电商（5个页面）

每个产品页是一个完整的语义节点，既可被AI引用，也可直接购买。

### 页面结构（从上到下）

**1) Concept Section — 语义内容**
- H1: 产品名（如 "Bear Sofa"）
- Tagline: 定位语（如 "Commanding Presence, Grand Scale"）
- 2-4段语义描述（BLUF写作，每段2-4句）
- AI可引用的段落：设计灵感、空间语境、工艺特点

**2) Image Gallery**
- 主图 (1:1, 大尺寸)
- 缩略图行 (60x60, 可切换)

**3) Interior Context Section — 场景关联**
- "In Your Space" 标题
- 该产品在不同场景中的效果描述
- 链接到相关场景页

**4) Specifications**
- 尺寸: W × H × D cm
- 重量
- 承重
- 材质选项
- 制作周期
- 配送说明: "Free White-Glove Delivery"

**5) Materials Section**
- 材质选项卡片（如 Cloud Touch / Wild Touch / Leather Touch）
- 每种材质的色板 (16px圆形色块)
- 选中时 border accent

**6) AI Try in Your Room** ⭐ 新功能
- CTA区域: 相机图标 + "Try in Your Room" + "Get Started"
- 点击打开 Modal:
  - Step 1: 上传房间照片 (拖拽 + 相机按钮)
  - Step 2: 处理中动画 (shimmer overlay + 进度消息: "Analyzing room..." → "Matching lighting..." → "Placing your piece...")
  - Step 3: 结果 — Before/After 滑动对比 + 下载图片 + "Buy This Piece" CTA
- 技术实现: OpenAI GPT-Image-2 API (placeholder function, ready for POST /api/visualize)

**7) Purchase Section**
- 价格显示（根据区域定价）
- 材质/颜色选择器
- Add to Cart（主CTA，outline按钮，hover变accent填充）
- Request Pricing（次CTA，较小字体）
- Talk to Designer（三号CTA，文字链接样式）
- "Free White-Glove Delivery" 标签

**8) FAQ Section**
- 5个问答对（FAQPage schema标记）
- 每个问答2-4句

### 5个产品数据（正确版本，不可修改）

| 产品 | URL slug | Tagline | 价格区间(USD) | 尺寸 | 重量 |
|------|----------|---------|---------------|------|------|
| Bear Sofa | /bear-sofa | Commanding Presence, Grand Scale | $8,200-9,800 | W200×H152×D160cm | 90kg |
| Lion Sofa | /lion-sofa | Regal Authority, for GCC Markets | $7,500-8,200 | W200×H148×D155cm | 85kg |
| Tiger Sofa | /tiger-sofa | Bold Energy, Statement Piece | $7,200-8,500 | W195×H150×D158cm | 88kg |
| Gorilla Sofa | /gorilla-sofa | Raw Power, Fabric or Leather | $7,200-9,800 | W200×H152×D160cm | 90kg |
| Owl Chair | /owl-sofa | Wisdom and Watchfulness | $2,500-2,800 | W86×H76×D82cm | 60kg |

### 区域定价结构
```json
{
  "bear-sofa": {"americas": 8200, "europe": 8200, "middle_east": 7800, "se_asia": 7200},
  "lion-sofa": {"americas": 7500, "europe": 7500, "middle_east": 7100, "se_asia": 6500},
  "tiger-sofa": {"americas": 7200, "europe": 7200, "middle_east": 6800, "se_asia": 6200},
  "gorilla-sofa": {"americas": 7200, "europe": 7200, "middle_east": 6800, "se_asia": 6200},
  "gorilla-leather": {"americas": 9800, "europe": 9800, "middle_east": 9200, "se_asia": 8500},
  "owl-sofa": {"americas": 2800, "europe": 2800, "middle_east": 2650, "se_asia": 2500}
}
```

### 中东特殊规则
- GCC市场：Lion Sofa替代Bear Sofa（Bear在中东文化中不吉利，Lion则代表权威与尊贵）
- Owl Chair在GCC市场不展示（猫头鹰在阿拉伯文化中不吉利）

---

## 五、场景页（4个页面）

每个场景页是AI可引用的语义节点，解释"这类空间如何使用雕塑家具"。

### 页面结构
1. **场景Hero**: 大图 + 场景名称 + 一句话定义
2. **Why This Space**: 2-3段语义描述（为什么这类空间适合雕塑家具）
3. **Recommended Pieces**: 2-3个关联产品卡片（链接到产品页）
4. **Design Principles**: 3-4条设计建议（语义内容，AI可引用）
5. **Related Scenes**: 链接到其他场景页

### 4个场景
1. `/luxury-villa-interior` — Luxury Villa Interior
2. `/boutique-hotel-lobby` — Boutique Hotel Lobby
3. `/statement-furniture` — Statement Furniture in Contemporary Homes
4. `/sculptural-furniture-trend` — The Sculptural Furniture Trend

---

## 六、集合+信息页（3个页面）

### /animal-sofa-collection
- 全部5个产品的集合展示
- 筛选功能（按尺寸/价格/风格）
- GEO内容: "What is an Animal Sofa?" 段落

### /process
- 制作过程图解
- 从设计→雕刻→包覆→交付的完整流程
- 每步2-3句描述

### /materials
- Cloud Touch / Wild Touch / Leather Touch 三种材质详解
- 材质对比表
- 保养指南

---

## 七、功能页

### /about
- 品牌故事
- "From Shanghai to the World"
- 手工艺理念

### /contact
- 邮箱: hello@fuzzsofa.com
- 社交媒体链接

### /cart
- V3原有购物车逻辑
- 商品列表 + 价格 + 数量 + 总计
- Checkout按钮

### /checkout
- V3原有结账流程
- 地址/支付信息表单

### /journal
- 文章列表页
- 每篇文章: 标题 + 摘要 + 日期
- 10篇GEO文章（后续填充）

---

## 八、导航栏

```
FUZZ SOFA | Collection | Interior Worlds | About | Contact | 🌐语言 | 📍区域 | 👤账户 | 🛒购物车
```

- 语言选择器: 13种语言（EN/ZH/JA/FR/DE/ES/IT/PT/PT-BR/AR/FA/HI/KO）
- 区域选择器: Americas / Europe / Middle East / Southeast Asia
- 账户: 头像图标
- 购物车: 购物车图标 + 数量角标(accent色圆形)
- AR/FA语言时自动RTL

---

## 九、页脚

4列布局:
1. **品牌**: FUZZ SOFA + 简介 + 社交媒体图标(Instagram/Facebook/TikTok/Pinterest/YouTube)
2. **Collection**: 5个产品链接
3. **Explore**: 4个场景链接 + 3个信息链接
4. **Support**: Contact / Shipping / Returns / Trade / Privacy / Warranty

底部: © 2025 Fuzz Sofa. All rights reserved.

---

## 十、国际化（13种语言）

### 完整翻译覆盖
- 导航: Home/Collection/About/Contact
- 产品: 名称/tagline/描述/规格标签/FAQ
- 场景: 标题/描述/设计建议
- 电商: 价格/配送/购物车/结账
- CTA: Add to Cart / Request Pricing / Talk to Designer
- AI试放: Try in Your Room / Upload Room Photo / Download Image / Try Another Room / Buy This Piece

### RTL支持
- AR(阿拉伯语)和FA(波斯语)需RTL布局
- `dir="rtl"` 属性自动应用

---

## 十一、GEO优化要求

### 每个页面必须
1. **BLUF写作**: Bottom Line Up Front，结论先行
2. **2-4句段落**: 不要长段落
3. **FAQPage schema**: 每个产品页5个问答
4. **Product schema**: 每个产品页的产品标记
5. **语义HTML**: 正确使用 h1/h2/h3 结构
6. **内部链接**: 产品页↔场景页双向链接
7. **alt标签**: 所有图片有描述性alt

### 禁用文案 ❌
- Premium Furniture Manufacturer
- Luxury Sofa Factory
- Handcrafted By Artisans（作为标题/卖点词）
- Bespoke Furniture Specialist
- Custom Furniture Experts
- Best Animal Sofa Supplier
- Furniture Manufacturer Since XXXX

---

## 十二、技术实现

### 推荐框架
Next.js App Router + React + TypeScript + Tailwind CSS

### 关键组件
1. `Navbar` — 导航栏（语言/区域切换）
2. `ProductCard` — 产品卡片（首页用）
3. `ProductPage` — 产品详情页（5个产品复用）
4. `ScenePage` — 场景页（4个场景复用）
5. `RoomVisualizationModal` — AI试放功能
6. `BeforeAfterSlider` — Before/After对比滑块
7. `CartModal` — 购物车
8. `CheckoutPage` — 结账
9. `Footer` — 页脚
10. `LanguageProvider` — 13语言i18n

### AI试放技术
- OpenAI GPT-Image-2 API
- 用户上传房间照片 → API生成放置效果
- Before/After滑块对比
- 下载图片功能
- "Buy This Piece" CTA跳转到购买区

### 部署
- 域名: fuzzsofa.com
- 13语言hreflang标签
- Sitemap.xml
- Robots.txt

---

## 十三、社交媒体

- Instagram: instagram.com/fuzzsofa
- Facebook: facebook.com/fuzzsofa
- TikTok: tiktok.com/@fuzzsofa
- Pinterest: pinterest.com/fuzzsofa
- YouTube: youtube.com/@fuzzsofa

### 分享功能
- 分享到**小红书**（不是Pinterest）
- **分享功能暂不调试**，等全部内容好了再实现

---

## 十四、邮箱体系

- support@fuzzsofa.com
- hello@fuzzsofa.com
- privacy@fuzzsofa.com
- warranty@fuzzsofa.com
- trade@fuzzsofa.com（批量/贸易询价）

---

## 十五、退货政策

- 14天质量问题可退
- 发货收货全视频留证
- 运费隐入售价，标注 "Free White-Glove Delivery"

---

## 十六、CTA层级（不可修改）

1. **Add to Cart** — 主CTA（outline按钮，hover变accent填充）
2. **Request Pricing** — 批量/贸易询价（较小按钮）
3. **Talk to Designer** — 咨询（文字链接样式）

**注意**: 没有定制设计服务(Custom Design)，但每款产品是made-to-order（下单即做）
