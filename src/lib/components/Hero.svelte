<script lang="ts">
  import { CalendarDays } from "svelte-heros-v2";
  import { onMount, onDestroy } from "svelte";
  import Laptop from "./../assets/images/laptop.png";
  import Phone from "./../assets/images/phone.png";
  import whatsappIcon from "$lib/assets/icons/whatsapp-icon.svg";
  import { siteConfig } from "$lib/config/site";
  import { trackContact, trackSchedule } from "$lib/tracking/track";
  import { waCountry, type CountryCode } from "$lib/stores/waCountry.svelte";
  import gymLogo from "$lib/assets/images/clients/gym.png";
  import karateLogo from "$lib/assets/images/clients/karate.png";
  import musicaLogo from "$lib/assets/images/clients/musica.png";
  import idiomasLogo from "$lib/assets/images/clients/idiomas.png";

  const heroMsg = "?text=¡Hola!%20Quisiera%20conocer%20cómo%20FlowPass%20puede%20ayudar%20a%20mi%20negocio.";
  const countries = Object.values(siteConfig.phones);

  const sloganWords = ["Automatiza.", "Simplifica.", "Fluye."];
  let activeWord = 0;

  let waOpen = $state(false);
  let waWrapEl: HTMLDivElement | undefined;

  function toggleWa() { waOpen = !waOpen; }
  function pickWa(code: CountryCode) {
    waCountry.set(code);
    trackContact("hero");
    waOpen = false;
  }
  function onDocClickWa(e: MouseEvent) {
    if (!waOpen) return;
    if (waWrapEl && !waWrapEl.contains(e.target as Node)) waOpen = false;
  }
  function onKeyWa(e: KeyboardEvent) {
    if (e.key === "Escape") waOpen = false;
  }

  onMount(() => {
    waCountry.init();
    document.addEventListener("click", onDocClickWa);
    document.addEventListener("keydown", onKeyWa);
    const id = setInterval(() => {
      activeWord = (activeWord + 1) % sloganWords.length;
    }, 1500);
    return () => clearInterval(id);
  });
  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.removeEventListener("click", onDocClickWa);
      document.removeEventListener("keydown", onKeyWa);
    }
  });

  const verticals = [
    { emoji: "🥊", label: "Academias deportivas" },
    { emoji: "🧘", label: "Yoga & pilates" },
    { emoji: "🎵", label: "Escuelas de música" },
    { emoji: "🧠", label: "Salud mental" },
    { emoji: "🗣️", label: "Idiomas" },
    { emoji: "🪵", label: "Talleres & cursos" },
    { emoji: "🤸", label: "Gimnasios" },
    { emoji: "👶", label: "Talleres para niños" },
  ];

</script>

<section
  id="inicio"
  class="hero-section relative w-full overflow-hidden"
  aria-labelledby="hero-heading"
>
  <!-- Ambient glow (only here) -->
  <div class="hero-glow pointer-events-none absolute inset-0"></div>


  <div
    class="relative max-w-7xl mx-auto px-5 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center"
  >
    <div class="space-y-6">
      <span class="sr-only">Estás en: Inicio - FlowPass</span>

      <!-- Badge -->
      <span
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-white/80 bg-white/5 border border-white/10 backdrop-blur-md"
        role="doc-subtitle"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
        Gestión de membresías para LATAM
      </span>

      <!-- H1 -->
      <h1 id="hero-heading" class="hero-title font-epoch font-bold tracking-tight">
      <p>FlowPass</p>
        <span class="block text-white">Cobra, gestiona y</span>
        <span class="block bg-gradient-to-r from-[#01f59e] via-[#3168F4] to-[#531DD8] bg-clip-text text-transparent">
          automatiza tu negocio
        </span>
        <span class="block text-white/25">sin el caos del Excel.</span>
      </h1>

      <!-- Slogan animado -->
      <div class="slogan" aria-label="Automatiza. Simplifica. Fluye.">
        {#each sloganWords as word, i}
          <span class="slogan-word" class:is-active={i === activeWord} aria-hidden={i !== activeWord}>
            {word}
          </span>
        {/each}
      </div>

      <!-- Description -->
      <p class="hero-description font-oktah">
        <strong class="text-white">FlowPass</strong> es el software para cualquier negocio
        que vende clases, planes o membresías. Pagos, asistencias y WhatsApp en un solo lugar.
      </p>

      <!-- Verticals chips: scroll horizontal en móvil, wrap en desktop -->
      <div class="verticals-wrap" aria-label="Verticales soportadas">
        <ul class="verticals-list list-none">
          {#each verticals as v}
            <li>
              <span class="vertical-chip inline-flex items-center gap-1.5">
                <span aria-hidden="true">{v.emoji}</span>
                <span class="whitespace-nowrap">{v.label}</span>
              </span>
            </li>
          {/each}
        </ul>
      </div>

      <!-- CTAs -->
      <div class="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-3">
        <a
          href="/agenda"
          aria-label="Agendar una asesoría gratuita con FlowPass"
          class="cta-link"
          onclick={() => trackSchedule('hero')}
        >
          <button
            class="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 min-h-[44px] text-base font-semibold rounded-xl bg-brand text-dark-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(1,245,158,0.45)] transition-all duration-300"
          >
            Agendar asesoría
            <CalendarDays class="w-5 h-5" aria-hidden="true" />
          </button>
        </a>

        <div class="cta-link hero-wa-wrap" bind:this={waWrapEl}>
          <button
            type="button"
            class="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 min-h-[44px] text-base font-semibold rounded-xl bg-transparent text-white border border-white/20 hover:border-brand/40 hover:bg-white/[0.04] transition-all duration-300"
            aria-haspopup="menu"
            aria-expanded={waOpen}
            aria-label="Escribir a FlowPass por WhatsApp (elegir país)"
            onclick={(e) => { e.stopPropagation(); toggleWa(); }}
          >
            Escríbenos
            <img src={whatsappIcon} alt="" class="w-5 h-5 brightness-0 invert" loading="lazy" />
          </button>

          {#if waOpen}
            <div class="hero-wa-panel" role="menu" aria-label="Elige con qué equipo hablar">
              <p class="hero-wa-panel__title">¿Con qué equipo quieres hablar?</p>
              <ul class="hero-wa-panel__list">
                {#each countries as c}
                  <li>
                    <a
                      href={`${c.whatsapp}${heroMsg}`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      class="hero-wa-option"
                      role="menuitem"
                      onclick={() => pickWa(c.code as CountryCode)}
                    >
                      <span class="hero-wa-option__flag" aria-hidden="true">{c.flag}</span>
                      <span class="hero-wa-option__body">
                        <span class="hero-wa-option__label">Equipo {c.label}</span>
                        <span class="hero-wa-option__phone">{c.formatted}</span>
                      </span>
                      <span class="hero-wa-option__arrow" aria-hidden="true">↗</span>
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      </div>

      <!-- Social proof -->
      <div class="flex items-center gap-3 pt-4">
        <div class="flex -space-x-2" aria-label="Negocios que usan FlowPass">
          <span class="client-circle ring-2 ring-[#09090f]">
            <img src={gymLogo} alt="Gym" class="client-circle-logo" loading="lazy" />
          </span>
          <span class="client-circle ring-2 ring-[#09090f]">
            <img src={karateLogo} alt="Karate" class="client-circle-logo" loading="lazy" />
          </span>
          <span class="client-circle ring-2 ring-[#09090f]">
            <img src={musicaLogo} alt="Música" class="client-circle-logo" loading="lazy" />
          </span>
          <span class="client-circle ring-2 ring-[#09090f]">
            <img src={idiomasLogo} alt="Idiomas" class="client-circle-logo" loading="lazy" />
          </span>
        </div>
        <p class="text-sm text-white/70">
          Confiado por negocios en Latinoamérica
        </p>
      </div>
    </div>

    <!-- Image -->
    <figure class="relative flex justify-center md:block w-full">
      <div class="absolute inset-0 -z-10 bg-brand/20 blur-[100px] rounded-full"></div>

      <div class="relative w-full max-w-full md:max-w-3xl md:scale-110 lg:scale-125">
        <!-- Laptop -->
        <img
          src={Laptop}
          alt="Dashboard de FlowPass mostrando gestión de membresías, pagos y asistencias"
          class="w-full drop-shadow-[0_25px_60px_rgba(1,245,158,0.18)]"
          loading="eager"
          width="1200"
          height="800"
        />

        <!-- Phone flotando bottom-right -->
        <img
          src={Phone}
          alt="Vista móvil de FlowPass mostrando asistencias y calendario"
          class="absolute bottom-[6%] right-[3%] w-[28%] rotate-[5deg] drop-shadow-[0_20px_50px_rgba(83,29,216,0.45)]"
          loading="eager"
          width="430"
          height="932"
        />
      </div>

      <figcaption class="sr-only">
        Vista previa del software FlowPass con panel de control mostrando alumnos activos, pagos recientes y estadísticas de asistencia.
      </figcaption>
    </figure>
  </div>
</section>

<style>
  .hero-section {
    padding-top: 7rem;
    padding-bottom: 3rem;
  }
  @media (min-width: 768px) {
    .hero-section {
      padding-top: 8rem;
      padding-bottom: 5rem;
    }
  }

  .hero-glow {
    background-image:
      radial-gradient(ellipse at 0% 100%, rgba(1, 245, 158, 0.2) 0%, transparent 60%),
      radial-gradient(ellipse at 100% 0%, rgba(83, 29, 216, 0.25) 0%, transparent 55%);
  }

  .hero-title {
    font-size: clamp(2.25rem, 7vw, 3.75rem);
    line-height: 1.05;
  }

  .cta-link {
    display: block;
    width: 100%;
  }
  @media (min-width: 640px) {
    .cta-link { width: auto; }
  }

  /* CTA Escríbenos: popover selector de país */
  .hero-wa-wrap {
    position: relative;
  }
  .hero-wa-panel {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    z-index: 40;
    background: rgba(14, 18, 30, 0.96);
    -webkit-backdrop-filter: blur(14px);
    backdrop-filter: blur(14px);
    border: 0.5px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    padding: 0.85rem;
    width: min(19rem, calc(100vw - 2.5rem));
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    animation: heroWaFade 0.16s ease-out both;
    color: #fff;
  }
  @keyframes heroWaFade {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero-wa-panel__title {
    font-size: 0.78rem;
    font-weight: 600;
    color: rgba(255,255,255,0.65);
    margin: 0 0 0.6rem;
    letter-spacing: 0.02em;
  }
  .hero-wa-panel__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .hero-wa-option {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.55rem 0.7rem;
    border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    text-decoration: none;
    color: #fff;
    transition: background 0.18s, border-color 0.18s, transform 0.18s;
  }
  .hero-wa-option:hover {
    background: rgba(1,245,158,0.08);
    border-color: rgba(1,245,158,0.35);
    transform: translateY(-1px);
  }
  .hero-wa-option__flag {
    font-size: 1.25rem;
    line-height: 1;
    flex-shrink: 0;
  }
  .hero-wa-option__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .hero-wa-option__label {
    font-size: 0.86rem;
    font-weight: 700;
    line-height: 1.15;
  }
  .hero-wa-option__phone {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.55);
    line-height: 1.15;
    margin-top: 2px;
  }
  .hero-wa-option__arrow {
    color: rgba(1,245,158,0.85);
    font-weight: 700;
    flex-shrink: 0;
  }

  /* Slogan animado */
  .slogan {
    position: relative;
    height: 1.6em;
    font-size: 18px;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.5);
  }
  .slogan-word {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.6s ease, transform 0.6s ease, color 0.6s ease;
    color: rgba(255, 255, 255, 0.5);
    will-change: opacity, transform;
  }
  .slogan-word.is-active {
    opacity: 1;
    transform: translateY(0);
    color: #01f59e;
  }

  /* Description */
  .hero-description {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.45);
    max-width: 460px;
    line-height: 1.6;
  }
  .hero-description strong {
    color: #ffffff;
  }

  /* Verticals: scroll horizontal en móvil */
  .verticals-wrap {
    margin-left: -1.25rem;
    margin-right: -1.25rem;
    padding: 4px 1.25rem;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .verticals-wrap::-webkit-scrollbar { display: none; }
  .verticals-list {
    display: flex;
    flex-wrap: nowrap;
    gap: 0.5rem;
  }
  @media (min-width: 768px) {
    .verticals-wrap {
      margin: 0;
      padding: 0;
      overflow: visible;
    }
    .verticals-list { flex-wrap: wrap; }
  }

  .vertical-chip {
    background: rgba(255, 255, 255, 0.04);
    border: 0.5px solid rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    padding: 6px 12px;
    transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
    cursor: default;
    flex-shrink: 0;
  }
  .vertical-chip:hover {
    border-color: rgba(1, 245, 158, 0.3);
    background: rgba(1, 245, 158, 0.05);
    color: rgba(255, 255, 255, 0.9);
  }

  /* Client circles */
  .client-circle {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.06);
    border: 0.5px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    cursor: default;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
  }
  .client-circle:hover {
    transform: translateY(-3px) scale(1.12);
    background: rgba(1, 245, 158, 0.08);
    border-color: rgba(1, 245, 158, 0.35);
    box-shadow: 0 0 16px rgba(1, 245, 158, 0.3);
  }
  .client-circle:hover .client-circle-logo {
    filter: grayscale(0%) brightness(1);
  }
  .client-circle-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 5px;
    filter: grayscale(100%) brightness(0.75);
    transition: filter 0.25s ease;
  }
</style>
