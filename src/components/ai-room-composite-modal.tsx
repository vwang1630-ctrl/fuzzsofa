"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";

interface AiRoomCompositeModalProps {
  isOpen: boolean;
  onClose: () => void;
  productSlug: string;
}

export function AiRoomCompositeModal({
  isOpen,
  onClose,
  productSlug,
}: AiRoomCompositeModalProps) {
  const { t } = useLanguage();
  const [roomImage, setRoomImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    setRoomImage(file);
    setError(null);
    setResultUrl(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setRoomImage(null);
      setPreviewUrl(null);
      setResultUrl(null);
      setError(null);
      setIsGenerating(false);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleGenerate = async () => {
    if (!roomImage) return;
    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("roomImage", roomImage);
      formData.append("productSlug", productSlug);

      const response = await fetch("/api/ai-room-composite", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.imageUrl) {
        setResultUrl(data.imageUrl);
      } else {
        setError(data.error || data.details || "Generation failed");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to generate image"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!resultUrl) return;
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `fuzzsofa-${productSlug}-in-my-room.png`;
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab
      window.open(resultUrl, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0A0A0A]/85 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg mx-4 bg-[#111111] border border-[#1A1A1A] rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
          <h3
            className="text-base font-light tracking-[0.15em] uppercase text-[#F5F0EB]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {t("aiRoomTitle" as TranslationKeys)}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#8A8580] hover:text-[#F5F0EB] transition-colors"
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Upload area */}
          {!resultUrl && (
            <>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
                  dragOver
                    ? "border-[#FF69B4]/60 bg-[#FF69B4]/05"
                    : previewUrl
                      ? "border-[#1A1A1A] bg-[#0A0A0A]"
                      : "border-[#1A1A1A] hover:border-[#FF69B4]/40"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />

                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Room preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-[#0A0A0A]/30 rounded-md flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-[#F5F0EB] text-xs tracking-[0.15em] uppercase">
                        Change Photo
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8A8580"
                      strokeWidth="1"
                      className="mx-auto mb-3"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <p className="text-sm text-[#8A8580] mb-1">
                      {t("aiRoomDropHint" as TranslationKeys)}
                    </p>
                    <p className="text-xs text-[#8A8580]/60">
                      JPG, PNG up to 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-xs text-[#8A8580]/80 leading-relaxed">
                {t("aiRoomDescription" as TranslationKeys)}
              </p>

              {/* Error */}
              {error && (
                <p className="mt-3 text-xs text-red-400/90">{error}</p>
              )}

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={!roomImage || isGenerating}
                className={`mt-5 w-full py-3 text-[12px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                  roomImage && !isGenerating
                    ? "border-[#FF69B4]/60 text-[#FF69B4] hover:bg-[#FF69B4] hover:text-[#0A0A0A] hover:border-[#FF69B4]"
                    : "border-[#1A1A1A] text-[#8A8580] cursor-not-allowed"
                }`}
              >
                {isGenerating ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="animate-spin h-3.5 w-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    {t("aiRoomGenerating" as TranslationKeys)}
                  </span>
                ) : (
                  t("aiRoomGenerate" as TranslationKeys)
                )}
              </button>
            </>
          )}

          {/* Result */}
          {resultUrl && (
            <div>
              <div className="relative rounded-lg overflow-hidden border border-[#1A1A1A]">
                <img
                  src={resultUrl}
                  alt="AI composite result"
                  className="w-full h-auto"
                />
              </div>

              <p className="mt-4 text-xs text-[#8A8580]/80 leading-relaxed text-center">
                {t("aiRoomResultHint" as TranslationKeys)}
              </p>

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2.5 text-[12px] tracking-[0.2em] uppercase border border-[#FF69B4]/60 text-[#FF69B4] hover:bg-[#FF69B4] hover:text-[#0A0A0A] hover:border-[#FF69B4] transition-all duration-300"
                >
                  {t("aiRoomDownload" as TranslationKeys)}
                </button>
                <button
                  onClick={() => {
                    setResultUrl(null);
                    setPreviewUrl(null);
                    setRoomImage(null);
                  }}
                  className="flex-1 py-2.5 text-[12px] tracking-[0.2em] uppercase border border-[#1A1A1A] text-[#8A8580] hover:border-[#F5F0EB]/40 hover:text-[#F5F0EB] transition-all duration-300"
                >
                  {t("aiRoomRetry" as TranslationKeys)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
