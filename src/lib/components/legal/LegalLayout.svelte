<script lang="ts">
  import type { Snippet } from "svelte";
  import { siteConfig } from "$lib/config/site";
  import type { SEOPage } from "$lib/config/seo";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  /**
   * Estructura común de las páginas legales (términos para academias, términos
   * para alumnos, privacidad): encabezado, índice lateral y contenido.
   * Los estilos del contenido van con :global porque el texto lo escribe cada
   * página y llega como snippet.
   */
  type Section = { id: string; num: string; title: string };

  let {
    seo,
    path,
    eyebrow = "Legal",
    title,
    titleGrad,
    subtitle,
    lastUpdate,
    lastUpdateISO,
    sections,
    children,
  }: {
    seo: SEOPage;
    path: string;
    eyebrow?: string;
    title: string;
    titleGrad: string;
    subtitle?: string;
    lastUpdate: string;
    lastUpdateISO: string;
    sections: Section[];
    children: Snippet;
  } = $props();

  const url = $derived(`${siteConfig.url}${path}`);
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
  <meta name="keywords" content={seo.keywords} />

  <link rel="canonical" href={url} />

  <meta property="og:title" content={seo.title} />
  <meta property="og:description" content={seo.description} />
  <meta property="og:url" content={url} />
  <meta property="og:type" content="website" />

  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    url,
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
    dateModified: lastUpdateISO,
  })}</script>`}
</svelte:head>

<Navbar />

<main class="terms-page">
  <header class="terms-header">
    <span class="terms-eyebrow">{eyebrow}</span>
    <h1 class="terms-h1 font-epoch">
      {title} <span class="grad">{titleGrad}</span>
    </h1>
    {#if subtitle}
      <p class="terms-subtitle">{subtitle}</p>
    {/if}
    <p class="terms-meta">
      Última actualización: <time datetime={lastUpdateISO}>{lastUpdate}</time>
    </p>
  </header>

  <div class="terms-layout">
    <aside class="terms-toc" aria-label="Tabla de contenidos">
      <p class="toc-title">En esta página</p>
      <ol class="toc-list">
        {#each sections as s}
          <li>
            <a href={`#${s.id}`}>
              <span class="toc-num">{s.num}.</span>
              <span>{s.title}</span>
            </a>
          </li>
        {/each}
      </ol>
    </aside>

    <article class="terms-content">
      {@render children()}

      <p class="back-home">
        <a href="/">← Volver al inicio</a>
      </p>
    </article>
  </div>
</main>

<Footer />

<style>
  .terms-page {
    color: #fff;
    padding: 6rem 1.25rem 3rem;
    min-height: 100vh;
  }
  @media (min-width: 768px) {
    .terms-page { padding: 8rem 1.5rem 5rem; }
  }

  /* Header */
  .terms-header {
    max-width: 760px;
    margin: 0 auto 3rem;
    text-align: center;
  }
  .terms-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.05);
    border: 0.5px solid rgba(255,255,255,0.1);
    margin-bottom: 1rem;
  }
  .terms-eyebrow::before {
    content: "";
    width: 6px; height: 6px;
    border-radius: 999px;
    background: #01f59e;
  }
  .terms-h1 {
    font-size: clamp(2.25rem, 6vw, 3.5rem);
    line-height: 1.1;
    color: #fff;
    margin: 0 0 0.75rem;
    letter-spacing: -0.01em;
  }
  .terms-h1 .grad {
    background: linear-gradient(90deg, #01f59e, #3168F4 60%, #531DD8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .terms-subtitle {
    color: rgba(255,255,255,0.7);
    font-size: 1rem;
    line-height: 1.6;
    margin: 0 0 0.75rem;
  }
  .terms-meta {
    color: rgba(255,255,255,0.45);
    font-size: 0.9rem;
    margin: 0;
  }

  /* Layout: TOC + content */
  .terms-layout {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  @media (min-width: 1024px) {
    .terms-layout {
      grid-template-columns: 240px 1fr;
      gap: 3rem;
      align-items: start;
    }
  }

  /* TOC */
  .terms-toc {
    display: none;
  }
  @media (min-width: 1024px) {
    .terms-toc {
      display: block;
      position: sticky;
      top: 6rem;
      padding: 1.25rem;
      background: rgba(255,255,255,0.04);
      border: 0.5px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      max-height: calc(100vh - 8rem);
      overflow-y: auto;
    }
  }
  .toc-title {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    margin: 0 0 0.75rem;
  }
  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .toc-list a {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    padding: 0.35rem 0.5rem;
    border-radius: 8px;
    color: rgba(255,255,255,0.6);
    font-size: 0.85rem;
    line-height: 1.4;
    text-decoration: none;
    transition: color 0.2s, background 0.2s;
  }
  .toc-list a:hover {
    color: #01f59e;
    background: rgba(1,245,158,0.06);
  }
  .toc-num {
    color: rgba(255,255,255,0.35);
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
    min-width: 1.25rem;
  }

  /* Content — el texto llega como snippet, por eso :global */
  .terms-content {
    background: rgba(255,255,255,0.03);
    border: 0.5px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 1.75rem 1.25rem;
  }
  @media (min-width: 768px) {
    .terms-content { padding: 3rem 3rem; }
  }
  .terms-content :global(section) {
    padding: 1.5rem 0;
    border-bottom: 0.5px solid rgba(255,255,255,0.06);
    scroll-margin-top: 6rem;
  }
  .terms-content :global(section:first-child) { padding-top: 0; }
  .terms-content :global(section:last-of-type) { border-bottom: 0; }

  .terms-content :global(.terms-h2) {
    font-size: 1.375rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    margin: 0 0 1rem;
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  @media (min-width: 768px) {
    .terms-content :global(.terms-h2) { font-size: 1.625rem; }
  }
  .terms-content :global(.terms-h2 .num) {
    font-size: 0.85rem;
    font-weight: 600;
    color: #01f59e;
    background: rgba(1,245,158,0.1);
    border: 0.5px solid rgba(1,245,158,0.25);
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    letter-spacing: 0.05em;
    font-family: 'OktahNeue', 'Inter', sans-serif;
    line-height: 1;
  }
  .terms-content :global(h3) {
    font-size: 1.05rem;
    font-weight: 600;
    color: #fff;
    margin: 1.25rem 0 0.5rem;
  }

  .terms-content :global(p) {
    color: rgba(255,255,255,0.7);
    font-size: 0.95rem;
    line-height: 1.75;
    margin: 0 0 0.85rem;
  }
  .terms-content :global(p:last-child) { margin-bottom: 0; }
  .terms-content :global(strong) { color: #fff; font-weight: 600; }
  .terms-content :global(p a),
  .terms-content :global(li a) {
    color: #01f59e;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .terms-content :global(.terms-list) {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }
  .terms-content :global(.terms-list li) {
    position: relative;
    padding-left: 1.4rem;
    color: rgba(255,255,255,0.7);
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .terms-content :global(.terms-list li::before) {
    content: "→";
    position: absolute;
    left: 0;
    color: #01f59e;
    font-weight: 700;
  }

  .terms-content :global(.callout) {
    background: rgba(1,245,158,0.06);
    border: 0.5px solid rgba(1,245,158,0.25);
    border-left: 3px solid #01f59e;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    margin: 0 0 1rem;
    color: #fff;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .terms-content :global(.contact-block) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
    font-style: normal;
  }
  .terms-content :global(.contact-row) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.85rem 1rem;
    min-height: 44px;
    background: rgba(255,255,255,0.03);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    color: #fff;
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .terms-content :global(.contact-row:not(.static):hover) {
    border-color: rgba(1,245,158,0.3);
    background: rgba(1,245,158,0.05);
  }
  .terms-content :global(.contact-label) {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.45);
  }
  .terms-content :global(.contact-value) {
    font-size: 0.95rem;
    color: #fff;
    text-align: right;
    word-break: break-all;
  }

  .back-home {
    margin: 2rem 0 0;
    font-size: 0.9rem;
  }
  .back-home a {
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    transition: color 0.2s;
  }
  .back-home a:hover { color: #01f59e; }
</style>
