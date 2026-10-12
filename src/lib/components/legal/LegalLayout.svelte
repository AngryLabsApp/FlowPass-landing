<script lang="ts">
  import type { Snippet } from "svelte";
  import { siteConfig } from "$lib/config/site";
  import type { SEOPage } from "$lib/config/seo";
  import Footer from "$lib/components/Footer.svelte";
  import "$lib/components/home/home.css";

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

<!-- El Navbar vive en +layout.svelte -->

<main class="home terms-page">
  <header class="terms-header">
    <span class="terms-eyebrow">{eyebrow}</span>
    <h1 class="terms-h1">
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
  /* Mismo lenguaje que la home: tokens de home.css (claro/oscuro), texto a la izquierda, sin degradados. */
  .terms-page { padding-block: 120px 64px; min-height: 100vh; }

  .terms-header { max-width: 1100px; margin: 0 auto 40px; }
  .terms-eyebrow {
    display: block;
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--accent-text);
    margin-bottom: 14px;
  }
  .terms-h1 { font-size: clamp(32px, 5vw, 56px); max-width: 18ch; }
  .terms-h1 .grad { color: var(--accent-text); }
  .terms-subtitle { color: var(--fg-2); font-size: 17px; margin-top: 16px !important; max-width: 52ch; }
  .terms-meta { color: var(--fg-3); font-size: 13px; margin-top: 8px !important; }

  .terms-layout { max-width: 1100px; margin: 0 auto; display: grid; gap: 32px; }
  @media (min-width: 1024px) {
    .terms-layout { grid-template-columns: 240px minmax(0, 1fr); gap: 48px; align-items: start; }
  }

  .terms-toc { display: none; }
  @media (min-width: 1024px) {
    .terms-toc {
      display: block;
      position: sticky;
      top: 104px;
      max-height: calc(100vh - 128px);
      overflow-y: auto;
      padding-right: 8px;
    }
  }
  .toc-title { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-3); margin-bottom: 10px !important; }
  .toc-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 2px; border-left: 1px solid var(--line); }
  .toc-list a {
    display: flex;
    gap: 8px;
    padding: 6px 12px;
    margin-left: -1px;
    border-left: 2px solid transparent;
    color: var(--fg-2);
    font-size: 13.5px;
    line-height: 1.4;
    text-decoration: none;
  }
  .toc-list a:hover { color: var(--fg); border-left-color: var(--accent); }
  .toc-num { color: var(--fg-3); font-variant-numeric: tabular-nums; flex: none; min-width: 18px; }

  /* Contenido: el texto llega como snippet, por eso :global */
  .terms-content { max-width: 720px; }
  .terms-content :global(section) { padding: 28px 0; border-bottom: 1px solid var(--line); scroll-margin-top: 96px; }
  .terms-content :global(section:first-child) { padding-top: 0; }
  .terms-content :global(section:last-of-type) { border-bottom: 0; }
  .terms-content :global(.terms-h2) { font-size: clamp(20px, 2.4vw, 26px); margin-bottom: 14px; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
  .terms-content :global(.terms-h2 .num) { font: 600 13px var(--body); color: var(--accent-text); letter-spacing: 0.04em; }
  .terms-content :global(h3) { font-size: 17px; margin: 20px 0 8px; }
  .terms-content :global(p) { color: var(--fg-2); font-size: 15.5px; line-height: 1.7; margin: 0 0 12px; }
  .terms-content :global(p:last-child) { margin-bottom: 0; }
  .terms-content :global(strong) { color: var(--fg); font-weight: 600; }
  .terms-content :global(p a),
  .terms-content :global(li a) { color: var(--accent-text); text-decoration: underline; text-underline-offset: 2px; }
  .terms-content :global(.terms-list) { list-style: none; padding: 0; margin: 8px 0 12px; display: grid; gap: 8px; }
  .terms-content :global(.terms-list li) { position: relative; padding-left: 22px; color: var(--fg-2); font-size: 15.5px; line-height: 1.6; }
  .terms-content :global(.terms-list li::before) { content: '✓'; position: absolute; left: 0; color: var(--accent-text); font-weight: 700; }
  /* Lista de pasos: número en vez de check */
  .terms-content :global(ol.terms-list) { counter-reset: paso; }
  .terms-content :global(ol.terms-list li) { counter-increment: paso; }
  .terms-content :global(ol.terms-list li::before) { content: counter(paso) '.'; }
  .terms-content :global(.callout) {
    background: var(--bg-2);
    border: 1px solid var(--line);
    border-left: 3px solid var(--accent);
    border-radius: 12px;
    padding: 14px 18px;
    margin: 0 0 14px;
    color: var(--fg);
    font-size: 15px;
    line-height: 1.6;
  }
  .terms-content :global(.contact-block) { display: grid; gap: 8px; margin-top: 14px; font-style: normal; }
  .terms-content :global(.contact-row) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 16px;
    min-height: 44px;
    background: var(--panel);
    border: 1px solid var(--line);
    border-radius: 12px;
    color: var(--fg);
    text-decoration: none;
  }
  .terms-content :global(.contact-row:not(.static):hover) { border-color: var(--accent); }
  .terms-content :global(.contact-label) { font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--fg-3); }
  .terms-content :global(.contact-value) { font-size: 15px; text-align: right; word-break: break-all; }

  .back-home { margin-top: 32px !important; font-size: 14px; }
  .back-home a { color: var(--fg-2); text-decoration: none; }
  .back-home a:hover { color: var(--accent-text); }

  @media (max-width: 560px) {
    .terms-page { padding-block: 96px 40px; }
    .terms-header { margin-bottom: 24px; }
    .terms-subtitle { font-size: 15px; }
    .terms-content :global(section) { padding: 22px 0; }
    .terms-content :global(p),
    .terms-content :global(.terms-list li) { font-size: 14.5px; }
  }
</style>
