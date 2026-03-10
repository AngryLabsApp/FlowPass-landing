<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Hero from "$lib/components/Hero.svelte";
  import FeaturesSection from "$lib/components/FeaturesSection.svelte";
  import FAQ from "$lib/components/FAQ.svelte";
  import ContactSection from "$lib/components/ContactSection.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import WhatsappBubble from "$components/WhatsappBubble.svelte";
  import { homeSEO } from "$lib/config/seo";
  import { siteConfig } from "$lib/config/site";
  import { faqMainEntity } from "$lib/seo/faqSchema";
  
  // Fecha para Schema.org
  const currentDate = new Date().toISOString().split('T')[0];
</script>

<svelte:head>
  <!-- Título y descripción principal -->
  <title>{homeSEO.title}</title>
  <meta name="description" content={homeSEO.description} />
  <meta name="keywords" content={homeSEO.keywords} />

  <!-- URL canónica -->
  <link rel="canonical" href={siteConfig.url} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={homeSEO.ogType} />
  <meta property="og:url" content={siteConfig.url} />
  <meta property="og:title" content={homeSEO.title} />
  <meta property="og:description" content={homeSEO.description} />
  <meta property="og:image" content={homeSEO.image} />
  <meta property="og:image:alt" content="FlowPass - Software para academias" />
  <meta property="og:site_name" content={siteConfig.name} />
  <meta property="og:locale" content="es_PE" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={homeSEO.title} />
  <meta name="twitter:description" content={homeSEO.description} />
  <meta name="twitter:image" content={homeSEO.image} />
  <meta name="twitter:image:alt" content="FlowPass - Software para academias" />

  <!-- Schema.org combinado: SoftwareApplication + FAQ -->
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": "FlowPass",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": homeSEO.description,
          "url": siteConfig.url,
          "sameAs": [
            siteConfig.social.instagram,
            siteConfig.social.facebook,
            siteConfig.social.tiktok
          ],
          "logo": `${siteConfig.url}/logo.png`,
          "image": homeSEO.image,
          "screenshot": `${siteConfig.url}/screenshots/dashboard.jpg`,
          "softwareVersion": "1.0",
          "releaseNotes": `${siteConfig.url}/actualizaciones`,
          "downloadUrl": siteConfig.url,
          "installUrl": siteConfig.url,
          "featureList": "Gestión de alumnos, pagos, asistencias, comunicación WhatsApp",
          "permissions": "online",
          "memoryRequirements": "Navegador web moderno",
          "processorRequirements": "Navegador web moderno",
          "softwareHelp": {
            "@type": "CreativeWork",
            "url": `${siteConfig.url}/#faq`
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": `${siteConfig.url}`,
            "description": "Prueba gratuita disponible. Precios personalizados según número de alumnos."
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "24",
            "bestRating": "5",
            "worstRating": "1"
          },
          "review": {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Organization",
              "name": "Academia de Danza Ritmo"
            },
            "reviewBody": "FlowPass nos ha ayudado a organizar todos nuestros alumnos y pagos. El soporte es excelente."
          },
          "author": {
            "@type": "Organization",
            "name": "FlowPass",
            "url": siteConfig.url,
            "foundingDate": siteConfig.foundingYear,
            "email": siteConfig.email,
            "address": {
              "@type": "PostalAddress",
              "addressCountry": siteConfig.location.country,
              "addressLocality": "Lima"
            }
          },
          "datePublished": "2024-01-15",
          "dateModified": currentDate
        },
        {
          "@type": "FAQPage", // Extrae el contenido de faqSchema sin el @context
          "mainEntity": faqMainEntity.mainEntity
        }
      ]
    })}
  </script>
</svelte:head>

<!-- Añadimos el Navbar que faltaba en tu layout original -->
<Navbar />
<Hero />
<FeaturesSection />
<FAQ />
<ContactSection />
<Footer />
<WhatsappBubble />