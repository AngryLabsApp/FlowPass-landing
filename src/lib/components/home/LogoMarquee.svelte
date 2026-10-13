<script lang="ts">
  import { reveal } from '$lib/actions/reveal';
  import { clientLogos } from '$lib/data/homeData';

  // Carrusel de logos de academias clientes. Se usa en la home y en las páginas de contacto.
  // compact: franja fina y sutil (sin fichas), pensada para ir arriba de un formulario.
  let { title = 'Confían en FlowPass', compact = false }: { title?: string; compact?: boolean } = $props();
</script>

{#if clientLogos.length}
  <div class="marquee" class:compact aria-label="Academias que usan FlowPass" use:reveal>
    <p class="mq-title">{title}</p>
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

<style>
  .marquee { margin-top: 40px; display: grid; gap: 14px; }
  .mq-title {
    margin: 0;
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--fg-3, rgba(9, 9, 15, 0.6));
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
  .mq-track li { flex: none; display: grid; place-items: center; width: 104px; height: 62px; padding: 6px 10px; box-sizing: border-box; border-radius: 14px; background: #fff; border: 1px solid rgba(9, 9, 15, 0.06); }
  .mq-track img { display: block; max-width: 84px; max-height: 48px; width: auto; height: auto; object-fit: contain; filter: grayscale(1) contrast(1.05); opacity: 0.72; transition: filter 0.25s, opacity 0.25s; }
  .mq-track li:hover img { filter: none; opacity: 1; }
  /* Versión sutil: logos chicos, sin ficha, casi transparentes; el título va centrado */
  /* Ancho acotado: franja discreta, no a todo lo ancho */
  .compact { margin: 0 auto; gap: 6px; max-width: 760px; }
  .compact .mq-title { text-align: center; letter-spacing: 0.02em; text-transform: none; font-weight: 500; font-size: 12px; }
  .compact .mq-track ul { gap: 22px; padding-left: 22px; animation-duration: 90s; }
  .compact .mq-track li { width: auto; height: 28px; padding: 0; background: none; border: 0; border-radius: 0; }
  .compact .mq-track img { max-width: 52px; max-height: 28px; opacity: 0.45; mix-blend-mode: multiply; }
  /* Los logos tienen fondo blanco: en claro se funde con multiply; en oscuro se invierte y se funde con screen */
  :global(:root[data-theme='dark']) .compact .mq-track img { filter: grayscale(1) invert(1); mix-blend-mode: screen; opacity: 0.55; }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .compact .mq-track img { filter: grayscale(1) invert(1); mix-blend-mode: screen; opacity: 0.55; }
  }
  @keyframes mq { to { transform: translateX(-100%); } }
  @media (prefers-reduced-motion: reduce) {
    .mq-track ul { animation: none; flex-wrap: wrap; }
    .mq-track ul[aria-hidden='true'] { display: none; }
  }
  @media (max-width: 560px) {
    .marquee { margin-top: 24px; gap: 10px; }
    .mq-title { font-size: 10.5px; }
    .mq-track ul { gap: 8px; padding-left: 8px; }
    .mq-track li { width: 76px; height: 48px; padding: 5px 7px; border-radius: 10px; }
    .mq-track img { max-width: 62px; max-height: 36px; }
    .compact .mq-track ul { gap: 20px; padding-left: 20px; }
    .compact .mq-track li { width: auto; height: 32px; padding: 0; }
    .compact .mq-track img { max-width: 56px; max-height: 32px; }
    .compact .mq-title { font-size: 11px; }
  }
</style>
