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
}

export const products: Product[] = [
  {
    slug: "bear-sofa",
    name: "Bear Sofa",
    animal: "Bear",
    tagline: "Commanding Presence, Grand Scale",
    description:
      "The Bear Sofa embodies the commanding presence of a grizzly bear in repose. Its broad, embracing silhouette creates a sanctuary of comfort that anchors any grand living space. Designed for those who seek furniture with primal authority and sculptural beauty.",
    concept:
      "Inspired by the resting grizzly — powerful yet at peace — the Bear Sofa translates the animal's broad shoulders and protective embrace into furniture form. The high, curved backrest evokes a bear's hunched silhouette, while the deep seat cradles you like a forest den. This is not merely seating; it is a statement of presence that transforms the room it occupies.",
    interiorContext:
      "The Bear Sofa belongs in spaces that demand gravitas: grand foyers of luxury villas, the principal lounge of boutique hotels, or the living room of a collector's penthouse. Its commanding scale requires generous ceiling height and visual breathing room, where it becomes the gravitational center of the interior.",
    priceRange: {
      americas: [8200, 9800],
      europe: [8200, 9800],
      middle_east: [7800, 9200],
      se_asia: [7200, 8600],
    },
    specifications: {
      width: "W200 cm",
      height: "H152 cm",
      depth: "D160 cm",
      seatHeight: "42 cm",
      weight: "90 kg",
      capacity: "3-seater, up to 340 kg",
    },
    materials: [
      "Solid hardwood frame (FSC-certified oak)",
      "High-density foam with down feather wrap",
      "Cloud Touch or Wild Touch fabric, or Leather Touch",
      "Solid brass feet with matte black finish",
    ],
    materialOptions: [
      {
        type: "Cloud Touch",
        options: [
          "Arctic White Bouclé",
          "Sand Linen Blend",
          "Charcoal Wool",
          "Forest Green Velvet",
        ],
        colors: ["#F5F0EB", "#C2B8A3", "#4A4A4A", "#3A5A40"],
      },
      {
        type: "Wild Touch",
        options: [
          "Midnight Bouclé",
          "Stone Grey Wool",
          "Saddle Tan Linen",
          "Charcoal Velvet",
        ],
        colors: ["#2A2A3A", "#7A7A7A", "#A08060", "#3A3A3A"],
      },
      {
        type: "Leather Touch",
        options: [
          "Cognac Aniline",
          "Midnight Black",
          "Burgundy Heritage",
          "Natural Vegetable-tanned",
        ],
        colors: ["#8B5A2B", "#1A1A1A", "#6B2A3A", "#C4A67A"],
      },
    ],
    faq: [
      {
        question: "How long does it take to receive a Bear Sofa?",
        answer:
          "Each Bear Sofa is made to order at our Shanghai workshop. Production takes 8–12 weeks, followed by free white-glove delivery to your door. You will receive photo and video documentation of your piece throughout the process.",
      },
      {
        question: "What is the weight capacity of the Bear Sofa?",
        answer:
          "The Bear Sofa supports up to 340 kg across its three-seat configuration. The solid hardwood frame and reinforced joinery ensure lasting structural integrity.",
      },
      {
        question: "Can I customize the fabric or leather?",
        answer:
          "Yes. The Bear Sofa is available in Cloud Touch fabric, Wild Touch fabric, and Leather Touch options with multiple colors each. For bespoke material requests, our design team can source specific textiles — contact us to discuss your vision.",
      },
      {
        question: "Is the Bear Sofa suitable for commercial spaces?",
        answer:
          "The Bear Sofa is engineered for both residential and commercial use. For hospitality projects, we offer contract-grade specifications with enhanced durability treatments and bulk pricing through our trade program.",
      },
      {
        question: "What is the return policy?",
        answer:
          "Fuzz Sofa offers a 14-day quality guarantee from delivery. If the piece does not meet our quality standards, we will arrange return shipping at no cost. Full video documentation of shipping and delivery is provided for every order.",
      },
    ],
    relatedProducts: ["lion-sofa", "gorilla-sofa", "owl-sofa"],
    relatedInteriors: ["luxury-villa-interior", "boutique-hotel-lobby"],
    metaDescription:
      "Bear Sofa by Fuzz Sofa — a sculptural three-seater inspired by the grizzly bear. Made to order in Shanghai with premium fabric or leather. Free white-glove delivery worldwide.",
    hiddenInRegions: ["middle_east"],
  },
  {
    slug: "lion-sofa",
    name: "Lion Sofa",
    animal: "Lion",
    tagline: "Regal Authority, for GCC Markets",
    description:
      "The Lion Sofa channels the regal authority of the king of beasts into a piece that commands any interior. Its proud, upright backrest and generous proportions make it the focal point of rooms designed for dialogue and ceremony. Particularly sought after for GCC market residences and diplomatic spaces.",
    concept:
      "The lion sits at the center of the pride — watchful, regal, commanding respect. The Lion Sofa captures this energy in its upright, proud backrest that rises like a mane, and its wide, generous seat that invites gathering. The armrests curve with leonine grace, strong yet fluid. In GCC palaces and diplomatic residences, this piece speaks a language of authority and hospitality that transcends cultural boundaries.",
    interiorContext:
      "The Lion Sofa thrives in spaces of ceremony and reception: the majlis of a Gulf residence, the diplomatic lounge of an embassy, or the principal salon of a heritage hotel. Its upright posture suits formal conversation, while its generous depth invites relaxed repose. In GCC markets, the Lion Sofa has become a signature piece for residences that blend traditional hospitality with contemporary design.",
    priceRange: {
      americas: [7500, 8200],
      europe: [7500, 8200],
      middle_east: [7100, 7800],
      se_asia: [6500, 7100],
    },
    specifications: {
      width: "W200 cm",
      height: "H148 cm",
      depth: "D155 cm",
      seatHeight: "44 cm",
      weight: "85 kg",
      capacity: "3-seater, up to 320 kg",
    },
    materials: [
      "Solid hardwood frame (FSC-certified walnut)",
      "High-density foam with down feather wrap",
      "Cloud Touch or Wild Touch fabric, or Leather Touch",
      "Solid brass feet with brushed gold finish",
    ],
    materialOptions: [
      {
        type: "Cloud Touch",
        options: [
          "Desert Sand Bouclé",
          "Ivory Linen",
          "Royal Navy Velvet",
          "Deep Burgundy Wool",
        ],
        colors: ["#C2B8A3", "#F0EBE0", "#1A2A5A", "#5A2A3A"],
      },
      {
        type: "Wild Touch",
        options: [
          "Midnight Bouclé",
          "Stone Grey Wool",
          "Saddle Tan Linen",
          "Charcoal Velvet",
        ],
        colors: ["#2A2A3A", "#7A7A7A", "#A08060", "#3A3A3A"],
      },
      {
        type: "Leather Touch",
        options: [
          "Desert Tan Aniline",
          "Midnight Black",
          "Oxblood Heritage",
          "Camel Full-grain",
        ],
        colors: ["#A08060", "#1A1A1A", "#6B2A2A", "#C4A67A"],
      },
    ],
    faq: [
      {
        question: "Why is the Lion Sofa popular in GCC markets?",
        answer:
          "The Lion Sofa's upright, commanding posture aligns with majlis seating traditions, while its contemporary design language appeals to modern GCC residences. Its generous proportions suit the scale of Gulf architecture, and the Leather Touch options are particularly popular for their durability in warm climates.",
      },
      {
        question: "What is the delivery timeframe for the Lion Sofa?",
        answer:
          "Made to order at our Shanghai workshop. Production takes 8–12 weeks, with free white-glove delivery worldwide. GCC deliveries typically arrive within 14–16 weeks total. Full shipping documentation and photo evidence are provided.",
      },
      {
        question: "Can the Lion Sofa be configured as a sectional?",
        answer:
          "The Lion Sofa is available as a three-seater, two-seater, and sectional configuration. For custom layouts, our design team works directly with your interior architect to ensure precise spatial integration.",
      },
      {
        question: "What warranty does the Lion Sofa carry?",
        answer:
          "All Fuzz Sofa pieces come with a 14-day quality guarantee from delivery. Structural warranty extends to 5 years for the frame and 2 years for upholstery under normal residential use.",
      },
      {
        question: "What is the return policy?",
        answer:
          "Fuzz Sofa offers a 14-day quality guarantee from delivery. If the piece does not meet our quality standards, we will arrange return shipping at no cost. Full video documentation of shipping and delivery is provided for every order.",
      },
    ],
    relatedProducts: ["bear-sofa", "tiger-sofa", "gorilla-sofa"],
    relatedInteriors: ["luxury-villa-interior", "boutique-hotel-lobby"],
    metaDescription:
      "Lion Sofa by Fuzz Sofa — a regal sculptural sofa inspired by the king of beasts. Made to order in Shanghai. Popular in GCC markets. Free white-glove delivery worldwide.",
  },
  {
    slug: "tiger-sofa",
    name: "Tiger Sofa",
    animal: "Tiger",
    tagline: "Bold Energy, Statement Piece",
    description:
      "The Tiger Sofa captures the bold, kinetic energy of a tiger mid-stride. Its dynamic, asymmetric profile and striking lines create an unmistakable statement piece that energizes any interior. For collectors and design enthusiasts who want furniture that provokes conversation.",
    concept:
      "A tiger in motion is all coiled energy and fluid power — every line in its body suggests imminent action. The Tiger Sofa translates this kinetic energy into furniture form. The asymmetric backrest rises and falls like a shoulder blade in motion. The seat flows from narrow to wide, suggesting forward momentum. This is furniture that refuses to be static, that makes the space around it feel alive with possibility.",
    interiorContext:
      "The Tiger Sofa is a natural centerpiece for contemporary art galleries, modernist apartments, and the living spaces of collectors who curate their interiors with the same intention as their art. Its dynamic profile pairs beautifully with brutalist architecture and minimalist interiors where its energy can resonate without competition.",
    priceRange: {
      americas: [7200, 8500],
      europe: [7200, 8500],
      middle_east: [6800, 8000],
      se_asia: [6200, 7300],
    },
    specifications: {
      width: "W195 cm",
      height: "H150 cm",
      depth: "D158 cm",
      seatHeight: "43 cm",
      weight: "88 kg",
      capacity: "3-seater, up to 300 kg",
    },
    materials: [
      "Solid hardwood frame (FSC-certified ash)",
      "High-density foam with down feather wrap",
      "Cloud Touch or Wild Touch fabric, or Leather Touch",
      "Powder-coated steel legs with matte finish",
    ],
    materialOptions: [
      {
        type: "Cloud Touch",
        options: [
          "Amber Bouclé",
          "Storm Grey Linen",
          "Burnt Orange Velvet",
          "Graphite Wool",
        ],
        colors: ["#B08040", "#7A7A80", "#C06020", "#4A4A4A"],
      },
      {
        type: "Wild Touch",
        options: [
          "Midnight Bouclé",
          "Stone Grey Wool",
          "Saddle Tan Linen",
          "Charcoal Velvet",
        ],
        colors: ["#2A2A3A", "#7A7A7A", "#A08060", "#3A3A3A"],
      },
      {
        type: "Leather Touch",
        options: [
          "Russet Aniline",
          "Obsidian Black",
          "Saddle Brown",
          "Olive Vegetable-tanned",
        ],
        colors: ["#8B4513", "#1A1A1A", "#8B6914", "#6B7A3A"],
      },
    ],
    faq: [
      {
        question: "What makes the Tiger Sofa different from other animal-inspired sofas?",
        answer:
          "The Tiger Sofa is the only piece in the Fuzz Sofa collection with an asymmetric profile. Its dynamic, forward-leaning silhouette captures movement rather than repose, making it uniquely suited for interiors that prioritize energy and conversation over conventional comfort arrangements.",
      },
      {
        question: "Is the asymmetric design comfortable for everyday seating?",
        answer:
          "Despite its unconventional silhouette, the Tiger Sofa's seat depth and cushioning are engineered for extended comfort. The varying back heights allow different seating positions — upright for conversation and reclined for relaxation.",
      },
      {
        question: "How do I maintain the fabric upholstery?",
        answer:
          "All Fuzz Sofa fabrics are treated with stain-resistant finishes. Regular vacuuming with a soft brush attachment and prompt attention to spills will maintain appearance. We provide a care guide with every delivery and can arrange professional cleaning services.",
      },
      {
        question: "Can I visit a showroom to see the Tiger Sofa in person?",
        answer:
          "We operate by appointment from our Shanghai workshop. For other regions, we offer virtual showroom consultations with detailed video walkthroughs. Contact us to arrange a session with our design team.",
      },
      {
        question: "What is the return policy?",
        answer:
          "Fuzz Sofa offers a 14-day quality guarantee from delivery. If the piece does not meet our quality standards, we will arrange return shipping at no cost. Full video documentation of shipping and delivery is provided for every order.",
      },
    ],
    relatedProducts: ["lion-sofa", "bear-sofa", "owl-sofa"],
    relatedInteriors: ["statement-furniture", "sculptural-furniture-trend"],
    metaDescription:
      "Tiger Sofa by Fuzz Sofa — a dynamic asymmetric sculptural sofa inspired by the tiger. Made to order in Shanghai with premium materials. Free white-glove delivery worldwide.",
  },
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
          "Gray Fur",
          "Cream Fur",
          "Brown Fur",
          "Black Fur",
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
    relatedProducts: ["bear-sofa", "lion-sofa", "tiger-sofa"],
    relatedInteriors: ["luxury-villa-interior", "statement-furniture"],
    metaDescription:
      "Gorilla Sofa by Fuzz Sofa — a massive low-slung sculptural sofa inspired by the gorilla. Available in fabric or leather. Made to order in Shanghai. Free white-glove delivery worldwide.",
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
    relatedProducts: ["bear-sofa", "tiger-sofa", "gorilla-sofa"],
    relatedInteriors: ["statement-furniture", "sculptural-furniture-trend"],
    metaDescription:
      "Owl Chair by Fuzz Sofa — a compact sculptural statement chair inspired by the owl. Made to order in Shanghai with premium fabric. Free white-glove delivery worldwide.",
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
        options: ["Gray Fabric", "Beige Fabric", "Navy Velvet", "Charcoal Velvet"],
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
    relatedProducts: ["gorilla-sofa", "bear-sofa", "lion-sofa"],
    relatedInteriors: ["luxury-villa-interior", "statement-furniture"],
    metaDescription:
      "Silverback Sofa by Fuzz Sofa — a sculptural upholstered gorilla sofa in premium fabric and velvet. Available in 4 colors. Made to order. Free white-glove delivery worldwide.",
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
    "bear-sofa": { americas: 8200, europe: 8200, middle_east: 7800, se_asia: 7200 },
    "lion-sofa": { americas: 7500, europe: 7500, middle_east: 7100, se_asia: 6500 },
    "tiger-sofa": { americas: 7200, europe: 7200, middle_east: 6800, se_asia: 6200 },
    "gorilla-sofa": { americas: 7200, europe: 7200, middle_east: 6800, se_asia: 6200 },
    "gorilla-leather": { americas: 9800, europe: 9800, middle_east: 9200, se_asia: 8500 },
    "owl-sofa": { americas: 2800, europe: 2800, middle_east: 2650, se_asia: 2500 },
  };
  const key = product.slug === "gorilla-sofa" ? "gorilla-sofa" : product.slug;
  return mapping[key]?.[region] ?? product.priceRange.americas[0];
}

export function formatPrice(price: number, region?: Region): string {
  if (region === "europe") {
    return `€${price.toLocaleString()}`;
  }
  return `$${price.toLocaleString()}`;
}
