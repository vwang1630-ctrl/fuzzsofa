"use client";

import { ScenePageContent } from "@/components/scene-page-content";
import type { Product } from "@/lib/products";
import { useLanguage } from "@/lib/language-context";

export function BoutiqueHotelContent({ products }: { products: Product[] }) {
  const { t } = useLanguage();

  return (
    <ScenePageContent
      heroLabel={t("hotelHeroLabel")}
      heroTitle={t("hotelHeroTitle")}
      heroSubtitle={t("hotelHeroSubtitle")}
      accent="from-[#151015] to-[#0A0A0A]"
      whyThisSpaceContent={
        <div className="space-y-5">
          <p className="text-base text-[#F5F0EB]/70 leading-[1.8]">
            {t("hotelWhyContent")}
          </p>
        </div>
      }
      recommendedProducts={products}
      designPrinciplesContent={
        <div className="max-w-2xl space-y-6">
          <p className="text-base text-[#F5F0EB]/70 leading-[1.8]">
            {t("hotelDesignPrinciples")}
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
