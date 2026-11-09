<!-- Badge "Disponible en Google Play" (app de la academia). Footer y portada en celular. -->
<script lang="ts">
  import PlayIcon from '$lib/components/PlayIcon.svelte';
  import { siteConfig } from '$lib/config/site';
  import { trackPlayStoreClick } from '$lib/tracking/track';

  let { source, class: cls = '', small = false }: { source: string; class?: string; small?: boolean } = $props();
</script>

<a
  class="play-badge {cls}"
  class:small
  href={siteConfig.playStore}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Descarga la app de FlowPass en Google Play"
  onclick={() => trackPlayStoreClick(source)}
>
  <PlayIcon size={small ? 17 : 22} />
  <span class="play-text">
    <span class="play-small">Disponible en</span>
    <span class="play-big">Google Play</span>
  </span>
</a>

<style>
  .play-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    min-height: 48px;
    padding: 0.4rem 1rem 0.4rem 0.75rem;
    border-radius: 10px;
    background: #000;
    border: 1px solid rgba(255,255,255,0.35);
    color: #fff;
    text-decoration: none;
    transition: border-color 0.2s, transform 0.2s;
  }
  .play-badge:hover { border-color: #01f59e; transform: translateY(-2px); }
  .play-badge:focus-visible { outline: 2px solid #01f59e; outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) { .play-badge:hover { transform: none; } }
  .play-text { display: flex; flex-direction: column; line-height: 1.1; }
  .play-small { font-size: 0.625rem; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255,255,255,0.75); }
  .play-big { font-size: 1.05rem; font-weight: 600; letter-spacing: -0.01em; }
  /* Portada en celular: un poco más chico. */
  .small { min-height: 40px; gap: 0.5rem; padding: 0.3rem 0.8rem 0.3rem 0.6rem; border-radius: 9px; }
  .small .play-small { font-size: 0.55rem; }
  .small .play-big { font-size: 0.9rem; }
</style>
