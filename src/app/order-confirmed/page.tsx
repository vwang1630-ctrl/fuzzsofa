"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export default function OrderConfirmedPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const orderNumber = searchParams.get("order") || "—";

  if (!mounted) return null;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
      {/* Checkmark Animation */}
      <div
        className={`w-20 h-20 rounded-full border-2 border-[#E8B4B8] flex items-center justify-center mb-8 transition-all duration-700 ${
          mounted ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#E8B4B8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={mounted ? "animate-draw-check" : ""}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="font-serif text-3xl font-light text-[#F5F0EB] mb-3 tracking-wide text-center">
        {t("orderConfirmedTitle")}
      </h1>

      <p className="text-[#8A8580] text-sm mb-2 text-center">
        {t("orderConfirmedPaymentSuccess")}
      </p>

      <div className="bg-[#111111] border border-[#1A1A1A] px-6 py-3 mt-4 mb-8">
        <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase block">
          {t("accountOrderNumber")}
        </span>
        <span className="text-[#F5F0EB] font-mono text-lg tracking-wider">{orderNumber}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-[#8A8580] mb-10">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>{t("orderConfirmedEstimatedDelivery")}: 7-15 business days</span>
      </div>

      <div className="flex gap-4">
        <Link
          href="/account"
          className="px-8 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
        >
          {t("orderViewOrder")}
        </Link>
        <Link
          href="/animal-sofa-collection"
          className="px-8 py-3 border border-[#333] text-[#8A8580] text-sm tracking-[0.1em] uppercase hover:border-[#E8B4B8] hover:text-[#E8B4B8] transition-all duration-300"
        >
          {t("cartContinueShopping")}
        </Link>
      </div>

      <style jsx>{`
        @keyframes draw-check {
          from {
            stroke-dashoffset: 30;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-draw-check {
          stroke-dasharray: 30;
          stroke-dashoffset: 0;
          animation: draw-check 0.5s ease-out 0.3s both;
        }
      `}</style>
    </div>
  );
}
