<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { browser, dev } from '$app/environment';
  import { PUBLIC_META_PIXEL_ID } from '$env/static/public';

  let scriptLoaded = false;
  let initialPageViewSent = false;

  onMount(() => {
    if (!browser) return;
    if (dev) return; // skip en development pa no contaminar metrics
    if (!PUBLIC_META_PIXEL_ID) return; // no configurado, salir
    if (scriptLoaded) return;
    scriptLoaded = true;

    // Evitar doble carga si el script ya existe
    if (document.querySelector('script[src*="fbevents.js"]')) {
      return;
    }

    // 1. Snippet oficial de Meta Pixel — inicializa fbq() y dataLayer
    (function (f: any, b: Document, e: string, v: string) {
      let n: any, t: HTMLScriptElement, s: HTMLScriptElement | null;
      if (f.fbq) return;
      n = f.fbq = function () {
        // eslint-disable-next-line prefer-rest-params
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e) as HTMLScriptElement;
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0] as HTMLScriptElement;
      s?.parentNode?.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    // 2. Inicializar el pixel con tu ID
    (window as any).fbq('init', PUBLIC_META_PIXEL_ID);

    // 3. Disparar PageView inicial
    (window as any).fbq('track', 'PageView');

    initialPageViewSent = true;
  });

  // 4. Tracking SPA — cada cambio de ruta dispara nuevo PageView
  $: if (browser && !dev && initialPageViewSent && $page.url.pathname) {
    setTimeout(() => {
      (window as any).fbq?.('track', 'PageView');
    }, 100);
  }
</script>

<svelte:head>
  {#if PUBLIC_META_PIXEL_ID && !dev}
    <!-- Noscript fallback: trackea visitas aunque JS esté desactivado -->
    <noscript>
      <img
        height="1"
        width="1"
        style="display:none"
        src={`https://www.facebook.com/tr?id=${PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  {/if}
</svelte:head>
