<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { CalendarDays } from "svelte-heros-v2";
  import { onMount } from "svelte";
  import Laptop from "./../assets/images/laptop.png";
  import Phone from "./../assets/images/phone.png";
  import whatsappIcon from "$lib/assets/icons/whatsapp-icon.svg";
  import { siteConfig } from "$lib/config/site";
  import gymLogo from "$lib/assets/images/clients/gym.png";
  import karateLogo from "$lib/assets/images/clients/karate.png";
  import musicaLogo from "$lib/assets/images/clients/musica.png";
  import idiomasLogo from "$lib/assets/images/clients/idiomas.png";

  const whatsappLink = `https://wa.me/${siteConfig.phone}?text=¡Hola!%20Quisiera%20conocer%20cómo%20FlowPass%20puede%20ayudar%20a%20mi%20negocio.`;

  const sloganWords = ["Automatiza.", "Simplifica.", "Fluye."];
  let activeWord = 0;

  onMount(() => {
    const id = setInterval(() => {
      activeWord = (activeWord + 1) % sloganWords.length;
    }, 1500);
    return () => clearInterval(id);
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

  <!-- Subtle grid -->
  <div class="pointer-events-none absolute inset-0 opacity-[0.04]"
    style="background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 48px 48px;">
  </div>

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
        Gestión de membresías para Latinoamérica
      </span>

      <!-- H1 -->
      <h1 id="hero-heading" class="hero-title font-epoch font-bold tracking-tight">
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
          href="https://calendar.app.google/niQmo8L4nZ7d4Kt8A"
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label="Agendar una demo gratuita de FlowPass"
          class="cta-link"
          onclick={() => {
            window.gtag?.('event', 'cta_click', {
              event_category: 'engagement',
              event_label: 'hero_demo_button',
              value: 1
            });
          }}
        >
          <Button
            class="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 min-h-[44px] text-base font-semibold rounded-xl bg-brand text-dark-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(1,245,158,0.45)] transition-all duration-300"
          >
            Agendar demo
            <CalendarDays class="w-5 h-5" aria-hidden="true" />
          </Button>
        </a>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir a FlowPass por WhatsApp"
          class="cta-link"
          onclick={() => {
            window.gtag?.('event', 'whatsapp_click', {
              event_category: 'contact',
              event_label: 'hero_button',
              value: 1
            });
          }}
        >
          <Button
            class="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 min-h-[44px] text-base font-semibold rounded-xl bg-transparent text-white border border-white/20 hover:border-brand/40 hover:bg-white/[0.04] transition-all duration-300"
          >
            Escríbenos
            <img src={whatsappIcon} alt="" class="w-5 h-5 brightness-0 invert" loading="lazy" />
          </Button>
        </a>
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
