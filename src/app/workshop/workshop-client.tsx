"use client";

export default function WorkshopClient() {
  return (
    <main className="bg-[#0A0A0A] text-[#F5F0EB] min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#8A8580] mb-6">Workshop</p>
          <h1 className="font-serif text-[2.8rem] font-light leading-[1.1] tracking-[0.02em] text-[#F5F0EB] mb-8">
            Behind the Studio
          </h1>
          <p className="text-base font-light leading-[1.8] text-[#8A8580] max-w-[540px] mx-auto">
            This is where design becomes physical furniture.
            Every piece passes through our studio — from raw materials to finished product.
          </p>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-[1000px] mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#8A8580] mb-4 text-center">Capabilities</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[
              {
                title: "Frame Construction",
                desc: "Solid hardwood frames cut, assembled, and reinforced by hand. Every joint is checked for structural integrity.",
              },
              {
                title: "Upholstery Production",
                desc: "Selected leather and fabric applied by skilled upholsterers. Each panel is stretched, pinned, and secured with precision.",
              },
              {
                title: "Material Preparation",
                desc: "Materials sourced from verified suppliers and inspected on arrival — leather, foam, hardwood, and structural components.",
              },
              {
                title: "Sculpting & Shaping",
                desc: "The organic curves that define our pieces are shaped layer by layer, building the form from the inside out.",
              },
              {
                title: "Quality Inspection",
                desc: "Every finished piece undergoes a multi-point inspection before export. We check seams, symmetry, and structural soundness.",
              },
              {
                title: "Export Packaging",
                desc: "Protective packaging designed for international shipping. Corner guards, wrapped frames, reinforced cartons.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-[#0E0E0E] rounded-lg p-8">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#D6A8AC]/40" />
                </div>
                <h3 className="text-sm font-light tracking-[0.05em] text-[#F5F0EB] mb-3">{item.title}</h3>
                <p className="text-xs font-light leading-[1.7] text-[#8A8580]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-6 bg-[#050505]">
        <div className="max-w-[700px] mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#8A8580] mb-6 text-center">Process</p>
          <h2 className="font-serif text-2xl font-light tracking-[0.02em] mb-12 text-center text-[#F5F0EB]">
            From Design to Delivery
          </h2>
          <div className="space-y-8">
            {[
              { step: "01", title: "Design Confirmation", desc: "Every detail is confirmed — dimensions, materials, finish." },
              { step: "02", title: "Project Preparation", desc: "Materials selected, inspected, and prepared for production." },
              { step: "03", title: "Studio Production", desc: "Frame, upholstery, and finishing — each step crafted by hand." },
              { step: "04", title: "Inspection & Global Shipping", desc: "Export-packed and shipped worldwide via trusted logistics partners." },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <span className="text-2xl font-serif font-light text-[#333] shrink-0">{item.step}</span>
                <div>
                  <h3 className="text-sm font-light tracking-[0.05em] text-[#F5F0EB] mb-2">{item.title}</h3>
                  <p className="text-xs font-light leading-[1.7] text-[#8A8580]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
