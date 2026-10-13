<script lang="ts">
  import Footer from "$lib/components/Footer.svelte";
  import LeadForm from "$lib/components/LeadForm.svelte";
  import { siteConfig } from "$lib/config/site";
  import { plans } from "$lib/data/pricingData.js";
  import { onMount } from "svelte";
  import calmArt from "$lib/assets/images/agenda-ilustracion.webp";

  // Si viene desde un plan de la sección de precios (/agenda?plan=lite), lo mostramos.
  // Se lee en el navegador: la página se pre-renderiza y ahí no hay query string.
  let planName = $state<string | null>(null);
  onMount(() => {
    const id = new URLSearchParams(location.search).get("plan");
    planName = plans.find((p) => p.id === id)?.name ?? null;
  });
</script>

<svelte:head>
  <title>Agenda tu asesoría | FlowPass</title>
  <meta
    name="description"
    content="Cuéntanos de tu academia y te ayudamos a ordenar y automatizar tu gestión en una sesión 1:1. Gratuita y sin compromiso."
  />
  <meta name="robots" content="noindex,follow" />
  <link rel="canonical" href={`${siteConfig.url}/agenda`} />
</svelte:head>

<!-- El Navbar vive en +layout.svelte -->

<main class="agenda-page">
  <div class="shell">
    <!-- Panel de calma: la promesa + el final del día resuelto -->
    <aside class="panel">
      <!-- Pegado arriba: si el paso 2 del formulario es largo, el panel acompaña al hacer scroll -->
      <div class="panel-in">
      <p class="eyebrow">Llamada de 15 minutos · Gratis</p>
      <h1>Estás a un paso de cambiar cómo administras <span>tu negocio.</span></h1>
      <ul class="what">
        <li>Demo con un caso como el tuyo</li>
        <li>Dudas de planes y precios</li>
        <li>Sin compromiso</li>
      </ul>
      <figure class="calm">
        <img src={calmArt} alt="Ilustración: una dueña de negocio relajada en su sillón, con un té, ve en el celular un check verde; al lado, su calendario ordenado" loading="eager" width="900" height="872" />
      </figure>
      </div>
    </aside>

    <section class="form-side" aria-labelledby="form-title">
      {#if planName}<p class="picked">Plan que te interesa: <b>{planName}</b></p>{/if}
      <h2 id="form-title">Agenda tu llamada</h2>
      <p class="lede">Déjanos tus datos y te escribimos por WhatsApp.</p>
      <LeadForm />
    </section>
  </div>
</main>

<Footer />

<style>
  /* Tarjeta partida: panel de marca a la izquierda, formulario limpio a la derecha. */
  .agenda-page {
    min-height: 100vh;
    padding: 112px 20px 56px;
    color: #09090f;
    background:
      radial-gradient(50% 60% at 85% 10%, rgba(83, 29, 216, 0.1), transparent 70%),
      radial-gradient(40% 50% at 0% 100%, rgba(1, 245, 158, 0.12), transparent 70%),
      #fbfbf8;
  }
  .shell {
    max-width: 1120px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
    background: #fff;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 30px 80px -40px rgba(9, 9, 15, 0.35), 0 0 0 1px rgba(9, 9, 15, 0.06);
  }

  .panel {
    padding: 44px 40px 0;
    /* Mismo lila que el fondo de la ilustración, para que se funda sin bordes */
    background: #e4ddfe;
  }
  .eyebrow { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; color: #531dd8; }
  h1 {
    font-family: 'Epoch', 'Syne', system-ui, sans-serif;
    font-size: clamp(28px, 3.2vw, 42px);
    line-height: 1.08;
    letter-spacing: -0.02em;
    margin: 14px 0 0;
    text-wrap: balance;
  }
  h1 span { color: #00865a; }
  .what { list-style: none; padding: 0; margin: 20px 0 0; display: grid; gap: 6px; }
  .what li { display: flex; gap: 8px; font-size: 14px; }
  .what li::before { content: '✓'; flex: none; color: #00865a; font-weight: 700; }
  /* La ilustración se apoya en el borde inferior del panel */
  .panel-in { position: sticky; top: 104px; display: flex; flex-direction: column; }
  .calm { margin: 0 -40px; padding-top: 28px; }
  .calm img { display: block; width: 100%; max-width: 380px; height: auto; margin-inline: auto; }

  .form-side { padding: 44px 48px; display: flex; flex-direction: column; justify-content: center; }
  .picked {
    align-self: flex-start;
    margin: 0 0 12px;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 13px;
    color: #04150e;
    background: rgba(1, 245, 158, 0.35);
  }
  h2 { font-family: 'Epoch', 'Syne', system-ui, sans-serif; font-size: 26px; letter-spacing: -0.01em; margin: 0; }
  .lede { margin: 6px 0 18px; font-size: 14.5px; color: rgba(9, 9, 15, 0.62); }
  /* El formulario vive dentro de la tarjeta: sin su propio marco ni sombra */
  .form-side :global(.lead-card) { max-width: none; margin: 0; padding: 0; border: 0; box-shadow: none; }

  @media (max-width: 900px) {
    .shell { grid-template-columns: 1fr; border-radius: 22px; }
    .panel { padding: 28px 24px 24px; }
    .panel-in { position: static; }
    .calm { display: none; }
    .form-side { padding: 28px 24px 32px; }
  }
  @media (max-width: 560px) {
    .agenda-page { padding: 92px 12px 40px; }
    .panel { padding: 22px 18px 18px; }
    h1 { font-size: clamp(22px, 6.6vw, 28px); }
    .what { margin-top: 12px; gap: 3px; }
    .what li { font-size: 13px; }
    .form-side { padding: 22px 18px 26px; }
    h2 { font-size: 20px; }
    .lede { font-size: 13.5px; margin-bottom: 14px; }
  }
</style>
