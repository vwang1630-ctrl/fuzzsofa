import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Luxury Villa Interior Design with Sculptural Furniture",
  description:
    "How sculptural animal-inspired furniture transforms luxury villa interiors. Fuzz Sofa pieces for grand living spaces, private residences, and statement rooms. Free white-glove delivery worldwide.",
};

export default function LuxuryVillaInteriorPage() {
  const villaProducts = products.filter((p) =>
    p.relatedInteriors.includes("luxury-villa-interior")
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "https://fuzzsofa.com" },
              { name: "Luxury Villa Interior", url: "https://fuzzsofa.com/luxury-villa-interior" },
            ])
          ),
        }}
      />

      {/* Hero */}
      <section className="relative">
        <div className="aspect-[21/9] md:aspect-[21/7] bg-gradient-to-b from-[#181510] to-[#0A0A0A] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 30% 60%, #E8B4B8, transparent 50%)" }} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent">
            <div className="max-w-7xl mx-auto px-6 pb-8 pt-24">
              <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-2">Interior World</p>
              <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
                Luxury Villa Interiors
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-lg text-[#F5F0EB]/70 leading-relaxed">
            Luxury villas demand furniture with the scale and presence to match their architecture. In grand living rooms with high ceilings and open floor plans, conventional furniture reads as insufficient — it fills space without commanding it. Sculptural furniture, by contrast, anchors these spaces with the same authority as the architecture itself.
          </p>
          <p className="mt-6 text-[#F5F0EB]/60 leading-relaxed">
            The Fuzz Sofa Bear Sofa and Gorilla Sofa are designed for precisely these environments. Their broad, commanding silhouettes and generous proportions create a gravitational center that organizes the space around them. In a 6-meter-wide living area with 4-meter ceilings, these pieces do not look large — they look correct.
          </p>
          <p className="mt-6 text-[#F5F0EB]/60 leading-relaxed">
            Villa interiors benefit from a curatorial approach to furniture. Rather than filling every surface, select one or two statement pieces that express the villa&apos;s character and let them breathe. A Bear Sofa in the principal living room, an Owl Chair in the library, and a Lion Sofa in the reception hall create a consistent design language without repetition. Each piece serves its space with a distinct animal presence.
          </p>
        </div>
      </section>

      {/* Products for this interior */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">
            Pieces for Villa Interiors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {villaProducts.map((product) => (
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

      {/* Related interiors */}
      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Explore More Interiors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { href: "/boutique-hotel-lobby", title: "Boutique Hotel Lobby", desc: "Hospitality spaces that make a lasting first impression" },
              { href: "/statement-furniture", title: "Statement Furniture", desc: "Understanding furniture that defines rather than decorates" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group border border-[#1A1A1A] p-8 hover:border-[#E8B4B8]/40 transition-all duration-300"
              >
                <h3 className="font-serif text-xl text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors">
                  {link.title}
                </h3>
                <p className="mt-2 text-sm text-[#8A8580]">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
