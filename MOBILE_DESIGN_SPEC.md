# 手机端视觉设计规范

## 配色方案
- **主背景**: #0A0A0A（深夜画廊黑）
- **主文字**: #F5F0EB（温暖白）
- **次要文字**: #8A8580（辅助灰）
- **辅助文字**: #6A6560（更浅灰）
- **边框**: #1A1A1A（结构边框）
- **强调色**: #E8B4B8（脏粉，唯一 accent 色）
- **卡片背景**: #111111

## 字体规范
### 字体族
- **标题**: Cormorant Garamond, Georgia, serif（衬线体）
- **正文**: Inter, -apple-system, sans-serif（无衬线体）

### 字号层级
- **页面标题**: 18px, font-weight 400, letter-spacing 0.1em
- **区块标题**: 22px, font-weight 300, letter-spacing 0.02em
- **卡片标题**: 14-16px, font-weight 400-500
- **主要正文**: 14-15px, font-weight 300-400, line-height 1.7-1.8
- **次要正文**: 12-13px, font-weight 300, line-height 1.6
- **辅助文字**: 10-11px, font-weight 300, letter-spacing 0.04-0.15em

### 字重规范
- **标题**: 300-500
- **正文**: 300-400
- **按钮**: 500

### 字间距
- **标题**: 0.02-0.1em
- **正文**: 0.02-0.06em
- **标签/辅助文字**: 0.04-0.2em（uppercase）

## 按钮规范
### 主要按钮（panel-confirm-btn）
- **字体**: Cormorant Garamond, 15px, weight 500
- **字间距**: 0.15em
- **颜色**: #E8B4B8
- **背景**: rgba(232, 180, 184, 0.06)
- **边框**: 1.5px solid rgba(232, 180, 184, 0.35)
- **内边框**: inset 4px, 0.5px solid rgba(232, 180, 184, 0.06)
- **高度**: 54px
- **圆角**: 0（直角）
- **点击效果**: scale(0.97), background 加深

### 次要按钮（btn-cart）
- **字体**: Cormorant Garamond, 15px, weight 500
- **字间距**: 0.15em
- **颜色**: #F5F0EB
- **背景**: transparent
- **边框**: 1.5px solid rgba(245, 240, 235, 0.25)
- **高度**: 54px
- **圆角**: 0

### 强调按钮（btn-buy）
- **字体**: Cormorant Garamond, 15px, weight 500
- **字间距**: 0.15em
- **颜色**: #E8B4B8
- **背景**: rgba(232, 180, 184, 0.06)
- **边框**: 1.5px solid rgba(232, 180, 184, 0.35)
- **高度**: 54px
- **圆角**: 0

## 间距规范
- **页面内边距**: 16-20px
- **区块间距**: 20-30px
- **卡片间距**: 12-16px
- **按钮间距**: 12px

## 边框规范
- **细边框**: 0.5px
- **标准边框**: 1-1.5px
- **圆角**: 0（保持锐利几何感）

## 动效规范
- **过渡时间**: 0.3s
- **缓动曲线**: cubic-bezier(0.25, 0.1, 0.25, 1)
- **点击效果**: scale(0.97)
- **淡入动画**: opacity 0→1, translateY(20px→0), 0.6s

## 设计禁忌
- 禁止圆角大于 8px
- 禁止渐变按钮
- 禁止玻璃拟态/glassmorphism
- 禁止糖果粉 #FF6B9D、电紫 #E040FB
- 禁止发光效果/glow
- 禁止彩色阴影（只允许纯黑阴影）
