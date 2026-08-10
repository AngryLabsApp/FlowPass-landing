<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import logoIcon from "$lib/assets/icons/logo-icon.svg";
  import { ArrowRightOnRectangle } from "svelte-heros-v2";
  import InstallAppButton from "$lib/pwa/InstallAppButton.svelte";
  import { trackLogin, trackSchedule } from "$lib/tracking/track";

  let isOpen = false;
  let scrolled = false;

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
  class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(95%,1200px)] transition-all duration-500 ease-in-out"
>
  <div
    class="glass-nav flex justify-between items-center px-5 py-2 rounded-2xl"
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
        class="w-32 h-10 transition-transform duration-300 group-hover:scale-105"
        width="32"
        height="32"
      />
    </a>

    <!-- DESKTOP MENU -->
    <ul
      class="hidden lg:flex items-center gap-6 text-neutral-400 font-medium text-sm list-none"
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
          href="/#contacto"
          class="hover:text-white transition duration-200 ease-in-out"
          >Contacto</a
        >
      </li>

      <li class="flex items-center gap-3 ml-2">
        <span class="w-px h-4 bg-white/15" aria-hidden="true"></span>

        <!-- Install PWA -->
        <InstallAppButton variant="desktop" />

        <!-- Asesoría ghost -->
        <a
          href="/agenda"
          aria-label="Agendar una asesoría gratuita con FlowPass"
          onclick={() => trackSchedule('navbar_desktop')}
          class="text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200"
        >
          Agendar asesoría
        </a>

        <!-- Ingresar — CTA notorio -->
        <a
          href="https://app.flow-pass.com/login"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ingresar a la plataforma FlowPass"
          onclick={() => trackLogin('navbar_desktop')}
          class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-brand text-[#09090f] hover:shadow-[0_0_22px_rgba(1,245,158,0.45)] hover:-translate-y-[2px] transition-all duration-300"
        >
          Ingresar
          <ArrowRightOnRectangle class="w-4 h-4" />
        </a>
      </li>
    </ul>

    <!-- MOBILE TOGGLE -->
    <button
      class="lg:hidden text-white hover:text-brand transition"
      onclick={() => (isOpen = !isOpen)}
      aria-expanded={isOpen}
      aria-controls="menu-movil"
      aria-label="Abrir menú de navegación"
    >
      {#if isOpen}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
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
          class="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
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

  <!-- MOBILE MENU -->
  {#if isOpen}
    <div
      id="menu-movil"
      role="menu"
      aria-label="Menú móvil FlowPass"
      class="lg:hidden glass-nav mt-2 px-6 py-5 space-y-4 rounded-2xl animate-slideDown"
    >
      <a
        href="/#features"
        class="block text-neutral-300 hover:text-white transition-colors duration-200"
        onclick={() => (isOpen = false)}>Funciones</a
      >
      <a
        href="/#precios"
        class="block text-neutral-300 hover:text-white transition-colors duration-200"
        onclick={() => (isOpen = false)}>Precios</a
      >
      <a
        href="/#faq"
        class="block text-neutral-300 hover:text-white transition-colors duration-200"
        onclick={() => (isOpen = false)}>FAQ</a
      >
      <a
        href="/about"
        class="block text-neutral-300 hover:text-white transition-colors duration-200"
        onclick={() => (isOpen = false)}>Nosotros</a
      >
      <a
        href="/#contacto"
        class="block text-neutral-300 hover:text-white transition-colors duration-200"
        onclick={() => (isOpen = false)}>Contacto</a
      >

      <div class="pt-2 border-t border-white/10 flex flex-col gap-2">
        <InstallAppButton variant="mobile" onInstall={() => (isOpen = false)} />

        <a
          href="/agenda"
          aria-label="Agendar una asesoría gratuita con FlowPass"
          onclick={() => {
            trackSchedule('navbar_mobile');
            isOpen = false;
          }}
          class="block text-center px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 border border-white/15 hover:border-white/30 hover:text-white transition-all duration-200"
        >
          Agendar asesoría
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
          class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand text-[#09090f] transition-all duration-200"
        >
          Ingresar a la plataforma
          <ArrowRightOnRectangle class="w-4 h-4" />
        </a>
      </div>
    </div>
  {/if}
</nav>

<style>
  .glass-nav {
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .glass-scrolled {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(28px) saturate(200%);
    -webkit-backdrop-filter: blur(28px) saturate(200%);
    border-color: rgba(255, 255, 255, 0.14);
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
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
