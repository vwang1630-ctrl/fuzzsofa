import type { Metadata } from "next";
import { breadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/lib/products";
import { ScenePageContent } from "@/components/scene-page-content";

export const metadata: Metadata = {
  title: "Boutique Hotel Lobby Furniture — Sculptural Statement Pieces",
  description:
    "Sculptural furniture for boutique hotel lobbies and hospitality spaces. Fuzz Sofa pieces that create photograph-worthy moments and define your property's character. Free white-glove delivery worldwide.",
};

export default function BoutiqueHotelLobbyPage() {
  const hotelProducts = products.filter((p) =>
    p.relatedInteriors.includes("boutique-hotel-lobby")
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "https://fuzzsofa.com" },
              { name: "Boutique Hotel Lobby", url: "https://fuzzsofa.com/boutique-hotel-lobby" },
            ])
          ),
        }}
      />

      <ScenePageContent
        heroLabel="Interior World"
        heroTitle="Boutique Hotel Lobbies"
        heroSubtitle="Sculptural furniture that defines the first and last impression of a property."
        accent="from-[#101518] to-[#0A0A0A]"
        whyThisSpaceContent={
          <>
            <p className="text-lg text-[#F5F0EB]/70 leading-relaxed">
              The boutique hotel lobby is the first and last impression a guest receives. In an era where guests choose properties for their distinctive character, the lobby furniture must communicate the property&apos;s design vision before the guest reaches the front desk.
            </p>
            <p className="mt-6 text-[#F5F0EB]/60 leading-relaxed">
              The Fuzz Sofa Lion Sofa has become a signature piece for hospitality spaces in the GCC and beyond. Its upright, commanding posture aligns with formal reception traditions, while its contemporary design language signals modern sophistication.
            </p>
            <p className="mt-6 text-[#F5F0EB]/60 leading-relaxed">
              Hospitality furniture must balance visual impact with operational durability. Fuzz Sofa pieces are available in contract-grade specifications with enhanced durability treatments. Leather options develop a rich patina with use, while maintaining structural integrity under high-traffic conditions.
            </p>
          </>
        }
        recommendedProducts={hotelProducts}
        designPrinciplesContent={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div>
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Photo-Worthy Moments</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-[1.7]">Hotel furniture should create moments guests photograph and share. A sculptural piece generates organic visibility no advertising budget can buy.</p>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Contract-Grade Durability</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-[1.7]">Hospitality furniture must withstand daily commercial use. Specify leather options and contract-grade treatments for longevity in high-traffic environments.</p>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Cultural Resonance</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-[1.7]">Choose animal motifs that align with the property&apos;s location. The Lion Sofa resonates in GCC markets; the Bear Sofa suits European mountain properties.</p>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Layered Lighting</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-[1.7]">Use accent lighting at floor level to sculpt the form after dark. The three-dimensional quality of each piece emerges under directional, low-angle illumination.</p>
            </div>
          </div>
        }
        relatedScenes={[
          { href: "/luxury-villa-interior", label: "Luxury Villas" },
          { href: "/statement-furniture", label: "Contemporary Homes" },
        ]}
      />
    </>
  );
}
