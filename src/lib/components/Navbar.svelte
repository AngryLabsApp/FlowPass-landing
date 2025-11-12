<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { onMount } from "svelte";

  let isOpen = false;
  let scrolled = false;

  // Detectar scroll para animar el fondo
  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 10;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
</script>

<nav
  class="fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out"
  class:bg-white={scrolled}
  class:shadow-md={scrolled}
  class:backdrop-blur-md={!scrolled}
>
  <div
    class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 transition-all duration-500"
  >
    <!-- LOGO -->
    <a href="/" class="flex items-center gap-2 group">
      <img
        src="src/lib/assets/icons/logo-icon.svg"
        alt="FlowPass logo"
        class="w-8 h-8 transition-transform duration-300 group-hover:scale-105"
      />
      <span
        class="font-jakarta font-bold text-lg text-dark-200 group-hover:text-brand transition-colors"
      >
        FlowPass
      </span>
    </a>

    <!-- DESKTOP MENU -->
    <div
      class="hidden md:flex items-center gap-8 text-neutral-700 font-medium transition-all duration-300"
    >
      <a
        href="#inicio"
        class="hover:text-brand transition duration-200 ease-in-out">Inicio</a
      >
      <a
        href="#how"
        class="hover:text-brand transition duration-200 ease-in-out"
        >Cómo funciona</a
      >
      <a
        href="#features"
        class="hover:text-brand transition duration-200 ease-in-out"
        >Funciones</a
      >
      <a
        href="#faq"
        class="hover:text-brand transition duration-200 ease-in-out"
        >Preguntas frecuentes</a
      >
      <a
        href="#contacto"
        class="hover:text-brand transition duration-200 ease-in-out">Contacto</a
      >

      <Button
        color="secondary"
        class="rounded-xl text-sm font-semibold px-5 py-2 shadow-sm hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300"
      >
        Agendar demo
      </Button>
    </div>

    <!-- MOBILE MENU BUTTON -->
    <button
      class="md:hidden text-dark-200 hover:text-brand transition"
      on:click={() => (isOpen = !isOpen)}
      aria-label="Abrir menú"
    >
      {#if isOpen}
        <!-- Close icon -->
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
        <!-- Menu icon -->
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
      class="md:hidden bg-white border-t border-light-200 px-6 py-4 space-y-3 animate-slideDown"
    >
      <a
        href="#inicio"
        class="block text-neutral-700 hover:text-brand transition-colors duration-200"
        >Inicio</a
      >
      <a
        href="#how"
        class="block text-neutral-700 hover:text-brand transition-colors duration-200"
        >Cómo funciona</a
      >
      <a
        href="#features"
        class="block text-neutral-700 hover:text-brand transition-colors duration-200"
        >Funciones</a
      >
      <a
        href="#faq"
        class="block text-neutral-700 hover:text-brand transition-colors duration-200"
        >Preguntas frecuentes</a
      >
      <a
        href="#contacto"
        class="block text-neutral-700 hover:text-brand transition-colors duration-200"
        >Contacto</a
      >

      <Button
        color="secondary"
        class="w-full rounded-xl mt-3 transition-transform duration-300 hover:scale-[1.02]"
      >
        Agendar demo
      </Button>
    </div>
  {/if}
</nav>

<style>
  /* Animación para menú móvil */
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
