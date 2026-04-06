<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { CalendarDays, ArrowRightOnRectangle } from "svelte-heros-v2";
  import Laptop from "./../assets/images/laptop.svg";
  import { siteConfig } from "$lib/config/site";
</script>

<section
  id="inicio"
  class="w-full bg-light-300 pt-16 pb-32"
  aria-labelledby="hero-heading"
>
  <div
    class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
  >
    <div class="space-y-6">
      <!-- Breadcrumb oculto para SEO (solo lectores de pantalla) -->
      <span class="sr-only">Estás en: Inicio - FlowPass</span>
      
      <!-- Subtítulo semántico -->
      <p class="text-sm text-gray-500 tracking-wide" role="doc-subtitle">
        Software de gestión para academias y centros de entrenamiento
      </p>

      <!-- H1 principal - ÚNICO en toda la página -->
      <h1 id="hero-heading" class="font-jakarta font-extrabold text-4xl md:text-6xl leading-tight">
        Software para academias
        <span class="text-brand-600 block">
          que automatiza alumnos, pagos y asistencias
        </span>
      </h1>

      <!-- Descripción con keyword principal -->
      <p class="text-gray-600 text-lg leading-relaxed max-w-md">
        <strong>FlowPass</strong> es la plataforma digital que tu academia necesita. 
        Administra <strong>alumnos, pagos, asistencias y comunicación</strong> desde 
        un solo lugar. Olvídate del Excel y enfócate en hacer crecer tu negocio.
      </p>

      <!-- CTAs -->
      <div class="flex flex-col items-start gap-3">
        <a
          href="https://calendar.app.google/niQmo8L4nZ7d4Kt8A"
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label="Agendar una demo gratuita de FlowPass (se abre en una nueva ventana)"
          onclick={() => {
            window.gtag?.('event', 'cta_click', {
              event_category: 'engagement',
              event_label: 'hero_demo_button',
              value: 1
            });
          }}
        >
          <Button
            color="secondary"
            class="flex justify-center gap-2 px-6 py-3 text-lg font-semibold rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            Agendar demo gratis
            <CalendarDays class="w-6 h-6 text-light-50" aria-hidden="true" />
          </Button>
        </a>

        <a
          href="https://app.flow-pass.com/login"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ingresar a la plataforma FlowPass"
          class="flex items-center gap-1.5 text-base text-neutral-400 hover:text-neutral-600 transition-colors duration-200 group"
        >
          ¿Ya tienes cuenta?
          <span class="font-medium">Ingresar</span>
          <ArrowRightOnRectangle class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      </div>
    </div>

    <!-- Imagen con descripción detallada -->
    <figure class="relative flex justify-center md:block">
      <img
        src={Laptop}
        alt="Dashboard de FlowPass mostrando la gestión de alumnos, pagos y asistencias en una interfaz moderna y fácil de usar"
        class="relative w-full max-w-3xl scale-110 md:scale-125"
        loading="eager" 
        width="1200"
        height="800"
      />
      <figcaption class="sr-only">
        Vista previa del software FlowPass con panel de control mostrando alumnos activos, pagos recientes y estadísticas de asistencia.
      </figcaption>
    </figure>
  </div>
</section>