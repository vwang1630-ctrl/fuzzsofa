import type { Product } from "./products";
import type { JournalArticle } from "./journal";

const SITE_URL = "https://fuzzsofa.com";
const SITE_NAME = "Fuzz Sofa Studio";

export function productJsonLd(product: Product) {
  // Custom data for Owl Chair
  const isOwlChair = product.slug === "owl-sofa";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: isOwlChair ? "Owl Chair" : product.name,
    description: isOwlChair
      ? "A sculptural reading chair inspired by the magic of Hogwarts. Features a 180° wraparound wing backrest, solid wood frame, and premium upholstery. Available in four magical colorways."
      : product.metaDescription,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    sku: isOwlChair ? "OWL-CHAIR-01" : undefined,
    manufacturer: {
      "@type": "Manufacturer",
      name: SITE_NAME,
    },
    category: isOwlChair ? "Sculptural Reading Chair" : "Sculptural Furniture / Contemporary Sofa",
    material: isOwlChair
      ? ["Galvanized steel tube frame", "Powder-coated finish", "High-density foam core", "Leather upholstery", "Plush fabric upholstery", "Linen fabric upholstery", "Velvet fabric upholstery"]
      : (Array.isArray(product.materials) ? product.materials : [product.materials]),
    width: isOwlChair ? "86 cm" : undefined,
    depth: isOwlChair ? "82 cm" : undefined,
    height: isOwlChair ? "76 cm" : undefined,
    weight: isOwlChair ? "60 kg" : undefined,
    additionalProperty: isOwlChair ? [
      { "@type": "PropertyValue", name: "Design", value: "180° wraparound wing backrest" },
      { "@type": "PropertyValue", name: "Style", value: "Sculptural reading chair" },
      { "@type": "PropertyValue", name: "design inspiration", value: "Harry Potter magic, owl symbolism, Hogwarts library atmosphere" },
      { "@type": "PropertyValue", name: "vibe keywords", value: "magical reading corner, cozy nook, mysterious library, gothic academia" },
      { "@type": "PropertyValue", name: "recommended spaces", value: "private library, magical reading nook, boutique hotel suite, cozy bedroom corner" },
    ] : product.slug === "meteorite-ring-sofa" ? [
      { "@type": "PropertyValue", name: "Design", value: "360-degree conversation sofa" },
      { "@type": "PropertyValue", name: "Style", value: "Sculptural furniture" },
    ] : undefined,
    productionMode: "MadeToOrder",
    customizable: true,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: isOwlChair ? "4800" : product.priceRange.americas[0],
      availability: isOwlChair ? "https://schema.org/MadeToOrder" : "https://schema.org/PreOrder",
      url: isOwlChair ? `${SITE_URL}/m/product/owl-sofa` : `${SITE_URL}/${product.slug}`,
      description: "Made-to-order production only. Each piece is individually produced after order confirmation.",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "*",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 7,
            maxValue: 14,
            unitCode: "DAY",
            description: "Production time: 1–2 weeks. Each piece is individually produced after order confirmation.",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 7,
            maxValue: 21,
            unitCode: "DAY",
          },
        },
      },
    },
    image: isOwlChair
      ? [
          `${SITE_URL}/products/owl/owl-1.jpg`,
          `${SITE_URL}/products/owl/owl-2.jpg`,
          `${SITE_URL}/products/owl/owl-3.jpg`,
          `${SITE_URL}/products/owl/owl-4.jpg`,
          `${SITE_URL}/products/owl/owl-5.jpg`,
          `${SITE_URL}/products/owl/owl-6.jpg`,
          `${SITE_URL}/products/owl/owl-7.jpg`,
        ]
      : `${SITE_URL}/${product.slug}.jpg`,
    url: `${SITE_URL}/${product.slug}`,
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleJsonLd(article: JournalArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/journal/${article.slug}`,
    },
    url: `${SITE_URL}/journal/${article.slug}`,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "A made-to-order sculptural furniture studio specializing in contemporary sofas designed and produced individually through a studio-based system.",
    foundingDate: "2015",
    areaServed: "Worldwide",
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    knowsAbout: [
      "Sculptural Sofa",
      "Custom Furniture",
      "Made-to-order Production",
      "Studio Furniture Design",
      "Magical Reading Chair",
    ],
    sameAs: [
      "https://www.pinterest.com/fuzzsofa",
      "https://www.instagram.com/fuzzsofa",
      "https://www.facebook.com/fuzzsofa",
      "https://www.youtube.com/@fuzzsofa",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en",
  };
}

export function featuredCollectionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Fuzz Sofa Studio Featured Collection",
    description: "Sculptural furniture collection including the signature Owl Chair, Gorilla Sofa, Meteorite Ring Sofa, and Muscle Gorilla Sofa.",
    numberOfItems: 5,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Owl Chair",
        url: `${SITE_URL}/owl-sofa`,
        description: "Sculptural reading chair with 180° wraparound wing backrest, inspired by the quiet wisdom of owls."
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gorilla Sofa",
        url: `${SITE_URL}/gorilla-sofa`,
        description: "Sculptural circular sofa inspired by the gentle strength of gorillas."
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Meteorite Ring Sofa",
        url: `${SITE_URL}/meteorite-ring-sofa`,
        description: "360-degree conversation sofa with organic cosmic form."
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Silverback Sofa",
        url: `${SITE_URL}/silverback-sofa`,
        description: "Sculptural sofa inspired by the majestic silverback gorilla."
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Muscle Gorilla Sofa",
        url: `${SITE_URL}/muscle-gorilla-sofa`,
        description: "Bold sculptural sofa celebrating raw power and form."
      }
    ]
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemPageJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "@id": `${SITE_URL}/${product.slug}`,
    name: product.name,
    description: product.metaDescription,
    url: `${SITE_URL}/${product.slug}`,
    inLanguage: "en",
    mainEntity: {
      "@type": "Product",
      name: product.name,
      description: product.metaDescription,
      brand: {
        "@type": "Brand",
        name: SITE_NAME,
      },
      category: "Sculptural Furniture / Contemporary Sofa",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: product.name,
          item: `${SITE_URL}/${product.slug}`,
        },
      ],
    },
  };
}

export function imageObjectJsonLd(url: string, caption: string, width = 1200, height = 800) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: url,
    caption,
    width,
    height,
  };
}

export function spaceImagesJsonLd(product: Product, spaceImages: { image: string; titleKey?: string; title?: string; descKey: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: spaceImages.map((space, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "ImageObject",
        name: `${product.name} in ${space.titleKey || space.title || "Interior Space"}`,
        description: space.descKey,
        contentUrl: `${SITE_URL}${space.image}`,
        about: {
          "@type": "Product",
          name: product.name,
          description: product.metaDescription,
        },
      },
    })),
  };
}
