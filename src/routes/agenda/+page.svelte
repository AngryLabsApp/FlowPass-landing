<script lang="ts">
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import LeadForm from "$lib/components/LeadForm.svelte";
  import { siteConfig } from "$lib/config/site";
</script>

<svelte:head>
  <title>Agenda tu demo | FlowPass</title>
  <meta
    name="description"
    content="Cuéntanos de tu academia y te mostramos cómo FlowPass automatiza tu gestión. Demo personalizada en menos de 24 horas."
  />
  <meta name="robots" content="noindex,follow" />
  <link rel="canonical" href={`${siteConfig.url}/agenda`} />
</svelte:head>

<Navbar />

<main class="agenda-page">
  <div class="agenda-wrap">
    <header class="agenda-head">
      <h1>Agenda tu <span class="grad">demo gratuita</span></h1>
      <p>Cuéntanos de tu academia y un asesor te contactará para coordinar.</p>
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
    color: #b8b8d0;
    font-size: 0.85rem;
    line-height: 1.4;
    margin: 0;
  }

  @media (min-width: 640px) {
    .agenda-page {
      padding: 100px 20px 56px;
    }

    .agenda-head h1 {
      font-size: 2rem;
    }

    .agenda-head p {
      font-size: 0.92rem;
    }
  }
</style>
