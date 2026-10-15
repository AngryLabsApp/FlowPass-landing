<script lang="ts">
  import { onMount } from "svelte";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
  import { siteConfig } from "$lib/config/site";
  import { googleRating, googleReviews } from "$lib/data/googleReviews";

  const ratingText = googleRating.rating.toFixed(1).replace(".", ",");

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
    drag: "free" as const,
    breakpoints: {
      1024: { perPage: 2 },
      640: { perPage: 1, arrows: false },
    },
    autoScroll: {
      speed: 0.4,
      pauseOnHover: true,
      pauseOnFocus: true,
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

  // Los reels de Instagram pesan varios MB: se cargan recién cuando la sección
  // está por entrar en pantalla, no al abrir la página.
  let sectionEl: HTMLElement;
  onMount(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        mounted = true;
        // espera un tick para que Splide renderice los slides antes de procesar embeds
        setTimeout(loadInstagram, 100);
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(sectionEl);
    return () => io.disconnect();
  });
</script>

<section
  id="testimonios"
  class="relative w-full"
  aria-labelledby="testimonios-heading"
  bind:this={sectionEl}
>
  <div class="wrap">
    <div class="t-head">
      <p class="eyebrow">En su día a día</p>
      <h2 id="testimonios-heading" class="sec-title">Ya nos confiaron su operación. Esto es lo que opinan.</h2>
    </div>

    <!-- Opiniones reales de Google (src/lib/data/googleReviews.ts) -->
    {#if googleReviews.length > 0}
      <div class="g-reviews">
        <p class="g-score">
          <span class="g-stars" aria-hidden="true">★★★★★</span>
          <b>{ratingText}</b> en Google · {googleRating.count} {googleRating.count === 1 ? "opinión" : "opiniones"}
        </p>
        <div class="g-list">
          {#each googleReviews as r (r.author)}
            <figure class="g-card">
              <span class="g-stars" aria-label={`${r.stars} de 5 estrellas`}>{"★".repeat(r.stars)}</span>
              <blockquote>“{r.text}”</blockquote>
              <figcaption>— {r.author}</figcaption>
            </figure>
          {/each}
        </div>
        <div class="g-links">
          <a href={siteConfig.social.google} target="_blank" rel="noopener noreferrer">Ver en Google →</a>
          <a href={siteConfig.social.googleReview} target="_blank" rel="noopener noreferrer">¿Ya usas FlowPass? Deja tu opinión ★</a>
        </div>
      </div>
    {/if}

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

    <div class="reel-carousel">
      {#if mounted}
        <Splide options={splideOptions} extensions={{ AutoScroll }} aria-label="Testimonios en video">
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
  .t-head { max-width: 760px; }
  .reel-carousel { margin-top: 40px; }
  @media (max-width: 560px) {
    .reel-carousel { margin-top: 20px; }
  }
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
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(8px);
    height: 2rem;
    width: 2rem;
    opacity: 0.5;
    transition: opacity 0.2s, background 0.2s, border-color 0.2s;
  }
  .reel-carousel :global(.splide__arrow svg) {
    fill: rgba(255, 255, 255, 0.7);
    height: 0.8rem;
    width: 0.8rem;
  }
  .reel-carousel :global(.splide__arrow--prev svg) {
    transform: scaleX(-1);
  }
  .reel-carousel :global(.splide__arrow:hover:not(:disabled)) {
    opacity: 1;
    background: rgba(1, 245, 158, 0.1);
    border-color: rgba(1, 245, 158, 0.3);
  }
  .reel-carousel :global(.splide__arrow:disabled) {
    opacity: 0.15;
  }

  @media (max-width: 640px) {
    .reel-carousel :global(.splide__arrow) {
      height: 1.75rem;
      width: 1.75rem;
    }
    .reel-carousel :global(.splide__arrow svg) {
      height: 0.7rem;
      width: 0.7rem;
    }
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
  .g-reviews { display: grid; gap: 14px; justify-items: start; margin-top: 28px; }
  .g-score { margin: 0; font-size: 14.5px; color: var(--fg-2); }
  .g-score b { color: var(--fg); }
  .g-stars { color: #f5b301; letter-spacing: 1px; }
  .g-list { display: grid; gap: 12px; width: 100%; max-width: 640px; }
  .g-card { margin: 0; display: grid; gap: 8px; padding: 18px 20px; border: 1px solid var(--line); border-radius: 18px; background: var(--panel); text-align: left; }
  .g-card blockquote { margin: 0; font-size: 15px; line-height: 1.55; color: var(--fg); }
  .g-card figcaption { font-size: 13px; color: var(--fg-2); }
  .g-links { display: flex; flex-wrap: wrap; gap: 8px 18px; font-size: 13.5px; }
  .g-links a { color: var(--accent-text); text-decoration: none; }
  .g-links a:hover { text-decoration: underline; }
</style>
