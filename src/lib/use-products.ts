"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/products";

let cachedProducts: Product[] | null = null;
let fetchPromise: Promise<Product[]> | null = null;

async function fetchProducts(): Promise<Product[]> {
  if (cachedProducts) return cachedProducts;
  if (fetchPromise) return fetchPromise;

  const promise: Promise<Product[]> = fetch("/api/products")
    .then((res) => res.json())
    .then((data: { products?: Product[] }) => {
      cachedProducts = data.products || [];
      fetchPromise = null;
      return cachedProducts;
    })
    .catch((): Product[] => {
      fetchPromise = null;
      return [];
    });

  fetchPromise = promise;
  return fetchPromise;
}

/** Hook to get all products (fetched once and cached) */
export function useProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(cachedProducts ?? []);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return products;
}

/** Get a product by slug from the cached list */
export function getClientProduct(slug: string): Product | undefined {
  return cachedProducts?.find((p) => p.slug === slug);
}

/** Force refresh the product cache */
export function refreshProducts(): Promise<Product[]> {
  cachedProducts = null;
  return fetchProducts();
}
