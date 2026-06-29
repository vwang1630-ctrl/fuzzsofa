#!/usr/bin/env python3
"""
验证产品数据完整性。

检查项:
1. products.ts 中新产品数据是否包含所有必需字段
2. 图片文件是否存在于 public/ 目录
3. cutout-images.ts 映射是否完整

用法:
  python3 validate_product.py --slug <slug>

示例:
  python3 validate_product.py --slug owl-sofa
"""

import argparse
import json
import re
import sys
from pathlib import Path

# 项目根目录
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# 必需的产品数据字段
REQUIRED_FIELDS = [
    "id", "name", "slug", "tagline", "description", "story",
    "price", "originalPrice", "category",
    "images", "specifications", "materials", "features",
    "materialOptions", "careInstructions",
]

# 必需的规格字段
REQUIRED_SPEC_FIELDS = ["width", "depth", "height", "seatHeight", "weight", "capacity"]

# 必需的图片类型
REQUIRED_IMAGE_PATTERNS = {
    "主图 (gallery)": "/products/{slug}/",
    "Story 产品图": "/products/{slug}/story-sketch.webp",
    "Materials 背景图": "/products/{slug}/materials-bg.webp",
    "空间展示图1": "/products/spaces/{slug}-space-1.jpg",
    "空间展示图2": "/products/spaces/{slug}-space-2.jpg",
    "空间展示图3": "/products/spaces/{slug}-space-3.jpg",
}


def check_product_data(slug: str) -> list[str]:
    """检查 products.ts 中产品数据是否完整"""
    errors = []
    products_file = PROJECT_ROOT / "src" / "lib" / "products.ts"

    if not products_file.exists():
        errors.append(f"products.ts 不存在: {products_file}")
        return errors

    content = products_file.read_text()

    # 检查 slug 是否存在
    if f'slug: "{slug}"' not in content and f"slug: '{slug}'" not in content:
        errors.append(f"products.ts 中未找到 slug: {slug}")
        return errors

    # 检查必需字段（通过简单文本搜索）
    # 提取该产品的代码块（简化版）
    slug_pos = content.find(f'"{slug}"')
    if slug_pos == -1:
        slug_pos = content.find(f"'{slug}'")

    if slug_pos > 0:
        # 向前找最近的 { 开始位置
        block_start = content.rfind("{", 0, slug_pos)
        # 向后找匹配的 } 结束位置
        depth = 1
        block_end = block_start + 1
        while depth > 0 and block_end < len(content):
            if content[block_end] == "{":
                depth += 1
            elif content[block_end] == "}":
                depth -= 1
            block_end += 1

        block = content[block_start:block_end]

        for field in REQUIRED_FIELDS:
            if field not in block:
                errors.append(f"产品 {slug} 缺少字段: {field}")

        for spec_field in REQUIRED_SPEC_FIELDS:
            if spec_field not in block:
                errors.append(f"产品 {slug} specifications 缺少字段: {spec_field}")

    return errors


def check_images(slug: str) -> list[str]:
    """检查图片文件是否存在"""
    errors = []
    public_dir = PROJECT_ROOT / "public"

    # 检查产品目录
    product_dir = public_dir / "products" / slug
    if not product_dir.exists():
        errors.append(f"产品图片目录不存在: public/products/{slug}/")
    else:
        # 检查必需图片
        for label, pattern in REQUIRED_IMAGE_PATTERNS.items():
            img_path = public_dir / pattern.format(slug=slug).lstrip("/")
            if not img_path.exists():
                errors.append(f"缺少{label}: {pattern.format(slug=slug)}")

        # 检查 cutout 目录
        cutout_dir = product_dir / "cutout"
        if cutout_dir.exists():
            cutout_files = list(cutout_dir.glob("*.png"))
            if not cutout_files:
                errors.append(f"cutout 目录为空: public/products/{slug}/cutout/")
        else:
            errors.append(f"cutout 目录不存在: public/products/{slug}/cutout/")

    # 检查空间展示图
    spaces_dir = public_dir / "products" / "spaces"
    for i in range(1, 4):
        space_file = spaces_dir / f"{slug}-space-{i}.jpg"
        if not space_file.exists():
            errors.append(f"缺少空间展示图{i}: public/products/spaces/{slug}-space-{i}.jpg")

    return errors


def check_cutout_mapping(slug: str) -> list[str]:
    """检查 cutout-images.ts 映射"""
    errors = []
    cutout_file = PROJECT_ROOT / "src" / "lib" / "cutout-images.ts"

    if not cutout_file.exists():
        errors.append(f"cutout-images.ts 不存在: {cutout_file}")
        return errors

    content = cutout_file.read_text()
    if f"'{slug}'" not in content and f'"{slug}"' not in content:
        errors.append(f"cutout-images.ts 中未找到 {slug} 的映射")
    else:
        # 检查映射中是否有条目
        slug_pos = content.find(f"'{slug}'")
        if slug_pos == -1:
            slug_pos = content.find(f'"{slug}"')

        # 向后找花括号块
        block_start = content.find("{", slug_pos)
        block_end = content.find("}", block_start)
        block = content[block_start:block_end]

        if not block.strip() or block.strip() == "{}":
            errors.append(f"cutout-images.ts 中 {slug} 的映射为空")

    return errors


def main():
    parser = argparse.ArgumentParser(description="验证产品数据完整性")
    parser.add_argument("--slug", required=True, help="产品 slug")
    args = parser.parse_args()

    slug = args.slug
    all_errors = []

    print(f"🔍 验证产品: {slug}")
    print("=" * 50)

    # 1. 检查产品数据
    print("\n📋 检查产品数据 (products.ts)...")
    data_errors = check_product_data(slug)
    all_errors.extend(data_errors)
    if data_errors:
        for e in data_errors:
            print(f"  ❌ {e}")
    else:
        print("  ✅ 产品数据完整")

    # 2. 检查图片文件
    print("\n🖼️  检查图片文件...")
    image_errors = check_images(slug)
    all_errors.extend(image_errors)
    if image_errors:
        for e in image_errors:
            print(f"  ❌ {e}")
    else:
        print("  ✅ 所有图片文件就位")

    # 3. 检查 cutout 映射
    print("\n✂️  检查去背图映射 (cutout-images.ts)...")
    cutout_errors = check_cutout_mapping(slug)
    all_errors.extend(cutout_errors)
    if cutout_errors:
        for e in cutout_errors:
            print(f"  ❌ {e}")
    else:
        print("  ✅ 去背图映射完整")

    # 汇总
    print("\n" + "=" * 50)
    if all_errors:
        print(f"⚠️  发现 {len(all_errors)} 个问题，请修复后重新验证")
        sys.exit(1)
    else:
        print(f"✅ 产品 {slug} 验证通过！")
        sys.exit(0)


if __name__ == "__main__":
    main()
