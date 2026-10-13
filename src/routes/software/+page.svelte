<script lang="ts">
  import '$lib/components/home/home.css';
  import Footer from '$lib/components/Footer.svelte';
  import { siteConfig } from '$lib/config/site';
  import { disciplinas } from '$lib/data/disciplinas';

  const url = `${siteConfig.url}/software`;
  const title = 'FlowPass por disciplina · Software para academias';
  const description = 'Software para academias de baile, artes marciales, fútbol, natación, música, gimnasios, escuelas de belleza y más. Cobros, asistencia y recordatorios.';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
</svelte:head>

<!-- El Navbar vive en +layout.svelte -->
<main class="home idx">
  <div class="wrap">
    <p class="eyebrow">Por disciplina</p>
    <h1>Un sistema hecho para tu tipo de negocio.</h1>
    <ul class="grid">
      {#each disciplinas as d (d.slug)}
        <li>
          <a href={`/software/${d.slug}`}>
            <b>{d.name}</b>
            <span>{d.card}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</main>

<Footer />

<style>
  .idx { padding-block: 128px 64px; }
  h1 { font-size: clamp(30px, 5vw, 56px); max-width: 18ch; margin-top: 12px !important; }
  .grid { list-style: none; padding: 0; margin: 36px 0 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .grid a {
    position: relative;
    display: grid;
    gap: 6px;
    padding: 22px 48px 22px 22px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: var(--panel);
    text-decoration: none;
    transition: border-color 0.2s, transform 0.2s;
  }
  .grid a:hover { border-color: var(--accent); transform: translateY(-2px); }
  .grid b { font-size: 17px; }
  .grid span { font-size: 14px; color: var(--fg-2); }
  .grid svg { position: absolute; top: 24px; right: 20px; color: var(--accent-text); }
  @media (max-width: 640px) {
    .idx { padding-top: 104px; }
    .grid { grid-template-columns: 1fr; gap: 10px; }
    .grid a { padding: 16px 44px 16px 16px; }
  }
</style>
