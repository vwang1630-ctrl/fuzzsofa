import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/lib/cart-context";
import { FontPreload } from "@/components/font-preload";

export const metadata: Metadata = {
  title: {
    default: "Fuzz Sofa — Sculptural Furniture Inspired by Nature",
    template: "%s | Fuzz Sofa",
  },
  description:
    "Fuzz Sofa creates sculptural animal-inspired furniture made to order in Shanghai. Bear, Lion, Tiger, Gorilla, and Owl designs. Free white-glove delivery worldwide.",
  keywords: [
    "sculptural furniture",
    "animal sofa",
    "statement furniture",
    "bear sofa",
    "lion sofa",
    "tiger sofa",
    "gorilla sofa",
    "owl chair",
    "fuzz sofa",
    "made to order furniture",
    "Shanghai workshop",
  ],
  authors: [{ name: "Fuzz Sofa", url: "https://fuzzsofa.com" }],
  openGraph: {
    title: "Fuzz Sofa — Sculptural Furniture Inspired by Nature",
    description:
      "Animal-inspired sculptural furniture made to order in Shanghai. Free white-glove delivery worldwide.",
    url: "https://fuzzsofa.com",
    siteName: "Fuzz Sofa",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fuzz Sofa — Sculptural Furniture Inspired by Nature",
    description:
      "Animal-inspired sculptural furniture made to order in Shanghai. Free white-glove delivery worldwide.",
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
        <CartProvider>
          <FontPreload />
          <Header />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
