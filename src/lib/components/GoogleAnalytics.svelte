<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // Reemplaza con tu Measurement ID
  const measurementId = 'G-N60MYY48QH'; 

  onMount(() => {
    if (!browser) return;

    // Cargar el script de GA4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Configurar gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: true,
      page_title: document.title,
      page_location: window.location.href
    });
  });

  // Enviar página vista cuando cambie la ruta (SPA navigation)
  $: if (browser && $page.url.pathname) {
    window.gtag?.('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: $page.url.pathname
    });
  }
</script>