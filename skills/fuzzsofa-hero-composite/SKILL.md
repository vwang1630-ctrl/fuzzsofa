# FuzzSofa Hero Scene Compositing Skill

## 概述

将真实产品照片精确放入电影级场景中，实现「AI场景 + 真实产品」的电商Hero Banner。核心原则：**产品必须与真实照片完全一致，不做任何AI改变**。

## 工作流（6步法）

### Step 1: 场景定义与生成

**输入**：产品名称、风格方向（关键词+意象描述）

**方法**：使用 AI 图像生成工具生成场景背景图，要求：
- 场景中**不包含**任何与目标产品相似的物体
- 场景需预留产品放置的视觉空间（光线、构图留白）
- 场景风格与产品形成有意义的对话（对比/互补/故事性）

**输出**：`public/hero-scene-N-empty.jpg`（空场景，无产品）

**关键提示词要素**：
```
- 场景类型（图书馆/工业风/画廊等）
- 照明方向（左暖右冷/霓虹/自然光等）
- 地面材质和颜色（产品需要"坐"在上面）
- 构图：三分法，预留产品位置
- 宽高比：16:7 或 16:9
```

### Step 2: 产品精确抠图

**输入**：真实产品照片（`public/products/{slug}/reference.jpg`）

**方法**：rembg ML抠图 + 颜色分析混合提取

#### 2a. ML提取（上半身/主体）
```bash
# 安装（首次）
pip install rembg

# 提取 - silueta模型效果最好
rembg i -m silueta -a -af 240 -ab 15 -ae 10 input.jpg output.png
```

参数说明：
- `-a`: 启用alpha matting
- `-af 240`: 前景阈值（越低保留越多）
- `-ab 15`: 背景阈值（越高越激进去背景）
- `-ae 10`: 侵蚀大小

#### 2b. 颜色分析补充（底部/脚部/ML遗漏区域）

ML模型对坐在地面上的产品底部无法正确提取（与地板颜色边界模糊）。需要：

1. 找到ML提取中产品主体结束的Y坐标（`legY`）
2. 在腿的X范围内，向下搜索属于产品的像素
3. 使用HSL色彩空间判断：
   - 产品毛发：低饱和度(S<0.15)、中低亮度
   - 产品脚趾/特殊部件：根据参考图特征定义颜色范围
4. 距离衰减：越往下alpha越小，确保平滑过渡

```javascript
// 判断像素是否属于产品的颜色分析逻辑
for (let y = legY; y < maxY; y++) {
  for (let x = leftLeg; x < rightLeg; x++) {
    const {l, s} = getHSL(pixel);
    // 毛发像素
    if (l < 0.35 && s < 0.10) addPixel(x, y, alpha);
    // 脚趾/特殊部件（根据产品定义）
    if (l < 0.12 && s < 0.18) addPixel(x, y, alpha);
  }
}
```

#### 2c. 清理杂质
- 移除不属于产品的暖色/高饱和度像素（木地板、砖墙等）
- 移除孤立噪点像素
- 保存为 `public/hero-{product}-extracted.png`

### Step 3: 像素级合成

**输入**：抠图PNG + 空场景JPG

**方法**：使用 sharp (Node.js) 进行像素级合成

#### 3a. 比例与位置计算
```javascript
const roomHeight = 3.5; // 米（根据场景推断）
const productHeight = 2.0; // 米（实际产品尺寸）
const targetVisibleRatio = productHeight / roomHeight; // ~57%
const targetVisibleH = Math.floor(sceneH * targetVisibleRatio);
// 位置：视觉中心（产品面部在画面~50%高度处）
const floorSurface = Math.floor(sceneH * 0.82); // 地面位置
const top = floorSurface - targetVisibleH;
```

#### 3b. 颜色校正（产品→场景）
```javascript
// 将产品从参考图的暖色室内光校正到场景的色温
// 画廊/冷调场景：
r = r * 0.93; g = g * 0.96; b = b * 1.01 + 2;
// 暖色场景：
r = r * 0.95 + 2; g = g * 0.97; b = b * 0.98;
```

#### 3c. 皮毛光泽增强（三频段）
```javascript
// 频段1：中间调S-curve对比（毛绒纹理立体感）
if (0.15 < l < 0.45 && s < 0.25) contrast_boost(l, 1.12);
// 频段2：高光specular sheen（毛尖反光）
if (l > 0.35 && s < 0.22) brightness_boost(1.15~1.22);
// 频段3：暖色高光反射（环境光映射）
if (l > 0.55 && s < 0.18) warm_specular(+5r, +2g);
```

#### 3d. 边缘融合
1. **距离场Alpha羽化**：计算每个不透明像素到最近透明像素的距离（12px范围），按距离衰减alpha
2. **方向性Rim Light**：
   - 左缘→暖色rim（场景左侧暖光反射）
   - 右缘→冷色rim（场景右侧冷光反射）
   - 顶缘→暖色rim（头顶光源）
   - 底缘→冷色rim（地板冷反射）
3. **二次Alpha平滑**：高斯模糊alpha通道，消除锯齿

#### 3e. 多层阴影
```svg
<!-- 硬接触阴影：紧贴产品底部 -->
<ellipse rx="productW*0.28" ry="12" filter="blur(10px)" opacity="0.65"/>
<!-- 中等扩散阴影 -->
<ellipse rx="productW*0.38" ry="26" filter="blur(28px)" opacity="0.30"/>
<!-- 柔环境阴影 -->
<ellipse rx="productW*0.52" ry="48" filter="blur(55px)" opacity="0.12"/>
<!-- 环境遮蔽(AO)：产品底部向下的暗区 -->
<rect fill="radialGradient" opacity="0.5→0"/>
```

#### 3f. 环境光叠加
```svg
<!-- 暖色环境光（screen blend） -->
<radialGradient cx="35%" cy="25%" stop-color="#D8C8B0" opacity="0.07"/>
<!-- 冷色方向光（over blend） -->
<linearGradient from="right" stop-color="#5A6A88" opacity="0.05"/>
<!-- 高光specular（screen blend） -->
<radialGradient cx="38%" cy="28%" stop-color="#F5EDE0" opacity="0.05"/>
<!-- 地板反射光（screen blend） -->
<linearGradient from="bottom" stop-color="#8A7060" opacity="0.04"/>
```

#### 3g. 边缘光晕包裹
```svg
<!-- 暖色光晕：包裹产品轮廓左侧 -->
<rect fill="radial(#B8A890, 0.05)" filter="blur(30px)"/>
<!-- 冷色光晕：包裹产品轮廓右侧 -->
<rect fill="radial(#6878A0, 0.025)" filter="blur(55px)"/>
```

**输出**：`public/hero-scene-N.jpg`

### Step 4: 场景色调统一

在最终合成时，对场景背景做色调调整，使产品与场景更和谐：

1. **场景校正**：冷墙微暖、暖地板微冷、统一中间调
2. **环境光洗**：全场景覆盖极淡暖色screen叠加
3. **暗角聚焦**：radial vignette将视觉焦点聚到中央产品
4. **整体色温**：产品体色应居中于场景暖冷两端之间

### Step 5: 文案与视觉设计

#### 文案策划原则
- **标题**：2-4个词，大胆直接，有记忆点。不做描述性标题。
  - 格式：动词+名词 / 短语 / 冲击性陈述
  - 例："Sit on Art" / "坐上艺术"
- **副标题/标签**：品类定义，宽字距大写
  - 例："SCULPTURAL ANIMAL FURNITURE"
- **描述**：1-2句，有温度和画面感，不堆砌卖点
  - 例："Born in Shanghai. Raised in your living room."
- **CTA**：指向具体产品，不用泛泛的"探索系列"
  - 例："Meet the Gorilla" → `/gorilla-sofa`

#### 视觉设计原则
- **产品是主角，文字是配角**：文字不与产品争夺视觉焦点
- **位置**：利用场景中的暗区/留白放置文字
- **层级**：accent标签 → 大标题 → 装饰线 → 描述 → CTA
- **按钮**：outline风格（border 1px solid off-white），hover变accent填充
- **动画**：staggered fade-in（0s→0.1s→0.25s→0.45s）

### Step 6: 功能对接

- CTA按钮链接到对应产品详情页（`/[slug]`）
- 产品slug在 `src/lib/products.ts` 中定义

## 场景风格库

| 风格 | 关键词 | 产品适配 | 色调 |
|------|--------|---------|------|
| 百万富翁图书馆 | 深色木书架、黄铜灯、皮革 | 大猩猩沙发 | 暖褐+冷蓝灰 |
| 暗黑朋克 | 混凝土墙、霓虹灯条、工业风 | 粉色猫头鹰 | 冷灰+粉霓虹 |
| 画廊白盒子 | 纯白墙、天窗、极简 | （待定） | 高亮白+中性灰 |

## 文件命名规范

```
public/
├── hero-scene-1.jpg           # 最终合成图（猩猩）
├── hero-scene-1-empty.jpg     # 原始空场景
├── hero-scene-1-no-lamp.jpg   # 修改后的空场景
├── hero-scene-2.jpg           # 最终合成图（猫头鹰）
├── hero-scene-2-empty.jpg     # 空场景
├── hero-gorilla-v2-with-feet.png  # 抠图结果
├── hero-owl-extracted.png     # 抠图结果
└── products/
    ├── gorilla-sofa/reference.jpg
    └── owl-sofa/reference.jpg
```

## 技术栈

- **rembg** (Python)：ML背景移除
- **sharp** (Node.js)：像素级图像合成
- **HSL色彩空间**：颜色分析判断
- **SVG**：阴影、AO、光晕的矢量定义

## 注意事项

1. **禁止AI image-to-image改变产品**：所有尝试过的AI图像转换都会改变产品细节（爪子形状、脸部比例等），必须用ML抠图+合成方式
2. **ML模型对底部失效**：坐在地面上的产品，ML无法正确提取底部，必须用颜色分析补充
3. **比例必须真实**：根据产品实际尺寸（2m等）和场景空间比例计算，不能凭感觉
4. **色调校正必须双向**：既校正产品到场景，也微调场景到产品
5. **JPG质量97%**：保证清晰度
