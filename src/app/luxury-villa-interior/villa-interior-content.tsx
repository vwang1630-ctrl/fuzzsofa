"use client";

import { ScenePageContent } from "@/components/scene-page-content";
import type { Product } from "@/lib/products";
import { useLanguage } from "@/lib/language-context";

export function VillaInteriorContent({ products }: { products: Product[] }) {
  const { t } = useLanguage();

  return (
    <ScenePageContent
      heroLabel={t("villaHeroLabel")}
      heroTitle={t("villaHeroTitle")}
      heroSubtitle={t("villaHeroSubtitle")}
      accent="from-[#181510] to-[#0A0A0A]"
      whyThisSpaceContent={
        <p className="text-lg text-[#F5F0EB]/70 leading-relaxed">
          {t("villaWhyContent")}
        </p>
      }
      recommendedProducts={products}
      designPrinciplesContent={
        <div className="max-w-3xl">
          <p className="text-[#F5F0EB]/70 leading-relaxed">
            {t("villaDesignPrinciples")}
          </p>
        </div>
      }
      relatedScenes={[
        { href: "/boutique-hotel-lobby", label: t("boutiqueHotels") },
        { href: "/statement-furniture", label: t("contemporaryHomes") },
      ]}
    />
  );
}
