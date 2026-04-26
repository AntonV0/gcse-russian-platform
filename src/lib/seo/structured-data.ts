import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  PUBLIC_SITE_NAME,
  getPublicSiteUrl,
} from "@/lib/seo/site";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type RelatedLink = {
  title: string;
  href: string;
};

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: PUBLIC_SITE_NAME,
    url: getPublicSiteUrl().toString(),
    sameAs: ["https://volnaschool.com"],
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: PUBLIC_SITE_NAME,
    url: getPublicSiteUrl().toString(),
    description: DEFAULT_SEO_DESCRIPTION,
    inLanguage: "en-GB",
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getPublicSiteUrl(item.path).toString(),
    })),
  };
}

export function buildCourseJsonLd({
  name = DEFAULT_SEO_TITLE,
  description = DEFAULT_SEO_DESCRIPTION,
  path = "/gcse-russian-course",
}: {
  name?: string;
  description?: string;
  path?: string;
} = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: getPublicSiteUrl(path).toString(),
    provider: {
      "@type": "Organization",
      name: PUBLIC_SITE_NAME,
      url: getPublicSiteUrl().toString(),
    },
    educationalLevel: "GCSE",
    teaches: [
      "Pearson Edexcel GCSE Russian",
      "GCSE Russian grammar",
      "GCSE Russian vocabulary",
      "GCSE Russian exam preparation",
    ],
    inLanguage: "en-GB",
  };
}

export function buildLearningResourceJsonLd({
  name,
  description,
  path,
  keywords = [],
  relatedLinks = [],
}: {
  name: string;
  description: string;
  path: string;
  keywords?: string[];
  relatedLinks?: RelatedLink[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name,
    description,
    url: getPublicSiteUrl(path).toString(),
    provider: {
      "@type": "Organization",
      name: PUBLIC_SITE_NAME,
      url: getPublicSiteUrl().toString(),
    },
    educationalLevel: "GCSE",
    learningResourceType: "Guide",
    inLanguage: "en-GB",
    about: keywords,
    isPartOf: relatedLinks.map((link) => ({
      "@type": "WebPage",
      name: link.title,
      url: getPublicSiteUrl(link.href).toString(),
    })),
  };
}

export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildProductOfferJsonLd({
  name,
  description,
  path,
  offers,
}: {
  name: string;
  description: string;
  path: string;
  offers: {
    name: string;
    price: number;
    priceCurrency?: string;
    availability?: string;
  }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url: getPublicSiteUrl(path).toString(),
    brand: {
      "@type": "Organization",
      name: PUBLIC_SITE_NAME,
      url: getPublicSiteUrl().toString(),
    },
    category: "Online GCSE course",
    offers: offers.map((offer) => ({
      "@type": "Offer",
      name: offer.name,
      price: offer.price,
      priceCurrency: offer.priceCurrency ?? "GBP",
      availability: offer.availability ?? "https://schema.org/InStock",
      url: getPublicSiteUrl(path).toString(),
    })),
  };
}
