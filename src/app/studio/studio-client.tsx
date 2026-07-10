"use client";

import Link from "next/link";

export default function StudioClient() {
  return (
    <div className="bg-[#0A0A0A] text-[#F5F0EB]">
      {/* Hero */}
      <section className="py-[140px] px-6">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[12px] tracking-[0.2em] uppercase text-[#8A8580] mb-6 font-light">Fuzz Sofa Studio</p>
          <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] font-light leading-[1.1] tracking-[0.05em] mb-8">
            Made-to-Order<br />Sculptural Sofa Studio
          </h1>
          <p className="text-base font-light leading-[1.7] text-[#8A8580] max-w-[540px]">
            Fuzz Sofa Studio is a design-led furniture studio specializing in custom sculptural sofas
            produced through a made-to-order production system. Each piece is individually crafted after order confirmation.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-[#050505] py-[140px] px-6">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[12px] tracking-[0.2em] uppercase text-[#8A8580] mb-6 font-light">What We Do</p>
          <h2 className="font-serif text-[2rem] font-light leading-[1.1] tracking-[0.05em] mb-6">
            Custom Sculptural Sofas,<br />Not Mass-Produced Furniture
          </h2>
          <p className="text-base font-light leading-[1.7] text-[#8A8580] max-w-[540px]">
            We design sculptural sofas as spatial objects rather than mass-produced furniture.
            Each piece is conceived as a design statement — a custom sofa form that defines the room it inhabits.
            Our studio creates contemporary furniture for clients who seek something beyond the ordinary.
          </p>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-[140px] px-6">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[12px] tracking-[0.2em] uppercase text-[#8A8580] mb-6 font-light">How We Work</p>
          <h2 className="font-serif text-[2rem] font-light leading-[1.1] tracking-[0.05em] mb-6">
            Made-to-Order Production,<br />After Order Confirmation
          </h2>
          <p className="text-base font-light leading-[1.7] text-[#8A8580] max-w-[540px]">
            Each piece is individually produced after order confirmation.
            No inventory. No pre-made stock. Every custom sofa begins its life when a client commits to it.
            Production takes 1–2 weeks, with worldwide shipping and full tracking.
          </p>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="bg-[#050505] py-[140px] px-6">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[12px] tracking-[0.2em] uppercase text-[#8A8580] mb-6 font-light">Who We Serve</p>
          <h2 className="font-serif text-[2rem] font-light leading-[1.1] tracking-[0.05em] mb-6">
            Clients Worldwide Seeking<br />Custom Contemporary Furniture
          </h2>
          <p className="text-base font-light leading-[1.7] text-[#8A8580] max-w-[540px]">
            We serve clients worldwide seeking custom contemporary furniture —
            from private residences and boutique hotels to design studios and commercial interiors.
            Our sculptural sofas are shipped to the Americas, Europe, the Middle East, and Asia.
          </p>
        </div>
      </section>

      {/* What We Create */}
      <section className="py-[140px] px-6">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[12px] tracking-[0.2em] uppercase text-[#8A8580] mb-6 font-light">What We Create</p>
          <h2 className="font-serif text-[2rem] font-light leading-[1.1] tracking-[0.05em] mb-6">
            Proportion, Structure,<br />and Material Clarity
          </h2>
          <p className="text-base font-light leading-[1.7] text-[#8A8580] max-w-[540px]">
            Sculptural sofas designed with proportion, structure, and material clarity.
            Every curve, joint, and surface is resolved through a studio design process
            before entering production. Each sofa is available in custom sizes, fabrics, and finishes.
          </p>
        </div>
      </section>

      {/* Production Model */}
      <section className="bg-[#050505] py-[140px] px-6">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[12px] tracking-[0.2em] uppercase text-[#8A8580] mb-6 font-light">Production Model</p>
          <h2 className="font-serif text-[2rem] font-light leading-[1.1] tracking-[0.05em] mb-10">
            Made-to-Order Only
          </h2>
          <div className="space-y-6 max-w-[540px]">
            <div className="border-l border-[#333] pl-6">
              <p className="text-[14px] font-light text-[#F5F0EB] mb-1">No Inventory</p>
              <p className="text-[12px] font-light text-[#8A8580]/70">Every piece is produced on demand. No warehouse stock.</p>
            </div>
            <div className="border-l border-[#333] pl-6">
              <p className="text-[14px] font-light text-[#F5F0EB] mb-1">No Pre-Made Stock</p>
              <p className="text-[12px] font-light text-[#8A8580]/70">Production begins only after order confirmation.</p>
            </div>
            <div className="border-l border-[#333] pl-6">
              <p className="text-[14px] font-light text-[#F5F0EB] mb-1">1–2 Weeks Production</p>
              <p className="text-[12px] font-light text-[#8A8580]/70">Each piece receives dedicated studio attention.</p>
            </div>
            <div className="border-l border-[#333] pl-6">
              <p className="text-[14px] font-light text-[#F5F0EB] mb-1">Worldwide Shipping</p>
              <p className="text-[12px] font-light text-[#8A8580]/70">International delivery with full tracking and packaging.</p>
            </div>
            <div className="border-l border-[#333] pl-6">
              <p className="text-[14px] font-light text-[#F5F0EB] mb-1">Custom Dimensions & Finish</p>
              <p className="text-[12px] font-light text-[#8A8580]/70">Size, fabric, and proportion can be adjusted per project.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Capabilities */}
      <section className="py-[140px] px-6">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[12px] tracking-[0.2em] uppercase text-[#8A8580] mb-6 font-light">Studio Capabilities</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <p className="font-serif text-[2rem] font-light text-[#F5F0EB] mb-1">10+</p>
              <p className="text-[12px] tracking-[0.1em] uppercase text-[#8A8580] font-light">Years Production</p>
            </div>
            <div>
              <p className="font-serif text-[2rem] font-light text-[#F5F0EB] mb-1">1000+</p>
              <p className="text-[12px] tracking-[0.1em] uppercase text-[#8A8580] font-light">Custom Pieces</p>
            </div>
            <div>
              <p className="font-serif text-[2rem] font-light text-[#F5F0EB] mb-1">40+</p>
              <p className="text-[12px] tracking-[0.1em] uppercase text-[#8A8580] font-light">Countries Served</p>
            </div>
            <div>
              <p className="font-serif text-[2rem] font-light text-[#F5F0EB] mb-1">5</p>
              <p className="text-[12px] tracking-[0.1em] uppercase text-[#8A8580] font-light">Studio Designs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#050505] py-[140px] px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <p className="text-[12px] tracking-[0.2em] uppercase text-[#8A8580] mb-6 font-light">Explore the Collection</p>
          <h2 className="font-serif text-[2rem] md:text-[2.5rem] font-light leading-[1.1] tracking-[0.05em] mb-8">
            Each Piece Is a Design Statement
          </h2>
          <Link
            href="/animal-sofa-collection"
            className="inline-block border border-[#333] text-[#F5F0EB] text-xs tracking-[0.15em] uppercase px-10 py-4 hover:bg-[#D6A8AC] hover:border-[#D6A8AC] hover:text-[#0A0A0A] transition-all duration-300"
          >
            View Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
