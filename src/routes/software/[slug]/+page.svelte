<script lang="ts">
  import '$lib/components/home/home.css';
  import Footer from '$lib/components/Footer.svelte';
  import WhatsappBubble from '$components/WhatsappBubble.svelte';
  import { siteConfig } from '$lib/config/site';
  import { disciplinas } from '$lib/data/disciplinas';
  import { trackAgendaClick } from '$lib/tracking/track';
  import BookFlip from '$lib/components/home/BookFlip.svelte';
  import HomePricing from '$lib/components/home/HomePricing.svelte';
  import HomeSteps from '$lib/components/home/HomeSteps.svelte';
  import PlatformTabs from '$lib/components/home/PlatformTabs.svelte';
  import HomeIntro from '$lib/components/home/HomeIntro.svelte';
  import Testimonials from '$lib/components/Testimonials.svelte';

  // Portada de cada disciplina: src/lib/assets/images/disciplinas/<slug>.webp
  const fotos = import.meta.glob('$lib/assets/images/disciplinas/*.webp', { eager: true, import: 'default' }) as Record<string, string>;

  let { data } = $props();
  const d = $derived(data.d);
  const url = $derived(`${siteConfig.url}/software/${d.slug}`);
  const foto = $derived(Object.entries(fotos).find(([k]) => k.endsWith(`/${d.slug}.webp`))?.[1]);
  const title = $derived(`Software para ${d.negocio} · FlowPass`);
  const description = $derived(`${d.sub} Para Perú, México y Latinoamérica.`.slice(0, 160));

  // Preguntas propias de la disciplina + una común sobre precio
  const faqs = $derived([
    ...d.faqs,
    { q: '¿Cuánto cuesta FlowPass?', a: 'Depende de cuántos alumnos activos tienes. Todos los planes traen las mismas funciones principales; los ves en la sección de precios de esta página.' }
  ]);
  const otras = $derived(disciplinas.filter((x) => x.slug !== d.slug));

  const jsonLd = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', '@id': url, url, name: title, description, isPartOf: { '@type': 'WebSite', name: siteConfig.name, url: siteConfig.url } },
        {
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }))
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteConfig.url },
            { '@type': 'ListItem', position: 2, name: 'Por disciplina', item: `${siteConfig.url}/software` },
            { '@type': 'ListItem', position: 3, name: d.name, item: url }
          ]
        }
      ]
    }).replace(/</g, '\\u003c')
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={`${d.keywords}, software ${d.negocio} Perú, software ${d.negocio} México`} />
  <meta property="og:locale" content="es_PE" />
  <meta property="og:locale:alternate" content="es_MX" />
  <link rel="canonical" href={url} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={foto ? `${siteConfig.url}${foto}` : `${siteConfig.url}/og-image.png`} />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<!-- El Navbar vive en +layout.svelte -->
<main class="home disc">
  <header class="hero">
    <nav class="crumbs wrap" aria-label="Ruta"><a href="/">Inicio</a> / <a href="/software">Por disciplina</a> / <span>{d.name}</span></nav>
    <div class="hero-card" class:has-photo={foto} style={foto ? `--photo:url(${foto})` : ''}>
      {#if foto}<div class="media" role="img" aria-label={`Dueño de un negocio de ${d.name.toLowerCase()} haciendo las cuentas a mano, de noche`}></div>{/if}
      <div class="copy">
        <h1>Software para <span>{d.negocio}.</span></h1>
        <p class="sub">{d.sub}</p>
        <div class="ctas">
          <a class="btn pill-green" href="/agenda" onclick={() => trackAgendaClick(`disciplina_${d.slug}`)}>
            Agenda 15 minutos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </a>
          <a class="btn pill-white" href="#precios">Ver precios</a>
        </div>
      </div>
    </div>
  </header>

  <!-- Orden: ¿es para mí? → prueba (cifras) → problema → funciones → testimonios
       → cómo empezar → precio → dudas → acción -->
  <HomeIntro />

  <section class="wrap" aria-labelledby="vs-title">
    <h2 id="vs-title" class="sec-title">Lo que hoy te quita tiempo, resuelto.</h2>
    <BookFlip labels={['Hoy', 'Con FlowPass']} groupLabel="Ver hoy o con FlowPass" class="disc-vs">
      {#snippet front()}
        <div class="side bad">
          <p class="label">Hoy</p>
          <ul class="list-bad">{#each d.pains as p (p)}<li>{p}</li>{/each}</ul>
        </div>
      {/snippet}
      {#snippet back()}
        <div class="side good">
          <p class="label">Con FlowPass</p>
          <ul class="list-good">{#each d.wins as w (w)}<li>{w}</li>{/each}</ul>
        </div>
      {/snippet}
    </BookFlip>
  </section>

  <!-- Todas las funciones, con los textos del rubro -->
  {#key d.slug}
    <PlatformTabs who={d.who} title={`Todas las funciones para ${d.negocio}.`} />
  {/key}

  <!-- Prueba social justo después de ver lo que hace -->
  <Testimonials />

  <!-- Precios: siempre en cada página por disciplina (misma sección que la home) -->
  <HomeSteps />
  <HomePricing />

  <section class="wrap faq-sec" aria-labelledby="faq-title">
    <div>
      <p class="eyebrow">Preguntas</p>
      <h2 id="faq-title" class="sec-title">Lo que nos preguntan antes de empezar.</h2>
    </div>
    <div class="faq">
      {#each faqs as f, i (f.q)}
        <details open={i === 0}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      {/each}
    </div>
  </section>

  <section class="wrap">
    <div class="close">
      <h2>Mira tu negocio <span>funcionando en FlowPass.</span></h2>
      <p>Una llamada de 15 minutos, con tus planes y tus precios reales.</p>
      <a class="btn pill-green" href="/agenda" onclick={() => trackAgendaClick(`disciplina_${d.slug}_cierre`)}>
        Agenda 15 minutos
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
      </a>
    </div>
  </section>

  <section class="wrap others" aria-labelledby="otras-title">
    <h2 id="otras-title" class="eyebrow">También para</h2>
    <ul>{#each otras as o (o.slug)}<li><a href={`/software/${o.slug}`}>{o.name}</a></li>{/each}</ul>
  </section>
</main>

<Footer />
<WhatsappBubble />

<style>
  .disc { padding-top: 92px; }
  .hero { padding-block: 8px; }
  .crumbs { font-size: 13px; color: var(--fg-3); margin-bottom: 14px; padding-inline: 0; }
  .crumbs a { color: var(--fg-2); text-decoration: none; }
  .crumbs a:hover { color: var(--accent-text); }
  /* Portada igual que la home: foto con gradación de marca y texto encima */
  .hero-card {
    position: relative;
    max-width: 1280px;
    margin-inline: auto;
    border-radius: 24px;
    overflow: hidden;
    min-height: clamp(460px, 70vh, 640px);
    display: flex;
    align-items: flex-end;
    isolation: isolate;
    background: #09090f;
  }
  .media { position: absolute; inset: 0; z-index: -2; background: var(--photo) 70% center / cover no-repeat; }
  .hero-card::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(180deg, rgba(9, 9, 15, 0.05) 30%, rgba(9, 9, 15, 0.85) 100%),
      linear-gradient(90deg, rgba(9, 9, 15, 0.75), transparent 60%);
  }
  .copy { padding: clamp(24px, 4vw, 48px); max-width: 720px; color: #fff; }
  h1 { font-size: clamp(32px, 5.4vw, 64px); color: #fff; max-width: 15ch; }
  h1 span { color: #01f59e; }
  .sub { margin-top: 16px; font-size: 17px; max-width: 46ch; color: rgba(255, 255, 255, 0.86); }
  .ctas { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 26px; }

  /* El contenedor lo renderiza BookFlip; en escritorio las dos tarjetas van lado a lado */
  :global(.disc-vs) { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 28px; }
  .side { border: 1px solid var(--line); border-radius: 18px; padding: 24px; background: var(--panel); }
  .bad { background: var(--bg-2); }
  .label { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; color: var(--fg-3); }
  .good .label { color: var(--accent-text); }
  .side ul { margin-top: 16px; gap: 12px; font-size: 15.5px; }


  .faq-sec { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); gap: 48px; }
  .faq-sec .sec-title { font-size: clamp(26px, 3.4vw, 40px); }
  .faq details { border-bottom: 1px solid var(--line); padding-block: 20px; }
  .faq details:first-child { border-top: 1px solid var(--line); }
  .faq summary { cursor: pointer; list-style: none; font-weight: 600; font-size: 17px; display: flex; justify-content: space-between; gap: 16px; }
  .faq summary::-webkit-details-marker { display: none; }
  .faq summary::after { content: '+'; color: var(--accent-text); font-size: 22px; line-height: 1; }
  .faq details[open] summary::after { content: '–'; }
  .faq details p { color: var(--fg-2); margin-top: 12px; max-width: 62ch; }

  /* Cierre: tarjeta negra de marca, como en la home */
  .close {
    border-radius: 24px;
    padding: clamp(28px, 5vw, 56px);
    background:
      radial-gradient(50% 80% at 85% 20%, rgba(83, 29, 216, 0.55), transparent 70%),
      radial-gradient(40% 60% at 10% 100%, rgba(1, 245, 158, 0.18), transparent 70%),
      #09090f;
    color: #fff;
    display: grid;
    justify-items: start;
    gap: 16px;
  }
  .close h2 { font-size: clamp(26px, 4vw, 48px); color: #fff; max-width: 18ch; }
  .close h2 span { display: block; color: #01f59e; }
  .close p { color: rgba(255, 255, 255, 0.78); }

  .disc .others { padding-top: 0; }
  .others ul { list-style: none; padding: 0; margin: 14px 0 0; display: flex; flex-wrap: wrap; gap: 8px; }
  .others a { display: inline-block; padding: 8px 14px; border: 1px solid var(--line); border-radius: 999px; font-size: 14px; color: var(--fg-2); text-decoration: none; }
  .others a:hover { border-color: var(--accent); color: var(--fg); }

  @media (max-width: 900px) {
    .faq-sec { grid-template-columns: 1fr; gap: 20px; }
  }
  @media (max-width: 900px) {
    :global(.disc-vs) { grid-template-columns: 1fr; gap: 0; margin-top: 12px; }
    /* Al pasar la página, los ✓ entran uno tras otro */
    :global(.book.flipped) :is(.good .label, .good li) { animation: settle 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
    :global(.book.flipped) .good .label { animation-delay: 0.42s; }
    :global(.book.flipped) .good li:nth-child(1) { animation-delay: 0.55s; }
    :global(.book.flipped) .good li:nth-child(2) { animation-delay: 0.65s; }
    :global(.book.flipped) .good li:nth-child(3) { animation-delay: 0.75s; }
  }
  @keyframes settle { from { opacity: 0; translate: 0 14px; } }
  @media (prefers-reduced-motion: reduce) {
    .good li, .good .label { animation: none !important; }
  }
  @media (max-width: 560px) {
    .disc { padding-top: 76px; }
    .crumbs { font-size: 12px; margin-bottom: 10px; }
    .hero-card { display: block; min-height: 0; border-radius: 18px; }
    .media { position: relative; height: 230px; background-position: 72% center; -webkit-mask-image: linear-gradient(#000 55%, transparent); mask-image: linear-gradient(#000 55%, transparent); }
    .hero-card::after { display: none; }
    .copy { padding: 0 20px 24px; margin-top: -30px; position: relative; }
    .hero-card:not(.has-photo) .copy { margin-top: 0; padding-top: 28px; }
    h1 { font-size: clamp(26px, 7.8vw, 34px); }
    .sub { font-size: 14px; margin-top: 12px; }
    .ctas .btn { flex: 1 1 100%; justify-content: center; padding: 11px 16px; font-size: 14px; }
    .side { padding: 18px 16px; }
    .side ul { font-size: 14px; }
    .faq summary { font-size: 15px; }
    .faq details { padding-block: 16px; }
    .close .btn { width: 100%; justify-content: center; }
  }
</style>
