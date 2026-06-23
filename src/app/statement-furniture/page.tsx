import type { Metadata } from "next";
import { breadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/lib/products";
import { StatementFurnitureContent } from "./statement-furniture-content";

export const metadata: Metadata = {
  title: "Statement Furniture for Contemporary Homes | Fuzz Sofa",
  description:
    "One sculptural piece can transform an entire room. Fuzz Sofa's animal-inspired furniture creates conversation between architecture, light, and daily ritual. Free white-glove delivery worldwide.",
};

export default function StatementFurniturePage() {
  const statementProducts = products.filter((p) =>
    p.relatedInteriors.includes("statement-furniture")
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "https://fuzzsofa.com" },
              { name: "Statement Furniture", url: "https://fuzzsofa.com/statement-furniture" },
            ])
          ),
        }}
      />
      <StatementFurnitureContent products={statementProducts} />
    </>
  );
}
