import type { Metadata } from "next";
import { breadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/lib/products";
import { ScenePageContent } from "@/components/scene-page-content";
import { VillaInteriorContent } from "./villa-interior-content";

export const metadata: Metadata = {
  title: "Luxury Villa Interior Design with Sculptural Furniture",
  description:
    "How sculptural animal-inspired furniture transforms luxury villa interiors. Fuzz Sofa pieces for grand living spaces, private residences, and statement rooms. Free white-glove delivery worldwide.",
};

export default function LuxuryVillaInteriorPage() {
  const villaProducts = products.filter((p) =>
    p.relatedInteriors.includes("luxury-villa-interior")
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "https://fuzzsofa.com" },
              { name: "Luxury Villa Interior", url: "https://fuzzsofa.com/luxury-villa-interior" },
            ])
          ),
        }}
      />
      <VillaInteriorContent products={villaProducts} />
    </>
  );
}
