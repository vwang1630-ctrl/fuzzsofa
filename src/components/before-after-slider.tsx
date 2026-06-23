"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getPosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return 50;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      return pct;
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      setSliderPos(getPosition(e.clientX));
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [getPosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      setSliderPos(getPosition(e.clientX));
    },
    [isDragging, getPosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSliderPos((p) => Math.max(0, p - 2));
      } else if (e.key === "ArrowRight") {
        setSliderPos((p) => Math.min(100, p + 2));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <figure className="relative w-full select-none overflow-hidden rounded-[4px]" role="img">
      <figcaption className="sr-only">
        Before and after comparison: {beforeAlt} versus {afterAlt}
      </figcaption>

      {/* Container */}
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full cursor-ew-resize touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* After image (full, underneath) */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterSrc}
            alt={afterAlt}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeSrc}
            alt={beforeAlt}
            className="h-full w-full object-cover"
            style={{
              width: `${100 / (sliderPos / 100)}%`,
              maxWidth: "none",
            }}
            draggable={false}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 z-10 w-[2px] -translate-x-1/2"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="h-full w-full bg-[#E8B4B8]" />
          {/* Handle circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-[#E8B4B8] bg-[#0A0A0A]/80 flex items-center justify-center backdrop-blur-sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-[#E8B4B8]"
            >
              <path
                d="M6 4L2 8L6 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 4L14 8L10 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-3 left-3 z-20 bg-[#0A0A0A]/70 px-3 py-1 backdrop-blur-sm">
          <span className="text-[10px] tracking-[0.1em] uppercase text-[#F5F0EB]/70">
            Before
          </span>
        </div>
        <div className="absolute bottom-3 right-3 z-20 bg-[#0A0A0A]/70 px-3 py-1 backdrop-blur-sm">
          <span className="text-[10px] tracking-[0.1em] uppercase text-[#F5F0EB]/70">
            After
          </span>
        </div>
      </div>
    </figure>
  );
}
