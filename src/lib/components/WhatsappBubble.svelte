<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import whatsappIcon from "$lib/assets/icons/whatsapp-icon.svg";
  import { siteConfig } from "$lib/config/site";
  import { trackContact } from "$lib/tracking/track";
  import { waCountry, type CountryCode } from "$lib/stores/waCountry.svelte";

  let {
    message = "Hola FlowPass, quiero saber más sobre la plataforma para mi negocio",
    ariaLabel = "Contactar a FlowPass por WhatsApp para consultar sobre el software de gestión",
    className = ""
  }: {
    message?: string;
    ariaLabel?: string;
    className?: string;
  } = $props();

  const encodedMsg = encodeURIComponent(message);
  const countries = Object.values(siteConfig.phones);

  let open = $state(false);
  let containerEl: HTMLDivElement | undefined;

  function toggle() {
    open = !open;
  }

  function pick(code: CountryCode) {
    waCountry.set(code);
    trackContact("floating_bubble");
    open = false;
  }

  function onDocClick(e: MouseEvent) {
    if (!open) return;
    if (containerEl && !containerEl.contains(e.target as Node)) open = false;
  }
  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") open = false;
  }

  onMount(() => {
    waCountry.init();
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
  });
  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    }
  });
</script>

<div
  bind:this={containerEl}
  class={`wa-bubble-root ${className}`}
>
  {#if open}
    <div
      class="wa-panel"
      role="dialog"
      aria-label="Elige con qué equipo hablar"
    >
      <p class="wa-panel__title">¿Con qué equipo quieres hablar?</p>
      <ul class="wa-panel__list">
        {#each countries as c}
          <li>
            <a
              href={`${c.whatsapp}?text=${encodedMsg}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              class="wa-option"
              onclick={() => pick(c.code as CountryCode)}
            >
              <span class="wa-option__flag" aria-hidden="true">{c.flag}</span>
              <span class="wa-option__body">
                <span class="wa-option__label">Equipo {c.label}</span>
                <span class="wa-option__phone">{c.formatted}</span>
              </span>
              <span class="wa-option__arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <button
    type="button"
    class="wa-bubble-btn"
    aria-haspopup="dialog"
    aria-expanded={open}
    aria-label={ariaLabel}
    onclick={(e) => { e.stopPropagation(); toggle(); }}
  >
    <img
      src={whatsappIcon}
      alt=""
      class="w-7 h-7"
      decoding="async"
      width="28"
      height="28"
      aria-hidden="true"
    />
    <span class="sr-only">Escríbenos por WhatsApp para conocer más sobre FlowPass</span>
  </button>
</div>

<style>
  .wa-bubble-root {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.75rem;
  }
  @media (min-width: 640px) {
    .wa-bubble-root { bottom: 1.5rem; right: 1.5rem; }
  }

  .wa-bubble-btn {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 9999px;
    background: #25D366;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    box-shadow: 0 8px 30px rgba(37, 211, 102, 0.45);
    transition: transform 0.25s ease;
  }
  .wa-bubble-btn:hover { transform: scale(1.05); }
  .wa-bubble-btn:focus-visible {
    outline: 2px solid #01f59e;
    outline-offset: 3px;
  }

  .wa-panel {
    background: rgba(14, 18, 30, 0.96);
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
    border: 0.5px solid rgba(255, 255, 255, 0.12);
    border-radius: 18px;
    padding: 0.9rem;
    width: min(18rem, calc(100vw - 2rem));
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
    animation: waFade 0.16s ease-out both;
    color: #fff;
  }
  @keyframes waFade {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .wa-panel__title {
    font-size: 0.78rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.65);
    margin: 0 0 0.65rem;
    letter-spacing: 0.02em;
  }
  .wa-panel__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .wa-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.85rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.04);
    border: 0.5px solid rgba(255, 255, 255, 0.08);
    color: #fff;
    text-decoration: none;
    transition: background 0.15s, border-color 0.15s, transform 0.15s;
  }
  .wa-option:hover {
    background: rgba(37, 211, 102, 0.12);
    border-color: rgba(37, 211, 102, 0.45);
    transform: translateY(-1px);
  }
  .wa-option__flag { font-size: 1.5rem; line-height: 1; }
  .wa-option__body {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    flex: 1;
    min-width: 0;
  }
  .wa-option__label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #fff;
    line-height: 1.15;
  }
  .wa-option__phone {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.6);
    font-variant-numeric: tabular-nums;
  }
  .wa-option__arrow {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.9rem;
  }
  .wa-option:hover .wa-option__arrow { color: #25D366; }

  .sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0 0 0 0);
    white-space: nowrap; border: 0;
  }
</style>
