"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { journalArticles } from "@/lib/journal";
import type { TranslationKeys } from "@/lib/i18n";

const articleI18nKeys = [
  { titleKey: "journalArticle1Title", excerptKey: "journalArticle1Excerpt", categoryKey: "journalArticle1Category" },
  { titleKey: "journalArticle2Title", excerptKey: "journalArticle2Excerpt", categoryKey: "journalArticle2Category" },
  { titleKey: "journalArticle3Title", excerptKey: "journalArticle3Excerpt", categoryKey: "journalArticle3Category" },
  { titleKey: "journalArticle4Title", excerptKey: "journalArticle4Excerpt", categoryKey: "journalArticle4Category" },
  { titleKey: "journalArticle5Title", excerptKey: "journalArticle5Excerpt", categoryKey: "journalArticle5Category" },
  { titleKey: "journalArticle6Title", excerptKey: "journalArticle6Excerpt", categoryKey: "journalArticle6Category" },
  { titleKey: "journalArticle7Title", excerptKey: "journalArticle7Excerpt", categoryKey: "journalArticle7Category" },
  { titleKey: "journalArticle8Title", excerptKey: "journalArticle8Excerpt", categoryKey: "journalArticle8Category" },
  { titleKey: "journalArticle9Title", excerptKey: "journalArticle9Excerpt", categoryKey: "journalArticle9Category" },
  { titleKey: "journalArticle10Title", excerptKey: "journalArticle10Excerpt", categoryKey: "journalArticle10Category" },
] as const;

export default function JournalContent() {
  const { t } = useLanguage();

  return (
    <section className="relative">
      <div className="py-20 md:py-32 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">{t("journalTitle")}</h1>
          <p className="mt-6 text-lg text-[#F5F0EB]/50 font-light max-w-2xl mx-auto">
            {t("journalSubtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="space-y-0">
          {journalArticles.map((article, idx) => {
            const keys = articleI18nKeys[idx];
            return (
              <Link
                key={article.slug}
                href={`/journal/${article.slug}`}
                className="group block border-t border-[#1A1A1A] py-8 first:border-t-0 hover:border-[#E8B4B8]/30 transition-colors duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                  <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase shrink-0 w-24">
                    {keys ? t(keys.categoryKey as TranslationKeys) : article.category}
                  </p>
                  <div className="flex-1">
                    <h2 className="font-serif text-xl md:text-2xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                      {keys ? t(keys.titleKey as TranslationKeys) : article.title}
                    </h2>
                    <p className="mt-2 text-sm text-[#8A8580] line-clamp-2">
                      {keys ? t(keys.excerptKey as TranslationKeys) : article.excerpt}
                    </p>
                  </div>
                  <p className="text-xs text-[#8A8580] shrink-0">{article.datePublished}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
