"use client";

import Link from "next/link";

export default function AboutClient() {
  return (
    <main className="bg-[#0A0A0A] text-[#F5F0EB] min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#8A8580] mb-6">About the Studio</p>
          <h1 className="font-serif text-[2.8rem] font-light leading-[1.1] tracking-[0.02em] text-[#F5F0EB] mb-8">
            Fuzz Sofa Studio
          </h1>
          <p className="text-base font-light leading-[1.8] text-[#8A8580] max-w-[540px] mx-auto">
            A contemporary furniture design studio shaping sculptural sofas for modern interiors.
            We focus on form, proportion, and tactile experience — creating pieces that define spaces.
          </p>
        </div>
      </section>

      {/* Section 1: Studio Identity */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-[900px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#8A8580] mb-4">Studio Identity</p>
              <h2 className="font-serif text-2xl font-light tracking-[0.02em] mb-6">Between Design and Production</h2>
              <p className="text-sm font-light leading-[1.8] text-[#8A8580] mb-4">
                Fuzz Sofa Studio is a contemporary design studio that operates between design
                and production — creating sculptural sofas for residential and commercial interiors worldwide.
              </p>
              <p className="text-sm font-light leading-[1.8] text-[#8A8580]">
                Every piece begins with an idea about form — how a silhouette can change a room,
                how a curve can invite you to stay. We then engineer that idea into furniture that lasts.
              </p>
            </div>
            <div className="aspect-[4/3] bg-[#111] rounded-lg flex items-center justify-center">
              <p className="text-[#333] text-xs tracking-[0.1em] uppercase">Studio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Production Background */}
      <section className="py-20 px-6 bg-[#050505]">
        <div className="max-w-[900px] mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#8A8580] mb-4">Production Background</p>
          <h2 className="font-serif text-2xl font-light tracking-[0.02em] mb-8">
            10+ Years of Production Experience
          </h2>
          <p className="text-sm font-light leading-[1.8] text-[#8A8580] max-w-[600px] mb-12">
            With over a decade of production experience, our studio handles the full production
            process — from structural engineering to final upholstery.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "Custom Sofa Production",
              "Upholstery Craft",
              "Structural Engineering",
              "Export Packaging & Logistics",
              "Quality Inspection Systems",
              "Material Sourcing & Selection",
            ].map((item) => (
              <div key={item} className="bg-[#0E0E0E] rounded-lg px-5 py-6 text-center">
                <p className="text-xs font-light tracking-[0.05em] text-[#F5F0EB]/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Production Philosophy */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-[700px] mx-auto text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#8A8580] mb-6">Production Philosophy</p>
          <h2 className="font-serif text-[2rem] font-light tracking-[0.02em] leading-[1.15] mb-8 text-[#F5F0EB]">
            We believe design should be physical.
          </h2>
          <p className="text-sm font-light leading-[1.8] text-[#8A8580]">
            Each piece is developed within our studio production system — made to order, cut, shaped,
            and upholstered by hand. This takes longer, but it ensures that every curve, every seam,
            and every joint meets the standard our clients expect.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-[#050505]">
        <div className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["10+", "Years Production Experience"],
            ["1000+", "Custom Pieces Created"],
            ["30+", "Countries Shipped"],
            ["100%", "Made to Order"],
          ].map(([num, label]) => (
            <div key={label}>
              <p className="font-serif text-3xl font-light text-[#F5F0EB] mb-2">{num}</p>
              <p className="text-[11px] tracking-[0.1em] text-[#8A8580]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="font-serif text-xl font-light tracking-[0.02em] mb-4 text-[#F5F0EB]">
            See How We Work
          </h2>
          <p className="text-sm font-light text-[#8A8580] mb-8">
            Visit our studio to see the process behind every piece.
          </p>
          <Link
            href="/workshop"
            className="inline-block px-8 py-3 border border-[#333] text-sm tracking-[0.08em] text-[#F5F0EB] hover:border-[#D6A8AC] hover:text-[#D6A8AC] transition-all duration-300 rounded-lg"
          >
            Visit Studio →
          </Link>
        </div>
      </section>
    </main>
  );
}
