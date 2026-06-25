import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/lib/cart-context";
import { LanguageProvider } from "@/lib/language-context";
import { FontPreload } from "@/components/font-preload";
import { SupabaseConfigProvider } from "@/lib/supabase-config-inject";

export const metadata: Metadata = {
  title: {
    default: "Fuzz Sofa Studio | Made-to-Order Sculptural Furniture",
    template: "%s | Fuzz Sofa Studio",
  },
  description:
    "Fuzz Sofa Studio is a design-led furniture studio specializing in sculptural sofas produced through a made-to-order system. Each piece is individually produced after order confirmation. No inventory. No mass production.",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Fuzz Sofa Studio — Made-to-Order Sculptural Furniture",
    description:
      "A design-led furniture studio specializing in sculptural sofas produced through a made-to-order system. Each piece is individually produced after order confirmation.",
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
              }),
            }}
          />
          <FontPreload />
          <Header />
          <main className="min-h-screen pt-[60px]">{children}</main>
          <Footer />
        </CartProvider>
        </LanguageProvider>
        </SupabaseConfigProvider>
      </body>
    </html>
  );
}
