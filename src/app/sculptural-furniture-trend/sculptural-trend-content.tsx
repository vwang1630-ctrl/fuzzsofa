"use client";

import { ScenePageContent } from "@/components/scene-page-content";
import type { Product } from "@/lib/products";
import { useLanguage } from "@/lib/language-context";

export function SculpturalTrendContent({ products }: { products: Product[] }) {
  const { t } = useLanguage();

  return (
    <ScenePageContent
      heroLabel={t("trendHeroLabel")}
      heroTitle={t("trendHeroTitle")}
      heroSubtitle={t("trendHeroSubtitle")}
      accent="from-[#151210] to-[#0A0A0A]"
      whyThisSpaceContent={
        <p className="text-lg text-[#F5F0EB]/70 leading-relaxed">
          {t("trendWhyContent")}
        </p>
      }
      recommendedProducts={products}
      designPrinciplesContent={
        <div className="max-w-3xl">
          <p className="text-[#F5F0EB]/70 leading-relaxed">
            {t("trendDesignPrinciples")}
          </p>
        </div>
      }
      relatedScenes={[
        { href: "/statement-furniture", label: t("contemporaryHomes") },
        { href: "/boutique-hotel-lobby", label: t("boutiqueHotels") },
      ]}
    />
  );
}
