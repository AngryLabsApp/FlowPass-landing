<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Hero from "$lib/components/Hero.svelte";
  import Testimonials from "$lib/components/Testimonials.svelte";
  import FeaturesSection from "$lib/components/FeaturesSection.svelte";
  import PricingSection from "$lib/components/PricingSection.svelte";
  import FAQ from "$lib/components/FAQ.svelte";
  import ContactSection from "$lib/components/ContactSection.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import WhatsappBubble from "$components/WhatsappBubble.svelte";
  import { homeSEO } from "$lib/config/seo";
  import { siteConfig } from "$lib/config/site";
  import { buildHomeGraph } from "$lib/seo/schemas";

  // Fecha para Schema.org
  const currentDate = new Date().toISOString().split('T')[0];
  // JSON-LD: se escapa "<" para evitar cerrar el <script> prematuramente.
  // Nota: en Svelte 5 el contenido de <script> no se interpola, por eso se
  // inyecta el tag completo con {@html}.
  const jsonLdString = JSON.stringify(buildHomeGraph(currentDate)).replace(/</g, '\\u003c');
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

  <!-- Schema.org: Organization + WebSite + SoftwareApplication + FAQPage + BreadcrumbList -->
  {@html `<script type="application/ld+json">${jsonLdString}</script>`}
</svelte:head>

<!-- Añadimos el Navbar que faltaba en tu layout original -->
<Navbar />
<Hero />
<hr class="section-divider" />
<FeaturesSection />
<hr class="section-divider" />
<Testimonials />
<hr class="section-divider" />
<PricingSection />
<hr class="section-divider" />
<FAQ />
<hr class="section-divider" />
<ContactSection />
<Footer />
<WhatsappBubble />