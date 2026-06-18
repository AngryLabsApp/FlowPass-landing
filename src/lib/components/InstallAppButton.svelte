<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowDownTray } from 'svelte-heros-v2';

  interface Props {
    variant?: 'desktop' | 'mobile';
    onInstall?: () => void;
  }

  let { variant = 'desktop', onInstall }: Props = $props();

  type BIPEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  };

  let deferred = $state<BIPEvent | null>(null);
  let isStandalone = $state(false);
  let isIOS = $state(false);

  onMount(() => {
    isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;

    isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);

    const handler = (e: Event) => {
      e.preventDefault();
      deferred = e as BIPEvent;
    };
    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      deferred = null;
      isStandalone = true;
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  });

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') {
      deferred = null;
      onInstall?.();
    }
  }

  let show = $derived(!isStandalone && (deferred !== null || isIOS));
</script>

{#if show}
  {#if deferred}
    <button
      type="button"
      onclick={install}
      aria-label="Instalar FlowPass como app"
      class={variant === 'desktop'
        ? 'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white border border-white/15 hover:border-brand hover:text-brand transition-all duration-200'
        : 'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white border border-white/15 hover:border-brand transition-all duration-200'}
    >
      <ArrowDownTray class="w-4 h-4" />
      Instalar app
    </button>
  {:else if isIOS}
    <a
      href="/launch"
      aria-label="Cómo instalar FlowPass en iOS"
      title="En iOS: toca Compartir y luego ‘Añadir a pantalla de inicio’"
      class={variant === 'desktop'
        ? 'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white border border-white/15 hover:border-brand hover:text-brand transition-all duration-200'
        : 'flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white border border-white/15 hover:border-brand transition-all duration-200'}
    >
      <ArrowDownTray class="w-4 h-4" />
      Instalar app
    </a>
  {/if}
{/if}
