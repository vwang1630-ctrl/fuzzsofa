import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Materials — Fuzz Sofa Fabric and Leather Options",
  description:
    "Fuzz Sofa material guide: premium fabrics and leathers used in our sculptural furniture. From Arctic White Bouclé to Cognac Aniline leather, every material is selected for lasting quality.",
};

export default function MaterialsPage() {
  return (
    <section className="relative">
      <div className="py-20 md:py-32 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-4">Materials</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
            Our Materials
          </h1>
          <p className="mt-6 text-lg text-[#F5F0EB]/50 font-light max-w-2xl mx-auto">
            Every material is selected for tactile richness, visual depth, and lasting performance. No shortcuts.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Fabrics */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Fabrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Bouclé",
                desc: "A textured, looped yarn fabric that creates a soft, inviting surface with visual depth. Bouclé reads as warm and organic — ideal for residential spaces where the furniture invites touch. Available in Arctic White, Midnight, Saddle Tan, and Ivory.",
                use: "Bear Sofa, Gorilla Sofa, Owl Chair",
              },
              {
                name: "Wool",
                desc: "Naturally flame-retardant and exceptionally durable, our wool fabrics offer a tight, smooth weave with subtle texture. Wool maintains its appearance over years of use and develops a gentle patina. Available in Charcoal, Deep Burgundy, Stone Grey, and Dusty Rose.",
                use: "Bear Sofa, Lion Sofa, Owl Chair",
              },
              {
                name: "Linen Blend",
                desc: "Linen blends combine the cool, breathable quality of natural linen with synthetic fibers for enhanced durability and wrinkle resistance. The resulting fabric has a relaxed elegance that suits both contemporary and transitional interiors. Available in Sand, Ivory, Navy, and Storm Grey.",
                use: "Bear Sofa, Lion Sofa, Tiger Sofa",
              },
              {
                name: "Velvet",
                desc: "Our velvet options use high-pile construction that creates dramatic light-and-shadow effects across the fabric surface. Velvet is particularly effective on sculptural pieces where the pile catches and releases light, emphasizing form. Available in Forest Green, Royal Navy, Burnt Orange, Sage Green, and Charcoal.",
                use: "Bear Sofa, Tiger Sofa, Owl Chair",
              },
            ].map((fabric) => (
              <div key={fabric.name} className="border-b border-[#1A1A1A] pb-8">
                <h3 className="font-serif text-xl text-[#F5F0EB] mb-3">{fabric.name}</h3>
                <p className="text-sm text-[#F5F0EB]/60 leading-relaxed">{fabric.desc}</p>
                <p className="mt-3 text-xs text-[#8A8580]">Used in: {fabric.use}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leathers */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Leathers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Aniline Leather",
                desc: "The most natural leather finish, aniline retains the hide&apos;s original surface with minimal treatment. It develops a rich patina with use and age — each piece becomes uniquely yours over time. Available in Cognac, Desert Tan, Russet, and Camel.",
                use: "Bear Sofa, Lion Sofa, Tiger Sofa, Gorilla Sofa",
              },
              {
                name: "Full-grain Leather",
                desc: "Full-grain leather uses the complete hide with all natural markings intact. It is the most durable leather option and develops the most pronounced patina. The surface breathes naturally, making it comfortable across seasons. Available in Midnight Black and Black.",
                use: "Gorilla Sofa, Lion Sofa",
              },
              {
                name: "Heritage Leather",
                desc: "Our Heritage leather features a semi-aniline finish that balances natural character with enhanced stain resistance. It offers the warmth and depth of aniline with greater practicality for high-traffic use. Available in Burgundy, Oxblood, and Espresso.",
                use: "Bear Sofa, Lion Sofa, Gorilla Sofa",
              },
              {
                name: "Vegetable-tanned Leather",
                desc: "Tanned using traditional plant-based methods without chromium, vegetable-tanned leather ages from light to deep amber over years. It is the most environmentally conscious leather option and develops the most dramatic color evolution. Available in Natural and Olive.",
                use: "Tiger Sofa, Bear Sofa, Gorilla Sofa",
              },
            ].map((leather) => (
              <div key={leather.name} className="border-b border-[#1A1A1A] pb-8">
                <h3 className="font-serif text-xl text-[#F5F0EB] mb-3">{leather.name}</h3>
                <p className="text-sm text-[#F5F0EB]/60 leading-relaxed">{leather.desc}</p>
                <p className="mt-3 text-xs text-[#8A8580]">Used in: {leather.use}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Frame materials */}
        <div>
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Frame & Structure</h2>
          <div className="space-y-6">
            {[
              { wood: "Oak", desc: "Used in Bear Sofa and Gorilla Sofa. Dense, strong, with a prominent grain that speaks to the piece's structural integrity." },
              { wood: "Walnut", desc: "Used in Lion Sofa and Owl Chair. Rich, dark tones with a fine, flowing grain that complements formal and residential settings." },
              { wood: "Ash", desc: "Used in Tiger Sofa. Light, strong, and flexible — ash's pale color and bold grain suit the Tiger's dynamic, energetic character." },
            ].map((item) => (
              <div key={item.wood} className="border-b border-[#1A1A1A] pb-6">
                <h3 className="font-serif text-lg text-[#F5F0EB] mb-2">FSC-Certified {item.wood}</h3>
                <p className="text-sm text-[#F5F0EB]/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-[#1A1A1A] pt-12">
          <Link
            href="/animal-sofa-collection"
            className="inline-flex items-center px-8 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
          >
            Explore the Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
