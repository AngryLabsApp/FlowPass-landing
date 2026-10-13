<!-- src/routes/+page.svelte -->
<script lang="ts">
  import "$lib/components/home/home.css";
  import HomeHero from "$lib/components/home/HomeHero.svelte";
  import HomeIntro from "$lib/components/home/HomeIntro.svelte";
  import BeforeAfter from "$lib/components/home/BeforeAfter.svelte";
  import PlatformTabs from "$lib/components/home/PlatformTabs.svelte";
  import StudentPortal from "$lib/components/home/StudentPortal.svelte";
  import Testimonials from "$lib/components/Testimonials.svelte";
  import HomePricing from "$lib/components/home/HomePricing.svelte";
  import HomeSteps from "$lib/components/home/HomeSteps.svelte";
  import HomeTeam from "$lib/components/home/HomeTeam.svelte";
  import HomeSecurity from "$lib/components/home/HomeSecurity.svelte";
  import HomeFAQ from "$lib/components/home/HomeFAQ.svelte";
  import HomeClose from "$lib/components/home/HomeClose.svelte";
  import Footer from "$lib/components/Footer.svelte";
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
  <meta property="og:locale:alternate" content="es_MX" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={homeSEO.title} />
  <meta name="twitter:description" content={homeSEO.description} />
  <meta name="twitter:image" content={homeSEO.image} />
  <meta name="twitter:image:alt" content="FlowPass - Software para academias" />

  <!-- Schema.org: Organization + WebSite + SoftwareApplication + FAQPage + BreadcrumbList -->
  {@html `<script type="application/ld+json">${jsonLdString}</script>`}
</svelte:head>

<!-- El Navbar vive en +layout.svelte -->
<div class="home">
  <!-- Orden: ¿es para mí? → prueba (cifras) → problema → solución → portal
       → testimonios → equipo → cómo empezar → precio → seguridad → dudas → acción -->
  <HomeHero />
  <HomeIntro />
  <BeforeAfter />
  <PlatformTabs />
  <StudentPortal />
  <Testimonials />
  <HomeTeam />
  <HomeSteps />
  <HomePricing />
  <HomeSecurity />
  <HomeFAQ />
  <HomeClose />
</div>
<Footer />
<WhatsappBubble />
