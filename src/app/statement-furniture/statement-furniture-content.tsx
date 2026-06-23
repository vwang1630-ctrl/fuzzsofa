"use client";

import { ScenePageContent } from "@/components/scene-page-content";
import type { Product } from "@/lib/products";
import { useLanguage } from "@/lib/language-context";

export function StatementFurnitureContent({ products }: { products: Product[] }) {
  const { t } = useLanguage();

  return (
    <ScenePageContent
      heroLabel={t("statementHeroLabel")}
      heroTitle={t("statementHeroTitle")}
      heroSubtitle={t("statementHeroSubtitle")}
      accent="from-[#101518] to-[#0A0A0A]"
      whyThisSpaceContent={
        <p className="text-lg text-[#F5F0EB]/70 leading-relaxed">
          {t("statementWhyContent")}
        </p>
      }
      recommendedProducts={products}
      designPrinciplesContent={
        <div className="max-w-3xl">
          <p className="text-[#F5F0EB]/70 leading-relaxed">
            {t("statementDesignPrinciples")}
          </p>
        </div>
      }
      relatedScenes={[
        { href: "/luxury-villa-interior", label: t("luxuryVillas") },
        { href: "/sculptural-furniture-trend", label: t("sculpturalTrend") },
      ]}
    />
  );
}
