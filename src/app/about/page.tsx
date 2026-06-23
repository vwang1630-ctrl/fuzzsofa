import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Fuzz Sofa — Sculptural Furniture from Shanghai",
  description:
    "Fuzz Sofa creates sculptural animal-inspired furniture at our Shanghai workshop. Learn about our origin, design philosophy, and commitment to lasting quality. Free white-glove delivery worldwide.",
};

export default function AboutPage() {
  return (
    <section className="relative">
      <div className="py-20 md:py-32 bg-gradient-to-b from-[#0E0E0E] to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
            About Fuzz Sofa
          </h1>
          <p className="mt-6 text-lg text-[#F5F0EB]/50 font-light max-w-2xl mx-auto">
            Sculptural furniture inspired by nature. Made to order in Shanghai, shipped worldwide.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="space-y-8">
          <p className="text-[#F5F0EB]/70 leading-relaxed text-lg">
            Fuzz Sofa began with a question: what if furniture could carry the presence of the living forms that inspire it? Not through decoration or pattern, but through the essential qualities of form — the broad protective embrace of a bear, the upright authority of a lion, the kinetic energy of a tiger, the grounded strength of a gorilla, the watchful alertness of an owl.
          </p>

          <p className="text-[#F5F0EB]/60 leading-relaxed">
            Our workshop in Shanghai brings together traditional woodworking, master upholstery, and contemporary design thinking. Each piece is made to order — never mass-produced, never from inventory. This approach allows us to specify every detail, from the FSC-certified hardwood in the frame to the hand-finished brass feet, and to document the entire process for the client.
          </p>

          <p className="text-[#F5F0EB]/60 leading-relaxed">
            The animal-inspired collection is our design language, not a theme. We do not reproduce animals in furniture form. We distill their essential qualities — presence, authority, energy, strength, watchfulness — into sculptural silhouettes that happen to be comfortable, durable, and functional. A Fuzz Sofa piece should read as sculpture from across the room and as furniture when you sit in it.
          </p>

          <p className="text-[#F5F0EB]/60 leading-relaxed">
            We ship worldwide with white-glove delivery service. Every piece arrives with photo and video documentation of its construction, a 14-day quality guarantee, and the knowledge that it was made specifically for you at our workshop.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[#222] pt-12">
          {[
            { label: "Origin", value: "Shanghai" },
            { label: "Founded", value: "2022" },
            { label: "Pieces", value: "5" },
            { label: "Markets", value: "40+ Countries" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xs text-[#6B6B6B] tracking-[0.1em] uppercase mb-1">{stat.label}</p>
              <p className="font-serif text-2xl text-[#F5F0EB]">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-[#222] pt-12 flex flex-wrap gap-4">
          <Link
            href="/animal-sofa-collection"
            className="inline-flex items-center px-8 py-3 border border-[#E8B4B8] text-[#E8B4B8] text-sm tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300"
          >
            Explore Collection
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 border border-[#333] text-[#F5F0EB]/50 text-sm tracking-[0.1em] uppercase hover:border-[#E8B4B8] hover:text-[#E8B4B8] transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
