import type { Product } from "./products";
import type { JournalArticle } from "./journal";

const SITE_URL = "https://fuzzsofa.com";
const SITE_NAME = "Fuzz Sofa Studio";

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    manufacturer: {
      "@type": "Organization",
      name: SITE_NAME,
      description: "A made-to-order sculptural furniture studio",
      address: {
        "@type": "PostalAddress",
        addressCountry: "CN",
      },
    },
    category: "Sculptural Furniture / Contemporary Sofa",
    material: Array.isArray(product.materials) ? product.materials : [product.materials],
    additionalProperty: product.slug === "meteorite-ring-sofa" ? [
      { "@type": "PropertyValue", name: "Design", value: "360-degree conversation sofa" },
      { "@type": "PropertyValue", name: "Style", value: "Sculptural furniture" },
    ] : undefined,
    productionMode: "MadeToOrder",
    customizable: true,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: product.priceRange.americas[0],
      highPrice: product.priceRange.americas[1],
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
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
    image: `${SITE_URL}/${product.slug}.jpg`,
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
