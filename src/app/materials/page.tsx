import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Materials — Fuzz Sofa Fabric and Leather Guide",
  description:
    "Fuzz Sofa material guide: Cloud Touch fabrics, Wild Touch textures, and Leather Touch options. Every material selected for tactile richness, visual depth, and lasting performance.",
};

export default function MaterialsPage() {
  return (
    <section className="relative">
      {/* Hero */}
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
        {/* Cloud Touch */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-2">Cloud Touch</h2>
          <p className="text-sm text-[#8A8580] mb-10">Soft, inviting fabrics with visual depth — ideal for residential comfort.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Bouclé",
                desc: "A textured, looped yarn fabric that creates a soft, inviting surface with visual depth. Bouclé reads as warm and organic — ideal for residential spaces where the furniture invites touch.",
                colors: ["Arctic White", "Midnight", "Saddle Tan", "Ivory"],
                use: "Bear Sofa, Gorilla Sofa, Owl Chair",
              },
              {
                name: "Wool",
                desc: "Naturally flame-retardant and exceptionally durable. Wool maintains its appearance over years of use and develops a gentle patina that adds character.",
                colors: ["Charcoal", "Deep Burgundy", "Stone Grey", "Dusty Rose"],
                use: "Bear Sofa, Lion Sofa, Owl Chair",
              },
              {
                name: "Linen Blend",
                desc: "Linen blends combine the cool, breathable quality of natural linen with synthetic fibers for enhanced durability and wrinkle resistance. Relaxed elegance for contemporary interiors.",
                colors: ["Sand", "Ivory", "Navy", "Storm Grey"],
                use: "Bear Sofa, Lion Sofa, Tiger Sofa",
              },
              {
                name: "Velvet",
                desc: "High-pile construction creates dramatic light-and-shadow effects across the fabric surface. Particularly effective on sculptural pieces where the pile catches and releases light.",
                colors: ["Forest Green", "Royal Navy", "Burnt Orange", "Sage Green", "Charcoal"],
                use: "Bear Sofa, Tiger Sofa, Owl Chair",
              },
            ].map((fabric) => (
              <div key={fabric.name} className="border-b border-[#1A1A1A] pb-8">
                <h3 className="font-serif text-xl text-[#F5F0EB] mb-3">{fabric.name}</h3>
                <p className="text-sm text-[#F5F0EB]/60 leading-relaxed">{fabric.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {fabric.colors.map((c) => (
                    <span key={c} className="text-xs text-[#8A8580] border border-[#1A1A1A] px-2 py-1">{c}</span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[#8A8580]">Used in: {fabric.use}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wild Touch */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-2">Wild Touch</h2>
          <p className="text-sm text-[#8A8580] mb-10">Textured weaves with natural character — surfaces that tell a story of material honesty.</p>
          <div className="space-y-6">
            {[
              { name: "Mohair Blend", desc: "Long-fiber mohair creates a subtle sheen with a deep, fuzzy texture. Resistant to crushing and fading, mohair is suited to statement pieces that receive attention." },
              { name: "Chenille", desc: "Woven from spun yarns that create a velvety, iridescent surface. Chenille offers the softness of velvet with greater durability and a distinctive play of color." },
              { name: "Tweed", desc: "Classic tweed weaves combine multiple fiber colors into a heathered, complex surface. The texture adds visual warmth without sacrificing sophistication." },
            ].map((item) => (
              <div key={item.name} className="border-b border-[#1A1A1A] pb-6">
                <h3 className="font-serif text-lg text-[#F5F0EB] mb-2">{item.name}</h3>
                <p className="text-sm text-[#F5F0EB]/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leather Touch */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-2">Leather Touch</h2>
          <p className="text-sm text-[#8A8580] mb-10">Premium hides selected for patina, durability, and tactile evolution over time.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Aniline Leather",
                desc: "The most natural leather finish. Retains the hide&apos;s original surface with minimal treatment. Develops a rich patina with use — each piece becomes uniquely yours.",
                colors: ["Cognac", "Desert Tan", "Russet", "Camel"],
                use: "Bear Sofa, Lion Sofa, Tiger Sofa, Gorilla Sofa",
              },
              {
                name: "Full-grain Leather",
                desc: "Uses the complete hide with all natural markings intact. The most durable leather option. Surface breathes naturally, comfortable across seasons.",
                colors: ["Midnight Black", "Black"],
                use: "Gorilla Sofa, Lion Sofa",
              },
              {
                name: "Heritage Leather",
                desc: "Semi-aniline finish balancing natural character with enhanced stain resistance. Offers the warmth of aniline with greater practicality for high-traffic use.",
                colors: ["Burgundy", "Oxblood", "Espresso"],
                use: "Bear Sofa, Lion Sofa, Gorilla Sofa",
              },
              {
                name: "Vegetable-tanned Leather",
                desc: "Tanned using traditional plant-based methods without chromium. Ages from light to deep amber over years. Most environmentally conscious leather option.",
                colors: ["Natural", "Olive"],
                use: "Tiger Sofa, Bear Sofa, Gorilla Sofa",
              },
            ].map((leather) => (
              <div key={leather.name} className="border-b border-[#1A1A1A] pb-8">
                <h3 className="font-serif text-xl text-[#F5F0EB] mb-3">{leather.name}</h3>
                <p className="text-sm text-[#F5F0EB]/60 leading-relaxed">{leather.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {leather.colors.map((c) => (
                    <span key={c} className="text-xs text-[#8A8580] border border-[#1A1A1A] px-2 py-1">{c}</span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[#8A8580]">Used in: {leather.use}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Material Comparison Table */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Material Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1A1A1A]">
                  <th className="text-left py-4 pr-4 text-[#F5F0EB] font-normal">Category</th>
                  <th className="text-left py-4 px-4 text-[#F5F0EB] font-normal">Durability</th>
                  <th className="text-left py-4 px-4 text-[#F5F0EB] font-normal">Maintenance</th>
                  <th className="text-left py-4 px-4 text-[#F5F0EB] font-normal">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1A1A1A]">
                  <td className="py-4 pr-4 text-[#E8B4B8]">Cloud Touch</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">Medium-High</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">Vacuum weekly, professional clean annually</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">Residential, low-traffic</td>
                </tr>
                <tr className="border-b border-[#1A1A1A]">
                  <td className="py-4 pr-4 text-[#E8B4B8]">Wild Touch</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">High</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">Brush to restore texture, spot clean</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">Residential, statement pieces</td>
                </tr>
                <tr className="border-b border-[#1A1A1A]">
                  <td className="py-4 pr-4 text-[#E8B4B8]">Leather Touch</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">Very High</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">Wipe with damp cloth, condition every 6 months</td>
                  <td className="py-4 px-4 text-[#F5F0EB]/60">Contract-grade, high-traffic</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Care Guide */}
        <div className="mb-20">
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Care Guide</h2>
          <div className="space-y-6 max-w-3xl">
            <div className="border-b border-[#1A1A1A] pb-6">
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Fabric Care</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-relaxed">Vacuum weekly with a soft brush attachment to remove dust. Blot spills immediately with a clean, dry cloth — never rub. For deep cleaning, engage a professional upholstery service. Avoid direct sunlight to prevent fading.</p>
            </div>
            <div className="border-b border-[#1A1A1A] pb-6">
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Leather Care</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-relaxed">Wipe with a slightly damp cloth monthly. Apply leather conditioner every 6 months to maintain suppleness. Avoid heat sources and direct sunlight. Patina development is normal and desirable — it indicates genuine, high-quality leather.</p>
            </div>
            <div className="border-b border-[#1A1A1A] pb-6">
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Frame Maintenance</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-relaxed">Check joints annually for movement. Keep humidity between 40-60% to prevent wood expansion or contraction. Dust with a soft, dry cloth. No polishes or waxes required — the natural finish is designed to age gracefully.</p>
            </div>
          </div>
        </div>

        {/* Frame Materials */}
        <div>
          <h2 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10">Frame &amp; Structure</h2>
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
