<!-- PWA — temporal hasta lanzar app nativa. Ver src/lib/pwa/README.md -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowDownTray } from 'svelte-heros-v2';
  import { pwaInstall } from './usePwaInstall.svelte';
  import { trackPwaInstallClick, trackPwaInstalled, trackPlayStoreClick } from '$lib/tracking/track';
  import { siteConfig } from '$lib/config/site';

  interface Props {
    /** strip: franja delgada arriba del header (solo compu). */
    variant?: 'desktop' | 'mobile' | 'strip';
    onInstall?: () => void;
  }

  let { variant = 'desktop', onInstall }: Props = $props();

  onMount(() => {
    pwaInstall.init();
  });

  async function handleInstall() {
    // Intención del usuario — dispara aunque después cancele en el modal nativo.
    trackPwaInstallClick(`navbar_${variant}`);
    const outcome = await pwaInstall.promptInstall();
    if (outcome === 'accepted') {
      trackPwaInstalled(`navbar_${variant}`);
      onInstall?.();
    }
  }

  let show = $derived(pwaInstall.canOffer);

  const baseClasses =
    'group relative flex items-center gap-2 rounded-xl text-sm font-medium ' +
    'bg-brand/10 border border-brand/25 text-brand ' +
    'hover:bg-brand/15 hover:border-brand/50 ' +
    'hover:shadow-[0_0_18px_rgba(1,245,158,0.18)] hover:-translate-y-[1px] ' +
    'transition-all duration-200';

  const stripClasses =
    'flex w-full h-10 items-center justify-center gap-2 bg-[#1b1035] text-[#e9e3ff] ' +
    'text-sm font-semibold hover:text-white transition-colors duration-200';

  const sizing = $derived(
    variant === 'desktop' ? 'px-3.5 py-2' : 'justify-center px-4 py-2.5 w-full'
  );
  const classes = $derived(variant === 'strip' ? stripClasses : `${baseClasses} ${sizing}`);
</script>

{#snippet content()}
  <ArrowDownTray class="w-4 h-4 flex-shrink-0" />
  <span class="whitespace-nowrap">
    {#if variant === 'strip'}
      {pwaInstall.isAndroid ? 'Descarga la app de FlowPass' : 'Instala FlowPass como app: crea un acceso directo'}
    {:else}
      {pwaInstall.isAndroid ? 'Descarga la app' : 'Crear acceso directo'}
    {/if}
  </span>
  {#if variant === 'strip'}
    <span
      class="px-2 py-0.5 rounded-full bg-brand text-[#04150e] text-[11px] font-extrabold uppercase tracking-wider leading-none"
    >
      Nuevo
    </span>
  {:else if variant === 'desktop'}
    <span
      class="ml-1 px-1.5 py-0.5 rounded-md bg-brand/20 text-brand text-[10px] font-semibold uppercase tracking-wider leading-none"
    >
      Nuevo
    </span>
  {/if}
{/snippet}

{#if show}
  {#if pwaInstall.isAndroid}
    <a
      href={siteConfig.playStore}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Descargar la app de FlowPass en Google Play"
      onclick={() => {
        trackPlayStoreClick(`navbar_${variant}`);
        onInstall?.();
      }}
      class={classes}
    >
      {@render content()}
    </a>
  {:else if pwaInstall.deferred}
    <button
      type="button"
      onclick={handleInstall}
      aria-label="Instalar FlowPass como app"
      class={classes}
    >
      {@render content()}
    </button>
  {:else if pwaInstall.isIOS}
    <a
      href="/launch"
      aria-label="Cómo instalar FlowPass en iOS"
      title="En iOS: toca Compartir y luego ‘Añadir a pantalla de inicio’"
      onclick={() => trackPwaInstallClick(`navbar_${variant}_ios`)}
      class={classes}
    >
      {@render content()}
    </a>
  {/if}
{/if}
