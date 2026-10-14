<script lang="ts">
  import { onMount } from 'svelte';
  import { trackBooking } from '$lib/tracking/track';
  import { detectCountry, CAL_COUNTRY_LABEL } from '$lib/utils/country';
  import { metaCookies } from '$lib/tracking/meta';

  /**
   * Calendario de Cal.com incrustado (inline). Es el snippet oficial de Cal.com
   * ("Inline embed") adaptado a Svelte: carga embed.js solo en el navegador.
   * - forwardQueryParams: los parámetros de la URL (?name=&email=&attendeePhoneNumber=)
   *   llegan al formulario de Cal.com ya escritos (los manda LeadForm al terminar).
   * - La pregunta "País" (identificador `pais`) se marca según la zona horaria del visitante.
   * - Al confirmar la reserva se registra la conversión (Schedule en Meta) con el uid
   *   de la reserva como eventID.
   * - `metadata[ua|fbp|fbc]`: navegador y cookies de Meta viajan dentro de la reserva.
   *   n8n los usa para mandar el mismo Schedule por la API de conversiones (mismo uid →
   *   Meta no lo cuenta dos veces) y para que Meta reconozca mejor a la persona.
   * La reserva la procesa n8n por el webhook de Cal.com (find_or_create_lead).
   */
  let {
    calLink = 'flowpass/conoce-flowpass',
    namespace = 'conoce-flowpass'
  }: { calLink?: string; namespace?: string } = $props();

  const elId = `cal-inline-${namespace}`;
  let loaded = $state(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type CalFn = any;

  // Datos para la API de conversiones de Meta (los lee n8n desde la reserva)
  function metaMetadata(): Record<string, string> {
    const { fbp, fbc } = metaCookies();
    const m: Record<string, string> = { 'metadata[ua]': navigator.userAgent.slice(0, 450) };
    if (fbp) m['metadata[fbp]'] = fbp;
    if (fbc) m['metadata[fbc]'] = fbc;
    return m;
  }

  onMount(() => {
    const w = window as unknown as { Cal?: CalFn };
    // Snippet oficial de Cal.com, sin cambios: encola las llamadas hasta que carga embed.js
    // prettier-ignore
    // @ts-expect-error snippet de terceros escrito en JS
    (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");

    const Cal = w.Cal!;
    Cal('init', namespace, { origin: 'https://app.cal.com' });
    Cal.config = Cal.config || {};
    Cal.config.forwardQueryParams = true;

    const dark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;

    const api = Cal.ns[namespace];
    api('inline', {
      elementOrSelector: `#${elId}`,
      // `pais`: la pregunta "País" del formulario de Cal.com llega ya marcada (identificador `pais`).
      // Si la URL ya trae ?pais=…, gana esa (forwardQueryParams).
      config: {
        layout: 'month_view',
        useSlotsViewOnSmallScreen: 'true',
        theme: dark ? 'dark' : 'light',
        ...metaMetadata(),
        ...(new URLSearchParams(location.search).has('pais') ? {} : { pais: CAL_COUNTRY_LABEL[detectCountry()] })
      },
      calLink
    });
    api('ui', {
      // Se muestra la columna de detalles: ahí está el selector de zona horaria
      hideEventTypeDetails: false,
      layout: 'month_view',
      theme: dark ? 'dark' : 'light',
      cssVarsPerTheme: { light: { 'cal-brand': '#531DD8' }, dark: { 'cal-brand': '#01F59E' } }
    });
    api('on', { action: 'linkReady', callback: () => (loaded = true) });
    api('on', {
      action: 'bookingSuccessfulV2',
      callback: (e: CustomEvent<{ data?: { uid?: string } }>) =>
        trackBooking('cal_booking', { fuente: 'cal.com' }, e.detail?.data?.uid)
    });
  });
</script>

<div class="cal-wrap" class:loaded>
  {#if !loaded}
    <div class="cal-loading" aria-live="polite">Cargando el calendario…</div>
  {/if}
  <div id={elId} class="cal-inline"></div>
  <noscript>
    <a href={`https://cal.com/${calLink}`}>Abrir el calendario de FlowPass</a>
  </noscript>
</div>

<style>
  /* El alto mínimo solo reserva espacio mientras carga: con el calendario listo,
     Cal.com centra su iframe en el contenedor y un mínimo fijo dejaría aire arriba */
  .cal-wrap { position: relative; min-height: 460px; }
  .cal-inline { width: 100%; overflow: auto; }
  .cal-wrap.loaded { min-height: 0; }
  .cal-loading {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 14px;
    color: var(--fg-3, rgba(9, 9, 15, 0.6));
  }
</style>
