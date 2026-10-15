<script lang="ts">
  import '$lib/components/home/home.css';
  import Footer from '$lib/components/Footer.svelte';
  import WhatsappBubble from '$components/WhatsappBubble.svelte';
  import { siteConfig } from '$lib/config/site';
  import { posts, fechaLarga } from '$lib/blog';
  import { trackAgendaClick } from '$lib/tracking/track';

  let { data } = $props();
  const p = $derived(data.post);
  const url = $derived(`${siteConfig.url}/blog/${p.slug}`);
  const image = $derived(p.cover ? `${siteConfig.url}${p.cover}` : `${siteConfig.url}/og-image.png`);
  const otros = $derived(posts.filter((x) => x.slug !== p.slug).slice(0, 2));

  const jsonLd = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `${url}#article`,
          headline: p.title,
          description: p.description,
          abstract: p.resumen,
          datePublished: p.date,
          dateModified: p.updated ?? p.date,
          inLanguage: 'es',
          mainEntityOfPage: url,
          image,
          wordCount: p.text.split(' ').length,
          articleSection: p.category,
          author: { '@type': 'Person', name: p.author, ...(p.authorRole ? { jobTitle: p.authorRole } : {}), worksFor: { '@type': 'Organization', name: siteConfig.name } },
          publisher: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url, logo: { '@type': 'ImageObject', url: `${siteConfig.url}/og-image.png` } }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteConfig.url },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/blog` },
            { '@type': 'ListItem', position: 3, name: p.title, item: url }
          ]
        }
      ]
    }).replace(/</g, '\\u003c')
  );
</script>

<svelte:head>
  <title>{`${p.title} · Blog FlowPass`}</title>
  <meta name="description" content={p.description} />
  <link rel="canonical" href={url} />
  <meta name="author" content={p.author} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={p.title} />
  <meta property="og:description" content={p.description} />
  <meta property="og:image" content={image} />
  <meta property="article:published_time" content={p.date} />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<main class="home post">
  <article class="wrap post-wrap">
    <nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a> / <a href="/blog">Blog</a> / <span>{p.category}</span></nav>

    <header class="post-head">
      <span class="post-cat">{p.category}</span>
      <h1>{p.title}</h1>
      <div class="post-meta">
        <span class="avatar" aria-hidden="true">{p.author.charAt(0)}</span>
        <span>
          <b>{p.author}</b>{#if p.authorRole}<small>{p.authorRole}</small>{/if}
        </span>
        <span class="dot" aria-hidden="true">·</span>
        <time datetime={p.date}>{fechaLarga(p.date)}</time>
        <span class="dot" aria-hidden="true">·</span>
        <span>{p.minutes} min de lectura</span>
      </div>
    </header>

    {#if p.cover}<img class="post-cover" src={p.cover} alt="" decoding="async" />{/if}

    {#if p.resumen}
      <aside class="tldr" aria-label="En pocas palabras">
        <p class="tldr-title">En 30 segundos</p>
        <p>{p.resumen}</p>
      </aside>
    {/if}

    <div class="prose">{@html p.html}</div>

    <section class="post-cta" aria-label="Ordena tu academia con FlowPass">
      <p class="eyebrow">¿Te sirvió?</p>
      <h2>Deja de perseguir pagos <span>desde este mes.</span></h2>
      <p>Déjanos tus datos y un asesor te escribe por WhatsApp. Asesoría gratis de 15 minutos.</p>
      <div class="ctas">
        <a class="btn pill-green" href="/te-llamamos" onclick={() => trackAgendaClick(`blog_${p.slug}`)}>Quiero ordenar mi academia →</a>
        <a class="link" href="/#precios">Ver precios</a>
      </div>
    </section>

    {#if otros.length}
      <section class="more">
        <h2>Sigue leyendo</h2>
        <ul>
          {#each otros as o (o.slug)}
            <li><a href={`/blog/${o.slug}`}><span>{o.category}</span>{o.title} →</a></li>
          {/each}
        </ul>
      </section>
    {/if}
  </article>
</main>

<Footer />
<WhatsappBubble />

<style>
  .post { padding-block: 112px 64px; }
  .home .post-wrap { max-width: 760px; }
  .crumbs { font-size: 13.5px; color: var(--fg-2); }
  .crumbs a { color: var(--fg-2); text-decoration: none; }
  .crumbs a:hover { color: var(--fg); }

  .post-head { margin-top: 22px; display: grid; gap: 16px; }
  .post-cat { justify-self: start; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 5px 11px; border-radius: 999px; color: #04150e; background: #01f59e; }
  .post-head h1 { font-size: clamp(30px, 5vw, 50px); line-height: 1.08; margin: 0 !important; text-wrap: balance; }
  .post-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; font-size: 14px; color: var(--fg-2); }
  .post-meta b { color: var(--fg); display: block; font-size: 14.5px; }
  .post-meta small { display: block; font-size: 12.5px; }
  .avatar { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; font: 700 16px var(--display); color: #fff; background: linear-gradient(135deg, #531dd8, #01f59e); }
  .dot { opacity: 0.6; }

  .post-cover { width: 100%; margin-top: 28px; border-radius: 22px; aspect-ratio: 16 / 9; object-fit: cover; }

  .tldr { margin-top: 30px; padding: 20px 22px; border-radius: 20px; border-left: 5px solid #01f59e; background: color-mix(in srgb, #01f59e 9%, var(--panel)); }
  .tldr-title { margin: 0 0 6px !important; font-size: 12.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent-text); }
  .tldr p:last-child { margin: 0 !important; font-size: 16.5px; line-height: 1.6; }

  /* Texto del artículo (viene del .md) */
  .prose { margin-top: 28px; font-size: 17.5px; line-height: 1.75; color: var(--fg); }
  .prose :global(p) { margin: 0 0 1.1em !important; }
  .prose :global(h2) { font-size: clamp(23px, 3vw, 29px); line-height: 1.2; margin: 1.9em 0 0.6em !important; text-wrap: balance; }
  .prose :global(h3) { font-size: 20px; margin: 1.5em 0 0.5em !important; }
  .prose :global(strong) { font-weight: 700; color: var(--fg); background: linear-gradient(transparent 62%, color-mix(in srgb, #01f59e 35%, transparent) 62%); }
  .prose :global(a) { color: var(--accent-text); font-weight: 600; }
  .prose :global(ul), .prose :global(ol) { margin: 0 0 1.2em !important; padding-left: 1.4em; display: grid; gap: 0.45em; }
  .prose :global(ul) { list-style: disc; }
  .prose :global(ol) { list-style: decimal; }
  .prose :global(ul li::marker) { color: #531dd8; }
  .prose :global(ol li::marker) { color: #531dd8; font-weight: 700; }
  .prose :global(figure) { margin: 1.8em 0 !important; }
  .prose :global(figure img) { width: 100%; border-radius: 18px; border: 1px solid var(--line); }
  .prose :global(figcaption) { margin-top: 8px; font-size: 13.5px; color: var(--fg-2); text-align: center; }

  .prose :global(.callout) { margin: 1.6em 0 !important; padding: 18px 20px; border-radius: 18px; border: 1px solid var(--line); }
  .prose :global(.callout p) { margin: 0 !important; font-size: 16px; line-height: 1.6; }
  .prose :global(.callout .callout-title) { margin-bottom: 4px !important; font-weight: 700; font-size: 15px; }
  .prose :global(.callout.tip) { background: color-mix(in srgb, #01f59e 10%, var(--panel)); border-color: color-mix(in srgb, #01f59e 40%, var(--line)); }
  .prose :global(.callout.tip .callout-title::before) { content: '💡 '; }
  .prose :global(.callout.warn) { background: color-mix(in srgb, #f5b301 12%, var(--panel)); border-color: color-mix(in srgb, #f5b301 45%, var(--line)); }
  .prose :global(.callout.warn .callout-title::before) { content: '⚠️ '; }
  .prose :global(.callout.flowpass) { color: #fff; border: 0; background: linear-gradient(135deg, #531dd8, #3b14a8 60%, #0a8f63); }
  .prose :global(.callout.flowpass p), .prose :global(.callout.flowpass strong) { color: #fff; background: none; }
  .prose :global(.callout.flowpass .callout-title) { font-size: 18px; }

  .post-cta { margin-top: 48px; padding: 32px 28px; border-radius: 26px; text-align: center; color: #fff;
    background: radial-gradient(60% 90% at 85% 10%, rgba(1, 245, 158, 0.35), transparent 70%), linear-gradient(135deg, #1b0b4d, #09090f); }
  .post-cta .eyebrow { color: #01f59e; }
  .post-cta h2 { color: #fff; font-size: clamp(24px, 3.4vw, 32px); margin-top: 8px !important; text-wrap: balance; }
  .post-cta h2 span { color: #01f59e; }
  .post-cta > p:not(.eyebrow) { margin-top: 10px !important; color: rgba(255, 255, 255, 0.8); }
  .post-cta .ctas { margin-top: 20px; display: flex; flex-wrap: wrap; gap: 12px 20px; justify-content: center; align-items: center; }
  .post-cta .btn { border-radius: 999px; }
  .post-cta .link { color: #fff; font-weight: 600; }

  .more { margin-top: 40px; }
  .more h2 { font-size: 20px; }
  .more ul { list-style: none; padding: 0; margin: 12px 0 0; display: grid; gap: 10px; }
  .more a { display: block; padding: 14px 18px; border-radius: 16px; border: 1px solid var(--line); background: var(--panel); color: var(--fg); text-decoration: none; font-weight: 600; }
  .more a:hover { border-color: #531dd8; }
  .more a span { display: block; font-size: 12px; color: var(--fg-2); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }

  @media (max-width: 560px) {
    .post { padding-top: 92px; }
    .prose { font-size: 16.5px; }
    .post-cta { padding: 26px 20px; }
    .post-cta .btn { width: 100%; justify-content: center; }
  }
</style>
