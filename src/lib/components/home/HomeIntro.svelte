<script lang="ts">
  import { reveal } from '$lib/actions/reveal';
  import { homeStats, clientLogos } from '$lib/data/homeData';

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

  {#if clientLogos.length}
    <div class="marquee" aria-label="Academias que usan FlowPass" use:reveal>
      <p class="mq-title">Confían en FlowPass</p>
      <div class="mq-track">
        {#each [0, 1] as copy (copy)}
          <ul aria-hidden={copy === 1}>
            {#each clientLogos as logo (logo.src)}
              <li>
                {#if logo.href}
                  <a href={logo.href} target="_blank" rel="noopener noreferrer" tabindex={copy === 1 ? -1 : 0}>
                    <img src={logo.src} alt={copy === 1 ? '' : logo.name} loading="lazy" decoding="async" />
                  </a>
                {:else}
                  <img src={logo.src} alt={copy === 1 ? '' : logo.name} loading="lazy" decoding="async" />
                {/if}
              </li>
            {/each}
          </ul>
        {/each}
      </div>
    </div>
  {/if}
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
  .marquee { margin-top: 40px; display: grid; gap: 14px; }
  .mq-title {
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--fg-3);
  }
  .mq-track {
    display: flex;
    overflow: hidden;
    mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  }
  .mq-track ul {
    list-style: none;
    margin: 0;
    padding: 0 0 0 14px;
    display: flex;
    align-items: center;
    gap: 14px;
    flex: none;
    animation: mq 70s linear infinite;
  }
  .mq-track:hover ul { animation-play-state: paused; }
  /* Cada logo en una ficha blanca: se ven igual en claro y en oscuro (los hay negros y de color).
     En gris por defecto para no competir con la marca; a color al pasar el mouse. */
  .mq-track li { flex: none; display: grid; place-items: center; width: 112px; height: 72px; padding: 8px 12px; border-radius: 14px; background: #fff; border: 1px solid rgba(9, 9, 15, 0.06); }
  .mq-track img { display: block; max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; filter: grayscale(1) contrast(1.05); opacity: 0.72; transition: filter 0.25s, opacity 0.25s; }
  .mq-track li:hover img { filter: none; opacity: 1; }
  @keyframes mq { to { transform: translateX(-100%); } }
  @media (prefers-reduced-motion: reduce) {
    .mq-track ul { animation: none; flex-wrap: wrap; }
    .mq-track ul[aria-hidden='true'] { display: none; }
  }
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
