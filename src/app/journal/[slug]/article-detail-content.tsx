"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { journalArticles } from "@/lib/journal";

interface ArticleDetailContentProps {
  slug: string;
  title: string;
  category: string;
  content: string;
  datePublished: string;
  dateModified: string;
}

const categoryKeyMap: Record<string, string> = {
  "Concepts": "categoryConcepts",
  "Design": "categoryDesign",
  "Guides": "categoryGuides",
  "Trends": "categoryTrends",
  "Spaces": "categorySpaces",
  "Process": "categoryProcess",
  "Collection": "categoryCollection",
};

const slugToArticleIdx: Record<string, number> = {};
journalArticles.forEach((a, i) => {
  slugToArticleIdx[a.slug] = i + 1;
});

export default function ArticleDetailContent({
  slug,
  title: _title,
  category: _category,
  content,
  datePublished,
  dateModified,
}: ArticleDetailContentProps) {
  const { t } = useLanguage();

  const articleIdx = slugToArticleIdx[slug];
  const translatedTitle = articleIdx ? t(`journalArticle${articleIdx}Title` as Parameters<typeof t>[0]) : _title;
  const translatedCategory = categoryKeyMap[_category]
    ? t(categoryKeyMap[_category] as Parameters<typeof t>[0])
    : _category;

  const paragraphs = content.split("\n\n");

  return (
    <article className="max-w-3xl mx-auto px-6 py-20 md:py-32">
      <header className="mb-12">
        <Link
          href="/journal"
          className="text-xs text-[#8A8580] hover:text-[#E8B4B8] transition-colors tracking-[0.1em] uppercase"
        >
          &larr; {t("journalBack")}
        </Link>
        <p className="mt-6 text-xs text-[#E8B4B8]/50 tracking-[0.1em] uppercase">
          {translatedCategory}
        </p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl font-light text-[#F5F0EB] leading-[1.1]">
          {translatedTitle}
        </h1>
        <div className="mt-6 flex items-center gap-4 text-xs text-[#8A8580]">
          <time dateTime={datePublished}>
            {new Date(datePublished).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {dateModified !== datePublished && (
            <span>
              {t("updatedLabel")}{" "}
              {new Date(dateModified).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </header>

      <div className="space-y-6">
        {paragraphs.map((paragraph, i) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;

          if (trimmed.length < 80 && !trimmed.endsWith(".") && i > 0) {
            return (
              <h2 key={i} className="font-serif text-2xl font-light text-[#F5F0EB] mt-10">
                {trimmed}
              </h2>
            );
          }

          return (
            <p key={i} className="text-[#F5F0EB]/70 leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>

      <footer className="mt-16 pt-8 border-t border-[#1A1A1A]">
        <div className="flex items-center justify-between">
          <Link
            href="/journal"
            className="text-sm text-[#8A8580] hover:text-[#E8B4B8] transition-colors"
          >
            &larr; {t("journalAllArticles")}
          </Link>
          <Link
            href="/animal-sofa-collection"
            className="text-sm text-[#E8B4B8] hover:text-[#D4A0A4] transition-colors"
          >
            {t("exploreCollectionLink")} &rarr;
          </Link>
        </div>
      </footer>
    </article>
  );
}
