"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { MagazineArticle } from "@/lib/magazine-data";
import { getRelatedArticles } from "@/lib/magazine-data";
import {
  ArrowLeft,
  Heart,
  Share2,
  Bookmark,
  Twitter,
  Instagram,
  LinkIcon,
} from "lucide-react";

interface Props {
  article: MagazineArticle;
}

export function ArticleDetailClient({ article }: Props) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const relatedArticles = getRelatedArticles(article.relatedSlugs);

  function handleLike() {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setShareOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Back link */}
      <div className="max-w-3xl mx-auto pt-[76px] px-6 animate-fade-in">
        <Link
          href="/magazine"
          className="inline-flex items-center gap-2 text-sm tracking-[0.1em] text-[#8A8580] hover:text-[#E8B4B8] transition-colors uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Interior World</span>
        </Link>
      </div>

      {/* Hero */}
      <section className="relative h-[60vh] mt-4 overflow-hidden animate-fade-in animate-fade-in-delay-1">
        <Image
          src={article.heroImage}
          alt={article.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-3xl mx-auto">
            <span className="font-serif text-[5rem] md:text-[6rem] font-light tracking-[0.05em] text-[#F5F0EB]/20 leading-none">
              {article.chapterNumber}
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-light tracking-[0.05em] text-[#F5F0EB] -mt-6 md:-mt-8 relative z-10">
              {article.title}
            </h1>
            <p className="font-sans text-sm md:text-base font-light tracking-[0.1em] text-[#8A8580] mt-4 uppercase">
              {article.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        {article.body.map((block, idx) => {
          if (block.type === "paragraph") {
            return (
              <p
                key={idx}
                className={`font-sans font-light leading-relaxed text-[#F5F0EB]/80 text-base md:text-lg mb-8 animate-fade-in ${
                  idx === 0 ? "drop-cap" : ""
                }`}
                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
              >
                {block.content}
              </p>
            );
          }

          if (block.type === "image") {
            return (
              <figure
                key={idx}
                className="relative mb-12 animate-fade-in"
                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
              >
                <div className="relative w-full aspect-[16/10] rounded overflow-hidden">
                  <Image
                    src={block.imageSrc!}
                    alt={block.imageAlt || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />

                  {/* Product tags */}
                  {article.productTags?.map((tag) => (
                    <div
                      key={tag.id}
                      className="absolute group cursor-pointer"
                      style={{ top: `${tag.topPercent}%`, left: `${tag.leftPercent}%` }}
                    >
                      <div className="w-3 h-3 bg-[#E8B4B8] rounded-full animate-pulse" />
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <Link
                          href={`/${tag.productSlug}`}
                          className="bg-[#1F1F1F] px-3 py-1.5 rounded whitespace-nowrap text-sm font-light tracking-[0.1em] text-[#F5F0EB] hover:text-[#E8B4B8] transition-colors"
                        >
                          {tag.productName} · {tag.colorName}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                {block.caption && (
                  <figcaption className="mt-3 text-xs tracking-[0.1em] text-[#8A8580] uppercase">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (block.type === "quote") {
            return (
              <blockquote
                key={idx}
                className="border-l-2 border-[#E8B4B8] pl-6 my-12 animate-fade-in"
                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
              >
                <p className="font-serif text-xl md:text-2xl font-light tracking-[0.05em] text-[#F5F0EB] italic">
                  {block.content}
                </p>
              </blockquote>
            );
          }

          return null;
        })}
      </article>

      {/* Interaction bar */}
      <aside className="max-w-3xl mx-auto px-6 pb-16 animate-fade-in animate-fade-in-delay-3">
        <div className="flex items-center gap-6 py-4 border-t border-b border-[#1A1A1A]/30">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors group ${
              isLiked ? "text-[#E8B4B8]" : "text-[#8A8580] hover:text-[#E8B4B8]"
            }`}
          >
            <Heart
              className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                isLiked ? "fill-[#E8B4B8]" : ""
              }`}
            />
            <span className="text-sm font-light tracking-[0.1em]">
              {likeCount}
            </span>
          </button>

          {/* Share */}
          <div className="relative">
            <button
              onClick={() => setShareOpen(!shareOpen)}
              className="flex items-center gap-2 text-[#8A8580] hover:text-[#E8B4B8] transition-colors group"
            >
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-light tracking-[0.1em]">Share</span>
            </button>
            {shareOpen && (
              <div className="absolute bottom-full left-0 mb-2 bg-[#1F1F1F] rounded shadow-[0_10px_25px_rgba(0,0,0,0.4)] min-w-[140px] z-10">
                <button
                  onClick={() => setShareOpen(false)}
                  className="w-full px-4 py-2.5 text-left text-sm font-light tracking-[0.1em] text-[#F5F0EB] hover:bg-[#252525] transition-colors flex items-center gap-2"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </button>
                <button
                  onClick={() => setShareOpen(false)}
                  className="w-full px-4 py-2.5 text-left text-sm font-light tracking-[0.1em] text-[#F5F0EB] hover:bg-[#252525] transition-colors flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full px-4 py-2.5 text-left text-sm font-light tracking-[0.1em] text-[#F5F0EB] hover:bg-[#252525] transition-colors flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            )}
          </div>

          {/* Bookmark */}
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex items-center gap-2 transition-colors group ${
              isBookmarked ? "text-[#E8B4B8]" : "text-[#8A8580] hover:text-[#E8B4B8]"
            }`}
          >
            <Bookmark
              className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                isBookmarked ? "fill-[#E8B4B8]" : ""
              }`}
            />
            <span className="text-sm font-light tracking-[0.1em]">Save</span>
          </button>
        </div>
      </aside>

      {/* Related Stories */}
      {relatedArticles.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-20 animate-fade-in animate-fade-in-delay-3">
          <h2 className="font-serif text-xl md:text-2xl font-light tracking-[0.05em] text-[#F5F0EB] mb-8">
            Related Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <Link
                key={related.slug}
                href={`/magazine/${related.slug}`}
                className="group block"
              >
                <div className="aspect-[4/3] overflow-hidden rounded mb-4">
                  <Image
                    src={related.heroImage}
                    alt={related.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:-translate-y-1 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-serif text-base font-light tracking-[0.05em] text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors">
                  {related.title}
                </h3>
                <p className="text-xs tracking-[0.1em] text-[#8A8580] uppercase mt-2">
                  {related.date}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
