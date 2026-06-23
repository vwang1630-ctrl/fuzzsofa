import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Process — How Fuzz Sofa Furniture Is Made",
  description:
    "Every Fuzz Sofa piece is made to order at our Shanghai workshop. From frame construction to final upholstery, the process takes 8–12 weeks and involves over 40 individual steps.",
};

export default function ProcessPage() {
  return (
    <section className="relative">
      <div className="py-20 md:py-32 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-[#E8B4B8]/60 tracking-[0.15em] uppercase mb-4">The Process</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-[#F5F0EB]">
            How Fuzz Sofa Is Made
          </h1>
          <p className="mt-6 text-lg text-[#F5F0EB]/50 font-light max-w-2xl mx-auto">
            Made to order at our Shanghai workshop. From frame to finish, 8–12 weeks and over 40 steps.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Step 1 */}
        <div className="mb-16">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-xs text-[#E8B4B8] tracking-[0.1em]">01</span>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB]">Frame Construction</h2>
          </div>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            Each frame is built from FSC-certified hardwood — oak for the Bear and Gorilla Sofas, walnut for the Lion and Owl, ash for the Tiger. The wood is kiln-dried to a moisture content below 12%, then cut and joined using traditional mortise-and-tenon joints reinforced with modern adhesives. The frame is the skeleton of the piece, and its integrity determines decades of structural performance.
          </p>
        </div>

        {/* Step 2 */}
        <div className="mb-16">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-xs text-[#E8B4B8] tracking-[0.1em]">02</span>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB]">Cushion Engineering</h2>
          </div>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            Fuzz Sofa cushions use a layered construction: a high-density foam core provides consistent support, wrapped in a blend of down feathers and synthetic fiber that creates the soft, embracing surface our pieces are known for. The ratio varies by model — the Bear Sofa&apos;s deeper seat uses more down for a sinking comfort, while the Owl Chair&apos;s compact seat uses a higher foam ratio for responsive support.
          </p>
        </div>

        {/* Step 3 */}
        <div className="mb-16">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-xs text-[#E8B4B8] tracking-[0.1em]">03</span>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB]">Upholstery</h2>
          </div>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            Upholstery is the most labor-intensive phase. Each piece&apos;s organic, sculptural silhouette requires skilled cutting and sewing that cannot be automated. Pattern pieces are cut by hand from the selected fabric or leather, then sewn with reinforced seams at stress points. The upholstery is applied over the cushioned frame with a combination of stapling, hand-stitching, and hand-lacing at visible seams.
          </p>
        </div>

        {/* Step 4 */}
        <div className="mb-16">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-xs text-[#E8B4B8] tracking-[0.1em]">04</span>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB]">Finishing & Quality Control</h2>
          </div>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            Brass feet are machined to specification and finished by hand. Exposed seams are hand-stitched with waxed thread. Leather edges are burnished and sealed. Each piece receives a final quality inspection before being photographed and documented for the client.
          </p>
        </div>

        {/* Step 5 */}
        <div className="mb-16">
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-xs text-[#E8B4B8] tracking-[0.1em]">05</span>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB]">Documentation & Delivery</h2>
          </div>
          <p className="text-[#F5F0EB]/60 leading-relaxed">
            The client receives photo and video documentation at three stages: frame completion, upholstery in progress, and final piece. This is part of our commitment to transparency. After production, white-glove delivery service brings the piece to your door, where our team unpacks, positions, and removes all packaging materials.
          </p>
        </div>

        <div className="border-t border-[#1A1A1A] pt-12">
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
