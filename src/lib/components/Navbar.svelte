<script lang="ts">
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import { onMount } from "svelte";
  import logoIcon from "$lib/assets/icons/logo-icon.svg";
  import { ArrowRightOnRectangle } from "svelte-heros-v2";
  import InstallAppButton from "$lib/pwa/InstallAppButton.svelte";
  import { trackLogin, trackSchedule } from "$lib/tracking/track";

  let isOpen = $state(false);
  let scrolled = $state(false);

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 10;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
</script>

<!-- FLOATING GLASS NAVBAR -->
<nav
  aria-label="Menú principal de FlowPass"
  class="fixed top-3 lg:top-4 left-1/2 -translate-x-1/2 z-50 w-[min(calc(100%-32px),1280px)] transition-all duration-500 ease-in-out"
>
  <div
    class="glass-nav flex justify-between items-center pl-4 pr-1.5 py-1.5 lg:pl-5 lg:pr-2 lg:py-2 rounded-full"
    class:glass-scrolled={scrolled}
  >
    <!-- LOGO -->
    <a
      href="/"
      class="flex items-center gap-2 group"
      title="FlowPass - Software para academias, volver al inicio"
      aria-label="FlowPass inicio">
      <img
        src={logoIcon}
        alt="FlowPass: software de gestión para academias"
        class="w-20 h-7 lg:w-28 lg:h-9 transition-transform duration-300 group-hover:scale-105"
        width="32"
        height="32"
      />
    </a>

    <!-- DESKTOP MENU -->
    <ul
      class="hidden lg:flex items-center gap-7 text-white/70 font-medium text-[15px] list-none"
    >
      <li>
        <a
          href="/#features"
          class="hover:text-white transition duration-200 ease-in-out"
          >Funciones</a
        >
      </li>

      <li>
        <a
          href="/#precios"
          class="hover:text-white transition duration-200 ease-in-out"
          >Precios</a
        >
      </li>

      <li>
        <a
          href="/#faq"
          class="hover:text-white transition duration-200 ease-in-out"
          >FAQ</a
        >
      </li>

      <li>
        <a
          href="/about"
          class="hover:text-white transition duration-200 ease-in-out"
          >Nosotros</a
        >
      </li>

      <li>
        <a
          href="/contacto"
          class="hover:text-white transition duration-200 ease-in-out"
          >Contacto</a
        >
      </li>

      <li class="flex items-center gap-3 ml-2">
        <span class="w-px h-5 bg-white/15" aria-hidden="true"></span>

        <!-- Install PWA -->
        <InstallAppButton variant="desktop" />

        <ThemeToggle />

        <!-- Ingresar — secundario -->
        <a
          href="https://app.flow-pass.com/login"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ingresar a la plataforma FlowPass"
          onclick={() => trackLogin('navbar_desktop')}
          class="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold text-white border border-white/20 hover:border-white/50 transition-colors duration-200"
        >
          Ingresar
          <ArrowRightOnRectangle class="w-4 h-4" />
        </a>

        <!-- Agenda — CTA principal, igual que en la portada -->
        <a
          href="/agenda"
          aria-label="Agendar una llamada de 15 minutos con FlowPass"
          onclick={() => trackSchedule('navbar_desktop')}
          class="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold bg-brand text-[#04150e] hover:-translate-y-px transition-transform duration-200"
        >
          Agenda 15 min
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
        </a>
      </li>
    </ul>

    <!-- MOBILE: tema + menú -->
    <div class="lg:hidden flex items-center gap-2">
    <ThemeToggle />
    <button
      type="button"
      class="lg:hidden nav-toggle inline-flex items-center justify-center w-10 h-10 rounded-full text-white border border-white/20 hover:border-white/50 active:scale-95 transition"
      onclick={() => (isOpen = !isOpen)}
      aria-expanded={isOpen}
      aria-controls="menu-movil"
      aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
    >
      {#if isOpen}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      {/if}
    </button>
    </div>
  </div>

  <!-- MOBILE MENU -->
  {#if isOpen}
    <div
      id="menu-movil"
      role="menu"
      aria-label="Menú móvil FlowPass"
      class="lg:hidden glass-nav mt-2 px-4 py-3 rounded-2xl animate-slideDown text-[15px]"
    >
      <a
        href="/#features"
        class="block py-2 text-neutral-300 hover:text-white transition-colors duration-200"
        onclick={() => (isOpen = false)}>Funciones</a
      >
      <a
        href="/#precios"
        class="block py-2 text-neutral-300 hover:text-white transition-colors duration-200"
        onclick={() => (isOpen = false)}>Precios</a
      >
      <a
        href="/#faq"
        class="block py-2 text-neutral-300 hover:text-white transition-colors duration-200"
        onclick={() => (isOpen = false)}>FAQ</a
      >
      <a
        href="/about"
        class="block py-2 text-neutral-300 hover:text-white transition-colors duration-200"
        onclick={() => (isOpen = false)}>Nosotros</a
      >
      <a
        href="/contacto"
        class="block py-2 text-neutral-300 hover:text-white transition-colors duration-200"
        onclick={() => (isOpen = false)}>Contacto</a
      >

      <div class="mt-2 pt-3 border-t border-white/10 flex flex-col gap-2">
        <InstallAppButton variant="mobile" onInstall={() => (isOpen = false)} />

        <a
          href="/agenda"
          aria-label="Agendar una asesoría gratuita con FlowPass"
          onclick={() => {
            trackSchedule('navbar_mobile');
            isOpen = false;
          }}
          class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold bg-brand text-[#04150e]"
        >
          Agenda 15 minutos
        </a>

        <a
          href="https://app.flow-pass.com/login"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ingresar a la plataforma FlowPass"
          onclick={() => {
            trackLogin('navbar_mobile');
            isOpen = false;
          }}
          class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold text-white border border-white/20 hover:border-white/50 transition-colors duration-200"
        >
          Ingresar a la plataforma
          <ArrowRightOnRectangle class="w-4 h-4" />
        </a>
      </div>
    </div>
  {/if}
</nav>

<style>
  /* Negro FlowPass casi sólido: mismo tono que la portada, se lee sobre cualquier sección. */
  .glass-nav {
    background: rgba(9, 9, 15, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 30px -12px rgba(9, 9, 15, 0.5);
  }

  .glass-scrolled {
    background: rgba(9, 9, 15, 0.97);
    box-shadow: 0 14px 40px -14px rgba(9, 9, 15, 0.65);
  }

  @keyframes slideDown {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-slideDown {
    animation: slideDown 0.3s ease forwards;
  }
</style>
