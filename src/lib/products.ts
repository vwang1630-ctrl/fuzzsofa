export type Region = "americas" | "europe" | "middle_east" | "se_asia";

export interface Product {
  slug: string;
  name: string;
  animal: string;
  tagline: string;
  description: string;
  concept: string;
  interiorContext: string;
  priceRange: {
    americas: [number, number];
    europe: [number, number];
    middle_east: [number, number];
    se_asia: [number, number];
  };
  specifications: {
    width: string;
    height: string;
    depth: string;
    seatHeight: string;
    weight: string;
    capacity: string;
  };
  materials: string[];
  materialOptions?: {
    type: string;
    options: string[];
    colors: string[];
  }[];
  images?: string[];
  faq: { question: string; answer: string }[];
  relatedProducts: string[];
  relatedInteriors: string[];
  metaDescription: string;
  /** Hide this product in specific regions */
  hiddenInRegions?: Region[];
  /** Regions where this product is trending/popular for SEO boost */
  trendingGeo?: string[];
}


export const products: Product[] = [
  {
    slug: "gorilla-sofa",
    name: "Gorilla Sofa",
    animal: "Gorilla",
    tagline: "Raw Power, Fabric or Leather",
    description:
      "The Gorilla Sofa embodies raw, grounded power. Its massive, low-slung profile and broad armrests create an unmistakable impression of strength and stability. Available in both fabric and leather options, this is the definitive statement piece for interiors that celebrate bold, primal energy.",
    concept:
      "The gorilla sits with quiet, undeniable authority — every line of its massive frame speaks of grounded strength that needs no display. The Gorilla Sofa captures this essence in its low, broad silhouette. The thick, powerful armrests rise like shoulders; the deep, wide seat offers an embrace that feels primal and protective. This is furniture that anchors a room not through height but through sheer, unapologetic mass and presence.",
    interiorContext:
      "The Gorilla Sofa demands generous floor space and suits interiors that celebrate materiality and bold gestures. It excels in loft apartments with exposed concrete, contemporary villas with double-height spaces, and hotel lobbies where it serves as a gathering anchor. Its low profile makes it ideal for rooms with dramatic views, where it won't compete with the landscape.",
    priceRange: {
      americas: [7800, 7800],
      europe: [7800, 7800],
      middle_east: [7800, 7800],
      se_asia: [7800, 7800],
    },
    specifications: {
      width: "W200 cm",
      height: "H152 cm",
      depth: "D160 cm",
      seatHeight: "38 cm",
      weight: "90 kg (80 kg + frame 10 kg)",
      capacity: "4-seater, up to 400 kg",
    },
    materials: [
      "Solid hardwood frame (FSC-certified oak)",
      "High-density foam with down feather wrap",
      "Plush long-pile fur fabric",
      "Sculpted matte black details (muzzle, paws)",
    ],
    materialOptions: [
      {
        type: "Plush Fur",
        options: [
          "Storm Gray",
          "Ivory Cream",
          "Cognac Brown",
          "Obsidian Black",
        ],
        colors: ["#6B6B6B", "#E8DFD0", "#5C3A1E", "#1A1A1A"],
      },
    ],
    images: [
      "/products/gorilla-sofa/gray.jpg",
      "/products/gorilla-sofa/cream.jpg",
      "/products/gorilla-sofa/brown.jpg",
      "/products/gorilla-sofa/black.jpg",
    ],
    faq: [
      {
        question: "Why does the Gorilla Sofa sit lower than other Fuzz Sofa models?",
        answer:
          "The low profile is intentional — it mirrors the gorilla's grounded, relaxed posture. This lower stance creates a more intimate seating experience and allows the piece to sit comfortably in rooms with dramatic views or art installations above eye level.",
      },
      {
        question: "What is the difference between fabric and leather options?",
        answer:
          "Both options use the same solid hardwood frame and cushioning system. Cloud Touch and Wild Touch fabrics offer warmer textures ideal for residential settings. Leather Touch develops a rich patina over time and is recommended for both residential and commercial use. Price varies by material selection.",
      },
      {
        question: "How is the Gorilla Sofa delivered?",
        answer:
          "All Fuzz Sofa pieces are delivered via our free white-glove service. The Gorilla Sofa's size requires our team to assess access points before delivery. We coordinate doorways, elevators, and staircases to ensure smooth installation. Full shipping video documentation is provided.",
      },
      {
        question: "Is the Gorilla Sofa suitable for commercial spaces?",
        answer:
          "The Gorilla Sofa is engineered for both residential and commercial use. For hospitality projects, we offer contract-grade specifications with enhanced durability treatments. Contact trade@fuzzsofa.com for bulk pricing.",
      },
      {
        question: "What is the return policy?",
        answer:
          "Fuzz Sofa offers a 14-day quality guarantee from delivery. If the piece does not meet our quality standards, we will arrange return shipping at no cost. Full video documentation of shipping and delivery is provided for every order.",
      },
    ],
    relatedProducts: ["owl-sofa", "silverback-sofa", "muscle-gorilla-sofa"],
    relatedInteriors: ["luxury-villa-interior", "statement-furniture"],
    metaDescription:
      "Custom sculptural gorilla sofa by Fuzz Sofa Studio. A made-to-order statement piece for contemporary interiors. Available in fabric or leather. 3–6 weeks production. Worldwide shipping.",
    trendingGeo: ["US", "EU", "JP", "AU", "AE", "SG"],
  },
  {
    slug: "owl-sofa",
    name: "Owl Chair",
    animal: "Owl",
    tagline: "Wisdom and Watchfulness",
    description:
      "The Owl Chair captures the alert, watchful essence of an owl at rest. Its compact scale and distinctive rounded backrest make it the most versatile piece in the Fuzz Sofa collection — a statement chair that transforms any corner into a place of contemplation and style.",
    concept:
      "The owl sits upright on its branch — alert, observant, perfectly composed. The Owl Chair translates this watchful quality into a compact statement seat. The rounded backrest encircles the sitter like folded wings, creating a sense of shelter and focus. The proportionally wide seat relative to the frame invites a drawn-up, contemplative posture. This is a chair for reading corners, study nooks, and intimate conversation — anywhere that rewards quiet attention.",
    interiorContext:
      "The Owl Chair's compact footprint makes it the most versatile piece in the collection. It excels in home libraries and reading nooks, bedroom seating areas, hotel room corners, and as accent seating in living rooms alongside larger Fuzz Sofa pieces. Its verticality makes it ideal for spaces where floor area is limited but vertical presence is welcome.",
    priceRange: {
      americas: [3500, 3500],
      europe: [3500, 3500],
      middle_east: [3500, 3500],
      se_asia: [3500, 3500],
    },
    specifications: {
      width: "W86 cm",
      height: "H76 cm",
      depth: "D82 cm",
      seatHeight: "44 cm",
      weight: "60 kg (50 kg + frame 10 kg)",
      capacity: "1-seater, up to 150 kg",
    },
    materials: [
      "Solid hardwood frame (FSC-certified walnut)",
      "High-density foam with down feather wrap",
      "Cloud Touch & Wild Touch fabric upholstery",
      "Solid brass feet with brushed finish",
    ],
    materialOptions: [
      {
        type: "Cloud Touch",
        options: [
          "Snowy White Bouclé",
          "Rose Pink Velvet",
        ],
        colors: ["#F0EBE0", "#E8B4B8"],
      },
      {
        type: "Wild Touch",
        options: [
          "Forest Green Velvet",
          "Warm Gray Linen",
        ],
        colors: ["#5A7A5A", "#8A8580"],
      },
    ],
    faq: [
      {
        question: "Is the Owl Chair available in leather?",
        answer:
          "The Owl Chair is available in two fabric lines: Cloud Touch (Snowy White Bouclé, Rose Pink Velvet) and Wild Touch (Forest Green Velvet, Warm Gray Linen) — four colors in total. The curved backrest and wing-like proportions are best expressed in fabric, which drapes naturally over the organic form. Leather options may be available for bespoke orders — contact our design team to discuss.",
      },
      {
        question: "Can the Owl Chair be used as a dining chair?",
        answer:
          "While the Owl Chair's seat height is compatible with standard dining tables, its deep, embracing design is optimized for relaxed seating rather than upright dining. For dining applications, we recommend considering custom seat depth modifications.",
      },
      {
        question: "Where does the Owl Chair work best?",
        answer:
          "The Owl Chair's compact footprint makes it the most versatile piece in the collection. It excels in home libraries, reading nooks, bedroom seating areas, and as accent seating alongside larger Fuzz Sofa pieces. Its vertical presence is ideal for spaces where floor area is limited.",
      },
      {
        question: "How is the Owl Chair shipped?",
        answer:
          "All Fuzz Sofa pieces include free white-glove delivery worldwide. The Owl Chair's compact size allows for simpler logistics than our larger pieces. Full shipping documentation with photo and video evidence is provided for every delivery.",
      },
      {
        question: "What is the return policy?",
        answer:
          "Fuzz Sofa offers a 14-day quality guarantee from delivery. If the piece does not meet our quality standards, we will arrange return shipping at no cost. Full video documentation of shipping and delivery is provided for every order.",
      },
    ],
    relatedProducts: ["gorilla-sofa", "silverback-sofa", "meteorite-ring-sofa"],
    relatedInteriors: ["statement-furniture", "sculptural-furniture-trend"],
    images: [
      "/products/owl/snowy-white.png",
      "/products/owl/warm-gray.png",
      "/products/owl/rose-pink.png",
      "/products/owl/forest-green.png",
    ],
    metaDescription:
      "Custom sculptural owl chair by Fuzz Sofa Studio. A made-to-order statement chair for modern interiors. Available in premium fabric. 3–6 weeks production. Worldwide shipping.",
    hiddenInRegions: ["middle_east"],
  },
  {
    slug: "silverback-sofa",
    name: "Silverback Sofa",
    animal: "Gorilla",
    tagline: "Upholstered Presence, Sculptural Authority",
    description:
      "The Silverback Sofa reimagines the sculptural gorilla form in refined upholstery. Its tailored fabric silhouette brings architectural precision to the primal gorilla outline, creating a statement piece that bridges organic sculpture and contemporary furniture design.",
    concept:
      "The silverback gorilla commands through stillness — its presence felt before a single move. The Silverback Sofa captures this quality in structured upholstery: the broad chest becomes a generous seat, the powerful arms form inviting armrests, and the watchful face rises as a sculptural backrest. Wrapped in premium fabric rather than fur, this version speaks to interiors that value clean lines and tactile sophistication alongside organic form.",
    interiorContext:
      "The Silverback Sofa's tailored upholstery makes it the most versatile gorilla piece for contemporary interiors. It excels in minimalist living rooms where texture matters more than pattern, modern boutique hotel lobbies, architect-designed residential spaces, and professional design studios. Its fabric construction suits climate-controlled environments and spaces where a refined, non-pile surface is preferred.",
    priceRange: {
      americas: [7800, 7800],
      europe: [7800, 7800],
      middle_east: [7800, 7800],
      se_asia: [7800, 7800],
    },
    specifications: {
      width: "W200 cm",
      height: "H152 cm",
      depth: "D160 cm",
      seatHeight: "42 cm",
      weight: "90 kg (80 kg + frame 10 kg)",
      capacity: "3-seater",
    },
    materials: ["Fabric", "Velvet"],
    materialOptions: [
      {
        type: "Fabric",
        options: ["Silver Mist", "Parchment Beige", "Midnight Navy", "Graphite Charcoal"],
        colors: ["#8A8A8A", "#D4C4A8", "#1B2A4A", "#363636"],
      },
    ],
    faq: [
      {
        question: "What is the difference between the Silverback Sofa and Gorilla Sofa?",
        answer:
          "The Silverback Sofa features tailored fabric and velvet upholstery for a refined, structured aesthetic. The Gorilla Sofa uses plush fur upholstery for a tactile, organic feel. Both share the same sculptural gorilla form and dimensions — the choice is about material preference and interior style.",
      },
      {
        question: "How is the Silverback Sofa delivered?",
        answer:
          "All Fuzz Sofa pieces are delivered via our free white-glove service. The Silverback Sofa's size requires our team to assess access points before delivery. We coordinate doorways, elevators, and staircases to ensure smooth installation.",
      },
      {
        question: "Is the fabric upholstery suitable for commercial spaces?",
        answer:
          "Yes. The Silverback Sofa is engineered for both residential and commercial use. For hospitality projects, we offer contract-grade fabric specifications with enhanced durability and stain-resistant treatments. Contact trade@fuzzsofa.com for bulk pricing.",
      },
      {
        question: "What is the return policy?",
        answer:
          "Fuzz Sofa offers a 14-day quality guarantee from delivery. If the piece does not meet our quality standards, we will arrange return shipping at no cost.",
      },
    ],
    relatedProducts: ["gorilla-sofa", "owl-sofa", "meteorite-ring-sofa"],
    relatedInteriors: ["luxury-villa-interior", "statement-furniture"],
    images: [
      "/products/silverback-sofa/gray.jpg",
      "/products/silverback-sofa/beige.jpg",
      "/products/silverback-sofa/navy.jpg",
      "/products/silverback-sofa/charcoal.jpg",
    ],
    metaDescription: "Custom sculptural silverback gorilla sofa by Fuzz Sofa Studio. A made-to-order upholstered sofa for contemporary interiors. Available in 4 colors. 3–6 weeks production. Worldwide shipping.",
  },
  {
    slug: "meteorite-ring-sofa",
    name: "Meteorite Ring Sofa",
    animal: "Meteorite",
    tagline: "Cosmic Impact, Grounded Comfort",
    description:
      "The Meteorite Ring Sofa captures the raw beauty of a celestial body frozen at the moment of impact. Its distinctive ring silhouette and crater-textured surface create a seating experience that is both sculptural and deeply comfortable — a conversation piece that transforms any space into a gallery of cosmic wonder.",
    concept:
      "A meteorite strikes the earth not with destruction but with transformation — the energy of the cosmos made tangible. The Meteorite Ring Sofa embodies this moment of cosmic impact. Its ring form evokes the crater left by a celestial visitor, while the textured surface recalls the fusion crust of a real meteorite — rough, organic, and utterly unique. The circular embrace of the ring creates a natural gathering space, an intimate orbit where conversation flows like gravity. This is furniture that reminds you the universe is both vast and personal.",
    interiorContext:
      "The Meteorite Ring Sofa's circular form makes it a natural centerpiece for open-plan living spaces, creative studios, and boutique hospitality environments. Its compact footprint fits surprisingly well in urban apartments, while its 360-degree design invites conversation from every angle. Best placed where it can be viewed in the round — center of room, near floor-to-ceiling windows, or as a room divider in open spaces.",
    priceRange: {
      americas: [3500, 3500],
      europe: [3500, 3500],
      middle_east: [3500, 3500],
      se_asia: [3500, 3500],
    },
    specifications: {
      width: "W110 cm",
      height: "H80 cm",
      depth: "D80 cm",
      seatHeight: "42 cm",
      weight: "30 kg (+ frame 10 kg)",
      capacity: "1-seater, up to 150 kg",
    },
    materials: [
      "Solid hardwood frame (FSC-certified)",
      "High-density foam with down feather wrap",
      "Meteorite-textured premium fabric",
      "Sculpted matte details",
    ],
    materialOptions: [
      {
        type: "Meteorite Fabric",
        options: [
          "Obsidian Black",
        ],
        colors: ["#1A1A1A"],
      },
    ],
    images: [
      "/products/meteorite-ring-sofa/main.jpg",
      "/products/meteorite-ring-sofa/scene-2.jpg",
      "/products/meteorite-ring-sofa/extracted.png",
    ],
    faq: [
      {
        question: "What makes the Meteorite Ring Sofa different from other Fuzz Sofa models?",
        answer:
          "The Meteorite Ring Sofa is the most compact piece in the collection. Its ring shape creates a 360-degree seating experience, while the crater-textured surface offers a unique tactile quality unlike any other furniture piece. It's designed for intimate spaces that demand a statement.",
      },
      {
        question: "Is the Meteorite Ring Sofa suitable for outdoor use?",
        answer:
          "The Meteorite Ring Sofa is designed for indoor use. The meteorite-textured fabric is treated for durability but is not weather-resistant. For covered outdoor spaces, we recommend consulting our trade team for custom outdoor specifications.",
      },
      {
        question: "How is the Meteorite Ring Sofa delivered?",
        answer:
          "All Fuzz Sofa pieces are delivered via our free white-glove service. The Meteorite Ring Sofa's compact size makes it one of the easiest pieces in the collection to deliver — it fits through standard doorways and elevators without special arrangements.",
      },
      {
        question: "What is the return policy?",
        answer:
          "Fuzz Sofa offers a 14-day quality guarantee from delivery. If the piece does not meet our quality standards, we will arrange return shipping at no cost.",
      },
    ],
    relatedProducts: ["gorilla-sofa", "owl-sofa", "silverback-sofa"],
    relatedInteriors: ["creative-studio", "urban-apartment"],
    metaDescription:
      "Custom sculptural ring sofa by Fuzz Sofa Studio. A made-to-order cosmic-inspired sofa for contemporary interiors. Compact 110x80x80cm. 3–6 weeks production. Worldwide shipping.",
    trendingGeo: ["americas", "europe"],
  },
  {
    slug: "muscle-gorilla-sofa",
    name: "Muscle Gorilla Sofa",
    animal: "Gorilla",
    tagline: "Raw Power, Refined Craft",
    description:
      "The Muscle Gorilla Sofa commands attention with its hyper-realistic sculpted form — every bicep, knuckle, and fur ridge rendered in polished leather. A furniture piece that refuses to be ignored, it transforms any room into a gallery of primal sophistication. Sit in the lap of strength.",
    concept:
      "Inspired by the raw musculature of a silverback gorilla in peak form, the Muscle Gorilla Sofa is a study in controlled power. Every surface has been sculpted to convey the tension of muscle beneath skin — the broad chest, the defined arms, the clenched fists. Yet for all its ferocity, the seating experience is pure comfort. The dichotomy between visual intensity and physical ease is the essence of this piece: a throne that earns its presence.",
    interiorContext:
      "The Muscle Gorilla Sofa demands a room with gravitas. Grand living rooms with high ceilings, luxury hotel lobbies, executive offices, or collector's penthouses — spaces where boldness is not just accepted but expected. Its 200cm width requires generous floor area, and its sculptural detail rewards close viewing. Best positioned as a centerpiece where it can be appreciated from multiple angles.",
    priceRange: {
      americas: [9800, 9800],
      europe: [9800, 9800],
      middle_east: [9200, 9200],
      se_asia: [8500, 8500],
    },
    specifications: {
      width: "W200 cm",
      height: "H152 cm",
      depth: "D160 cm",
      seatHeight: "42 cm",
      weight: "80 kg (+ frame 10 kg)",
      capacity: "3-seater, up to 340 kg",
    },
    materials: [
      "Solid hardwood frame (FSC-certified oak)",
      "High-density foam with sculpted contouring",
      "Premium leather upholstery with stitching detail",
      "Solid brass feet with matte black finish",
    ],
    materialOptions: [
      {
        type: "Leather",
        options: [
          "Onyx Black",
          "Chestnut Brown",
          "Burgundy Red",
          "Midnight Navy",
        ],
        colors: ["#1A1A1A", "#5C3A21", "#6B1C23", "#1B2A4A"],
      },
    ],
    images: [
      "/products/muscle-gorilla-sofa/main.jpg",
      "/products/muscle-gorilla-sofa/scene-2.jpg",
      "/products/muscle-gorilla-sofa/scene-4.jpg",
      "/products/muscle-gorilla-sofa/scene-5.jpg",
      "/products/muscle-gorilla-sofa/scene-6.jpg",
    ],
    faq: [
      {
        question: "What makes the Muscle Gorilla Sofa different from the Gorilla Sofa?",
        answer:
          "The Muscle Gorilla Sofa features hyper-realistic sculpted musculature in premium leather, while the Gorilla Sofa has a softer, more abstract silhouette in plush fabric. The Muscle Gorilla is for those who want maximum visual impact — it's the more dramatic, more detailed statement piece.",
      },
      {
        question: "Is the leather easy to maintain?",
        answer:
          "Yes. The premium leather upholstery is treated for stain resistance and can be cleaned with a damp cloth. We include a leather care kit with every purchase. The sculpted stitching details are reinforced to prevent wear in high-contact areas.",
      },
      {
        question: "How is the Muscle Gorilla Sofa delivered?",
        answer:
          "All Fuzz Sofa pieces are delivered via our free white-glove service. Due to the Muscle Gorilla's substantial size (W200 x H152 x D160 cm), our delivery team will coordinate with you to ensure smooth access through doorways and elevators. Assembly takes approximately 30 minutes on-site.",
      },
      {
        question: "What is the return policy?",
        answer:
          "Fuzz Sofa offers a 14-day quality guarantee from delivery. If the piece does not meet our quality standards, we will arrange return shipping at no cost.",
      },
    ],
    relatedProducts: ["gorilla-sofa", "silverback-sofa", "meteorite-ring-sofa"],
    relatedInteriors: ["luxury-villa-interior", "statement-furniture"],
    metaDescription:
      "Custom sculptural gorilla sofa by Fuzz Sofa Studio. A made-to-order leather statement piece for contemporary interiors. Available in 4 colors. 3–6 weeks production. Worldwide shipping.",
    trendingGeo: ["americas", "middle_east", "europe"],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getVisibleProducts(region: Region): Product[] {
  return products.filter((p) => !p.hiddenInRegions?.includes(region));
}

export function getPrice(product: Product, region: Region): number {
  const mapping: Record<string, Record<Region, number>> = {
    "gorilla-sofa": { americas: 7200, europe: 7200, middle_east: 6800, se_asia: 6200 },
    "gorilla-leather": { americas: 9800, europe: 9800, middle_east: 9200, se_asia: 8500 },
    "owl-sofa": { americas: 2800, europe: 2800, middle_east: 2650, se_asia: 2500 },
    "silverback-sofa": { americas: 7800, europe: 7800, middle_east: 7400, se_asia: 6800 },
    "meteorite-ring-sofa": { americas: 3500, europe: 3500, middle_east: 3500, se_asia: 3500 },
    "muscle-gorilla-sofa": { americas: 9800, europe: 9800, middle_east: 9200, se_asia: 8500 },
  };
  const key = product.slug === "gorilla-sofa" ? "gorilla-sofa" : product.slug;
  return mapping[key]?.[region] ?? product.priceRange.americas[0];
}

export function formatPrice(price: number | undefined | null, region?: Region): string {
  const safePrice = price ?? 0;
  if (region === "europe") {
    return `€${safePrice.toLocaleString()}`;
  }
  return `$${safePrice.toLocaleString()}`;
}
