#!/usr/bin/env python3
"""
裁剪宽幅图片为 1:1 方形，以产品主体为中心。

用法:
  python3 crop_square.py <input> <output> [--center-x X] [--center-y Y] [--size SIZE]

参数:
  input       输入图片路径
  output      输出图片路径
  --center-x  裁剪中心 X 坐标（默认：图片宽度/2）
  --center-y  裁剪中心 Y 坐标（默认：图片高度/2）
  --size      输出尺寸（默认：800）

示例:
  # 产品在画面中心
  python3 crop_square.py lifestyle.webp lifestyle-square.webp

  # 产品在画面左下方
  python3 crop_square.py lifestyle.webp lifestyle-square.webp --center-x 900 --center-y 850
"""

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("错误：需要 Pillow 库。请运行: pip install Pillow", file=sys.stderr)
    sys.exit(1)


def crop_square(
    input_path: str,
    output_path: str,
    center_x: int | None = None,
    center_y: int | None = None,
    output_size: int = 800,
) -> None:
    img = Image.open(input_path)
    w, h = img.size

    # 确定裁剪中心
    cx = center_x if center_x is not None else w // 2
    cy = center_y if center_y is not None else h // 2

    # 取短边为裁剪边长
    crop_size = min(w, h)

    # 计算裁剪区域，确保不超出图片边界
    left = max(0, cx - crop_size // 2)
    top = max(0, cy - crop_size // 2)

    # 如果右/下超出边界，向左/上调整
    if left + crop_size > w:
        left = w - crop_size
    if top + crop_size > h:
        top = h - crop_size

    # 确保不为负
    left = max(0, left)
    top = max(0, top)

    right = left + crop_size
    bottom = top + crop_size

    cropped = img.crop((left, top, right, bottom))
    resized = cropped.resize((output_size, output_size), Image.LANCZOS)

    # 确保输出目录存在
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    # 根据扩展名保存
    ext = Path(output_path).suffix.lower()
    if ext in (".jpg", ".jpeg"):
        resized.save(output_path, "JPEG", quality=90)
    elif ext == ".webp":
        resized.save(output_path, "WEBP", quality=90)
    elif ext == ".png":
        resized.save(output_path, "PNG")
    else:
        resized.save(output_path)

    print(f"已裁剪: {input_path} ({w}x{h}) → {output_path} ({output_size}x{output_size})")
    print(f"裁剪中心: ({cx}, {cy}), 裁剪区域: ({left}, {top}) → ({right}, {bottom})")


def main():
    parser = argparse.ArgumentParser(description="裁剪宽幅图片为 1:1 方形")
    parser.add_argument("input", help="输入图片路径")
    parser.add_argument("output", help="输出图片路径")
    parser.add_argument("--center-x", type=int, default=None, help="裁剪中心 X 坐标")
    parser.add_argument("--center-y", type=int, default=None, help="裁剪中心 Y 坐标")
    parser.add_argument("--size", type=int, default=800, help="输出尺寸 (默认: 800)")

    args = parser.parse_args()
    crop_square(args.input, args.output, args.center_x, args.center_y, args.size)


if __name__ == "__main__":
    main()
