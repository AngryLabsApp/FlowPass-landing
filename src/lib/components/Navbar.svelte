<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import logoIcon from "$lib/assets/icons/logo-icon.svg";
  import { CalendarDays } from "svelte-heros-v2";
  import whatsappIcon from "$lib/assets/icons/whatsapp-icon.svg";

  let isOpen = false;
  let scrolled = false;

  const whatsappNumber = "51977854515";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=¡Hola!%20Quisiera%20conocer%20cómo%20FlowPass%20puede%20ayudar%20a%20mi%20academia.`;

  // Detectar scroll para animar el fondo
  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 10;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
</script>

<!-- NAVIGATION BAR -->
<nav
  aria-label="Menú principal de FlowPass"
  class="fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out"
  class:bg-white={scrolled}
  class:shadow-md={scrolled}
  class:backdrop-blur-md={!scrolled}
>
  <div
    class="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 transition-all duration-500"
  >
    <!-- LOGO (marca con alt y enlace semántico) -->
    <a
      href="/"
      class="flex items-center gap-2 group"
      title="Ir al inicio de FlowPass"
      aria-label="Inicio de FlowPass"
    >
      <img
        src={logoIcon}
        alt="Logo de FlowPass, plataforma de gestión para academias"
        class="w-8 h-8 transition-transform duration-300 group-hover:scale-105"
      />
      <span
        class="font-jakarta font-bold text-lg text-dark-200 group-hover:text-brand transition-colors"
      >
        FlowPass
      </span>
    </a>

    <!-- MENÚ DESKTOP SEMÁNTICO -->
    <ul
      class="hidden md:flex items-center gap-8 text-neutral-700 font-medium transition-all duration-300 list-none"
    >
      <li>
        <a
          href="/#inicio"
          title="Inicio - Plataforma FlowPass"
          aria-current={$page.url.pathname === "/" ? "page" : undefined}
          class="hover:text-brand transition duration-200 ease-in-out">Inicio</a
        >
      </li>

      <li>
        <a
          href="/#features"
          title="Explora las funciones principales de FlowPass"
          aria-current={$page.url.pathname === "/" ? "page" : undefined}
          class="hover:text-brand transition duration-200 ease-in-out"
          >Funciones</a
        >
      </li>

      <li>
        <a
          href="/#faq"
          title="Preguntas frecuentes sobre FlowPass"
          aria-current={$page.url.pathname === "/" ? "page" : undefined}
          class="hover:text-brand transition duration-200 ease-in-out"
          >Preguntas frecuentes</a
        >
      </li>

      <li>
        <a
          href="/terminos#terms"
          title="Consulta nuestros términos y condiciones"
          aria-current={$page.url.pathname.startsWith("/terminos")
            ? "page"
            : undefined}
          class="hover:text-brand transition duration-200 ease-in-out"
          >Términos y condiciones</a
        >
      </li>

      <li>
        <a
          href="/#contacto"
          title="Contáctanos para más información"
          aria-current={$page.url.pathname === "/" ? "page" : undefined}
          class="hover:text-brand transition duration-200 ease-in-out"
          >Contacto</a
        >
      </li>

      <li class="flex items-center gap-3">
        <!-- Botón de agenda -->
        <a
          href="https://calendar.app.google/niQmo8L4nZ7d4Kt8A"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir el calendario para agendar una demo de FlowPass"
        >
          <Button
            color="dark"
            class="flex justify-center items-center gap-2 rounded-xl text-sm font-semibold px-5 py-2 shadow-sm hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300"
          >
            Agendar demo
            <CalendarDays class="w-5 h-5 text-light-50" />
          </Button>
        </a>

        <!-- Botón de WhatsApp -->
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
        >
          <Button
            class="flex justify-center items-center gap-2 rounded-xl text-sm font-semibold px-5 py-2 shadow-sm hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300 bg-[#25D366] text-white border border-[#1EBE5D]"
          >
            Escríbenos
            <img
              src={whatsappIcon}
              alt="WhatsApp icon"
              class="w-5 h-5 brightness-0 invert"
              loading="lazy"
            />
          </Button>
        </a>
      </li>
    </ul>

    <!-- BOTÓN MENÚ MÓVIL -->
    <button
      class="md:hidden text-dark-200 hover:text-brand transition"
      on:click={() => (isOpen = !isOpen)}
      aria-expanded={isOpen}
      aria-controls="menu-movil"
      aria-label="Abrir menú de navegación"
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

  <!-- MENÚ MÓVIL (ARIA + ANIMACIÓN) -->
  {#if isOpen}
    <div
      id="menu-movil"
      role="menu"
      aria-label="Menú móvil FlowPass"
      class="md:hidden bg-white border-t border-light-200 px-6 py-4 space-y-3 animate-slideDown"
    >
      <a
        href="/#inicio"
        class="block text-neutral-700 hover:text-brand transition-colors duration-200"
        on:click={() => (isOpen = false)}>Inicio</a
      >
      <a
        href="/#features"
        class="block text-neutral-700 hover:text-brand transition-colors duration-200"
        on:click={() => (isOpen = false)}>Funciones</a
      >
      <a
        href="/#faq"
        class="block text-neutral-700 hover:text-brand transition-colors duration-200"
        on:click={() => (isOpen = false)}>Preguntas frecuentes</a
      >
      <a
        href="/terminos#terms"
        class="block text-neutral-700 hover:text-brand transition-colors duration-200"
        on:click={() => (isOpen = false)}>Términos y condiciones</a
      >
      <a
        href="/#contacto"
        class="block text-neutral-700 hover:text-brand transition-colors duration-200"
        on:click={() => (isOpen = false)}>Contacto</a
      >

      <div class="flex items-center gap-2">
        <a
          href="https://calendar.app.google/niQmo8L4nZ7d4Kt8A"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir el calendario para agendar una demo de FlowPass"
        >
          <Button
            color="dark"
            class="w-full flex justify-center items-center gap-2 rounded-xl text-sm font-semibold px-5 py-2 shadow-sm hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300"
          >
            Agendar demo
            <CalendarDays class="w-5 h-5 text-light-50" />
          </Button>
        </a>

        <!-- Botón de WhatsApp -->
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
        >
          <Button
            class="w-full flex justify-center items-center gap-2 rounded-xl text-sm font-semibold px-5 py-2 shadow-sm hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300 bg-[#25D366] text-white border border-[#1EBE5D]"
          >
            Escríbenos
            <img
              src={whatsappIcon}
              alt="WhatsApp icon"
              class="w-5 h-5 brightness-0 invert"
              loading="lazy"
            />
          </Button>
        </a>
      </div>
      <!-- Botón de agenda -->
    </div>
  {/if}
</nav>

<style>
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
