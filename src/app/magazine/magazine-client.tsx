"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { magazineArticles, userSpacePosts } from "@/lib/magazine-data";
import { Heart, Share2, ArrowRight, Upload, X, ImagePlus } from "lucide-react";

export function MagazinePageClient() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const heroArticle = magazineArticles[0];
  const editorialArticles = magazineArticles.slice(1);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <Image
          src={heroArticle.heroImage}
          alt="High-end interior space featuring Fuzz Sofa in a modern living room"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient overlay from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
          {/* Chapter number */}
          <span className="font-serif font-light text-[5rem] md:text-[6rem] lg:text-[7rem] leading-none text-[#F5F0EB]/20 absolute bottom-8 left-6 md:left-12 lg:left-16">
            {heroArticle.chapterNumber}
          </span>

          {/* Title and description */}
          <div className="max-w-xl ml-auto md:ml-0 md:pl-[30%] lg:pl-[40%] animate-fade-in">
            <h1 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl tracking-[0.05em] text-[#F5F0EB] mb-4">
              {heroArticle.title}
            </h1>
            <p className="font-sans font-light text-sm md:text-base text-[#8A8580] tracking-wide mb-8 max-w-md leading-relaxed">
              {heroArticle.subtitle}
            </p>

            {/* Read More button */}
            <Link
              href={`/magazine/${heroArticle.slug}`}
              className="inline-flex items-center gap-3 px-6 py-3 border border-[#F5F0EB]/60 text-[#F5F0EB] text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#E8B4B8] hover:border-[#E8B4B8] hover:text-[#0A0A0A]"
            >
              <span>Read More</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Picks */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 max-w-[1200px] mx-auto">
        <div className="mb-10 animate-fade-in">
          <h2 className="font-serif font-light text-2xl md:text-3xl tracking-[0.1em] text-[#F5F0EB] uppercase">
            Editorial
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature card — first editorial article spans full width */}
          <Link
            href={`/magazine/${editorialArticles[0].slug}`}
            className="group relative h-[400px] md:col-span-2 rounded overflow-hidden cursor-pointer animate-fade-in animate-fade-in-delay-1"
          >
            <Image
              src={editorialArticles[0].heroImage}
              alt="Modern living room design with warm-toned decor"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

            {/* Chapter number */}
            <span className="absolute top-6 left-6 font-serif font-light text-[4rem] leading-none text-[#F5F0EB]/20">
              {editorialArticles[0].chapterNumber}
            </span>

            {/* Social share icons (hover) */}
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              <button
                className="p-2 bg-[#111111]/80 backdrop-blur rounded hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h3 className="font-serif font-light text-2xl md:text-3xl tracking-[0.05em] text-[#F5F0EB] mb-3">
                {editorialArticles[0].title}
              </h3>
              <p className="font-sans font-light text-sm text-[#8A8580] max-w-lg leading-relaxed">
                {editorialArticles[0].subtitle}
              </p>
            </div>

            {/* Hover lift */}
            <div className="absolute inset-0 transition-transform duration-300 group-hover:-translate-y-1 pointer-events-none" />
          </Link>

          {/* Small cards */}
          {editorialArticles.slice(1).map((article) => (
            <Link
              key={article.slug}
              href={`/magazine/${article.slug}`}
              className="group relative h-[300px] rounded overflow-hidden cursor-pointer animate-fade-in animate-fade-in-delay-2"
            >
              <Image
                src={article.heroImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

              {/* Chapter number */}
              <span className="absolute top-4 left-4 font-serif font-light text-[3rem] leading-none text-[#F5F0EB]/20">
                {article.chapterNumber}
              </span>

              {/* Share icon (hover) */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <button
                  className="p-2 bg-[#111111]/80 backdrop-blur rounded hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-serif font-light text-xl md:text-2xl tracking-[0.05em] text-[#F5F0EB] mb-2">
                  {article.title}
                </h3>
                <p className="font-sans font-light text-xs text-[#8A8580] leading-relaxed">
                  {article.subtitle}
                </p>
              </div>

              {/* Hover lift */}
              <div className="absolute inset-0 transition-transform duration-300 group-hover:-translate-y-1 pointer-events-none" />
            </Link>
          ))}
        </div>
      </section>

      {/* Your Space — User Photos */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-[#0E0E0E]">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-10 animate-fade-in">
            <h2 className="font-serif font-light text-2xl md:text-3xl tracking-[0.1em] text-[#F5F0EB] uppercase mb-2">
              Your Space
            </h2>
            <p className="font-sans font-light text-sm text-[#8A8580] tracking-wide">
              Share your Fuzz Sofa moment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {userSpacePosts.map((post, i) => (
              <div
                key={post.id}
                className={`group relative aspect-[4/3] rounded overflow-hidden cursor-pointer animate-fade-in ${
                  i % 3 === 0
                    ? "animate-fade-in-delay-1"
                    : i % 3 === 1
                    ? "animate-fade-in-delay-2"
                    : "animate-fade-in-delay-3"
                }`}
              >
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Bottom overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-[#0A0A0A]/90 to-transparent">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-[#F5F0EB] tracking-wide">
                      {post.username}
                    </span>
                    <div className="flex items-center gap-1 text-[#8A8580]">
                      <Heart className="w-3.5 h-3.5" />
                      <span className="font-sans text-xs">{post.likes}</span>
                    </div>
                  </div>
                </div>
                {/* Share button (hover) */}
                <button
                  className="absolute top-3 right-3 p-2 bg-[#111111]/70 backdrop-blur rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Share"
                >
                  <Share2 className="w-4 h-4 text-[#F5F0EB]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload CTA */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-16 bg-[#111111]">
        <div className="text-center animate-fade-in">
          <p className="font-sans font-light text-base md:text-lg text-[#F5F0EB] tracking-wide mb-6">
            Have a Fuzz Sofa at home? Share your space.
          </p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#F5F0EB]/60 text-[#F5F0EB] text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#E8B4B8] hover:border-[#E8B4B8] hover:text-[#0A0A0A]"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Your Space</span>
          </button>
        </div>
      </section>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setUploadModalOpen(false);
          }}
        >
          <div className="bg-[#111111] rounded max-w-md w-full p-8 shadow-[0_25px_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif font-light text-xl tracking-[0.05em] text-[#F5F0EB]">
                Upload Your Space
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 text-[#8A8580] hover:text-[#F5F0EB] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="border-2 border-dashed border-[#1A1A1A] rounded p-8 text-center mb-6">
              <ImagePlus className="w-10 h-10 text-[#8A8580] mx-auto mb-3" />
              <p className="font-sans text-sm text-[#8A8580]">
                Drag and drop your image here, or click to browse
              </p>
              <p className="font-sans text-xs text-[#8A8580]/60 mt-2">
                Supports JPG, PNG up to 10MB
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="@your_username"
                className="w-full bg-[#1A1A1A] border-none rounded px-3 py-2 text-sm text-[#F5F0EB] placeholder:text-[#8A8580]/50 focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/30 transition-colors"
              />
              <button className="w-full bg-[#E8B4B8] text-[#0A0A0A] px-4 py-2.5 rounded text-sm font-medium tracking-wide hover:opacity-90 active:scale-[0.98] transition-all">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
