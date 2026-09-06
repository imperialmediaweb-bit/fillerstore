// Tot ce ține de vizibilitatea în Google: metadatele paginilor și datele
// structurate (schema.org). Datele structurate sunt cele care aduc în
// rezultate prețul, stocul, stelele și firimiturile de navigație.

import { siteConfig, absoluteUrl } from "@/lib/site";
import { stripHtml, formatPrice } from "@/lib/content";
import { img } from "@/lib/img";

const clamp = (text = "", max = 158) => {
  const t = stripHtml(text);
  if (t.length <= max) return t;
  return t.slice(0, t.lastIndexOf(" ", max)).trimEnd() + "…";
};

/**
 * Metadatele unei pagini, în forma cerută de Next.
 * Acoperă titlu, descriere, canonical, Open Graph și Twitter dintr-un loc.
 */
export function pageMeta({ title, description, path = "/", image, type = "website", publishedTime, modifiedTime, noIndex = false } = {}) {
  const url = absoluteUrl(path);
  const desc = clamp(description || siteConfig.description);
  const ogImage = image ? img(image, { w: 1200, h: 630, fit: "cover", dpr: 1 }) : absoluteUrl("/og.png");

  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: title ? `${title} — ${siteConfig.name}` : siteConfig.name,
      description: desc,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title || siteConfig.name }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title || siteConfig.name,
      description: desc,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

// ---------- date structurate ----------

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: siteConfig.name,
    legalName: siteConfig.company.legalName,
    url: siteConfig.url,
    description: siteConfig.description,
    taxID: siteConfig.company.cui,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.company.address.street,
      addressRegion: siteConfig.company.address.region,
      addressCountry: siteConfig.company.address.country,
    },
    areaServed: { "@type": "Country", name: "România" },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "ro-RO",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: absoluteUrl("/produse?q={search_term_string}") },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function productLd(product) {
  if (!product) return null;
  const url = absoluteUrl(`/produse/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: clamp(product.shortDescription || product.description, 300),
    url,
    image: (product.images || []).slice(0, 4).map((i) => img(i.src, { w: 1200, dpr: 1 })),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.categories?.length ? { category: product.categories[0].name || product.categories[0] } : {}),
    ...(product.price != null && {
      offers: {
        "@type": "Offer",
        url,
        price: product.price.toFixed(2),
        priceCurrency: product.currency || "RON",
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: siteConfig.name },
      },
    }),
    ...(product.rating && product.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };
}

export function itemListLd(products = [], path = "/produse") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: absoluteUrl(path),
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/produse/${p.slug}`),
      name: p.name,
    })),
  };
}

export function faqLd(faq = []) {
  if (!faq.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function articleLd(post) {
  if (!post) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: clamp(post.excerpt || post.content),
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.date,
    dateModified: post.modified || post.date,
    inLanguage: "ro-RO",
    ...(post.image ? { image: [img(post.image.src, { w: 1200, dpr: 1 })] } : {}),
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
  };
}

// Etichetă gata de pus în pagină: <JsonLd data={productLd(product)} />
export function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
