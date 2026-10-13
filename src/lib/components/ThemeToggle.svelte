<script lang="ts">
  import { onMount } from 'svelte';

  /**
   * Botón claro / oscuro. Guarda la elección en localStorage (`fp_theme`) y la aplica
   * como `data-theme` en <html>; app.html la lee antes de pintar. Sin elección, manda
   * la preferencia del sistema.
   */
  let dark = $state(true);

  const systemDark = () => matchMedia('(prefers-color-scheme: dark)').matches;

  onMount(() => {
    const t = document.documentElement.dataset.theme;
    dark = t ? t === 'dark' : systemDark();
  });

  function toggle() {
    dark = !dark;
    const theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('fp_theme', theme);
    } catch {
      /* modo privado: solo dura esta visita */
    }
  }
</script>

<button
  type="button"
  class="theme-toggle"
  onclick={toggle}
  aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
  title={dark ? 'Modo claro' : 'Modo oscuro'}
>
  {#if dark}
    <!-- sol -->
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
  {:else}
    <!-- luna -->
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
  {/if}
</button>

<style>
  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    flex: none;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: transparent;
    color: #fff;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.2s;
  }
  .theme-toggle:hover { border-color: rgba(255, 255, 255, 0.5); }
  .theme-toggle:active { transform: scale(0.95); }
  .theme-toggle:focus-visible { outline: 2px solid #01f59e; outline-offset: 2px; }
</style>
