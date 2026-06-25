<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import LeadForm from "$lib/components/LeadForm.svelte";
  import { siteConfig } from "$lib/config/site";
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

<Navbar />

<main class="agenda-page">
  <div class="agenda-wrap">
    <header class="agenda-head">
      <h1>Agenda tu <span class="grad">asesoría gratuita</span></h1>
      <p>Déjanos tus datos y te contactamos por WhatsApp para coordinar una sesión 1:1 de 30 min, donde te ayudamos a ordenar y automatizar la gestión de tu academia.</p>
      <p class="agenda-trust">
        <span aria-hidden="true">✦</span>
        Academias en Perú y México ya ordenan su gestión con FlowPass
      </p>
    </header>

    <LeadForm />
  </div>
</main>

<Footer />

<style>
  .agenda-page {
    min-height: 100vh;
    padding: 80px 14px 40px;
    background: radial-gradient(circle at top, #1a1a45 0%, #0a0a1a 60%);
  }

  .agenda-wrap {
    max-width: 720px;
    margin: 0 auto;
  }

  .agenda-head {
    text-align: center;
    color: #ffffff;
    margin-bottom: 14px;
  }

  .agenda-head h1 {
    font-family: 'Epoch', system-ui, sans-serif;
    font-size: 1.6rem;
    line-height: 1.1;
    margin: 0 0 6px;
    letter-spacing: -0.015em;
  }

  .grad {
    background: linear-gradient(90deg, #01f59e 0%, #3168f4 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .agenda-head p {
    font-family: 'Oktah Neue', system-ui, sans-serif;
    color: #d8d8e8;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 10px;
  }

  .agenda-trust {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px !important;
    margin-bottom: 14px !important;
    padding: 5px 12px;
    background: rgba(1, 245, 158, 0.08);
    border: 1px solid rgba(1, 245, 158, 0.22);
    border-radius: 999px;
    color: #d8f7ec !important;
    font-size: 0.72rem !important;
    font-weight: 500;
  }

  .agenda-trust span {
    color: #01f59e;
  }

  @media (min-width: 640px) {
    .agenda-page {
      padding: 100px 20px 56px;
    }

    .agenda-head h1 {
      font-size: 2.1rem;
    }

    .agenda-head p {
      font-size: 0.98rem;
    }

    .agenda-trust {
      font-size: 0.78rem !important;
    }
  }
</style>
