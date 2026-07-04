export interface MagazineArticle {
  slug: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  heroImage: string;
  category: string;
  date: string;
  body: MagazineBlock[];
  productTags?: MagazineProductTag[];
  relatedSlugs: string[];
  likes: number;
}

export interface MagazineBlock {
  type: "paragraph" | "image" | "quote";
  content: string;
  caption?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface MagazineProductTag {
  id: string;
  productSlug: string;
  productName: string;
  colorName: string;
  topPercent: number;
  leftPercent: number;
}

export interface UserSpacePost {
  id: string;
  username: string;
  image: string;
  alt: string;
  likes: number;
}

export const magazineArticles: MagazineArticle[] = [
  {
    slug: "art-of-stillness",
    chapterNumber: "01",
    title: "The Art of Stillness",
    subtitle:
      "In a world of constant motion, we explore the beauty of stillness — where silence becomes a design language.",
    heroImage:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80",
    category: "Living",
    date: "March 2024",
    likes: 128,
    body: [
      {
        type: "paragraph",
        content:
          "In the realm of contemporary interior design, a quiet revolution is taking place. Designers and collectors alike are embracing sculptural furniture pieces that blur the boundary between functional objects and fine art. Among these, animal-inspired furniture has emerged as a particularly compelling category, offering both the practical comfort we expect from our living spaces and the aesthetic pleasure of curated sculpture.",
      },
      {
        type: "paragraph",
        content:
          "The appeal lies in the unexpected. A sofa that echoes the graceful curve of an owl's wing, a chair that captures the noble silhouette of a deer — these pieces invite conversation and contemplation. They transform a living room from a mere collection of furniture into a gallery of personal expression, where each piece tells its own story while contributing to the narrative of the whole.",
      },
      {
        type: "image",
        content: "",
        imageSrc:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
        imageAlt: "Modern living room featuring animal-themed sculptural furniture",
        caption:
          "The living space of a Copenhagen apartment, featuring sculptural pieces from the Autumn Collection",
      },
      {
        type: "paragraph",
        content:
          "What distinguishes these pieces from mere novelty is the rigor of their design. Each curve, each proportion has been considered with the same attention an architect brings to a building. The result is furniture that feels inevitable, as if it could not have been designed any other way — yet also surprising, revealing new details with each encounter.",
      },
      {
        type: "paragraph",
        content:
          "For those considering such pieces for their own spaces, the key is restraint. One or two sculptural elements can anchor a room; too many, and the space becomes a museum rather than a home. The goal is to create moments of discovery — pieces that reveal themselves slowly, that reward the second glance as much as the first.",
      },
    ],
    productTags: [
      {
        id: "pt-1",
        productSlug: "owl-sofa",
        productName: "Owl Sofa",
        colorName: "Snowy White",
        topPercent: 30,
        leftPercent: 25,
      },
      {
        id: "pt-2",
        productSlug: "owl-sofa",
        productName: "Owl Sofa",
        colorName: "Forest Green",
        topPercent: 55,
        leftPercent: 60,
      },
    ],
    relatedSlugs: ["material-matters", "light-and-shadow"],
  },
  {
    slug: "material-matters",
    chapterNumber: "02",
    title: "Material Matters",
    subtitle:
      "Exploring the tactile experience of premium textiles — how texture shapes our perception of comfort and luxury in contemporary living spaces.",
    heroImage:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=80",
    category: "Craft",
    date: "February 2024",
    likes: 256,
    body: [
      {
        type: "paragraph",
        content:
          "Touch is the most intimate of senses. Before we see a fabric, we reach for it — an instinct as old as humanity itself. In the world of furniture design, this instinct drives every decision about material: the weight of a velvet, the resilience of a boucle, the warmth of a leather that ages with grace.",
      },
      {
        type: "paragraph",
        content:
          "At Fuzz Sofa Studio, material selection is never an afterthought. Each textile is chosen not merely for appearance but for the way it transforms over time — how a boucle develops character, how a leather softens to the shape of its owner. These are materials that tell a story, and the story only deepens with use.",
      },
      {
        type: "image",
        content: "",
        imageSrc:
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
        imageAlt: "Close-up of handwoven textile details showing artisan craftsmanship",
        caption:
          "Hand-selected boucle from a family-run mill in Belgium, used across the Owl Sofa collection",
      },
      {
        type: "paragraph",
        content:
          "The difference between good and exceptional furniture lies in these material choices. A velvet that catches light differently at every angle, a leather that develops a patina unique to its owner — these are the details that elevate a piece from furniture to heirloom.",
      },
      {
        type: "paragraph",
        content:
          "We believe that the materials you surround yourself with shape how you feel in a space. A room dressed in textured, natural fabrics invites you to slow down, to touch, to stay a little longer. This is not decoration — it is design that serves the deepest human need: the desire to feel at home.",
      },
    ],
    productTags: [
      {
        id: "pt-3",
        productSlug: "gorilla-sofa",
        productName: "Gorilla Sofa",
        colorName: "Agate Black",
        topPercent: 40,
        leftPercent: 35,
      },
    ],
    relatedSlugs: ["art-of-stillness", "craft-and-heritage"],
  },
  {
    slug: "light-and-shadow",
    chapterNumber: "03",
    title: "Light & Shadow",
    subtitle:
      "The interplay of natural light transforms ordinary spaces into sanctuaries of calm.",
    heroImage:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&q=80",
    category: "Space",
    date: "January 2024",
    likes: 189,
    body: [
      {
        type: "paragraph",
        content:
          "Architecture has long understood what furniture is only beginning to discover: that light is the most powerful design element in any room. A single ray of afternoon sun can transform a simple corner into a meditative retreat, while the cool blue of dusk lends even the most ornate piece a contemplative stillness.",
      },
      {
        type: "paragraph",
        content:
          "When we design sculptural furniture, we design for light. The curves of an owl sofa are not merely decorative — they are calculated to catch and diffuse natural light, creating gentle shadows that shift throughout the day. Each piece becomes a small architecture of light within the larger architecture of the room.",
      },
      {
        type: "image",
        content: "",
        imageSrc:
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
        imageAlt:
          "Minimalist bedroom design with soft natural lighting creating peaceful atmosphere",
        caption:
          "Morning light in a Tokyo residence, where sculptural forms create their own landscape of shadow",
      },
      {
        type: "paragraph",
        content:
          "The lesson for anyone arranging their own space is simple: place your most sculptural pieces where they will interact with changing light. A window-facing sofa becomes a different piece at dawn than at noon, at sunset than at midnight. This dynamism is not a flaw but a feature — furniture that is alive with light is furniture that never grows stale.",
      },
    ],
    productTags: [],
    relatedSlugs: ["art-of-stillness", "craft-and-heritage"],
  },
  {
    slug: "craft-and-heritage",
    chapterNumber: "04",
    title: "Craft & Heritage",
    subtitle:
      "Celebrating the artisans who preserve traditional techniques in modern furniture making.",
    heroImage:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80",
    category: "People",
    date: "December 2023",
    likes: 312,
    body: [
      {
        type: "paragraph",
        content:
          "Behind every sculptural piece from Fuzz Sofa Studio lies a chain of hands — pattern makers, frame builders, upholsterers, finishers — each contributing a layer of craft that machines cannot replicate. In an era of automated production, these artisans represent a living connection to traditions that stretch back centuries.",
      },
      {
        type: "paragraph",
        content:
          "The frame of a single sofa passes through no fewer than eight pairs of hands before it reaches your living room. Each joint is checked, each curve is sanded by feel, each staple is placed with the precision that only decades of practice can produce. This is not nostalgia — it is quality control at the most fundamental level.",
      },
      {
        type: "image",
        content: "",
        imageSrc:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
        imageAlt: "Artisan hands working on furniture details in the workshop",
        caption:
          "Inside the Fuzz Sofa workshop, where traditional joinery meets contemporary design",
      },
      {
        type: "paragraph",
        content:
          "We believe that when you know the story of how something is made, you value it differently. A sofa is no longer just a seat — it is the culmination of skill, patience, and pride. The slight variation in a hand-stitched seam is not imperfection; it is the signature of its maker, as personal as a fingerprint.",
      },
    ],
    productTags: [
      {
        id: "pt-4",
        productSlug: "owl-sofa",
        productName: "Owl Sofa",
        colorName: "Rose Pink",
        topPercent: 45,
        leftPercent: 50,
      },
    ],
    relatedSlugs: ["material-matters", "light-and-shadow"],
  },
];

export const userSpacePosts: UserSpacePost[] = [
  {
    id: "us-1",
    username: "@home_lover",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
    alt: "Scandinavian style living room with white sofa and green plants",
    likes: 128,
  },
  {
    id: "us-2",
    username: "@minimalist_life",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    alt: "Modern minimalist living room with large floor-to-ceiling windows",
    likes: 256,
  },
  {
    id: "us-3",
    username: "@cozy_corner",
    image:
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=600&q=80",
    alt: "Cozy bedroom corner with plush sofa and soft blankets",
    likes: 89,
  },
  {
    id: "us-4",
    username: "@urban_dreamer",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    alt: "Industrial style living room with leather sofa and metal accents",
    likes: 342,
  },
  {
    id: "us-5",
    username: "@book_nook",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    alt: "Sun-filled study room with fabric sofa and bookshelf",
    likes: 167,
  },
  {
    id: "us-6",
    username: "@artful_living",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    alt: "Refined apartment living room with neutral tones and art pieces",
    likes: 201,
  },
];

export function getArticleBySlug(slug: string): MagazineArticle | undefined {
  return magazineArticles.find((a) => a.slug === slug);
}

export function getRelatedArticles(
  slugs: string[]
): MagazineArticle[] {
  return magazineArticles.filter((a) => slugs.includes(a.slug));
}
