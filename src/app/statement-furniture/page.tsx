import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "What Is Statement Furniture? Definition, Examples, and How to Choose",
  description:
    "Statement furniture defined: what it is, how it differs from accent furniture, and why a single sculptural piece can transform any interior. Complete guide by Fuzz Sofa.",
};

export default function StatementFurniturePage() {
  const statementProducts = products.filter((p) =>
    p.relatedInteriors.includes("statement-furniture")
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "https://fuzzsofa.com" },
              { name: "Statement Furniture", url: "https://fuzzsofa.com/statement-furniture" },
            ])
          ),
        }}
      />

      <section className="relative">
        <div className="aspect-[21/9] md:aspect-[21/7] bg-gradient-to-b from-[#151015] to-[#0A0A0A] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 50% 50%, #E8B4B8, transparent 50%)" }} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent">
            <div className="max-w-7xl mx-auto px-6 pb-8 pt-24">
              <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-2">Furniture Concept</p>
              <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
                What Is Statement Furniture?
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-lg text-[#F5F0EB]/70 leading-relaxed">
            Statement furniture is a single piece that defines the character of an entire room. Unlike accent furniture that complements existing decor, statement furniture leads — it is the first thing you notice and the last thing you forget.
          </p>

          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mt-12 mb-6">What Makes Furniture a Statement Piece</h2>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            The term &ldquo;statement furniture&rdquo; refers to pieces whose primary function extends beyond utility into the realm of artistic expression. A statement chair, sofa, or table communicates the owner&apos;s aesthetic vision before it provides a seat or surface. This does not mean it neglects comfort — the best statement furniture is both sculptural and functional.
          </p>

          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mt-12 mb-6">Statement Furniture vs Accent Furniture</h2>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            The distinction between statement furniture and accent furniture is one of degree and placement. Accent furniture adds visual interest within an established aesthetic framework. Statement furniture establishes the framework itself. An accent chair complements a room&apos;s color palette; a statement chair like the Fuzz Sofa Owl Chair becomes the reason the palette exists.
          </p>

          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mt-12 mb-6">How to Identify Statement Furniture</h2>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            Three qualities distinguish it: sculptural form that reads as art from every angle, material choices that emphasize tactile and visual richness, and proportion that commands space rather than fills it. When all three are present, the piece transcends its functional category and becomes what interior designers call a &ldquo;room-defining element.&rdquo;
          </p>

          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mt-12 mb-6">Placement and Impact</h2>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            Statement furniture works best when given visual breathing room. A statement piece crowded by too many competing elements loses its impact. The most effective interiors place one or two statement pieces in conversation with a quiet, supporting environment — neutral walls, understated lighting, and minimal competing ornamentation.
          </p>
        </div>
      </section>

      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Statement Pieces from Fuzz Sofa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statementProducts.map((product) => (
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
                <h3 className="font-serif text-lg text-[#F5F0EB] group-hover:text-[#E8B4B8] transition-colors">{product.name}</h3>
                <p className="text-xs text-[#8A8580] mt-1">{product.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Related Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { href: "/journal/statement-chair-vs-accent-chair", title: "Statement Chair vs Accent Chair", desc: "The key difference in form, placement, and purpose" },
              { href: "/journal/how-to-choose-a-statement-chair", title: "How to Choose a Statement Chair", desc: "Scale, material, placement, and common mistakes" },
              { href: "/sculptural-furniture-trend", title: "Sculptural Furniture Trend 2026", desc: "Why furniture-as-art is the defining direction" },
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
