import { notFound } from "next/navigation";
import Link from "next/link";
import { getProducts, getProduct, formatPrice } from "@/lib/products-server";
import type { Region } from "@/lib/products";
import { productJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { ProductPageClient } from "./product-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not Found" };

  // Custom title for Owl Chair
  const title = slug === "owl-sofa"
    ? "Owl Chair — Magical Reading Chair | Fuzz Sofa Studio"
    : `${product.name} | Sculptural Circular Sofa | Fuzz Sofa`;

  return {
    title,
    description: product.metaDescription,
    openGraph: {
      title,
      description: product.metaDescription,
      url: `https://fuzzsofa.com/${product.slug}`,
      type: "website",
      siteName: "Fuzz Sofa Studio",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.metaDescription,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  // Get related products
  const allProducts = getProducts();
  const relatedProducts = allProducts.filter((p) =>
    product!.relatedProducts.includes(p.slug)
  );

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}
