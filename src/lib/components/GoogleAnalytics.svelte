<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  const measurementId = 'G-N60MYY48QH'; 
  let initialPageViewSent = false;
  let scriptLoaded = false;

  onMount(() => {
    if (!browser) return;

    // Evitar ejecución múltiple
    if (scriptLoaded) return;
    scriptLoaded = true;

    // Verificar si el script ya existe
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)) {
      return;
    }

    // 1. Inicializar dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };

    // 2. Configurar GA4
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: true,
      page_title: document.title,
      page_location: window.location.href,
      page_referrer: document.referrer || undefined
    });

    // 3. Cargar script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    initialPageViewSent = true;
  });

  // 4. Tracking de navegación SPA
  $: if (browser && $page.url.pathname && initialPageViewSent) {
    // Pequeño delay para asegurar que el título se actualizó
    setTimeout(() => {
      window.gtag?.('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: $page.url.pathname,
        send_to: measurementId
      });
    }, 100);
  }
</script>