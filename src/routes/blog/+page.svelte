<script lang="ts">
  import '$lib/components/home/home.css';
  import Footer from '$lib/components/Footer.svelte';
  import { siteConfig } from '$lib/config/site';
  import { posts, fechaLarga } from '$lib/blog';

  const url = `${siteConfig.url}/blog`;
  const title = 'Blog FlowPass · Ideas para ordenar tu academia';
  const description = 'Guías cortas y útiles para dueños de academias y negocios de clases: cobros, alumnos, asistencia y cómo crecer sin perder el control.';
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': url,
    url,
    name: 'Blog FlowPass',
    description,
    publisher: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: `${url}/${p.slug}`, datePublished: p.date }))
  }).replace(/</g, '\\u003c');
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={`${siteConfig.url}/og-image.png`} />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<main class="home blog-list">
  <div class="wrap">
    <header class="bl-head">
      <p class="eyebrow">Blog FlowPass</p>
      <h1>Ideas para ordenar <span>tu academia.</span></h1>
      <p class="bl-sub">Guías cortas y útiles para que ganes tiempo y tengas tu negocio bajo control.</p>
    </header>

    <ul class="bl-grid">
      {#each posts as p (p.slug)}
        <li>
          <a class="bl-card" href={`/blog/${p.slug}`}>
            {#if p.cover}<img class="bl-cover" src={p.cover} alt="" loading="lazy" decoding="async" />{/if}
            <span class="bl-cat">{p.category}</span>
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <span class="bl-meta">{fechaLarga(p.date)} · {p.minutes} min de lectura</span>
            <span class="bl-more">Leer →</span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</main>

<Footer />

<style>
  .blog-list { padding-block: 120px 72px; }
  .bl-head { max-width: 720px; }
  .bl-head h1 { font-size: clamp(32px, 5vw, 56px); margin-top: 10px !important; text-wrap: balance; }
  .bl-head h1 span { background: linear-gradient(120deg, #531dd8, #01b874); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .bl-sub { margin-top: 14px !important; font-size: 17px; color: var(--fg-2); }
  .bl-grid { list-style: none; padding: 0; margin: 40px 0 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); gap: 18px; }
  .bl-card { position: relative; height: 100%; display: flex; flex-direction: column; gap: 10px; padding: 26px 24px 22px; border-radius: 22px; color: var(--fg); text-decoration: none; overflow: hidden;
    background: linear-gradient(var(--panel), var(--panel)) padding-box, linear-gradient(135deg, color-mix(in srgb, #531dd8 60%, transparent), color-mix(in srgb, #01f59e 60%, transparent)) border-box;
    border: 1.5px solid transparent; transition: transform 0.25s, box-shadow 0.25s; }
  .bl-card:hover { transform: translateY(-4px); box-shadow: 0 24px 50px -26px rgba(83, 29, 216, 0.6); }
  .bl-card:focus-visible { outline: 2px solid #531dd8; outline-offset: 3px; }
  .bl-cover { width: calc(100% + 48px); max-width: none; margin: -26px -24px 6px; aspect-ratio: 16 / 9; object-fit: cover; }
  .bl-cat { align-self: flex-start; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px; color: #04150e; background: #01f59e; }
  .bl-card h2 { font-size: 21px; line-height: 1.25; margin: 4px 0 0 !important; text-wrap: balance; }
  .bl-card p { margin: 0 !important; font-size: 15px; color: var(--fg-2); flex: 1; }
  .bl-meta { font-size: 13px; color: var(--fg-2); }
  .bl-more { font-weight: 700; font-size: 14.5px; color: var(--accent-text); }
  @media (max-width: 560px) { .blog-list { padding-top: 96px; } }
</style>
