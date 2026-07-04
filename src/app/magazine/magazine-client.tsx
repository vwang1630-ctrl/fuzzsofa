"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import {
  magazineArticles,
  userSpacePosts,
} from "@/lib/magazine-data";
import {
  Heart,
  Share2,
  ArrowRight,
  X,
  Sparkles,
  Download,
  Loader2,
  Camera,
} from "lucide-react";

export function MagazinePageClient() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [roomPhoto, setRoomPhoto] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const heroArticle = magazineArticles[0];
  const editorialArticles = magazineArticles.slice(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setRoomPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const res = await fetch("/api/magazine/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          imageUrl: roomPhoto || undefined,
        }),
      });

      const data = await res.json();

      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else {
        setError(data.error || "Generation failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedImage) return;
    setSaving(true);
    try {
      // Download via fetch+blob for cross-origin
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `fuzz-sofa-space-${Date.now()}.png`;
      link.click();
      window.URL.revokeObjectURL(blobUrl);

      // Also save to cloud storage
      await fetch("/api/magazine/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: generatedImage }),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Fallback: just download locally
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `fuzz-sofa-space-${Date.now()}.png`;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = (platform: string) => {
    const shareUrl = window.location.href;
    const shareText = "Check out my AI-generated Fuzz Sofa space!";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "copy": {
        navigator.clipboard.writeText(shareUrl).then(() => {
          setShareMenuOpen(false);
          alert("Link copied to clipboard!");
        });
        break;
      }
    }
    setShareMenuOpen(false);
  };

  const resetModal = () => {
    setPrompt("");
    setRoomPhoto(null);
    setGeneratedImage(null);
    setError(null);
    setShareMenuOpen(false);
    setSaved(false);
    setAiModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] min-h-[480px] sm:min-h-[600px] overflow-hidden">
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
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 md:p-12 lg:p-16">
          {/* Chapter number */}
          <span className="font-serif font-light text-[3.5rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem] leading-none text-[#F5F0EB]/20 absolute bottom-5 sm:bottom-8 left-5 sm:left-6 md:left-12 lg:left-16">
            {heroArticle.chapterNumber}
          </span>

          {/* Title and description */}
          <div className="max-w-xl md:ml-0 md:pl-[30%] lg:pl-[40%] animate-fade-in">
            <h1 className="font-serif font-light text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.05em] text-[#F5F0EB] mb-3 sm:mb-4">
              {heroArticle.title}
            </h1>
            <p className="font-sans font-light text-xs sm:text-sm md:text-base text-[#8A8580] tracking-wide mb-6 sm:mb-8 max-w-md leading-relaxed">
              {heroArticle.subtitle}
            </p>

            {/* Read More button */}
            <Link
              href={`/magazine/${heroArticle.slug}`}
              className="inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 border border-[#F5F0EB]/60 text-[#F5F0EB] text-xs sm:text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#E8B4B8] hover:border-[#E8B4B8] hover:text-[#0A0A0A]"
            >
              <span>Read More</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Picks */}
      <section className="py-12 sm:py-16 md:py-24 px-5 sm:px-6 md:px-12 lg:px-16 max-w-[1200px] mx-auto">
        <div className="mb-6 sm:mb-10 animate-fade-in">
          <h2 className="font-serif font-light text-xl sm:text-2xl md:text-3xl tracking-[0.1em] text-[#F5F0EB] uppercase">
            Editorial
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Feature card */}
          <Link
            href={`/magazine/${editorialArticles[0].slug}`}
            className="group relative h-[280px] sm:h-[350px] md:h-[400px] md:col-span-2 rounded overflow-hidden cursor-pointer animate-fade-in animate-fade-in-delay-1"
          >
            <Image
              src={editorialArticles[0].heroImage}
              alt="Modern living room design with warm-toned decor"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

            <span className="absolute top-4 left-4 sm:top-6 sm:left-6 font-serif font-light text-[3rem] sm:text-[4rem] leading-none text-[#F5F0EB]/20">
              {editorialArticles[0].chapterNumber}
            </span>

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-2 opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              <button
                className="p-2 bg-[#111111]/80 backdrop-blur rounded hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <h3 className="font-serif font-light text-2xl md:text-3xl tracking-[0.05em] text-[#F5F0EB] mb-3">
                {editorialArticles[0].title}
              </h3>
              <p className="font-sans font-light text-sm text-[#8A8580] max-w-lg leading-relaxed">
                {editorialArticles[0].subtitle}
              </p>
            </div>

            <div className="absolute inset-0 transition-transform duration-300 group-hover:-translate-y-1 pointer-events-none" />
          </Link>

          {/* Small cards */}
          {editorialArticles.slice(1).map((article) => (
            <Link
              key={article.slug}
              href={`/magazine/${article.slug}`}
              className="group relative h-[250px] sm:h-[300px] rounded overflow-hidden cursor-pointer animate-fade-in animate-fade-in-delay-2"
            >
              <Image
                src={article.heroImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

              <span className="absolute top-4 left-4 font-serif font-light text-[3rem] leading-none text-[#F5F0EB]/20">
                {article.chapterNumber}
              </span>

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <button
                  className="p-2 bg-[#111111]/80 backdrop-blur rounded hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-serif font-light text-xl md:text-2xl tracking-[0.05em] text-[#F5F0EB] mb-2">
                  {article.title}
                </h3>
                <p className="font-sans font-light text-xs text-[#8A8580] leading-relaxed">
                  {article.subtitle}
                </p>
              </div>

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

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-t from-[#0A0A0A]/90 to-transparent">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[10px] sm:text-xs text-[#F5F0EB] tracking-wide">
                      {post.username}
                    </span>
                    <div className="flex items-center gap-1 text-[#8A8580]">
                      <Heart className="w-3.5 h-3.5" />
                      <span className="font-sans text-xs">{post.likes}</span>
                    </div>
                  </div>
                </div>
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

      {/* AI Synthesis CTA */}
      <section className="py-12 sm:py-16 md:py-20 px-5 sm:px-6 md:px-12 lg:px-16 bg-[#111111]">
        <div className="text-center animate-fade-in max-w-2xl mx-auto">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#E8B4B8] mx-auto mb-3 sm:mb-4" />
          <p className="font-sans font-light text-sm sm:text-base md:text-lg text-[#F5F0EB] tracking-wide mb-2">
            Imagine Fuzz Sofa in your space.
          </p>
          <p className="font-sans font-light text-xs sm:text-sm text-[#8A8580] tracking-wide mb-6 sm:mb-8">
            Describe your room, upload a photo, and let AI create the vision.
          </p>
          <button
            onClick={() => setAiModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border border-[#F5F0EB]/60 text-[#F5F0EB] text-xs sm:text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#E8B4B8] hover:border-[#E8B4B8] hover:text-[#0A0A0A]"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>AI Space Visualizer</span>
          </button>
        </div>
      </section>

      {/* AI Generation Modal */}
      {aiModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) resetModal();
          }}
        >
          <div className="bg-[#111111] rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-[0_25px_50px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A]">
              <h3 className="font-serif font-light text-xl tracking-[0.05em] text-[#F5F0EB]">
                AI Space Visualizer
              </h3>
              <button
                onClick={resetModal}
                className="p-1 text-[#8A8580] hover:text-[#F5F0EB] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Prompt input */}
              <div>
                <label className="block font-sans text-xs tracking-[0.15em] uppercase text-[#8A8580] mb-2">
                  Describe your space
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A cozy living room with large windows, hardwood floors, and warm afternoon light. Add a Fuzz Sofa owl sofa in snowy white bouclé."
                  className="w-full bg-[#1A1A1A] border-none rounded-lg px-4 py-3 text-sm text-[#F5F0EB] placeholder:text-[#8A8580]/40 focus:outline-none focus:ring-2 focus:ring-[#E8B4B8]/30 transition-colors resize-none h-28 leading-relaxed"
                />
              </div>

              {/* Room photo upload (optional) */}
              <div>
                <label className="block font-sans text-xs tracking-[0.15em] uppercase text-[#8A8580] mb-2">
                  Your room photo
                  <span className="normal-case tracking-normal text-[#8A8580]/60 ml-1">
                    (optional)
                  </span>
                </label>
                {roomPhoto ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#1A1A1A]">
                    <Image
                      src={roomPhoto}
                      alt="Your room"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => setRoomPhoto(null)}
                      className="absolute top-2 right-2 p-1.5 bg-[#0A0A0A]/80 rounded-full hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-[#1A1A1A] rounded-lg p-6 text-center hover:border-[#333] transition-colors cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-[#8A8580] mx-auto mb-2" />
                    <p className="font-sans text-sm text-[#8A8580]">
                      Upload a photo of your room
                    </p>
                    <p className="font-sans text-xs text-[#8A8580]/50 mt-1">
                      JPG, PNG up to 10MB
                    </p>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={generating || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#E8B4B8] text-[#0A0A0A] rounded-lg text-sm font-medium tracking-wide hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate</span>
                  </>
                )}
              </button>

              {/* Error */}
              {error && (
                <p className="font-sans text-sm text-red-400 text-center">
                  {error}
                </p>
              )}

              {/* Generated image result */}
              {generatedImage && (
                <div className="space-y-4">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[#1A1A1A]">
                    <Image
                      src={generatedImage}
                      alt="AI-generated Fuzz Sofa space"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3">
                    {/* Save */}
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A1A1A] text-[#F5F0EB] rounded-lg text-sm tracking-wide hover:bg-[#222] transition-colors disabled:opacity-40"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : saved ? (
                        <span>Saved!</span>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Save</span>
                        </>
                      )}
                    </button>

                    {/* Share */}
                    <div className="relative flex-1">
                      <button
                        onClick={() => setShareMenuOpen(!shareMenuOpen)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#F5F0EB]/40 text-[#F5F0EB] rounded-lg text-sm tracking-wide hover:border-[#E8B4B8] hover:text-[#E8B4B8] transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>

                      {/* Share dropdown */}
                      {shareMenuOpen && (
                        <div className="absolute bottom-full mb-2 left-0 right-0 bg-[#1A1A1A] rounded-lg border border-[#333] overflow-hidden shadow-lg z-10">
                          <button
                            onClick={() => handleShare("twitter")}
                            className="w-full px-4 py-2.5 text-left font-sans text-sm text-[#F5F0EB] hover:bg-[#222] transition-colors"
                          >
                            Twitter / X
                          </button>
                          <button
                            onClick={() => handleShare("facebook")}
                            className="w-full px-4 py-2.5 text-left font-sans text-sm text-[#F5F0EB] hover:bg-[#222] transition-colors"
                          >
                            Facebook
                          </button>
                          <button
                            onClick={() => handleShare("copy")}
                            className="w-full px-4 py-2.5 text-left font-sans text-sm text-[#F5F0EB] hover:bg-[#222] transition-colors"
                          >
                            Copy Link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
