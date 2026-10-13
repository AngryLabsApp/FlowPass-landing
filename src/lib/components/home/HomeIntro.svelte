<script lang="ts">
  import { reveal } from '$lib/actions/reveal';
  import { homeStats } from '$lib/data/homeData';
  import LogoMarquee from './LogoMarquee.svelte';

  const stats = homeStats.filter((s) => s.value);
</script>

<!-- Qué es FlowPass, en una frase + prueba (cifras y logos solo si son reales) -->
<div class="wrap intro">
  <p class="what" use:reveal>
    <b>FlowPass</b> es el sistema que cobra, recuerda y ordena tu negocio de membresías.
  </p>

  {#if stats.length}
    <div class="stats" aria-label="FlowPass en números" use:reveal>
      {#each stats as s (s.label)}
        <div class="stat"><b>{s.value}</b><span>{s.label}</span></div>
      {/each}
    </div>
  {/if}

  <LogoMarquee />
</div>

<style>
  .intro { padding-block: calc(var(--section-y) * 1.2) 0; }
  .what {
    max-width: 900px;
    font-size: clamp(22px, 2.6vw, 32px);
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: var(--fg-2);
    text-wrap: balance;
  }
  .what b { color: var(--fg); }
  .stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    border-block: 1px solid var(--line);
    margin-top: 36px;
  }
  .stat { padding: 24px; border-left: 1px solid var(--line); }
  .stat:first-child { border-left: 0; padding-left: 0; }
  .stat b {
    display: block;
    font-family: var(--display);
    font-size: 40px;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }
  .stat span { font-size: 14px; color: var(--fg-2); }
  @media (max-width: 900px) {
    .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .stat:nth-child(3) { border-left: 0; padding-left: 0; }
    .stat:nth-child(n + 3) { border-top: 1px solid var(--line); }
  }
  @media (max-width: 560px) {
    .what { font-size: 19px; }
    .stats { margin-top: 28px; }
    .stat { padding: 16px 0 16px 16px; }
    .stat b { font-size: clamp(22px, 7vw, 28px); line-height: 1.1; }
    .stat span { display: block; margin-top: 6px; font-size: 13px; line-height: 1.35; }
  }
</style>
