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

  // Resolve cutout image URL if available, fallback to original product image
  const resolvedProductImageUrl = useMemo(() => {
    const cutoutUrl = productSlug ? getCutoutImage(productSlug, selectedColorName ?? "") : null;
    return cutoutUrl || productImageUrl;
  }, [productSlug, selectedColorName, productImageUrl]);

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

  const handleDownload = useCallback(() => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = `fuzzsofa-${productName.toLowerCase().replace(/\s+/g, "-")}-in-room.png`;
    link.click();
  }, [resultImage, productName]);

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
            <p className="text-[10px] text-[#8A8580] mt-1 tracking-[0.08em] uppercase">
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
                <p className="text-[10px] text-[#8A8580]">
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
              <p className="text-[10px] text-[#8A8580]/60 text-center leading-relaxed">
                Your room photo is processed entirely in your browser.
                Nothing is uploaded to any server.
              </p>

              {/* Product preview */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="text-[10px] text-[#8A8580]">Placing:</div>
                <div className="text-[11px] text-[#F5F0EB]/80 font-light">
                  {productName}
                </div>
                <div className="text-[10px] text-[#E8B4B8]/50">
                  — Your exact product
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Position */}
          {step === "position" && roomImage && (
            <RoomPlacementCanvas
              roomImage={roomImage}
              productImageUrl={resolvedProductImageUrl}
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
                <span className="text-[10px] text-[#E8B4B8]/60">
                  Pixel-perfect product placement — no AI generation
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={handleBack}
                  className="border border-[#1A1A1A] text-[#8A8580] px-5 py-2.5 
                    text-[10px] tracking-[0.1em] uppercase font-light 
                    hover:border-[#E8B4B8]/40 hover:text-[#F5F0EB]/70 
                    transition-all duration-300 rounded-[4px]"
                >
                  Reposition
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-[#E8B4B8] text-[#0A0A0A] px-6 py-2.5 text-[10px] 
                    tracking-[0.1em] uppercase font-medium hover:bg-[#E0BEC0] 
                    transition-all duration-300 rounded-[4px]"
                >
                  Download Image
                </button>
              </div>

              <button
                onClick={handleReset}
                className="block mx-auto text-[10px] text-[#8A8580]/50 
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
