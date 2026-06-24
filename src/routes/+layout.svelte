<script lang="ts">
  import flowPassIcon from "$lib/assets/icons/logo-icon.svg";
  import Navbar from "$lib/components/Navbar.svelte";
  import GoogleAnalytics from '$lib/components/GoogleAnalytics.svelte';
  import MetaPixel from '$lib/components/MetaPixel.svelte';
  import InstallPromptToast from '$lib/pwa/InstallPromptToast.svelte';
  import { page } from '$app/stores';

  // Nuevo sistema de props en SvelteKit 2
  let { children } = $props();

  import "../app.css";

  // Rutas donde el toast de instalación PWA NO debe aparecer (formularios, etc.).
  const HIDE_INSTALL_TOAST_ROUTES = ['/agenda'];
</script>

<svelte:head>
  <link rel="icon" href={flowPassIcon} />
</svelte:head>

<!-- Navbar fijo -->
<Navbar />
<GoogleAnalytics />
<MetaPixel />
{#if !HIDE_INSTALL_TOAST_ROUTES.includes($page.url.pathname)}
  <InstallPromptToast />
{/if}

<!-- Renderiza el contenido de la página -->
<main class="min-h-screen text-white">
  {@render children()}
</main>
