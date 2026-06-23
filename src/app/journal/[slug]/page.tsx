import { notFound } from "next/navigation";
import Link from "next/link";
import { journalArticles, getArticle } from "@/lib/journal";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return journalArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Not Found" };

  return {
    title: article.title,
    description: article.metaDescription,
    openGraph: {
      title: `${article.title} | Fuzz Sofa`,
      description: article.metaDescription,
      url: `https://fuzzsofa.com/journal/${article.slug}`,
      type: "article",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
    },
  };
}

export default async function JournalArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const paragraphs = article.content.split("\n\n");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "https://fuzzsofa.com" },
              { name: "Journal", url: "https://fuzzsofa.com/journal" },
              { name: article.title, url: `https://fuzzsofa.com/journal/${article.slug}` },
            ])
          ),
        }}
      />

      <article className="max-w-3xl mx-auto px-6 py-20 md:py-32">
        <header className="mb-12">
          <Link href="/journal" className="text-xs text-[#6B6B6B] hover:text-[#E8B4B8] transition-colors tracking-[0.1em] uppercase">
            &larr; Journal
          </Link>
          <p className="mt-6 text-xs text-[#E8B4B8]/50 tracking-[0.1em] uppercase">{article.category}</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl font-light text-[#F5F0EB] leading-[1.1]">
            {article.title}
          </h1>
          <div className="mt-6 flex items-center gap-4 text-xs text-[#6B6B6B]">
            <time dateTime={article.datePublished}>
              {new Date(article.datePublished).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {article.dateModified !== article.datePublished && (
              <span>Updated {new Date(article.dateModified).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
            )}
          </div>
        </header>

        <div className="space-y-6">
          {paragraphs.map((paragraph, i) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            // Check if it's a heading-like line (short, no period at end)
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

        <footer className="mt-16 pt-8 border-t border-[#222]">
          <div className="flex items-center justify-between">
            <Link
              href="/journal"
              className="text-sm text-[#6B6B6B] hover:text-[#E8B4B8] transition-colors"
            >
              &larr; All Articles
            </Link>
            <Link
              href="/animal-sofa-collection"
              className="text-sm text-[#E8B4B8] hover:text-[#D4A0A4] transition-colors"
            >
              Explore Collection &rarr;
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
}
