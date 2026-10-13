<script lang="ts">
  import '$lib/components/home/home.css';
  import Footer from '$lib/components/Footer.svelte';
  import CalEmbed from '$lib/components/CalEmbed.svelte';
  import { siteConfig } from '$lib/config/site';
  import { plans } from '$lib/data/pricingData.js';
  import { onMount } from 'svelte';

  // Para quien ya quiere elegir día y hora: calendario de Cal.com.
  // Quien aún no está listo va a /te-llamamos y deja sus datos.
  let planName = $state<string | null>(null);
  onMount(() => {
    const id = new URLSearchParams(location.search).get('plan');
    planName = plans.find((p) => p.id === id)?.name ?? null;
  });
</script>

<svelte:head>
  <title>Agenda tu llamada | FlowPass</title>
  <meta
    name="description"
    content="Elige día y hora para una llamada de 20 minutos con FlowPass: vemos tu negocio funcionando con tus planes y precios reales. Gratis y sin compromiso."
  />
  <meta name="robots" content="noindex,follow" />
  <link rel="canonical" href={`${siteConfig.url}/agenda`} />
  <link rel="preconnect" href="https://app.cal.com" />
</svelte:head>

<!-- El Navbar vive en +layout.svelte -->
<main class="home agenda">
  <div class="wrap">
    <header class="head">
      <p class="eyebrow">20 minutos · Google Meet · Gratis</p>
      <h1>Elige el día y la hora <span>que te acomode.</span></h1>
      <ul class="what">
        <li>Demo con un caso como el tuyo</li>
        <li>Dudas de planes y precios</li>
        <li>Sin compromiso</li>
      </ul>
      {#if planName}<p class="picked">Plan que te interesa: <b>{planName}</b></p>{/if}
    </header>

    <section class="cal-card" aria-label="Calendario para agendar la llamada">
      <CalEmbed />
    </section>

    <a class="not-ready" href="/te-llamamos">
      <span>¿Aún no estás listo para agendar?</span>
      <b>Déjanos tus datos y te llamamos →</b>
    </a>
  </div>
</main>

<Footer />

<style>
  .agenda { padding-block: 104px 48px; min-height: 100vh; }
  /* Todo centrado y más angosto: el calendario sin la columna de detalles ocupa menos */
  .agenda .wrap { max-width: 920px; }
  .head { text-align: center; margin-inline: auto; }
  .what { justify-content: center; }
  h1 { font-size: clamp(26px, 3.6vw, 40px); margin-top: 10px !important; }
  h1 span { color: var(--accent-text); }
  .what { list-style: none; padding: 0; margin: 16px 0 0; display: flex; flex-wrap: wrap; gap: 6px 18px; }
  .what li { display: flex; gap: 8px; font-size: 14.5px; color: var(--fg-2); }
  .what li::before { content: '✓'; color: var(--accent-text); font-weight: 700; }
  .picked { display: inline-block; margin-top: 14px !important; padding: 6px 12px; border-radius: 999px; font-size: 13px; background: color-mix(in srgb, #01f59e 22%, var(--panel)); }
  /* Sin marco propio: el borde lo pone Cal.com, así no hay doble tarjeta */
  /* Cal.com ya trae aire arriba dentro del iframe */
  .cal-card { margin-top: 0; }
  .not-ready {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
    margin-top: 20px;
    padding: 18px;
    border: 1px dashed var(--line);
    border-radius: 16px;
    font-size: 15px;
    color: var(--fg-2);
    text-decoration: none;
  }
  .not-ready b { color: var(--accent-text); }
  .not-ready:hover { border-color: var(--accent); }
  @media (max-width: 560px) {
    .agenda { padding-top: 92px; }
    .cal-card { margin-top: 0; }
    .what li { font-size: 13px; }
  }
</style>
