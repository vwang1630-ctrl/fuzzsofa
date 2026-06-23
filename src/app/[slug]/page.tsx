import { notFound } from "next/navigation";
import Link from "next/link";
import { products, getProduct, formatPrice, type Region } from "@/lib/products";
import { productJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { ProductPageClient } from "./product-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Not Found" };

  return {
    title: `${product.name} — ${product.tagline}`,
    description: product.metaDescription,
    openGraph: {
      title: `${product.name} — Fuzz Sofa`,
      description: product.metaDescription,
      url: `https://fuzzsofa.com/${product.slug}`,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return <ProductPageClient product={product} />;
}
