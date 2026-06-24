"use client";

import { useState, useCallback, useRef } from "react";
import type { Product } from "@/lib/products";
import { generateRoomVisualization, createPlaceholderResult } from "@/lib/room-visualization";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { useLanguage } from "@/lib/language-context";

interface RoomVisualizationModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onBuyThisPiece: () => void;
}

type ModalStep = "upload" | "processing" | "result";

export function RoomVisualizationModal({
  product,
  isOpen,
  onClose,
  onBuyThisPiece,
}: RoomVisualizationModalProps) {
  const { t } = useLanguage();
  const slugToPrefix: Record<string, string> = {
    "bear-sofa": "bearSofa",
    "lion-sofa": "lionSofa",
    "tiger-sofa": "tigerSofa",
    "gorilla-sofa": "gorillaSofa",
    "owl-sofa": "owlChair",
  };
  const prefix = slugToPrefix[product.slug];
  const productName = prefix ? t(`${prefix}Name` as Parameters<typeof t>[0]) : product.name;

  const [step, setStep] = useState<ModalStep>("upload");
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setRoomImage(dataUrl);
        handleProcess(dataUrl);
      };
      reader.readAsDataURL(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleProcess = useCallback(async (imageDataUrl: string) => {
    setStep("processing");
    setProcessingProgress(0);

    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 400);

    try {
      const result = await generateRoomVisualization(imageDataUrl, product);
      const placeholder = await createPlaceholderResult(result.resultImage);

      clearInterval(progressInterval);
      setProcessingProgress(100);

      await new Promise((r) => setTimeout(r, 300));

      setResultImage(placeholder);
      setStep("result");
    } catch {
      clearInterval(progressInterval);
      setStep("upload");
    }
  }, [product]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleReset = useCallback(() => {
    setStep("upload");
    setRoomImage(null);
    setResultImage(null);
    setProcessingProgress(0);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!resultImage) return;
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `fuzzsofa-${product.slug}-room-preview.jpg`;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(resultImage, "_blank");
    }
  }, [resultImage, product.slug]);

  const handleShareXiaohongshu = useCallback(() => {
    // Xiaohongshu sharing - opens the app/web with pre-filled content
    // On mobile, this will attempt to open the Xiaohongshu app
    const shareText = encodeURIComponent(
      `$productName — Sculptural Furniture Inspired by Nature | Fuzz Sofa`
    );
    const shareUrl = encodeURIComponent(`https://fuzzsofa.com/${product.slug}`);
    window.open(
      `https://www.xiaohongshu.com/discovery/item?title=${shareText}&url=${shareUrl}`,
      "_blank"
    );
  }, [product]);

  // Share feature is deferred — will be implemented when all content is ready
  // const handleShare = useCallback(async () => { ... }, [product]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(10,10,10,0.95)]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center text-[#F5F0EB]/50 hover:text-[#E8B4B8] transition-colors duration-300"
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 4L16 16M16 4L4 16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Modal content */}
      <div className="relative z-10 w-full max-w-[800px] mx-4 max-h-[90vh] overflow-y-auto bg-[#111111] border border-[#1A1A1A] rounded-[4px]">
        {/* Product thumbnail badge */}
        <div className="sticky top-0 z-20 bg-[#111111] border-b border-[#1A1A1A] px-6 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center">
            <span className="font-serif text-sm text-[#E8B4B8]">
              {product.animal.charAt(0)}
            </span>
          </div>
          <span className="text-xs tracking-[0.08em] text-[#8A8580] uppercase">
            Placing: <span className="text-[#E8B4B8] normal-case">productName</span>
          </span>
        </div>

        <div className="p-6 md:p-10">
          {/* STEP 1: Upload */}
          {step === "upload" && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl md:text-3xl font-light text-[#F5F0EB] tracking-[0.05em]">
                Try in Your Room
              </h2>
              <p className="text-sm text-[#8A8580] leading-relaxed max-w-md font-light">
                Upload a photo of your room and see how the productName{" "}
                transforms your space. Our AI will place it with realistic
                lighting and perspective.
              </p>

              {/* Upload area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative cursor-pointer border-2 border-dashed rounded-[4px] p-8 md:p-12
                  flex flex-col items-center justify-center gap-4 min-h-[280px]
                  transition-all duration-300
                  ${
                    isDragOver
                      ? "border-[#E8B4B8] bg-[#E8B4B8]/[0.03]"
                      : "border-[#E8B4B8]/40 hover:border-[#E8B4B8] hover:bg-[#E8B4B8]/[0.02]"
                  }
                `}
              >
                {/* Camera icon */}
                <div className="w-16 h-16 rounded-full border border-[#1A1A1A] flex items-center justify-center">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    className="text-[#E8B4B8]/60"
                  >
                    <path
                      d="M3 10C3 8.89543 3.89543 8 5 8H7.586C7.85122 8 8.10557 7.89464 8.29289 7.70711L9.70711 6.29289C9.89443 6.10536 10.1488 6 10.414 6H17.586C17.8512 6 18.1056 6.10536 18.2929 6.29289L19.7071 7.70711C19.8944 7.89464 20.1488 8 20.414 8H23C24.1046 8 25 8.89543 25 10V20C25 21.1046 24.1046 22 23 22H5C3.89543 22 3 21.1046 3 20V10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="14"
                      cy="14.5"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-sm text-[#F5F0EB]/70 font-light">
                    Drop your room photo here
                  </p>
                  <p className="text-xs text-[#8A8580]">or tap to upload</p>
                </div>

                <p className="text-[10px] text-[#8A8580]/60">
                  JPG, PNG up to 10MB
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleInputChange}
                  className="hidden"
                  aria-label="Upload room photo"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Processing */}
          {step === "processing" && roomImage && (
            <div className="space-y-8 flex flex-col items-center text-center">
              <h2 className="font-serif text-2xl md:text-3xl font-light text-[#F5F0EB] tracking-[0.05em]">
                Placing productName in your room...
              </h2>

              {/* Room preview with shimmer overlay */}
              <div className="relative w-full max-w-md mx-auto">
                <div className="aspect-[4/3] overflow-hidden rounded-[4px] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={roomImage}
                    alt="Your room"
                    className="w-full h-full object-cover"
                  />
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 bg-[#0A0A0A]/30">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 40%, rgba(232, 180, 184, 0.08) 45%, rgba(232, 180, 184, 0.15) 50%, rgba(232, 180, 184, 0.08) 55%, transparent 60%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 2s infinite",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="w-full max-w-xs space-y-3">
                <div className="h-[1px] bg-[#1A1A1A] w-full overflow-hidden">
                  <div
                    className="h-full bg-[#E8B4B8] transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(processingProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-[#8A8580] font-light">
                  {processingProgress < 30
                    ? "Analyzing room layout..."
                    : processingProgress < 60
                    ? "Matching lighting and perspective..."
                    : processingProgress < 90
                    ? "Placing your piece..."
                    : "Almost ready..."}
                </p>
              </div>

              {/* Product thumbnail */}
              <div className="flex items-center gap-2 pt-2">
                <div className="w-6 h-6 rounded-full bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center">
                  <span className="font-serif text-[10px] text-[#E8B4B8]">
                    {product.animal.charAt(0)}
                  </span>
                </div>
                <span className="text-xs text-[#8A8580]">
                  productName
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Result */}
          {step === "result" && roomImage && resultImage && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl md:text-3xl font-light text-[#F5F0EB] tracking-[0.05em] text-center">
                productName in Your Room
              </h2>

              {/* Before / After Slider */}
              <BeforeAfterSlider
                beforeSrc={roomImage}
                afterSrc={resultImage}
                beforeAlt={`Your room without $productName`}
                afterAlt={`Your room with $productName placed by AI`}
              />

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  className="btn-outline flex-1 max-w-[200px] mx-auto sm:mx-0 py-3 text-xs tracking-[0.1em] uppercase font-light flex items-center justify-center gap-2"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M7 1V9M7 9L4 6M7 9L10 6"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M1 11V12C1 12.5523 1.44772 13 2 13H12C12.5523 13 13 12.5523 13 12V11"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Download Image
                </button>

                <button
                  onClick={handleShareXiaohongshu}
                  className="btn-outline flex-1 max-w-[200px] mx-auto sm:mx-0 py-3 text-xs tracking-[0.1em] uppercase font-light flex items-center justify-center gap-2"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="currentColor"
                    className="text-[#E8B4B8]"
                  >
                    <path d="M7 0C3.13 0 0 3.13 0 7c0 2.84 1.69 5.29 4.13 6.43-.06-.53-.11-1.35.02-1.93.12-.53.81-3.43.81-3.43s-.21-.41-.21-1.02c0-.96.56-1.67 1.25-1.67.59 0 .87.44.87.92 0 .56-.36 1.4-.54 2.17-.15.65.33 1.18.97 1.18 1.16 0 2.05-1.22 2.05-2.99 0-1.56-1.12-2.66-2.73-2.66-1.86 0-2.95 1.39-2.95 2.83 0 .56.22 1.16.49 1.49.05.06.06.12.04.18l-.18.74c-.03.12-.1.15-.22.09-.84-.39-1.36-1.61-1.36-2.59 0-2.11 1.53-4.05 4.42-4.05 2.32 0 4.12 1.65 4.12 3.86 0 2.3-1.45 4.15-3.47 4.15-.68 0-1.31-.35-1.53-.77l-.42 1.58c-.15.58-.56 1.31-.83 1.75C5.57 13.89 6.27 14 7 14c3.87 0 7-3.13 7-7s-3.13-7-7-7z" />
                  </svg>
                  Xiaohongshu
                </button>

                {/* Share button — deferred, will be implemented when all content is ready */}
                <button
                  disabled
                  className="border border-[#1A1A1A] text-[#8A8580]/40 px-4 py-2.5 text-xs tracking-[0.05em] uppercase font-light cursor-not-allowed"
                  title="Coming soon"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline mr-1.5 -mt-0.5">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Share
                </button>
              </div>

              {/* Secondary actions */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="btn-text text-xs"
                >
                  Try Another Room
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onBuyThisPiece();
                  }}
                  className="btn-accent py-3 px-8 text-xs tracking-[0.1em] uppercase font-light rounded-[4px]"
                >
                  Buy This Piece
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
