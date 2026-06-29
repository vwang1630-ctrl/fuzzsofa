# 产品数据完整字段定义

## TypeScript 接口

```typescript
interface Product {
  slug: string;              // URL 路径标识，如 'owl-sofa'
  name: string;              // 显示名称，如 'Owl Chair'
  tagline: string;           // 一句话描述，如 'A quiet presence in the corner of the room.'
  category: string;          // 产品分类，如 'Chairs', 'Sofas', 'Tables'
  price: number;             // 价格（人民币），如 29800
  originalPrice?: number;    // 原价（可选），如 35800
  description: string;       // 简短描述（用于卡片）
  story: string[];           // 故事段落数组（2-3段，每段 2-4 句）
  specifications: {
    width: number;           // 宽度 cm
    depth: number;           // 深度 cm
    height: number;          // 高度 cm
    seatHeight: number;      // 坐高 cm
    weight: number;          // 净重 kg
    capacity: number;        // 最大承重 kg
  };
  materials: [               // 材质列表（固定4项）
    {
      name: string;          // 材质名称，如 'Steel Frame'
      description: string;   // 材质描述，如 'FSC-certified solid walnut wood frame'
      iconLetter: string;    // 图标字母，如 'F'
      svgPath: string;       // SVG 图标路径（d 属性值），见下方图标列表
    },
    // ... 共4项
  ];
  craftTags: [               // 工艺标签（固定4项）
    {
      label: string;         // 标签文字，如 'Handcrafted'
      svgPath: string;       // SVG 图标路径
    },
    // ... 共4项
  ];
  materialOptions: [         // 颜色/材质变体
    {
      name: string;          // 变体名称，如 'Cloud White'
      color: string;         // 色值，如 '#F5F0EB'
      cutoutImage: string;   // 去背图路径，如 '/products/owl/cutout/white.png'
      price?: number;        // 变体价格（可选，默认用主价格）
    },
    // ... 至少1项
  ];
  productImages: string[];   // 产品图路径数组，如 ['/products/owl/hero.webp', ...]
}
```

## Owl-Sofa 标准示例

```typescript
{
  slug: 'owl-sofa',
  name: 'Owl Chair',
  tagline: 'A quiet presence in the corner of the room.',
  category: 'Chairs',
  price: 29800,
  originalPrice: 35800,
  description: 'Inspired by the watchful silhouette of an owl, this sculptural chair brings quiet character to any corner.',
  story: [
    'It started, as the best things do, with a walk at dusk. The designer spotted an owl perched on a fence post — completely still, yet intensely present. That paradox of quiet confidence became the design thesis: a chair that commands attention without demanding it.',
    'The Owl Chair wraps you in a gently curved shell, its rounded wings offering a sense of shelter without enclosure. The seat sinks just enough, the back supports without rigidity. It is, in every sense, a place to settle.',
    'We spent fourteen months on the prototype alone — shaping and reshaping the wing curves until they felt like an invitation rather than a statement. The brass feet took another three months. Details matter.'
  ],
  specifications: {
    width: 86,
    depth: 82,
    height: 76,
    seatHeight: 44,
    weight: 50,
    capacity: 150,
  },
  materials: [
    {
      name: 'FRAME',
      description: 'FSC-certified solid walnut wood frame',
      iconLetter: 'F',
      svgPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    },
    {
      name: 'CUSHION',
      description: 'High-density foam wrapped in duck down',
      iconLetter: 'S',
      svgPath: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    },
    {
      name: 'UPHOLSTERY',
      description: 'Cloud Touch & Wild Touch fabric upholstery',
      iconLetter: 'L',
      svgPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    },
    {
      name: 'FEET',
      description: 'Solid brass feet with brushed finish',
      iconLetter: 'B',
      svgPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5',
    },
  ],
  craftTags: [
    { label: 'Handcrafted', svgPath: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
    { label: '1-2 Weeks', svgPath: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' },
    { label: 'Made to Order', svgPath: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
    { label: 'Free White-Glove', svgPath: 'M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2.81A2 2 0 0 1 20 8v8a2 2 0 0 1-2 2h-2M12 2v20M8 6V2h8v4' },
  ],
  materialOptions: [
    { name: 'Cloud White', color: '#F5F0EB', cutoutImage: '/products/owl/cutout/white.png' },
    { name: 'Dusty Rose', color: '#E8B4B8', cutoutImage: '/products/owl/cutout/pink.png' },
    { name: 'Midnight', color: '#1A1A1A', cutoutImage: '/products/owl/cutout/black.png' },
  ],
  productImages: [
    '/products/owl/hero.webp',
    '/products/owl/detail-1.webp',
    '/products/owl/detail-2.webp',
    '/products/owl/lifestyle-square.webp',
  ],
}
```

## 可用 SVG 图标路径 (Lucide Icons)

材质卡片和工艺标签使用 Lucide 风格 SVG stroke 图标。以下是常用图标的 `d` 属性：

**材质类**：
- 框架/结构: `M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5` (layers)
- 填充/软垫: `M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z` (heart)
- 面料/保护: `M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z` (shield)
- 金属/脚: `M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5` (diamond)

**工艺标签类**：
- 手工: `M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z` (wrench)
- 时间: `M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83` (clock)
- 定制: `M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z` (package)
- 配送: `M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2.81A2 2 0 0 1 20 8v8a2 2 0 0 1-2 2h-2M12 2v20M8 6V2h8v4` (truck)

更多图标可从 Lucide Icons (https://lucide.dev/icons/) 获取。
