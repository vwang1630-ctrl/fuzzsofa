import type { Metadata } from "next";
import Link from "next/link";
import { journalArticles } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal — Fuzz Sofa Design and Furniture Insights",
  description:
    "Design insights, furniture guides, and trend analysis from Fuzz Sofa. Explore articles on statement furniture, sculptural design, and animal-inspired interiors.",
};

export default function JournalPage() {
  return (
    <section className="relative">
      <div className="py-20 md:py-32 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">Journal</h1>
          <p className="mt-6 text-lg text-[#F5F0EB]/50 font-light max-w-2xl mx-auto">
            Design insights, furniture guides, and trend analysis.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="space-y-0">
          {journalArticles.map((article, i) => (
            <Link
              key={article.slug}
              href={`/journal/${article.slug}`}
              className="group block border-t border-[#1A1A1A] py-8 first:border-t-0 hover:border-[#E8B4B8]/30 transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8">
                <p className="text-xs text-[#8A8580] tracking-[0.1em] uppercase shrink-0 w-24">
                  {article.category}
                </p>
                <div className="flex-1">
                  <h2 className="font-serif text-xl md:text-2xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors duration-300">
                    {article.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#8A8580] line-clamp-2">{article.excerpt}</p>
                </div>
                <p className="text-xs text-[#8A8580] shrink-0">{article.datePublished}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
