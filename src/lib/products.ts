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
    middleEast: [number, number];
    southeastAsia: [number, number];
  };
  specifications: {
    width: string;
    depth: string;
    height: string;
    seatHeight: string;
    weight: string;
    capacity: string;
  };
  materials: string[];
  materialOptions?: {
    type: string;
    options: string[];
  }[];
  faq: { question: string; answer: string }[];
  relatedProducts: string[];
  relatedInteriors: string[];
  metaDescription: string;
}

export const products: Product[] = [
  {
    slug: "bear-sofa",
    name: "Bear Sofa",
    animal: "Bear",
    tagline: "Commanding Presence. Grand Scale.",
    description:
      "The Bear Sofa embodies the commanding presence of a grizzly bear in repose. Its broad, embracing silhouette creates a sanctuary of comfort that anchors any grand living space. Designed for those who seek furniture with primal authority and sculptural beauty.",
    concept:
      "Inspired by the resting grizzly — powerful yet at peace — the Bear Sofa translates the animal's broad shoulders and protective embrace into furniture form. The high, curved backrest evokes a bear's hunched silhouette, while the deep seat cradles you like a forest den. This is not merely seating; it is a statement of presence that transforms the room it occupies.",
    interiorContext:
      "The Bear Sofa belongs in spaces that demand gravitas: grand foyers of luxury villas, the principal lounge of boutique hotels, or the living room of a collector's penthouse. Its commanding scale requires generous ceiling height and visual breathing room, where it becomes the gravitational center of the interior.",
    priceRange: {
      americas: [6200, 9800],
      europe: [5800, 9200],
      middleEast: [6400, 10100],
      southeastAsia: [5200, 8200],
    },
    specifications: {
      width: '280 cm / 110"',
      depth: '120 cm / 47"',
      height: '95 cm / 37"',
      seatHeight: '42 cm / 16.5"',
      weight: "85 kg / 187 lbs",
      capacity: "3-seater, up to 340 kg / 750 lbs",
    },
    materials: [
      "Solid hardwood frame (FSC-certified oak)",
      "High-density foam with down feather wrap",
      "Premium fabric or top-grain leather",
      "Solid brass feet with matte black finish",
    ],
    materialOptions: [
      {
        type: "Fabric",
        options: [
          "Arctic White Bouclé",
          "Charcoal Wool",
          "Sand Linen Blend",
          "Forest Green Velvet",
        ],
      },
      {
        type: "Leather",
        options: [
          "Cognac Aniline",
          "Midnight Black",
          "Burgundy Heritage",
          "Natural Vegetable-tanned",
        ],
      },
    ],
    faq: [
      {
        question: "How long does it take to receive a Bear Sofa?",
        answer:
          "Each Bear Sofa is made to order at our Shanghai workshop. Production takes 8–12 weeks, followed by white-glove delivery to your door. You will receive photo and video documentation of your piece throughout the process.",
      },
      {
        question: "What is the weight capacity of the Bear Sofa?",
        answer:
          "The Bear Sofa supports up to 340 kg (750 lbs) across its three-seat configuration. The solid hardwood frame and reinforced joinery ensure lasting structural integrity.",
      },
      {
        question: "Can I customize the fabric or leather?",
        answer:
          "Yes. The Bear Sofa is available in four fabric options and four leather options. For bespoke material requests, our design team can source specific textiles — contact us to discuss your vision.",
      },
      {
        question: "Is the Bear Sofa suitable for commercial spaces?",
        answer:
          "The Bear Sofa is engineered for both residential and commercial use. For hospitality projects, we offer contract-grade specifications with enhanced durability treatments and bulk pricing.",
      },
    ],
    relatedProducts: ["lion-sofa", "gorilla-sofa", "owl-sofa"],
    relatedInteriors: ["luxury-villa-interior", "boutique-hotel-lobby"],
    metaDescription:
      "Bear Sofa by Fuzz Sofa — a sculptural three-seater inspired by the grizzly bear. Made to order in Shanghai with premium fabric or leather. Free white-glove delivery worldwide.",
  },
  {
    slug: "lion-sofa",
    name: "Lion Sofa",
    animal: "Lion",
    tagline: "Regal Authority. Timeless Elegance.",
    description:
      "The Lion Sofa channels the regal authority of the king of beasts into a piece that commands any interior. Its proud, upright backrest and generous proportions make it the focal point of rooms designed for dialogue and ceremony. Particularly sought after for GCC market residences and diplomatic spaces.",
    concept:
      "The lion sits at the center of the pride — watchful, regal, commanding respect. The Lion Sofa captures this energy in its upright, proud backrest that rises like a mane, and its wide, generous seat that invites gathering. The armrests curve with leonine grace, strong yet fluid. In GCC palaces and diplomatic residences, this piece speaks a language of authority and hospitality that transcends cultural boundaries.",
    interiorContext:
      "The Lion Sofa thrives in spaces of ceremony and reception: the majlis of a Gulf residence, the diplomatic lounge of an embassy, or the principal salon of a heritage hotel. Its upright posture suits formal conversation, while its generous depth invites relaxed repose. In GCC markets, the Lion Sofa has become a signature piece for residences that blend traditional hospitality with contemporary design.",
    priceRange: {
      americas: [5500, 8200],
      europe: [5100, 7600],
      middleEast: [5700, 8500],
      southeastAsia: [4600, 6900],
    },
    specifications: {
      width: '260 cm / 102"',
      depth: '115 cm / 45"',
      height: '92 cm / 36"',
      seatHeight: '44 cm / 17"',
      weight: "78 kg / 172 lbs",
      capacity: "3-seater, up to 320 kg / 705 lbs",
    },
    materials: [
      "Solid hardwood frame (FSC-certified walnut)",
      "High-density foam with down feather wrap",
      "Premium fabric or top-grain leather",
      "Solid brass feet with brushed gold finish",
    ],
    materialOptions: [
      {
        type: "Fabric",
        options: [
          "Royal Navy Velvet",
          "Desert Sand Bouclé",
          "Ivory Linen",
          "Deep Burgundy Wool",
        ],
      },
      {
        type: "Leather",
        options: [
          "Desert Tan Aniline",
          "Midnight Black",
          "Oxblood Heritage",
          "Camel Full-grain",
        ],
      },
    ],
    faq: [
      {
        question: "Why is the Lion Sofa popular in GCC markets?",
        answer:
          "The Lion Sofa's upright, commanding posture aligns with majlis seating traditions, while its contemporary design language appeals to modern GCC residences. Its generous proportions suit the scale of Gulf architecture, and the leather options are particularly popular for their durability in warm climates.",
      },
      {
        question: "What is the delivery timeframe for the Lion Sofa?",
        answer:
          "Made to order at our Shanghai workshop. Production takes 8–12 weeks, with white-glove delivery worldwide. GCC deliveries typically arrive within 14–16 weeks total. Full shipping documentation and photo evidence are provided.",
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
    tagline: "Bold Energy. Definitive Statement.",
    description:
      "The Tiger Sofa captures the bold, kinetic energy of a tiger mid-stride. Its dynamic, asymmetric profile and striking lines create an unmistakable statement piece that energizes any interior. For collectors and design enthusiasts who want furniture that provokes conversation.",
    concept:
      "A tiger in motion is all coiled energy and fluid power — every line in its body suggests imminent action. The Tiger Sofa translates this kinetic energy into furniture form. The asymmetric backrest rises and falls like a shoulder blade in motion. The seat flows from narrow to wide, suggesting forward momentum. This is furniture that refuses to be static, that makes the space around it feel alive with possibility.",
    interiorContext:
      "The Tiger Sofa is a natural centerpiece for contemporary art galleries, modernist apartments, and the living spaces of collectors who curate their interiors with the same intention as their art. Its dynamic profile pairs beautifully with brutalist architecture and minimalist interiors where its energy can resonate without competition.",
    priceRange: {
      americas: [5200, 8500],
      europe: [4800, 7900],
      middleEast: [5400, 8800],
      southeastAsia: [4300, 7100],
    },
    specifications: {
      width: '250 cm / 98"',
      depth: '110 cm / 43"',
      height: '88 cm / 35"',
      seatHeight: '43 cm / 17"',
      weight: "72 kg / 159 lbs",
      capacity: "3-seater, up to 300 kg / 660 lbs",
    },
    materials: [
      "Solid hardwood frame (FSC-certified ash)",
      "High-density foam with down feather wrap",
      "Premium fabric or top-grain leather",
      "Powder-coated steel legs with matte finish",
    ],
    materialOptions: [
      {
        type: "Fabric",
        options: [
          "Burnt Orange Velvet",
          "Graphite Wool",
          "Amber Bouclé",
          "Storm Grey Linen",
        ],
      },
      {
        type: "Leather",
        options: [
          "Russet Aniline",
          "Obsidian Black",
          "Saddle Brown",
          "Olive Vegetable-tanned",
        ],
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
    tagline: "Raw Power. Grounded Strength.",
    description:
      "The Gorilla Sofa embodies raw, grounded power. Its massive, low-slung profile and broad armrests create an unmistakable impression of strength and stability. Available in both fabric and leather options, this is the definitive statement piece for interiors that celebrate bold, primal energy.",
    concept:
      "The gorilla sits with quiet, undeniable authority — every line of its massive frame speaks of grounded strength that needs no display. The Gorilla Sofa captures this essence in its low, broad silhouette. The thick, powerful armrests rise like shoulders; the deep, wide seat offers an embrace that feels primal and protective. This is furniture that anchors a room not through height but through sheer, unapologetic mass and presence.",
    interiorContext:
      "The Gorilla Sofa demands generous floor space and suits interiors that celebrate materiality and bold gestures. It excels in loft apartments with exposed concrete, contemporary villas with double-height spaces, and hotel lobbies where it serves as a gathering anchor. Its low profile makes it ideal for rooms with dramatic views, where it won't compete with the landscape.",
    priceRange: {
      americas: [6200, 9800],
      europe: [5800, 9200],
      middleEast: [6400, 10100],
      southeastAsia: [5200, 8200],
    },
    specifications: {
      width: '300 cm / 118"',
      depth: '130 cm / 51"',
      height: '78 cm / 31"',
      seatHeight: '38 cm / 15"',
      weight: "95 kg / 209 lbs",
      capacity: "4-seater, up to 400 kg / 880 lbs",
    },
    materials: [
      "Solid hardwood frame (FSC-certified oak)",
      "High-density foam with down feather wrap",
      "Premium fabric or top-grain leather",
      "Solid steel base with black powder coat",
    ],
    materialOptions: [
      {
        type: "Fabric",
        options: [
          "Midnight Bouclé",
          "Stone Grey Wool",
          "Saddle Tan Linen",
          "Charcoal Velvet",
        ],
      },
      {
        type: "Leather",
        options: [
          "Black Full-grain",
          "Cognac Aniline",
          "Espresso Heritage",
          "Natural Vegetable-tanned",
        ],
      },
    ],
    faq: [
      {
        question: "Why does the Gorilla Sofa sit lower than other Fuzz Sofa models?",
        answer:
          "The low profile is intentional — it mirrors the gorilla's grounded, relaxed posture. This lower stance creates a more intimate seating experience and allows the piece to sit comfortably in rooms with dramatic views or art installations above eye level.",
      },
      {
        question: "Is the Gorilla Sofa the largest piece in the collection?",
        answer:
          "Yes, the Gorilla Sofa is the widest and heaviest piece in the Fuzz Sofa collection at 300 cm wide and 95 kg. Its four-seat capacity and generous depth make it the most substantial single piece we produce.",
      },
      {
        question: "What is the difference between fabric and leather options?",
        answer:
          "Both options use the same solid hardwood frame and cushioning system. Fabric options offer warmer textures and are ideal for residential settings. Leather options develop a rich patina over time and are recommended for both residential and commercial use. Price varies by material selection.",
      },
      {
        question: "How is the Gorilla Sofa delivered?",
        answer:
          "All Fuzz Sofa pieces are delivered via our white-glove service. The Gorilla Sofa's size requires our team to assess access points before delivery. We coordinate doorways, elevators, and staircases to ensure smooth installation. Full shipping video documentation is provided.",
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
    tagline: "Wisdom and Watchfulness. Compact Statement.",
    description:
      "The Owl Chair captures the alert, watchful essence of an owl at rest. Its compact scale and distinctive rounded backrest make it the most versatile piece in the Fuzz Sofa collection — a statement chair that transforms any corner into a place of contemplation and style.",
    concept:
      "The owl sits upright on its branch — alert, observant, perfectly composed. The Owl Chair translates this watchful quality into a compact statement seat. The rounded backrest encircles the sitter like folded wings, creating a sense of shelter and focus. The proportionally wide seat relative to the frame invites a drawn-up, contemplative posture. This is a chair for reading corners, study nooks, and intimate conversation — anywhere that rewards quiet attention.",
    interiorContext:
      "The Owl Chair's compact footprint makes it the most versatile piece in the collection. It excels in home libraries and reading nooks, bedroom seating areas, hotel room corners, and as accent seating in living rooms alongside larger Fuzz Sofa pieces. Its verticality makes it ideal for spaces where floor area is limited but vertical presence is welcome.",
    priceRange: {
      americas: [1500, 2800],
      europe: [1400, 2600],
      middleEast: [1600, 2900],
      southeastAsia: [1200, 2300],
    },
    specifications: {
      width: '85 cm / 33"',
      depth: '80 cm / 31"',
      height: '98 cm / 39"',
      seatHeight: '44 cm / 17"',
      weight: "28 kg / 62 lbs",
      capacity: "1-seater, up to 150 kg / 330 lbs",
    },
    materials: [
      "Solid hardwood frame (FSC-certified walnut)",
      "High-density foam with down feather wrap",
      "Premium fabric upholstery",
      "Solid brass feet with brushed finish",
    ],
    materialOptions: [
      {
        type: "Fabric",
        options: [
          "Ivory Bouclé",
          "Sage Green Velvet",
          "Dusty Rose Wool",
          "Navy Linen Blend",
        ],
      },
    ],
    faq: [
      {
        question: "Is the Owl Chair available in leather?",
        answer:
          "Currently, the Owl Chair is offered exclusively in fabric upholstery. The curved backrest and wing-like proportions are best expressed in fabric, which drapes naturally over the organic form. Leather options may be available for bespoke orders — contact our design team to discuss.",
      },
      {
        question: "Can the Owl Chair be used as a dining chair?",
        answer:
          "While the Owl Chair's seat height is compatible with standard dining tables, its deep, embracing design is optimized for relaxed seating rather than upright dining. For dining applications, we recommend considering custom seat depth modifications.",
      },
      {
        question: "How does the Owl Chair compare to other statement chairs?",
        answer:
          "Unlike conventional accent chairs, the Owl Chair is a sculptural statement piece with a complete 360-degree design presence. Its rounded backrest means it works beautifully in the center of a room, not just against a wall. It occupies the space between furniture and art.",
      },
      {
        question: "What is the lead time for the Owl Chair?",
        answer:
          "The Owl Chair requires 6–10 weeks for production at our Shanghai workshop, followed by white-glove delivery. As our most compact piece, it ships more quickly and is often in stock for immediate delivery in select fabric options.",
      },
    ],
    relatedProducts: ["bear-sofa", "tiger-sofa", "gorilla-sofa"],
    relatedInteriors: ["statement-furniture", "sculptural-furniture-trend"],
    metaDescription:
      "Owl Chair by Fuzz Sofa — a compact sculptural statement chair inspired by the owl. Made to order in Shanghai. Free white-glove delivery worldwide.",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export type Region = "americas" | "europe" | "middleEast" | "southeastAsia";

export function formatPrice(price: number, region: Region): string {
  const currencyMap: Record<Region, { code: string; symbol: string; locale: string }> = {
    americas: { code: "USD", symbol: "$", locale: "en-US" },
    europe: { code: "EUR", symbol: "€", locale: "de-DE" },
    middleEast: { code: "USD", symbol: "$", locale: "en-US" },
    southeastAsia: { code: "USD", symbol: "$", locale: "en-US" },
  };
  const { code, locale } = currencyMap[region];
  return new Intl.NumberFormat(locale, { style: "currency", currency: code, maximumFractionDigits: 0 }).format(price);
}
