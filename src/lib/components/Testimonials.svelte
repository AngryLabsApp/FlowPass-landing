<script lang="ts">
  import { onMount } from "svelte";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";

  const reelUrls = [
    "https://www.instagram.com/p/DVl81gqkfOn/",
    "https://www.instagram.com/p/DVrcZjSjfYg/",
    "https://www.instagram.com/p/DVv7kCQkZsV/",
    "https://www.instagram.com/p/DVzSmHWEXQT/",
    "https://www.instagram.com/p/DWc4Y4lkfwQ/",
    "https://www.instagram.com/p/DXfKJ75EXEK/",
  ];

  // TODO: agregar logos en static/logos/ y completar lista
  const clientLogos: { src: string; name: string }[] = [
    // { src: "/logos/logo-1.svg", name: "Cliente 1" },
  ];

  const splideOptions = {
    type: "loop" as const,
    perPage: 3,
    perMove: 1,
    gap: "1.25rem",
    pagination: true,
    arrows: true,
    speed: 700,
    breakpoints: {
      1024: { perPage: 2 },
      640: { perPage: 1 },
    },
  };

  let mounted = false;

  function processEmbeds() {
    // @ts-ignore
    if (window.instgrm?.Embeds?.process) {
      // @ts-ignore
      window.instgrm.Embeds.process();
    }
  }

  function loadInstagram() {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.instagram.com/embed.js"]'
    );
    if (!existing) {
      const s = document.createElement("script");
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      s.onload = () => {
        processEmbeds();
        // reintento por si Splide aún no terminó de renderizar
        setTimeout(processEmbeds, 800);
        setTimeout(processEmbeds, 2000);
      };
      document.body.appendChild(s);
    } else {
      processEmbeds();
      setTimeout(processEmbeds, 800);
    }
  }

  onMount(() => {
    mounted = true;
    // espera un tick para que Splide renderice los slides antes de procesar embeds
    setTimeout(loadInstagram, 100);
  });
</script>

<section
  id="testimonios"
  class="relative w-full py-24"
  aria-labelledby="testimonios-heading"
>
  <div class="max-w-6xl mx-auto px-6">
    <div class="text-center">
      <span
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-white/80 bg-white/5 border border-white/10 backdrop-blur-md"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
        Testimonios
      </span>

      <h2
        id="testimonios-heading"
        class="font-epoch font-bold text-3xl md:text-5xl text-white mt-5 leading-tight"
      >
        Lo que dicen nuestros clientes
      </h2>
      <p class="font-oktah text-white/60 mt-3 text-lg">
        Negocios reales, resultados reales.
      </p>
    </div>

    {#if clientLogos.length > 0}
      <div class="mt-12">
        <p class="text-center text-xs uppercase tracking-widest text-white/40 mb-6">
          Negocios que confían en FlowPass
        </p>
        <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {#each clientLogos as logo}
            <img
              src={logo.src}
              alt={logo.name}
              class="h-8 md:h-10 w-auto opacity-50 hover:opacity-100 transition-opacity duration-300 brightness-0 invert"
              loading="lazy"
            />
          {/each}
        </div>
      </div>
    {/if}

    <div class="mt-12 reel-carousel">
      {#if mounted}
        <Splide options={splideOptions} aria-label="Testimonios en video">
          {#each reelUrls as url (url)}
            <SplideSlide>
              <div
                class="reel-frame mx-auto rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-md p-1.5"
              >
                <div class="reel-clip">
                  <div class="reel-skeleton" aria-hidden="true"></div>
                  <blockquote
                    class="instagram-media"
                    data-instgrm-permalink={url}
                    data-instgrm-version="14"
                    style="background:#000; border:0; margin:0; padding:0; width:100%; min-width:unset;"
                  ></blockquote>
                </div>
              </div>
            </SplideSlide>
          {/each}
        </Splide>
      {:else}
        <!-- Skeleton mientras monta -->
        <div class="skeleton-row">
          {#each [0,1,2] as _}
            <div class="skeleton-card">
              <div class="skeleton-shimmer"></div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .reel-frame {
    max-width: 340px;
  }

  .reel-clip {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    border-radius: 12px;
    background: #000;
  }

  .reel-clip :global(iframe) {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 100% !important;
    min-width: 100% !important;
    height: auto !important;
    min-height: 100% !important;
  }

  .reel-frame :global(.instagram-media) {
    border-radius: 12px !important;
    margin: 0 !important;
    min-width: unset !important;
    max-width: 100% !important;
  }

  .reel-frame :global(.instagram-media-rendered) {
    min-width: unset !important;
    max-width: 100% !important;
  }

  .reel-carousel :global(.splide__pagination__page) {
    background: rgba(255, 255, 255, 0.2);
  }
  .reel-carousel :global(.splide__pagination__page.is-active) {
    background: #01f59e;
    transform: scale(1.2);
  }
  .reel-carousel :global(.splide__arrow) {
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
    height: 2.5rem;
    width: 2.5rem;
    opacity: 1;
  }
  .reel-carousel :global(.splide__arrow svg) {
    fill: #fff;
    height: 1rem;
    width: 1rem;
  }
  .reel-carousel :global(.splide__arrow:hover:not(:disabled)) {
    background: rgba(1, 245, 158, 0.15);
    border-color: rgba(1, 245, 158, 0.4);
  }
  .reel-carousel :global(.splide__arrow:disabled) {
    opacity: 0.3;
  }

  /* Skeleton loader */
  .skeleton-row {
    display: flex;
    gap: 1.25rem;
    justify-content: center;
  }
  .skeleton-card {
    width: 340px;
    aspect-ratio: 4 / 5;
    border-radius: 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
  }
  .skeleton-shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255,255,255,0.04) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  /* Skeleton dentro del reel mientras Instagram carga */
  .reel-skeleton {
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.03);
    z-index: 0;
  }
</style>
