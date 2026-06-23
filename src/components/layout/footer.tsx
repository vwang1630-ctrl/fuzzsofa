import Link from "next/link";

const socialLinks = [
  {
    href: "https://instagram.com/fuzzsofa",
    label: "Instagram",
    icon: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z",
  },
  {
    href: "https://facebook.com/fuzzsofa",
    label: "Facebook",
    icon: "M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.93 3.78-3.93 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z",
  },
  {
    href: "https://tiktok.com/@fuzzsofa",
    label: "TikTok",
    icon: "M16.6 5.82s.51.5 0 0A4.28 4.28 0 0019.5 4.1a8.34 8.34 0 01-2.15.91 4.38 4.38 0 00-7.47 4.04A12.4 12.4 0 013.1 4.55a4.38 4.38 0 001.36 5.84 4.36 4.36 0 01-1.98-.55v.06a4.38 4.38 0 003.51 4.29 4.38 4.38 0 01-1.97.07 4.38 4.38 0 004.09 3.04A8.78 8.78 0 012 19.54a12.4 12.4 0 006.72 1.97c8.06 0 12.46-6.68 12.46-12.46 0-.19 0-.37-.01-.56A8.9 8.9 0 0022 6.17a8.7 8.7 0 01-2.55.7 4.44 4.44 0 001.95-2.46 8.8 8.8 0 01-2.8 1.07z",
  },
  {
    href: "https://pinterest.com/fuzzsofa",
    label: "Pinterest",
    icon: "M12 2C6.48 2 2 6.48 2 12c0 4.25 2.67 7.9 6.44 9.34-.09-.78-.17-1.99.04-2.85.18-.78 1.17-4.97 1.17-4.97s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.85 0 1.27.64 1.27 1.41 0 .86-.55 2.14-.83 3.33-.24.99.49 1.8 1.46 1.8 1.75 0 3.1-1.85 3.1-4.51 0-2.36-1.7-4.01-4.12-4.01-2.81 0-4.46 2.1-4.46 4.28 0 .85.33 1.76.73 2.25.08.09.09.17.07.27-.07.31-.24.99-.28 1.13-.04.18-.15.22-.34.13-1.25-.58-2.03-2.41-2.03-3.88 0-3.16 2.3-6.06 6.62-6.06 3.48 0 6.18 2.48 6.18 5.79 0 3.46-2.18 6.24-5.21 6.24-1.02 0-1.98-.53-2.3-1.15l-.63 2.39c-.23.88-.84 1.98-1.26 2.65A10 10 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z",
  },
  {
    href: "https://youtube.com/@fuzzsofa",
    label: "YouTube",
    icon: "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1A1A1A] bg-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Column 1: Brand */}
          <div>
            <Link href="/" className="font-serif text-lg tracking-[0.08em] text-[#F5F0EB]">
              FUZZ SOFA
            </Link>
            <p className="mt-3 text-sm text-[#8A8580] leading-relaxed font-light">
              Sculptural Furniture Inspired by Nature. Made to order in Shanghai, shipped worldwide.
            </p>
            <p className="mt-3 text-xs text-[#8A8580] tracking-[0.05em] uppercase">
              Free White-Glove Delivery
            </p>
            {/* Social icons */}
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Collection */}
          <div>
            <h3 className="text-[10px] font-light tracking-[0.2em] uppercase text-[#8A8580] mb-4">Collection</h3>
            <ul className="space-y-2">
              {[
                { href: "/bear-sofa", label: "Bear Sofa" },
                { href: "/lion-sofa", label: "Lion Sofa" },
                { href: "/tiger-sofa", label: "Tiger Sofa" },
                { href: "/gorilla-sofa", label: "Gorilla Sofa" },
                { href: "/owl-sofa", label: "Owl Chair" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300 font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div>
            <h3 className="text-[10px] font-light tracking-[0.2em] uppercase text-[#8A8580] mb-4">Explore</h3>
            <ul className="space-y-2">
              {[
                { href: "/luxury-villa-interior", label: "Luxury Villa Interior" },
                { href: "/boutique-hotel-lobby", label: "Boutique Hotel Lobby" },
                { href: "/statement-furniture", label: "Statement Furniture" },
                { href: "/sculptural-furniture-trend", label: "Sculptural Furniture Trend" },
                { href: "/process", label: "Our Process" },
                { href: "/materials", label: "Materials Guide" },
                { href: "/animal-sofa-collection", label: "Full Collection" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300 font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="text-[10px] font-light tracking-[0.2em] uppercase text-[#8A8580] mb-4">Support</h3>
            <ul className="space-y-2">
              {[
                { href: "/contact", label: "Contact" },
                { href: "/contact", label: "Shipping" },
                { href: "/contact", label: "Returns" },
                { href: "mailto:trade@fuzzsofa.com", label: "Trade" },
                { href: "mailto:privacy@fuzzsofa.com", label: "Privacy" },
                { href: "mailto:warranty@fuzzsofa.com", label: "Warranty" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-[#8A8580] hover:text-[#E8B4B8] transition-colors duration-300 font-light">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[#1A1A1A] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-[#8A8580] tracking-[0.1em] uppercase font-light">
            &copy; 2025 Fuzz Sofa. All rights reserved.
          </p>
          <p className="text-[10px] text-[#8A8580] tracking-[0.05em] font-light">
            14-Day Quality Guarantee &middot; Free White-Glove Delivery
          </p>
        </div>
      </div>
    </footer>
  );
}
