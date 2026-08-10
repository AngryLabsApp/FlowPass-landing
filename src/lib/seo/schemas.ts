// src/lib/seo/schemas.ts
// Constructor del grafo JSON-LD (Schema.org) del sitio.
// Compone Organization + WebSite + SoftwareApplication + FAQPage + BreadcrumbList
// con referencias cruzadas vía `@id` para que motores de búsqueda y LLMs
// entiendan la relación entre la empresa, el producto y el sitio.

import { siteConfig } from "$lib/config/site";
import { homeSEO } from "$lib/config/seo";
import { faqMainEntity } from "$lib/seo/faqSchema";
import { plans } from "$lib/data/pricingData.js";

// ─── IDs canónicos (permiten referenciar entidades entre schemas) ─
const ORG_ID = `${siteConfig.url}/#organization`;
const SITE_ID = `${siteConfig.url}/#website`;
const SOFTWARE_ID = `${siteConfig.url}/#software`;

// ─── Organization ────────────────────────────────────────────────
function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/logo.png`
    },
    email: siteConfig.email,
    telephone: `+${siteConfig.phone}`,
    foundingDate: String(siteConfig.foundingYear),
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.location.country,
      addressLocality: "Lima",
      addressRegion: "Lima"
    },
    areaServed: [
      { "@type": "Country", name: "Perú" },
      { "@type": "Country", name: "México" },
      { "@type": "Country", name: "Colombia" },
      { "@type": "Country", name: "Chile" },
      { "@type": "Country", name: "Argentina" },
      { "@type": "Country", name: "Ecuador" },
      { "@type": "Country", name: "Bolivia" }
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${siteConfig.phone}`,
      contactType: "customer service",
      email: siteConfig.email,
      areaServed: ["PE", "MX", "CO", "CL", "AR", "EC", "BO"],
      availableLanguage: ["Spanish"]
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.social.tiktok
    ]
  };
}

// ─── WebSite ────────────────────────────────────────────────────
function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: homeSEO.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "es"
  };
}

// ─── Offers a partir de los planes reales (moneda PEN, mercado base) ─
function offersFromPlans() {
  const priceableOffers = plans
    .filter((p: any) => !p.quoteBased && p.prices)
    .map((p: any) => ({
      "@type": "Offer",
      name: p.name,
      description: p.tagline,
      category: p.activeStudents,
      price: String(p.prices.mensual.PE),
      priceCurrency: "PEN",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(p.prices.mensual.PE),
        priceCurrency: "PEN",
        billingIncrement: 1,
        unitCode: "MON",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: "MON"
        }
      },
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/#pricing`,
      eligibleRegion: [
        { "@type": "Country", name: "Perú" },
        { "@type": "Country", name: "México" }
      ]
    }));

  const numeric = priceableOffers.map((o) => Number(o.price));
  return {
    aggregate: {
      "@type": "AggregateOffer",
      priceCurrency: "PEN",
      lowPrice: String(Math.min(...numeric)),
      highPrice: String(Math.max(...numeric)),
      offerCount: String(priceableOffers.length),
      offers: priceableOffers,
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/#pricing`
    }
  };
}

// ─── SoftwareApplication ────────────────────────────────────────
function softwareApplicationSchema(currentDate: string) {
  const { aggregate } = offersFromPlans();

  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "MembershipManagementSoftware",
    operatingSystem: "Web",
    description: homeSEO.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    image: homeSEO.image,
    screenshot: `${siteConfig.url}/screenshots/dashboard.jpg`,
    softwareVersion: "1.0",
    releaseNotes: `${siteConfig.url}/actualizaciones`,
    downloadUrl: siteConfig.url,
    installUrl: siteConfig.url,
    featureList: [
      "Gestión de alumnos y clientes",
      "Control de asistencia con QR",
      "Cobros y facturación",
      "Recordatorios automáticos por WhatsApp (API oficial Meta)",
      "Multi-sede en un solo panel",
      "Ventas, ingresos, gastos e inventario",
      "Reportes y estadísticas descargables",
      "Accesos ilimitados para el equipo",
      "Flowy — asistente de IA propio (beta)"
    ].join(", "),
    permissions: "online",
    memoryRequirements: "Navegador web moderno",
    processorRequirements: "Navegador web moderno",
    softwareHelp: {
      "@type": "CreativeWork",
      url: `${siteConfig.url}/#faq`
    },
    isAccessibleForFree: false,
    offers: aggregate,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "24",
      bestRating: "5",
      worstRating: "1"
    },
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5"
      },
      author: {
        "@type": "Organization",
        name: "Academia de Danza Ritmo"
      },
      reviewBody:
        "FlowPass nos ha ayudado a organizar todos nuestros alumnos y pagos. El soporte es excelente."
    },
    publisher: { "@id": ORG_ID },
    author: { "@id": ORG_ID },
    provider: { "@id": ORG_ID },
    datePublished: "2024-01-15",
    dateModified: currentDate,
    inLanguage: "es"
  };
}

// ─── FAQPage ────────────────────────────────────────────────────
function faqPageSchema() {
  return {
    "@type": "FAQPage",
    "@id": `${siteConfig.url}/#faq`,
    mainEntity: faqMainEntity,
    inLanguage: "es",
    isPartOf: { "@id": SITE_ID }
  };
}

// ─── BreadcrumbList ─────────────────────────────────────────────
function breadcrumbSchema() {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: siteConfig.url
      }
    ]
  };
}

// ─── Grafo completo ─────────────────────────────────────────────
export function buildHomeGraph(currentDate: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema(),
      websiteSchema(),
      softwareApplicationSchema(currentDate),
      faqPageSchema(),
      breadcrumbSchema()
    ]
  };
}
