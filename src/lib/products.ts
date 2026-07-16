export type Region = "americas" | "europe" | "middle_east" | "se_asia";

export interface MobileFeature {
  num: string;
  label: string;
  desc: string;
}

export interface MobileStory {
  title: string;
  text: string[];
}

export interface MobileCraft {
  name: string;
  detail: string;
}

export interface MobileScene {
  image: string;
  label: string;
  sub: string;
}

export interface Product {
  slug: string;
  name: string;
  animal: string;
  tagline: string;
  description: string;
  concept: string;
  interiorContext: string;
  priceRange: {
    americas: [number, number];
    europe: [number, number];
    middle_east: [number, number];
    se_asia: [number, number];
  };
  specifications: {
    width: string;
    height: string;
    depth: string;
    seatHeight: string;
    weight: string;
    capacity: string;
  };
  materials: string[];
  materialOptions?: {
    type: string;
    options: string[];
    colors: string[];
  }[];
  images?: string[];
  faq: { question: string; answer: string }[];
  relatedProducts: string[];
  relatedInteriors: string[];
  metaDescription: string;
  /** Hide this product in specific regions */
  hiddenInRegions?: Region[];
  /** Regions where this product is trending/popular for SEO boost */
  trendingGeo?: string[];
  /** Short key used in mobile URL paths (e.g. "gorilla" for /m/product/gorilla) */
  mobileShortKey?: string;
  /** Mobile-specific feature highlights */
  mobileFeatures?: MobileFeature[];
  /** Mobile-specific design story */
  mobileStory?: MobileStory;
  /** Mobile-specific craftsmanship details */
  mobileCrafts?: MobileCraft[];
  /** Mobile-specific scene images */
  mobileScenes?: MobileScene[];
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
