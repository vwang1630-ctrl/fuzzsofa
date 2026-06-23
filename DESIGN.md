# DESIGN.md

## 气质与意象
夜间画廊中的雕塑品展厅——纯黑空间中，每一件动物灵感家具如雕塑般被聚光照亮。温暖白光勾勒出毛绒质感与有机曲线，空气中弥漫着皮革与织物的触感记忆。参观者低声交谈，指尖掠过表面，像在确认一种真实的存在感。

## 配色方案 (V3 Design System)
- --black: #0A0A0A（深夜画廊黑，主背景）
- --off-white: #F5F0EB（温暖白，前景/正文）
- --muted: #8A8580（辅助灰，正文次要信息）
- --border: #1A1A1A（分割线/结构边框）
- --accent: #E8B4B8（脏粉，唯一accent色，如黎明时分最柔软的光）
- --surface: #111111（卡片/面板背景）
- 交互边框: #333（按钮/选择器边框，hover → accent）

## 字体排版
- 标题：Cormorant Garamond weight 300, letter-spacing 0.05em, 衬线体
- 正文：Inter weight 300-400, 无衬线体
- 全站 letter-spacing 偏大（0.1-0.2em），uppercase 标签
- 标题字号节奏：Hero 3.5rem → Section 2.5rem → Card 1.5rem
- 行高：标题 1.1，正文 1.7

## 按钮风格
- outline style: border 1px solid var(--off-white), background transparent
- hover: background var(--accent), border-color var(--accent), color var(--black)
- 禁止：渐变按钮、glassmorphism、glow效果、糖果粉(#FF6B9D)、电光紫(#E040FB)

## 布局规范
- 导航栏: fixed, height 60px, backdrop-filter blur(8px), border-bottom
- Section padding: 6rem 2rem
- 产品网格: grid, repeat(auto-fill, minmax(300px, 1fr)), gap 2rem
- 产品详情: 2列网格, gap 3rem (图片左 / 信息右)
- 最大宽度: 1200px (grid), 1100px (detail), 700px (text)

## 视觉策略
- 图像方向：高端室内摄影，家具置于真实空间中的氛围感
- 图形语言：极简线条画动物轮廓（作为装饰元素）、大面积留白
- 图片处理：所有产品图默认暗角渐变，融合黑色背景
- 产品图: aspect-ratio 1:1, object-fit cover
- 缩略图: 60x60px, border 1px solid, hover border accent

## 动效与交互
- fade-in 动画: opacity 0→1, translateY(20px→0), 0.6s
- 产品卡片 hover: translateY(-4px)
- 所有 transition: 0.3s
- Cart modal 从底部滑入
- 缓动曲线：cubic-bezier(0.25, 0.1, 0.25, 1) — 柔和进出
- 滚动：自然流动

## 设计禁忌
- 禁止渐变按钮（仅 outline 样式，hover 变 accent 填充）
- 禁止玻璃拟态/glassmorphism
- 禁止糖果粉 #FF6B9D、电紫 #E040FB
- 禁止发光效果/glow
- 禁止全大写段落文字（标题可用 letter-spacing 放大效果）
- 禁止圆角大于 8px（保持锐利几何感）
- 禁止彩色阴影（只允许纯黑阴影）
- 禁止文案: Premium Furniture Manufacturer / Luxury Sofa Factory / Handcrafted By Artisans / Bespoke Furniture Specialist / Custom Furniture Experts / Best Animal Sofa Supplier / Furniture Manufacturer Since XXXX
