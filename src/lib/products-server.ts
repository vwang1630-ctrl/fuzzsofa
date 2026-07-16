import fs from 'fs';
import path from 'path';
import type { Product, Region } from './products';

const DATA_PATH = path.join(process.cwd(), 'src/data/products.json');

function readProductsData(): Product[] {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

/** Get all products (reads from JSON file each time for fresh data) */
export function getProducts(): Product[] {
  return readProductsData();
}

export function getProduct(slug: string): Product | undefined {
  const data = readProductsData();
  return data.find((p) => p.slug === slug);
}

/** Get product by mobile short key */
export function getProductByShortKey(shortKey: string): Product | undefined {
  const data = readProductsData();
  return data.find((p) => p.mobileShortKey === shortKey);
}

export function getVisibleProducts(region: Region): Product[] {
  const data = readProductsData();
  return data.filter((p) => !p.hiddenInRegions?.includes(region));
}

export function getPrice(product: Product, region: Region): number {
  const mapping: Record<string, Record<Region, number>> = {
    "gorilla-sofa": { americas: 7200, europe: 7200, middle_east: 6800, se_asia: 6200 },
    "gorilla-leather": { americas: 9800, europe: 9800, middle_east: 9200, se_asia: 8500 },
    "owl-sofa": { americas: 4800, europe: 4800, middle_east: 4800, se_asia: 4800 },
    "silverback-sofa": { americas: 7800, europe: 7800, middle_east: 7400, se_asia: 6800 },
    "meteorite-ring-sofa": { americas: 3500, europe: 3500, middle_east: 3500, se_asia: 3500 },
    "muscle-gorilla-sofa": { americas: 9800, europe: 9800, middle_east: 9200, se_asia: 8500 },
  };
  const key = product.slug === "gorilla-sofa" ? "gorilla-sofa" : product.slug;
  return mapping[key]?.[region] ?? product.priceRange.americas[0];
}

export function formatPrice(price: number | undefined | null, region?: Region): string {
  const safePrice = price ?? 0;
  if (region === "europe") {
    return `€${safePrice.toLocaleString()}`;
  }
  return `$${safePrice.toLocaleString()}`;
}
