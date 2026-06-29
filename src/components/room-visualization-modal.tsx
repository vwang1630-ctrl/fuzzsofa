"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import RoomPlacementCanvas from "./room-placement-canvas";
import { getCutoutImage } from "@/lib/cutout-images";

interface RoomVisualizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productImageUrl: string;
  productName: string;
  productSlug?: string;
  selectedColorName?: string;
}

type Step = "upload" | "position" | "result";

export default function RoomVisualizationModal({
  isOpen,
  onClose,
  productImageUrl,
  productName,
  productSlug,
  selectedColorName,
}: RoomVisualizationModalProps) {
  const [step, setStep] = useState<Step>("upload");
  const [roomImage, setRoomImage] = useState<string>("");
  const [resultImage, setResultImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resolve cutout image URL (transparent background) — separate from the product image
  const cutoutImageUrl = useMemo(() => {
    return productSlug ? getCutoutImage(productSlug, selectedColorName ?? "") : null;
  }, [productSlug, selectedColorName]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setRoomImage(dataUrl);
        setStep("position");
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const handleComposite = useCallback((dataUrl: string) => {
    setResultImage(dataUrl);
    setStep("result");
  }, []);

  const handleBack = useCallback(() => {
    if (step === "position") {
      setStep("upload");
      setRoomImage("");
    } else if (step === "result") {
      setStep("position");
    }
  }, [step]);

  const handleReset = useCallback(() => {
    setStep("upload");
    setRoomImage("");
    setResultImage("");
  }, []);

  const [shareStatus, setShareStatus] = useState<string>("");

  const handleDownload = useCallback(() => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `fuzzsofa-${productName.toLowerCase().replace(/\s+/g, "-")}-in-room.png`;
    link.click();
  }, [resultImage, productName]);

  const handleSocialShare = useCallback(async (platform: "pinterest" | "instagram" | "facebook" | "youtube") => {
    const pageUrl = encodeURIComponent(window.location.href);
    const productNameEnc = encodeURIComponent(productName);
    const description = encodeURIComponent(`See how the ${productName} looks in my room — Fuzz Sofa Studio`);
    const mediaUrl = encodeURIComponent(window.location.href); // fallback: product page as media

    switch (platform) {
      case "pinterest": {
        // Pinterest Pin Creator: opens with image + description + link
        const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${pageUrl}&media=${mediaUrl}&description=${description}`;
        window.open(pinterestUrl, "_blank", "width=800,height=600");
        break;
      }
      case "facebook": {
        // Facebook Share dialog
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        window.open(fbUrl, "_blank", "width=800,height=600");
        break;
      }
      case "instagram": {
        // Instagram doesn't support direct web sharing — download image + copy caption
        try {
          const response = await fetch(resultImage);
          const blob = await response.blob();
          const file = new File([blob], `fuzzsofa-in-room.png`, { type: "image/png" });
          
          // Try Web Share API with file (works on mobile to share to Instagram app)
          if (navigator.share && navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              title: `${productName} — Fuzz Sofa Studio`,
              text: `See how the ${productName} looks in my room!`,
              files: [file],
            });
            return;
          }
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") return;
        }
        // Fallback: download image + copy caption
        handleDownload();
        try {
          await navigator.clipboard.writeText(
            `See how the ${productName} looks in my room! ${window.location.href}`
          );
          setShareStatus("Image saved, caption copied!");
          setTimeout(() => setShareStatus(""), 3000);
        } catch {
          setShareStatus("Image saved — paste in Instagram");
          setTimeout(() => setShareStatus(""), 3000);
        }
        break;
      }
      case "youtube": {
        // YouTube doesn't support direct image sharing — download + copy link
        handleDownload();
        try {
          await navigator.clipboard.writeText(
            `See how the ${productName} looks in my room! ${window.location.href}`
          );
          setShareStatus("Image saved, link copied!");
          setTimeout(() => setShareStatus(""), 3000);
        } catch {
          setShareStatus("Image saved — share on YouTube");
          setTimeout(() => setShareStatus(""), 3000);
        }
        break;
      }
    }
  }, [resultImage, productName, handleDownload]);

  const handleClose = useCallback(() => {
    handleReset();
    onClose();
  }, [handleReset, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative bg-[#0A0A0A] border border-[#1A1A1A] w-full sm:max-w-2xl 
          max-h-[90vh] overflow-y-auto rounded-t-[8px] sm:rounded-[8px] 
          shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1A1A1A]">
          <div>
            <h3 className="text-[#F5F0EB] font-serif text-lg font-light tracking-wide">
              Preview In Your Space
            </h3>
            <p className="text-[12px] text-[#8A8580] mt-1 tracking-[0.08em] uppercase">
              {step === "upload" && "Upload a photo of your room"}
              {step === "position" && "Position your sculpture in the room"}
              {step === "result" && "Your sculpture in the room"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-[#8A8580] 
              hover:text-[#F5F0EB] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1L13 13M1 13L13 1"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="space-y-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-[#1A1A1A] rounded-[4px] 
                  p-10 flex flex-col items-center justify-center cursor-pointer
                  hover:border-[#E8B4B8]/30 hover:bg-[#E8B4B8]/5 
                  transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full border border-[#1A1A1A] 
                  flex items-center justify-center mb-4 
                  group-hover:border-[#E8B4B8]/30 transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-[#8A8580] group-hover:text-[#E8B4B8] transition-colors"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="text-[#F5F0EB]/70 text-sm font-light mb-1">
                  Upload a photo of your room
                </p>
                <p className="text-[12px] text-[#8A8580]">
                  JPG or PNG · Your photo stays on your device
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Privacy note */}
              <p className="text-[12px] text-[#8A8580]/60 text-center leading-relaxed">
                Your room photo is processed entirely in your browser.
                Nothing is uploaded to any server.
              </p>

              {/* Product preview */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="text-[12px] text-[#8A8580]">Placing:</div>
                <div className="text-[12px] text-[#F5F0EB]/80 font-light">
                  {productName}
                </div>
                <div className="text-[12px] text-[#E8B4B8]/50">
                  — Your exact product
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Position */}
          {step === "position" && roomImage && (
            <RoomPlacementCanvas
              roomImage={roomImage}
              productImageUrl={productImageUrl}
              cutoutImageUrl={cutoutImageUrl}
              productName={productName}
              onComposite={handleComposite}
              onBack={handleBack}
            />
          )}

          {/* Step 3: Result */}
          {step === "result" && resultImage && (
            <div className="space-y-5">
              <div className="flex justify-center">
                <img
                  src={resultImage}
                  alt={`${productName} in your room`}
                  className="max-w-full max-h-[50vh] rounded-[4px] object-contain"
                />
              </div>

              {/* Tag */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-[12px] text-[#E8B4B8]/60">
                  Pixel-perfect product placement — no AI generation
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-2">
                {/* Social Share Icons */}
                <div className="flex items-center justify-center gap-4">
                  <p className="text-[12px] text-[#8A8580] tracking-[0.08em] uppercase mr-1">
                    Share to
                  </p>
                  {/* Pinterest */}
                  <button
                    onClick={() => handleSocialShare("pinterest")}
                    title="Share to Pinterest"
                    className="w-9 h-9 rounded-full border border-[#1A1A1A] flex items-center justify-center
                      text-[#8A8580] hover:border-[#E8B4B8]/40 hover:text-[#E8B4B8]
                      transition-all duration-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.15 9.43 7.6 11.21-.1-.94-.2-2.38.04-3.41.22-.93 1.4-5.93 1.4-5.93s-.36-.72-.36-1.78c0-1.67.97-2.91 2.17-2.91 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-.99 3.99-.28 1.18.59 2.14 1.76 2.14 2.11 0 3.73-2.23 3.73-5.44 0-2.85-2.05-4.84-4.97-4.84-3.39 0-5.38 2.54-5.38 5.17 0 1.02.39 2.12.89 2.72.1.12.11.22.08.34-.09.37-.29 1.18-.33 1.35-.05.22-.18.27-.41.16-1.53-.71-2.49-2.95-2.49-4.75 0-3.87 2.81-7.42 8.11-7.42 4.26 0 7.57 3.03 7.57 7.09 0 4.23-2.67 7.63-6.37 7.63-1.24 0-2.41-.65-2.81-1.41l-.76 2.92c-.28 1.06-1.03 2.39-1.53 3.2C9.58 23.81 10.77 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
                    </svg>
                  </button>
                  {/* Instagram */}
                  <button
                    onClick={() => handleSocialShare("instagram")}
                    title="Share to Instagram"
                    className="w-9 h-9 rounded-full border border-[#1A1A1A] flex items-center justify-center
                      text-[#8A8580] hover:border-[#E8B4B8]/40 hover:text-[#E8B4B8]
                      transition-all duration-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="5.5" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </button>
                  {/* Facebook */}
                  <button
                    onClick={() => handleSocialShare("facebook")}
                    title="Share to Facebook"
                    className="w-9 h-9 rounded-full border border-[#1A1A1A] flex items-center justify-center
                      text-[#8A8580] hover:border-[#E8B4B8]/40 hover:text-[#E8B4B8]
                      transition-all duration-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/>
                    </svg>
                  </button>
                  {/* YouTube */}
                  <button
                    onClick={() => handleSocialShare("youtube")}
                    title="Share to YouTube"
                    className="w-9 h-9 rounded-full border border-[#1A1A1A] flex items-center justify-center
                      text-[#8A8580] hover:border-[#E8B4B8]/40 hover:text-[#E8B4B8]
                      transition-all duration-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.75 15.27V8.73L15.82 12l-6.07 3.27z"/>
                    </svg>
                  </button>
                </div>
                {/* Primary Actions */}
                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={handleBack}
                    className="border border-[#1A1A1A] text-[#8A8580] px-5 py-2.5 
                      text-[12px] tracking-[0.1em] uppercase font-light 
                      hover:border-[#E8B4B8]/40 hover:text-[#F5F0EB]/70 
                      transition-all duration-300 rounded-[4px]"
                  >
                    Reposition
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-[#E8B4B8] text-[#0A0A0A] px-6 py-2.5 text-[12px] 
                      tracking-[0.1em] uppercase font-medium hover:bg-[#E0BEC0] 
                      transition-all duration-300 rounded-[4px]"
                  >
                    Download Image
                  </button>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="block mx-auto text-[12px] text-[#8A8580]/50 
                  hover:text-[#8A8580] transition-colors pt-1"
              >
                Try another room
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
