<!-- PWA — temporal hasta lanzar app nativa. Ver src/lib/pwa/README.md -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowDownTray, XMark } from 'svelte-heros-v2';
  import { pwaInstall } from './usePwaInstall.svelte';
  import { trackPwaInstallClick, trackPwaInstalled } from '$lib/tracking/track';

  const STORAGE_KEY = 'fp-install-toast-dismissed';
  const DELAY_MS = 3_000;
  const EXIT_MS = 750;

  let elapsed = $state(false);
  let dismissed = $state(false);
  let exiting = $state(false);

  onMount(() => {
    pwaInstall.init();
    dismissed = localStorage.getItem(STORAGE_KEY) === '1';

    const timer = setTimeout(() => {
      elapsed = true;
    }, DELAY_MS);

    return () => clearTimeout(timer);
  });

  function dismiss() {
    if (exiting) return;
    exiting = true;
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore quota / privacy mode errors
    }
    setTimeout(() => {
      dismissed = true;
      exiting = false;
    }, EXIT_MS);
  }

  async function install() {
    trackPwaInstallClick('toast');
    const outcome = await pwaInstall.promptInstall();
    if (outcome === 'accepted') {
      trackPwaInstalled('toast');
    } else if (outcome === 'dismissed') {
      dismiss();
    }
  }

  let show = $derived(
    elapsed &&
      !dismissed &&
      !pwaInstall.isStandalone &&
      (pwaInstall.deferred !== null || pwaInstall.isIOS)
  );
</script>

{#if show}
  <div
    class="fixed top-[72px] right-3 left-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2
           sm:w-[min(95%,1200px)] z-50 pointer-events-none"
  >
    <div
      role="dialog"
      aria-label="Instalar FlowPass como app"
      class="ml-auto max-w-[340px] sm:max-w-sm pointer-events-auto relative
             rounded-xl sm:rounded-2xl border border-brand/25
             bg-[#0f0f14]/90 backdrop-blur-md
             shadow-[0_4px_20px_rgba(0,0,0,0.3)]
             sm:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(1,245,158,0.15)]
             p-3 sm:p-4 transition-none
             {exiting
        ? 'animate-[slideOutRight_0.75s_cubic-bezier(0.4,0,1,1)_forwards]'
        : 'animate-[slideInRight_0.95s_cubic-bezier(0.22,1,0.36,1)]'}"
    >
      <button
        type="button"
        onclick={dismiss}
        aria-label="Cerrar"
        class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition"
      >
        <XMark class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      <div class="flex items-start gap-2.5 sm:gap-3 pr-5 sm:pr-6">
        <div
          class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand/15 border border-brand/30 flex items-center justify-center"
        >
          <ArrowDownTray class="w-4 h-4 sm:w-5 sm:h-5 text-brand" />
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-xs sm:text-sm font-semibold text-white leading-tight">
            Crea un acceso directo
          </p>
          <p class="mt-0.5 text-[11px] sm:text-xs text-neutral-400 leading-snug">
            Quedará en tu inicio. Sin descargas.
          </p>

          <div class="mt-2.5 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
            {#if pwaInstall.deferred}
              <button
                type="button"
                onclick={install}
                class="px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold bg-brand text-[#09090f]
                       hover:shadow-[0_0_18px_rgba(1,245,158,0.4)] transition-all duration-200"
              >
                Crear acceso
              </button>
            {:else if pwaInstall.isIOS}
              <a
                href="/launch"
                onclick={() => trackPwaInstallClick('toast_ios')}
                class="px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold bg-brand text-[#09090f]
                       hover:shadow-[0_0_18px_rgba(1,245,158,0.4)] transition-all duration-200"
              >
                Cómo hacerlo
              </a>
            {/if}
            <button
              type="button"
              onclick={dismiss}
              class="px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium text-neutral-400 hover:text-white transition"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(120%) scale(0.96);
      filter: blur(4px);
    }
    to {
      opacity: 1;
      transform: translateX(0) scale(1);
      filter: blur(0);
    }
  }

  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0) scale(1);
      filter: blur(0);
    }
    to {
      opacity: 0;
      transform: translateX(120%) scale(0.94);
      filter: blur(6px);
    }
  }
</style>
