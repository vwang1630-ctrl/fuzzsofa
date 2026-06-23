"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

export function Header() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-[#222]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-[0.08em] text-[#F5F0EB]">
          FUZZ SOFA
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-light tracking-wide">
          <Link href="/animal-sofa-collection" className="text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors duration-300">
            Collection
          </Link>
          <Link href="/process" className="text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors duration-300">
            Process
          </Link>
          <Link href="/materials" className="text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors duration-300">
            Materials
          </Link>
          <Link href="/journal" className="text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors duration-300">
            Journal
          </Link>
          <Link href="/about" className="text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors duration-300">
            About
          </Link>
          <Link href="/contact" className="text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors duration-300">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#E8B4B8] text-[#0A0A0A] text-xs rounded-full flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-[#0A0A0A] border-t border-[#222] px-6 py-4 flex flex-col gap-4 text-sm font-light tracking-wide">
          <Link href="/animal-sofa-collection" onClick={() => setMobileOpen(false)} className="text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors">Collection</Link>
          <Link href="/process" onClick={() => setMobileOpen(false)} className="text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors">Process</Link>
          <Link href="/materials" onClick={() => setMobileOpen(false)} className="text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors">Materials</Link>
          <Link href="/journal" onClick={() => setMobileOpen(false)} className="text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors">Journal</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors">About</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-[#F5F0EB]/70 hover:text-[#E8B4B8] transition-colors">Contact</Link>
        </nav>
      )}
    </header>
  );
}
