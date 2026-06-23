import type { Metadata } from "next";
import { breadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/lib/products";
import { ScenePageContent } from "@/components/scene-page-content";

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

      <ScenePageContent
        heroLabel="Furniture Concept"
        heroTitle="What Is Statement Furniture?"
        heroSubtitle="A single piece that defines the character of an entire room."
        accent="from-[#151015] to-[#0A0A0A]"
        whyThisSpaceContent={
          <>
            <p className="text-lg text-[#F5F0EB]/70 leading-relaxed">
              Statement furniture is a single piece that defines the character of an entire room. Unlike accent furniture that complements existing decor, statement furniture leads — it is the first thing you notice and the last thing you forget.
            </p>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mt-12 mb-6">What Makes Furniture a Statement Piece</h2>
            <p className="text-[#F5F0EB]/60 leading-relaxed">
              The term &ldquo;statement furniture&rdquo; refers to pieces whose primary function extends beyond utility into the realm of artistic expression. A statement chair, sofa, or table communicates the owner&apos;s aesthetic vision before it provides a seat or surface.
            </p>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mt-12 mb-6">Statement Furniture vs Accent Furniture</h2>
            <p className="text-[#F5F0EB]/60 leading-relaxed">
              The distinction is one of degree and placement. Accent furniture adds visual interest within an established aesthetic framework. Statement furniture establishes the framework itself. An accent chair complements a room&apos;s color palette; a statement chair like the Fuzz Sofa Owl Chair becomes the reason the palette exists.
            </p>
            <h2 className="font-serif text-2xl font-light text-[#F5F0EB] mt-12 mb-6">How to Identify Statement Furniture</h2>
            <p className="text-[#F5F0EB]/60 leading-relaxed">
              Three qualities distinguish it: sculptural form that reads as art from every angle, material choices that emphasize tactile and visual richness, and proportion that commands space rather than fills it. When all three are present, the piece transcends its functional category and becomes a &ldquo;room-defining element.&rdquo;
            </p>
          </>
        }
        recommendedProducts={statementProducts}
        designPrinciplesContent={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div>
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">One Piece, One Room</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-[1.7]">Limit statement furniture to one or two pieces per room. Multiple competing statement pieces cancel each other&apos;s impact.</p>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Let It Breathe</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-[1.7]">Surround statement furniture with negative space. Neutral walls and minimal decor amplify the piece&apos;s sculptural presence.</p>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Read from Every Angle</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-[1.7]">True statement furniture is sculptural — it should look intentional from every viewing angle, not just the front.</p>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Form Follows Feeling</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-[1.7]">Choose statement furniture by the emotion it evokes, not by trend. A piece you connect with instinctively will outlast any style cycle.</p>
            </div>
          </div>
        }
        relatedScenes={[
          { href: "/luxury-villa-interior", label: "Luxury Villas" },
          { href: "/sculptural-furniture-trend", label: "Sculptural Trend" },
        ]}
      />
    </>
  );
}
