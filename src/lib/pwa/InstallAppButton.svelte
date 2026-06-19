<!-- PWA — temporal hasta lanzar app nativa. Ver src/lib/pwa/README.md -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowDownTray } from 'svelte-heros-v2';
  import { pwaInstall } from './usePwaInstall.svelte';

  interface Props {
    variant?: 'desktop' | 'mobile';
    onInstall?: () => void;
  }

  let { variant = 'desktop', onInstall }: Props = $props();

  onMount(() => {
    pwaInstall.init();
  });

  async function handleInstall() {
    const outcome = await pwaInstall.promptInstall();
    if (outcome === 'accepted') onInstall?.();
  }

  let show = $derived(
    !pwaInstall.isStandalone && (pwaInstall.deferred !== null || pwaInstall.isIOS)
  );

  const baseClasses =
    'group relative flex items-center gap-2 rounded-xl text-sm font-medium ' +
    'bg-brand/10 border border-brand/25 text-brand ' +
    'hover:bg-brand/15 hover:border-brand/50 ' +
    'hover:shadow-[0_0_18px_rgba(1,245,158,0.18)] hover:-translate-y-[1px] ' +
    'transition-all duration-200';

  const sizing = $derived(
    variant === 'desktop' ? 'px-3.5 py-2' : 'justify-center px-4 py-2.5 w-full'
  );
</script>

{#snippet content()}
  <ArrowDownTray class="w-4 h-4 flex-shrink-0" />
  <span class="whitespace-nowrap">Crear acceso directo</span>
  {#if variant === 'desktop'}
    <span
      class="ml-1 px-1.5 py-0.5 rounded-md bg-brand/20 text-brand text-[10px] font-semibold uppercase tracking-wider leading-none"
    >
      Nuevo
    </span>
  {/if}
{/snippet}

{#if show}
  {#if pwaInstall.deferred}
    <button
      type="button"
      onclick={handleInstall}
      aria-label="Instalar FlowPass como app"
      class="{baseClasses} {sizing}"
    >
      {@render content()}
    </button>
  {:else if pwaInstall.isIOS}
    <a
      href="/launch"
      aria-label="Cómo instalar FlowPass en iOS"
      title="En iOS: toca Compartir y luego ‘Añadir a pantalla de inicio’"
      class="{baseClasses} {sizing}"
    >
      {@render content()}
    </a>
  {/if}
{/if}
