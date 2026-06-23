import type { Product } from "./products";
import type { JournalArticle } from "./journal";

const SITE_URL = "https://fuzzsofa.com";
const SITE_NAME = "Fuzz Sofa";

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
      address: {
        "@type": "PostalAddress",
        addressLocality: "Shanghai",
        addressCountry: "CN",
      },
    },
    category: "Sculptural Furniture",
    material: product.materials.join(", "),
    offers: {
      "@type": "AggregateOffer",
      lowPrice: product.priceRange.americas[0],
      highPrice: product.priceRange.americas[1],
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
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
            minValue: 56,
            maxValue: 84,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 7,
            maxValue: 14,
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
    logo: `${SITE_URL}/logo.png`,
    description: "Sculptural Furniture Inspired by Nature. Made to order in Shanghai, shipped worldwide.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Shanghai",
      addressCountry: "CN",
    },
    sameAs: [
      "https://instagram.com/fuzzsofa",
      "https://facebook.com/fuzzsofa",
      "https://tiktok.com/@fuzzsofa",
      "https://pinterest.com/fuzzsofa",
      "https://youtube.com/@fuzzsofa",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
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
