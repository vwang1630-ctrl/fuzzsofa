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
      heroImage="/scenes/luxury-villa-hero.png"
      accent="from-[#181510] to-[#0A0A0A]"
      whyThisSpaceContent={
        <div className="space-y-5">
          <p className="text-base text-[#F5F0EB]/70 leading-[1.8]">
            {t("villaWhyContent")}
          </p>
        </div>
      }
      recommendedProducts={products}
      designPrinciplesContent={
        <div className="max-w-2xl space-y-6">
          <p className="text-base text-[#F5F0EB]/70 leading-[1.8]">
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
