import { notFound } from "next/navigation";
import { journalArticles, getArticle } from "@/lib/journal";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import ArticleDetailContent from "./article-detail-content";

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

      <ArticleDetailContent
        slug={slug}
        title={article.title}
        category={article.category}
        content={article.content}
        datePublished={article.datePublished}
        dateModified={article.dateModified}
      />
    </>
  );
}
