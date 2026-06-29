# 图片规格与命名规范

## 目录结构

每个产品需要一个独立的图片目录：

```
public/products/<slug>/
├── hero.webp                # 主图
├── detail-1.webp            # 细节图1
├── detail-2.webp            # 细节图2
├── lifestyle.webp           # 场景图（宽幅原图）
├── lifestyle-square.webp    # 场景图方版（自动裁剪）
├── story-sketch.webp        # Story 区块产品图/手绘图
├── materials-bg.webp        # Materials 区块背景图
└── cutout/                  # 各颜色去背图
    ├── white.png
    ├── pink.png
    └── black.png
```

空间展示图（独立目录，按产品 slug 命名）：
```
public/products/spaces/
├── <slug>-space-1.jpg
├── <slug>-space-2.jpg
└── <slug>-space-3.jpg
```

## 图片规格

| 图片 | 尺寸要求 | 比例 | 格式 | 用途 |
|------|---------|------|------|------|
| hero.webp | ≥800×800px | 1:1 | WebP | 主图画廊首图 |
| detail-1.webp | ≥800×800px | 1:1 | WebP | 细节/材质特写 |
| detail-2.webp | ≥800×800px | 1:1 | WebP | 细节/工艺特写 |
| lifestyle.webp | ≥1920×1080px | 16:9 宽幅 | WebP | 场景图原图 |
| lifestyle-square.webp | 800×800px | 1:1 | WebP | 从 lifestyle 自动裁剪 |
| story-sketch.webp | ≥600px高 | 竖版/方版均可 | WebP | Story 区块产品图 |
| materials-bg.webp | ≥1200×800px | 3:2 宽幅 | WebP | Materials 区块背景 |
| cutout/*.png | ≥600px | 透明背景 | PNG | 颜色变体切换去背图 |
| spaces/*.jpg | ≥1200×600px | 2:1 宽幅 | JPEG | 空间展示区卡片 |

## 关键处理规则

### 1. lifestyle-square.webp 自动裁剪

必须从 `lifestyle.webp` 裁剪生成 1:1 方形图。使用 `scripts/crop_square.py`：

```bash
python3 product-upload/scripts/crop_square.py \
  public/products/<slug>/lifestyle.webp \
  public/products/<slug>/lifestyle-square.webp \
  --center-x 900 --center-y 850
```

**关键**：`--center-x` 和 `--center-y` 必须对准产品主体位置，不是图片几何中心！
- 产品在画面左侧 → center-x 偏小
- 产品在画面底部 → center-y 偏大
- 需要目测产品位置后给出坐标

### 2. 图片格式优先级

- 产品图/场景图 → **WebP**（更小体积，更好压缩）
- 去背图 → **PNG**（需要透明通道）
- 空间展示图 → **JPEG**（照片类，不需透明）

### 3. 图片命名规范

- 全部小写英文
- 用连字符分隔单词：`story-sketch.webp`
- 颜色名用英文：`white.png`, `dusty-rose.png`, `midnight.png`
- 禁止中文文件名
- 禁止空格

### 4. 图片来源处理

- 用户直接上传 → 下载到对应目录
- 用户提供 URL → curl 下载到对应目录
- AI 生成 → 保存到对应目录
- 禁止使用占位图或外部 CDN 链接
