<script lang="ts">
  import { onMount } from "svelte";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
  import { siteConfig } from "$lib/config/site";
  import { googleRating, googleReviews } from "$lib/data/googleReviews";

  const ratingText = googleRating.rating.toFixed(1).replace(".", ",");
  // El carrusel se mueve en bucle: repetimos la lista hasta tener varias tarjetas por mitad
  const reviewLoop = Array.from({ length: Math.max(2, Math.ceil(6 / Math.max(googleReviews.length, 1))) }, () => googleReviews).flat();
  const initial = (name: string) => name.trim().charAt(0).toUpperCase();
  let reviewsEl: HTMLElement;
  let reviewsIn = false;

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
    // Estrellas: se animan cuando las opiniones entran en pantalla
    if (reviewsEl) {
      const rio = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        reviewsIn = true;
        rio.disconnect();
      }, { threshold: 0.3 });
      rio.observe(reviewsEl);
    }
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
      <div class="g-reviews" class:in={reviewsIn} bind:this={reviewsEl}>
        <div class="g-top">
          <div class="g-score">
            <span class="g-num">{ratingText}</span>
            <div>
              <span class="g-stars g-stars-lg" aria-label={`${ratingText} de 5 estrellas`}>
                {#each [0, 1, 2, 3, 4] as i (i)}<span class="g-star" style={`--d:${i * 110}ms`}>★</span>{/each}
              </span>
              <p class="g-count">{googleRating.count} {googleRating.count === 1 ? "opinión" : "opiniones"} en Google</p>
            </div>
          </div>
          <div class="g-links">
            <a href={siteConfig.social.google} target="_blank" rel="noopener noreferrer">Ver en Google →</a>
            <a class="g-cta" href={siteConfig.social.googleReview} target="_blank" rel="noopener noreferrer">¿Ya usas FlowPass? Deja tu opinión ★</a>
          </div>
        </div>
        <div class="g-marquee" aria-label="Opiniones de clientes en Google">
          <ul class="g-track">
            {#each [...reviewLoop, ...reviewLoop] as r, i (i)}
              <li class="g-card" aria-hidden={i >= googleReviews.length ? "true" : undefined}>
                <span class="g-quote" aria-hidden="true">“</span>
                <span class="g-stars" aria-label={`${r.stars} de 5 estrellas`}>
                  {#each Array(r.stars) as _, k (k)}<span class="g-star" style={`--d:${500 + k * 90}ms`}>★</span>{/each}
                </span>
                <blockquote>{r.text}</blockquote>
                <div class="g-who">
                  <span class="g-avatar" aria-hidden="true">{initial(r.author)}</span>
                  <span><b>{r.author}</b>{#if r.business}<small>{r.business}</small>{/if}</span>
                </div>
              </li>
            {/each}
          </ul>
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
  /* ── Opiniones de Google ─────────────────────────────── */
  .g-reviews { margin-top: 32px; display: grid; gap: 22px; }
  .g-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px 24px; }
  .g-score { display: flex; align-items: center; gap: 14px; }
  .g-num { font: 700 clamp(44px, 6vw, 60px)/1 var(--display); letter-spacing: -0.02em; background: linear-gradient(135deg, #531dd8, #01f59e); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .g-count { margin: 4px 0 0 !important; font-size: 14px; color: var(--fg-2); }
  .g-stars { display: inline-flex; gap: 2px; color: #f5b301; line-height: 1; }
  .g-stars-lg { font-size: 26px; gap: 4px; }
  .g-star { display: inline-block; }
  .g-links { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; font-size: 14px; }
  .g-links a { color: var(--accent-text); text-decoration: none; font-weight: 600; }
  .g-links a:hover { text-decoration: underline; }
  .g-links .g-cta { padding: 9px 16px; border-radius: 999px; border: 1px solid color-mix(in srgb, #01f59e 45%, var(--line)); background: color-mix(in srgb, #01f59e 10%, transparent); }
  .g-links .g-cta:hover { text-decoration: none; background: color-mix(in srgb, #01f59e 18%, transparent); }

  .g-marquee { overflow: hidden; padding: 6px 0 14px; -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
  .g-track { list-style: none; margin: 0; padding: 0; display: flex; gap: 18px; width: max-content; animation: g-scroll 45s linear infinite; }
  .g-marquee:hover .g-track, .g-marquee:focus-within .g-track { animation-play-state: paused; }
  @keyframes g-scroll { to { transform: translateX(calc(-50% - 9px)); } }

  .g-card { position: relative; width: min(380px, 82vw); flex: none; display: flex; flex-direction: column; gap: 14px; padding: 26px 24px 22px; border-radius: 22px; background:
      linear-gradient(var(--panel), var(--panel)) padding-box,
      linear-gradient(135deg, color-mix(in srgb, #531dd8 70%, transparent), color-mix(in srgb, #01f59e 70%, transparent)) border-box;
    border: 1.5px solid transparent; box-shadow: 0 18px 40px -28px rgba(83, 29, 216, 0.55); transition: transform 0.25s, box-shadow 0.25s; }
  .g-card:hover { transform: translateY(-4px); box-shadow: 0 24px 50px -26px rgba(83, 29, 216, 0.7); }
  .g-quote { position: absolute; top: 4px; right: 18px; font: 700 76px/1 var(--display); color: color-mix(in srgb, #531dd8 22%, transparent); pointer-events: none; }
  .g-card .g-stars { font-size: 17px; }
  .g-card blockquote { margin: 0; flex: 1; font-size: 15.5px; line-height: 1.6; color: var(--fg); }
  .g-who { display: flex; align-items: center; gap: 12px; }
  .g-avatar { flex: none; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; font: 700 16px var(--display); color: #fff; background: linear-gradient(135deg, #531dd8, #01f59e); }
  .g-who b { display: block; font-size: 14.5px; }
  .g-who small { display: block; font-size: 12.5px; color: var(--fg-2); }

  /* Estrellas: se encienden una por una al entrar en pantalla y luego brillan de vez en cuando */
  @media (prefers-reduced-motion: no-preference) {
    .g-reviews .g-star { opacity: 0.25; transform: scale(0.6); filter: grayscale(1); }
    .g-reviews.in .g-star { animation: g-pop 0.5s cubic-bezier(.34, 1.56, .64, 1) var(--d) forwards, g-shine 4s ease-in-out calc(var(--d) + 1.2s) infinite; }
  }
  @keyframes g-pop { to { opacity: 1; transform: scale(1); filter: none; } }
  @keyframes g-shine { 0%, 88%, 100% { text-shadow: none; transform: scale(1); } 92% { text-shadow: 0 0 12px rgba(245, 179, 1, 0.9); transform: scale(1.18); } }
  @media (prefers-reduced-motion: reduce) {
    .g-track { animation: none; width: auto; }
    .g-marquee { overflow-x: auto; -webkit-mask-image: none; mask-image: none; }
    .g-card[aria-hidden="true"] { display: none; }
  }
  @media (max-width: 560px) {
    .g-top { align-items: flex-start; }
    .g-links { width: 100%; }
  }
</style>
