<script lang="ts">
  /**
   * Captcha de Cloudflare Turnstile (casi siempre invisible: solo pide marcar una casilla si duda).
   * Entrega un token de un solo uso (5 min) que el API revisa con Cloudflare. Después de usarlo, llamar a `reset()`.
   * Clave pública: PUBLIC_TURNSTILE_SITE_KEY. En local, la de prueba de Cloudflare `1x00000000000000000000AA`.
   */
  import { onDestroy, onMount } from "svelte";
  import { env } from "$env/dynamic/public";

  type TurnstileApi = {
    render: (el: HTMLElement, opts: Record<string, unknown>) => string;
    reset: (id: string) => void;
    remove: (id: string) => void;
  };

  let { token = $bindable("") }: { token?: string } = $props();

  const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  let el: HTMLDivElement;
  let widgetId: string | null = null;

  /** El script se carga una sola vez por página, aunque haya varios widgets. */
  function loadScript(): Promise<TurnstileApi> {
    const w = window as unknown as { turnstile?: TurnstileApi; __turnstileLoading?: Promise<TurnstileApi> };
    if (w.turnstile) return Promise.resolve(w.turnstile);
    w.__turnstileLoading ??= new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SCRIPT_URL;
      s.async = true;
      s.onload = () => (w.turnstile ? resolve(w.turnstile) : reject(new Error("Turnstile no cargó")));
      s.onerror = () => reject(new Error("Turnstile no cargó"));
      document.head.appendChild(s);
    });
    return w.__turnstileLoading;
  }

  onMount(async () => {
    if (!env.PUBLIC_TURNSTILE_SITE_KEY) return;
    const api = await loadScript().catch(() => null);
    if (!api || !el) return;
    widgetId = api.render(el, {
      sitekey: env.PUBLIC_TURNSTILE_SITE_KEY,
      language: "es",
      theme: "dark",
      callback: (t: string) => (token = t),
      "expired-callback": () => (token = ""),
      "error-callback": () => (token = ""),
    });
  });

  onDestroy(() => {
    if (typeof window === "undefined") return; // la página se prerenderiza
    const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
    if (api && widgetId) api.remove(widgetId);
  });

  /** Pide un token nuevo (el anterior ya se usó). */
  export function reset() {
    token = "";
    const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
    if (api && widgetId) api.reset(widgetId);
  }
</script>

<div bind:this={el} class="turnstile"></div>

<style>
  /* Centrado y con aire: el widget de Cloudflare mide 300 px de ancho. */
  .turnstile { min-height: 65px; display: flex; justify-content: center; margin: 4px 0; }
</style>
