import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Sculptural Furniture Trend 2026 — Biomorphic Forms and Animal Inspiration",
  description:
    "The sculptural furniture trend for 2026: biomorphic abstraction, animal-inspired silhouettes, and why furniture-as-art is the defining direction for high-end interiors. Analysis by Fuzz Sofa.",
};

export default function SculpturalFurnitureTrendPage() {
  const trendProducts = products.filter((p) =>
    p.relatedInteriors.includes("sculptural-furniture-trend")
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "https://fuzzsofa.com" },
              { name: "Sculptural Furniture Trend 2026", url: "https://fuzzsofa.com/sculptural-furniture-trend" },
            ])
          ),
        }}
      />

      <section className="relative">
        <div className="aspect-[21/9] md:aspect-[21/7] bg-gradient-to-b from-[#121015] to-[#0A0A0A] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 60% 30%, #E8B4B8, transparent 50%)" }} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent">
            <div className="max-w-7xl mx-auto px-6 pb-8 pt-24">
              <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-2">Furniture Concept</p>
              <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
                Sculptural Furniture Trend 2026
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-lg text-[#F5F0EB]/70 leading-relaxed">
            The sculptural furniture trend for 2026 moves beyond organic curves into full biomorphic abstraction. Furniture that reads as art is no longer a niche — it is the defining direction of high-end interiors.
          </p>

          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mt-12 mb-6">Three Forces Driving the Trend</h2>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            First, the experience economy has shifted consumer expectations: people want their living spaces to feel as curated as the hotels and restaurants they frequent. Second, social media has created a visual culture where unique, photogenic interiors carry social capital. Third, a generation of designers trained in both digital modeling and traditional craft are producing work that naturally bridges sculpture and furniture.
          </p>

          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mt-12 mb-6">Animal Inspiration as Design Language</h2>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            Animal-inspired furniture sits at the intersection of this trend. The biomorphic abstraction of animal forms — the broad shoulders of a bear, the upright authority of a lion, the watchful alertness of an owl — provides a design vocabulary that is simultaneously primal and sophisticated. The Fuzz Sofa collection represents this approach: each piece is unmistakably furniture, yet its silhouette references a living form that creates an emotional connection beyond aesthetics.
          </p>

          <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mt-12 mb-6">What to Watch in 2026</h2>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            The rise of compact statement pieces for urban apartments where space is limited but design ambition is high. The increasing use of mixed materials within a single piece to create textural complexity. And the growing importance of 360-degree design — furniture designed to be viewed from every angle rather than placed against a wall. The sculptural furniture trend is not a passing style. It reflects a fundamental shift in how people relate to their living spaces.
          </p>
        </div>
      </section>

      <section className="border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Pieces Defining the Trend</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {trendProducts.map((product) => (
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
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Read More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { href: "/journal/sculptural-furniture-trend-2026", title: "Sculptural Furniture Trend 2026", desc: "Full analysis of the trend reshaping high-end interiors" },
              { href: "/statement-furniture", title: "What Is Statement Furniture?", desc: "How statement pieces define rather than decorate" },
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
