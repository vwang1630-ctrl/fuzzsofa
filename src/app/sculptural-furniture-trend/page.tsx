import type { Metadata } from "next";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getProducts } from "@/lib/products-server";
import { SculpturalTrendContent } from "./sculptural-trend-content";

export const metadata: Metadata = {
  title: "The Sculptural Furniture Trend | Fuzz Sofa",
  description:
    "Why the world's leading interiors are moving from minimal to sculptural. How animal-inspired furniture is defining the next wave of interior design. Free white-glove delivery worldwide.",
};

export default function SculpturalFurnitureTrendPage() {
  const trendProducts = getProducts().filter((p) =>
    p.relatedInteriors.includes("sculptural-furniture-trend")
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "https://fuzzsofa.com" },
              { name: "Sculptural Furniture Trend", url: "https://fuzzsofa.com/sculptural-furniture-trend" },
            ])
          ),
        }}
      />
      <SculpturalTrendContent products={trendProducts} />
    </>
  );
}
