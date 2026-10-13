<script lang="ts">
  import { page } from '$app/state';
  import Footer from '$lib/components/Footer.svelte';
  import '$lib/components/home/home.css';

  const notFound = $derived(page.status === 404);
</script>

<svelte:head>
  <title>{notFound ? 'Página no encontrada' : 'Algo salió mal'} · FlowPass</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<!-- El Navbar vive en +layout.svelte. Ruta inexistente: nginx sirve 404.html con estado 404 real. -->
<main class="home err">
  <div class="wrap box">
    <!-- Aquí va la animación de la marca cuando esté lista; mientras, un 404 animado con CSS -->
    <div class="art" aria-hidden="true">
      <span>4</span><span class="o">0</span><span>4</span>
    </div>
    <h1>{notFound ? 'Esta página no existe.' : 'Algo salió mal.'}</h1>
    <p class="lead">{notFound ? 'Puede que el enlace esté mal escrito o que la página se haya movido.' : 'Intenta de nuevo en unos minutos.'}</p>
    <div class="ctas">
      <a class="btn btn-primary" href="/">Ir al inicio</a>
      <a class="btn btn-ghost" href="/#precios">Ver precios</a>
    </div>
  </div>
</main>

<Footer />

<style>
  .err { min-height: 100vh; display: grid; place-items: center; padding-block: 120px 64px; background: var(--bg); }
  .box { text-align: center; display: grid; justify-items: center; gap: 16px; }
  .art {
    display: flex;
    gap: 0.04em;
    font-family: var(--display);
    font-weight: 700;
    font-size: clamp(96px, 22vw, 200px);
    line-height: 1;
    letter-spacing: -0.04em;
    color: var(--fg);
  }
  .art span { display: inline-block; animation: float 3.2s ease-in-out infinite; }
  .art span:nth-child(3) { animation-delay: -1.1s; }
  .art .o {
    color: transparent;
    -webkit-text-stroke: 3px var(--accent);
    animation: spin 6s cubic-bezier(0.6, 0, 0.4, 1) infinite, float 3.2s ease-in-out -0.5s infinite;
    filter: drop-shadow(0 0 24px rgba(1, 245, 158, 0.45));
  }
  h1 { font-size: clamp(26px, 4vw, 40px); }
  .lead { max-width: 40ch; color: var(--fg-2); }
  .ctas { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 8px; }
  .ctas .btn { border-radius: 999px; }
  @keyframes float { 50% { translate: 0 -10px; } }
  @keyframes spin { 0%, 40% { rotate: 0deg; } 60%, 100% { rotate: 360deg; } }
  @media (prefers-reduced-motion: reduce) {
    .art span, .art .o { animation: none; }
  }
</style>
