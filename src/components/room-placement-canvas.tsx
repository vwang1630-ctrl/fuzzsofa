"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  loadImage,
  removeDarkBackground,
  imageToCanvas,
} from "@/lib/room-compositing";

interface RoomPlacementCanvasProps {
  /** Room image data URL */
  roomImage: string;
  /** Product image URL */
  productImageUrl: string;
  /** Called when user clicks "Done" — returns the final composited data URL */
  onComposite: (dataUrl: string) => void;
  /** Called when user wants to go back */
  onBack: () => void;
  /** Product name for display */
  productName: string;
}

export default function RoomPlacementCanvas({
  roomImage,
  productImageUrl,
  onComposite,
  onBack,
  productName,
}: RoomPlacementCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cutoutRef = useRef<HTMLCanvasElement | null>(null);
  const roomImgRef = useRef<HTMLImageElement | null>(null);

  // Product placement state
  const [position, setPosition] = useState({ x: 0.5, y: 0.6 });
  const [scale, setScale] = useState(0.45);
  const [shadowOpacity, setShadowOpacity] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Drag tracking
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // Load assets
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [roomImg, productImg] = await Promise.all([
          loadImage(roomImage),
          loadImage(productImageUrl),
        ]);
        if (cancelled) return;

        roomImgRef.current = roomImg;
        const productCanvas = imageToCanvas(productImg);
        cutoutRef.current = removeDarkBackground(productCanvas);

        // Auto-size canvas to fit container while maintaining room aspect ratio
        const container = containerRef.current;
        if (container) {
          const maxW = container.clientWidth;
          const maxH = Math.min(window.innerHeight * 0.55, 600);
          const roomAspect = roomImg.naturalWidth / roomImg.naturalHeight;
          let w = maxW;
          let h = w / roomAspect;
          if (h > maxH) {
            h = maxH;
            w = h * roomAspect;
          }
          setCanvasSize({ width: Math.round(w), height: Math.round(h) });
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load images:", err);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [roomImage, productImageUrl]);

  // Redraw canvas whenever position/scale/shadow changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const roomImg = roomImgRef.current;
    const cutout = cutoutRef.current;
    if (!canvas || !roomImg || !cutout) return;

    const ctx = canvas.getContext("2d")!;
    const cw = canvasSize.width;
    const ch = canvasSize.height;
    canvas.width = cw;
    canvas.height = ch;

    // Draw room
    ctx.drawImage(roomImg, 0, 0, cw, ch);

    // Calculate product placement
    const productH = ch * scale;
    const cutoutAspect = cutout.width / cutout.height;
    const productW = productH * cutoutAspect;
    const px = cw * position.x - productW / 2;
    const py = ch * position.y - productH / 2;

    // Draw shadow
    if (shadowOpacity > 0) {
      ctx.save();
      ctx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
      ctx.shadowBlur = 20 * (ch / 600);
      ctx.shadowOffsetX = 4 * (ch / 600);
      ctx.shadowOffsetY = 8 * (ch / 600);
      ctx.drawImage(cutout, px, py, productW, productH);
      ctx.restore();
    }

    // Draw product cutout
    ctx.drawImage(cutout, px, py, productW, productH);

    // Draw subtle placement guide (dashed border around product)
    ctx.strokeStyle = "rgba(232, 180, 184, 0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(px, py, productW, productH);
    ctx.setLineDash([]);
  }, [position, scale, shadowOpacity, canvasSize]);

  // Handle mouse/touch drag
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: position.x,
        posY: position.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [position],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      
      setPosition({
        x: dragStartRef.current.posX + dx / rect.width,
        y: dragStartRef.current.posY + dy / rect.height,
      });
    },
    [isDragging],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle scroll/pinch zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.02 : 0.02;
      setScale((prev) => Math.max(0.1, Math.min(0.9, prev + delta)));
    },
    [],
  );

  // Export final composite at full resolution
  const handleDone = useCallback(async () => {
    const roomImg = roomImgRef.current;
    const cutout = cutoutRef.current;
    if (!roomImg || !cutout) return;

    const canvas = document.createElement("canvas");
    canvas.width = roomImg.naturalWidth;
    canvas.height = roomImg.naturalHeight;
    const ctx = canvas.getContext("2d")!;

    // Draw room at full res
    ctx.drawImage(roomImg, 0, 0);

    // Calculate product at full res
    const productH = canvas.height * scale;
    const cutoutAspect = cutout.width / cutout.height;
    const productW = productH * cutoutAspect;
    const px = canvas.width * position.x - productW / 2;
    const py = canvas.height * position.y - productH / 2;

    // Shadow
    if (shadowOpacity > 0) {
      ctx.save();
      ctx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
      ctx.shadowBlur = 20 * (canvas.height / 600);
      ctx.shadowOffsetX = 4 * (canvas.height / 600);
      ctx.shadowOffsetY = 8 * (canvas.height / 600);
      ctx.drawImage(cutout, px, py, productW, productH);
      ctx.restore();
    }

    // Product
    ctx.drawImage(cutout, px, py, productW, productH);

    const dataUrl = canvas.toDataURL("image/png");
    onComposite(dataUrl);
  }, [position, scale, shadowOpacity, onComposite]);

  return (
    <div className="space-y-5">
      {/* Instructions */}
      <p className="text-xs text-[#8A8580] text-center font-light">
        Drag to position · Scroll to resize · Your exact product, pixel-perfect
      </p>

      {/* Canvas container */}
      <div ref={containerRef} className="w-full flex justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="w-6 h-6 border-2 border-[#E8B4B8]/40 border-t-[#E8B4B8] rounded-full animate-spin" />
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="rounded-[4px] cursor-grab active:cursor-grabbing max-w-full"
            style={{ width: canvasSize.width, height: canvasSize.height }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
          />
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Size slider */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#8A8580] uppercase tracking-[0.1em] w-14 shrink-0">
            Size
          </span>
          <input
            type="range"
            min={0.15}
            max={0.85}
            step={0.01}
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="flex-1 h-[1px] appearance-none bg-[#1A1A1A] accent-[#E8B4B8] 
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
              [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-[#E8B4B8] [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#E8B4B8] 
              [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
          />
          <span className="text-[10px] text-[#8A8580] w-8 text-right">
            {Math.round(scale * 100)}%
          </span>
        </div>

        {/* Shadow slider */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#8A8580] uppercase tracking-[0.1em] w-14 shrink-0">
            Shadow
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={shadowOpacity}
            onChange={(e) => setShadowOpacity(parseFloat(e.target.value))}
            className="flex-1 h-[1px] appearance-none bg-[#1A1A1A] accent-[#E8B4B8]
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
              [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full 
              [&::-webkit-slider-thumb]:bg-[#E8B4B8] [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#E8B4B8] 
              [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
          />
          <span className="text-[10px] text-[#8A8580] w-8 text-right">
            {Math.round(shadowOpacity * 100)}%
          </span>
        </div>
      </div>

      {/* Product name label */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-5 h-5 rounded-full bg-[#0A0A0A] border border-[#1A1A1A] flex items-center justify-center">
          <span className="font-serif text-[8px] text-[#E8B4B8]">
            {productName.charAt(0)}
          </span>
        </div>
        <span className="text-[11px] text-[#8A8580]">{productName}</span>
        <span className="text-[10px] text-[#E8B4B8]/50 ml-1">
          — Exact product, not AI-generated
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center pt-2">
        <button
          onClick={onBack}
          className="border border-[#1A1A1A] text-[#8A8580] px-5 py-2.5 text-[10px] 
            tracking-[0.1em] uppercase font-light hover:border-[#E8B4B8]/40 
            hover:text-[#F5F0EB]/70 transition-all duration-300 rounded-[4px]"
        >
          Back
        </button>
        <button
          onClick={handleDone}
          className="bg-[#E8B4B8] text-[#0A0A0A] px-6 py-2.5 text-[10px] 
            tracking-[0.1em] uppercase font-medium hover:bg-[#E0BEC0] 
            transition-all duration-300 rounded-[4px]"
        >
          Done — Save Image
        </button>
      </div>
    </div>
  );
}
