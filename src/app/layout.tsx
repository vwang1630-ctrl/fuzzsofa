import type { Metadata } from "next";
import "./globals.css";
import { LayoutShell } from "@/components/layout/layout-shell";
import { CartProvider } from "@/lib/cart-context";
import { LanguageProvider } from "@/lib/language-context";
import { FontPreload } from "@/components/font-preload";
import { SupabaseConfigProvider } from "@/lib/supabase-config-inject";

export const metadata: Metadata = {
  title: {
    default: "Fuzz Sofa Studio | Sculptural Furniture & Owl Chair | Made-to-Order",
    template: "%s | Fuzz Sofa Studio",
  },
  description:
    "Fuzz Sofa Studio is a design-led furniture studio specializing in sculptural sofas and the signature Owl Chair. Each piece is handcrafted through a made-to-order system in our Shanghai atelier. No inventory. No mass production.",
  keywords: [
    "sculptural furniture",
    "made-to-order sofa",
    "custom furniture studio",
    "sculptural sofa",
    "studio furniture design",
    "contemporary furniture",
    "design-led furniture",
    "fuzz sofa studio",
    "custom sofa",
    "bespoke furniture",
    "owl chair",
    "sculptural reading chair",
    "animal inspired furniture",
  ],
  authors: [{ name: "Fuzz Sofa Studio", url: "https://fuzzsofa.com" }],
  openGraph: {
    title: "Fuzz Sofa Studio — Made-to-Order Sculptural Furniture",
    description:
      "A design-led furniture studio specializing in sculptural sofas produced through a made-to-order system. Each piece is individually produced after order confirmation.",
    url: "https://fuzzsofa.com",
    siteName: "Fuzz Sofa Studio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://fuzzsofa.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fuzz Sofa Studio - Sculptural Furniture Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fuzz Sofa Studio — Made-to-Order Sculptural Furniture",
    description:
      "A design-led furniture studio specializing in sculptural sofas produced through a made-to-order system. Each piece is individually produced after order confirmation.",
    images: ["https://fuzzsofa.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0A0A0A] text-[#F5F0EB]">
        <SupabaseConfigProvider>
        <LanguageProvider>
        <CartProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Fuzz Sofa Studio",
                url: "https://fuzzsofa.com",
                description:
                  "A made-to-order sculptural furniture studio specializing in contemporary sofas designed and produced individually through a studio-based system.",
                foundingDate: "2015",
                areaServed: "Worldwide",
                brand: {
                  "@type": "Brand",
                  name: "Fuzz Sofa Studio",
                },
                knowsAbout: [
                  "Sculptural Sofa",
                  "Custom Furniture",
                  "Made-to-order Production",
                  "Studio Furniture Design",
                ],
                sameAs: [
                  "https://www.pinterest.com/fuzzsofa",
                  "https://www.instagram.com/fuzzsofa",
                  "https://www.facebook.com/fuzzsofa",
                  "https://www.youtube.com/@fuzzsofa",
                ],
              }),
            }}
          />
          <FontPreload />
          <LayoutShell>{children}</LayoutShell>
        </CartProvider>
        </LanguageProvider>
        </SupabaseConfigProvider>
      </body>
    </html>
  );
}
