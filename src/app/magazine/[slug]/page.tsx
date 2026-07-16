import type { Metadata } from "next";
import { magazineArticles, getArticleBySlug } from "@/lib/magazine-data";
import { ArticleDetailClient } from "./article-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return magazineArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} — The Gallery`,
    description: article.subtitle,
    openGraph: {
      title: `${article.title} — The Gallery`,
      description: article.subtitle,
      images: [{ url: article.heroImage, width: 1200, height: 630 }],
    },
  };
}

export default async function MagazineArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return <div className="pt-20 text-center text-[#8A8580]">Article not found</div>;

  return <ArticleDetailClient article={article} />;
}
