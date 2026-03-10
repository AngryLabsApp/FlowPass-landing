<script lang="ts">
  import flowPassIcon from "$lib/assets/icons/logo-icon.svg";
  import Navbar from "$lib/components/Navbar.svelte";
  import GoogleAnalytics from '$lib/components/GoogleAnalytics.svelte';

  // Nuevo sistema de props en SvelteKit 2
  let { children } = $props();

  import "../app.css";
</script>

<svelte:head>
  <link rel="icon" href={flowPassIcon} />
</svelte:head>

<!-- Navbar fijo -->
<Navbar />
<GoogleAnalytics />

<!-- Renderiza el contenido de la página -->
<main class="pt-20"> 
  {@render children()}
</main>
