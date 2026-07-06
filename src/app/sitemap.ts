import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products-server";
import { journalArticles } from "@/lib/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fuzzsofa.com";

  const productUrls = getProducts().map((product) => ({
    url: `${baseUrl}/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const interiorUrls = [
    "/luxury-villa-interior",
    "/boutique-hotel-lobby",
    "/statement-furniture",
    "/sculptural-furniture-trend",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const collectionUrls = [
    "/animal-sofa-collection",
    "/process",
    "/materials",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const infoUrls = [
    "/about",
    "/contact",
    "/journal",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const journalUrls = journalArticles.map((article) => ({
    url: `${baseUrl}/journal/${article.slug}`,
    lastModified: new Date(article.dateModified),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...productUrls,
    ...interiorUrls,
    ...collectionUrls,
    ...infoUrls,
    ...journalUrls,
  ];
}
