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

    <a class="not-ready" href="/te-llamamos">
      <span class="nr-ic" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" /></svg>
      </span>
      <span class="nr-txt">
        <b>¿Aún no estás listo{" "}<span class="long">para agendar</span>?</b>
        <span>Déjanos tus datos y un asesor te escribe por WhatsApp.</span>
      </span>
      <span class="nr-btn">Te llamamos →</span>
    </a>

    <section class="cal-card" aria-label="Calendario para agendar la llamada">
      <CalEmbed />
    </section>

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
  /* Es <section>: anula el padding-block de 96px que home.css da a todas las secciones */
  .agenda .cal-card { margin-top: 0; padding-block: 0; }
  /* Segunda opción bien visible: tarjeta con ícono y botón */
  .not-ready {
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: 620px;
    margin: 18px auto 14px;
    gap: 12px;
    padding: 10px 10px 10px 14px;
    border-radius: 999px;
    background: color-mix(in srgb, #531dd8 9%, var(--panel));
    border: 1px solid color-mix(in srgb, #531dd8 28%, var(--line));
    color: var(--fg);
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .not-ready:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
  .nr-ic { flex: none; display: grid; place-items: center; width: 34px; height: 34px; border-radius: 50%; background: #531dd8; color: #fff; }
  .nr-txt { flex: 1; display: grid; gap: 2px; min-width: 0; }
  .nr-txt b { font-size: 14.5px; }
  .nr-txt > span { font-size: 13px; color: var(--fg-2); }
  .nr-btn { flex: none; padding: 9px 16px; border-radius: 999px; background: #09090f; color: #fff; font-weight: 600; font-size: 13.5px; white-space: nowrap; }
  :global(:root[data-theme='dark']) .nr-btn { background: #01f59e; color: #04150e; }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .nr-btn { background: #01f59e; color: #04150e; }
  }
  @media (max-width: 560px) {
    .agenda { padding-top: 92px; }
    .cal-card { margin-top: 0; }
    .what li { font-size: 13px; }
    /* Celular: una fila compacta (texto + botón), sin ícono ni descripción */
    .not-ready { gap: 10px; padding: 7px 7px 7px 16px; margin-block: 14px 8px; }
    .nr-ic, .nr-txt > span, .long { display: none; }
    .nr-txt b { font-size: 13.5px; }
    .nr-btn { padding: 8px 13px; font-size: 13px; }
  }
</style>
