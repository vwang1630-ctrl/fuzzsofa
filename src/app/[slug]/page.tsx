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
    title: `${product.name} — Custom Sculptural Sofa | Fuzz Sofa Studio`,
    description: product.metaDescription,
    openGraph: {
      title: `${product.name} — Custom Sculptural Sofa for Modern Interiors`,
      description: product.metaDescription,
      url: `https://fuzzsofa.com/${product.slug}`,
      type: "website",
      siteName: "Fuzz Sofa Studio",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Custom Sculptural Sofa | Fuzz Sofa Studio`,
      description: product.metaDescription,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return <ProductPageClient product={product} />;
}
