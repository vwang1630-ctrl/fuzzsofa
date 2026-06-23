import type { Metadata } from "next";
import { breadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/lib/products";
import { ScenePageContent } from "@/components/scene-page-content";

export const metadata: Metadata = {
  title: "Luxury Villa Interior Design with Sculptural Furniture",
  description:
    "How sculptural animal-inspired furniture transforms luxury villa interiors. Fuzz Sofa pieces for grand living spaces, private residences, and statement rooms. Free white-glove delivery worldwide.",
};

export default function LuxuryVillaInteriorPage() {
  const villaProducts = products.filter((p) =>
    p.relatedInteriors.includes("luxury-villa-interior")
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "https://fuzzsofa.com" },
              { name: "Luxury Villa Interior", url: "https://fuzzsofa.com/luxury-villa-interior" },
            ])
          ),
        }}
      />

      <ScenePageContent
        heroLabel="Interior World"
        heroTitle="Luxury Villa Interiors"
        heroSubtitle="Sculptural furniture that anchors grand residential spaces with commanding presence."
        accent="from-[#181510] to-[#0A0A0A]"
        whyThisSpaceContent={
          <>
            <p className="text-lg text-[#F5F0EB]/70 leading-relaxed">
              Luxury villas demand furniture with the scale and presence to match their architecture. In grand living rooms with high ceilings and open floor plans, conventional furniture reads as insufficient — it fills space without commanding it. Sculptural furniture, by contrast, anchors these spaces with the same authority as the architecture itself.
            </p>
            <p className="mt-6 text-[#F5F0EB]/60 leading-relaxed">
              The Fuzz Sofa Bear Sofa and Gorilla Sofa are designed for precisely these environments. Their broad, commanding silhouettes and generous proportions create a gravitational center that organizes the space around them.
            </p>
            <p className="mt-6 text-[#F5F0EB]/60 leading-relaxed">
              Villa interiors benefit from a curatorial approach to furniture. Rather than filling every surface, select one or two statement pieces that express the villa&apos;s character and let them breathe. A Bear Sofa in the principal living room, an Owl Chair in the library, and a Lion Sofa in the reception hall create a consistent design language without repetition.
            </p>
          </>
        }
        recommendedProducts={villaProducts}
        designPrinciplesContent={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div>
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Scale Over Quantity</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-[1.7]">One sculptural piece in a grand room creates more impact than five conventional ones. Let the statement piece breathe.</p>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Anchor the Focal Point</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-[1.7]">Place the largest piece facing the primary entry point. This establishes a gravitational center the eye naturally returns to.</p>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Contrast with Architecture</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-[1.7]">Organic sculptural forms against clean architectural lines create tension that makes both the building and the furniture more powerful.</p>
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#E8B4B8] mb-2">Light from One Direction</h3>
              <p className="text-sm text-[#F5F0EB]/60 leading-[1.7]">Single-source lighting reveals the three-dimensional form of sculptural furniture. Avoid flat overhead lighting that washes out texture.</p>
            </div>
          </div>
        }
        relatedScenes={[
          { href: "/boutique-hotel-lobby", label: "Boutique Hotels" },
          { href: "/statement-furniture", label: "Contemporary Homes" },
        ]}
      />
    </>
  );
}
