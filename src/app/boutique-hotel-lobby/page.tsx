import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/lib/products";

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

      <section className="relative">
        <div className="aspect-[21/9] md:aspect-[21/7] bg-gradient-to-b from-[#101518] to-[#0A0A0A] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 70% 40%, #E8B4B8, transparent 50%)" }} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent">
            <div className="max-w-7xl mx-auto px-6 pb-8 pt-24">
              <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-2">Interior World</p>
              <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
                Boutique Hotel Lobbies
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-lg text-[#F5F0EB]/70 leading-relaxed">
            The boutique hotel lobby is the first and last impression a guest receives. In an era where guests choose properties for their distinctive character, the lobby furniture must communicate the property&apos;s design vision before the guest reaches the front desk. Sculptural furniture achieves this instantly.
          </p>
          <p className="mt-6 text-[#F5F0EB]/60 leading-relaxed">
            The Fuzz Sofa Lion Sofa has become a signature piece for hospitality spaces in the GCC and beyond. Its upright, commanding posture aligns with formal reception traditions, while its contemporary design language signals modern sophistication. In hotel lobbies, the Lion Sofa creates a photograph-worthy moment that guests share — generating organic visibility that traditional furnishings cannot replicate.
          </p>
          <p className="mt-6 text-[#F5F0EB]/60 leading-relaxed">
            Hospitality furniture must balance visual impact with operational durability. Fuzz Sofa pieces are available in contract-grade specifications with enhanced durability treatments. Leather options — particularly Cognac Aniline and Desert Tan — develop a rich patina with use, while maintaining structural integrity under high-traffic conditions. All pieces come with our 14-day quality guarantee and full shipping documentation.
          </p>
        </div>
      </section>

      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">
            Pieces for Hotel Spaces
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotelProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/${product.slug}`}
                className="group bg-[#111111] border border-[#1A1A1A] p-6 hover:border-[#E8B4B8]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/3] mb-4 bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-500"
                    style={{ background: "radial-gradient(ellipse at center, #E8B4B8, transparent)" }}
                  />
                  <span className="font-serif text-6xl text-[#F5F0EB]/[0.06] group-hover:text-[#E8B4B8]/15 transition-colors duration-500">
                    {product.animal.charAt(0)}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-[#8A8580] mt-1">{product.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Explore More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { href: "/luxury-villa-interior", title: "Luxury Villa Interior", desc: "Sculptural furniture for grand private residences" },
              { href: "/statement-furniture", title: "Statement Furniture", desc: "What defines furniture that leads rather than follows" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="group border border-[#1A1A1A] p-8 hover:border-[#E8B4B8]/40 transition-all duration-300">
                <h3 className="font-serif text-xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors">{link.title}</h3>
                <p className="mt-2 text-sm text-[#8A8580]">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
