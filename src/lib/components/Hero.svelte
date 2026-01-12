<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { CalendarDays } from "svelte-heros-v2";
  import Laptop from "./../assets/images/laptop.svg";
</script>

<section
  id="inicio"
  class="w-full bg-light-300 pt-16 pb-32"
  aria-label="FlowPass: plataforma para gestión de academias"
>
  <div
    class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
  >
    <!-- TEXT CONTENT -->
    <div class="space-y-6">
      <!-- SEO Subheading -->
      <p class="text-sm text-gray-500 tracking-wide">
        Software de gestión para academias y centros de entrenamiento
      </p>

      <!-- MAIN H1 (solo uno en toda la landing) -->
      <h1
        class="font-jakarta font-extrabold text-4xl md:text-6xl leading-tight"
      >
        Gestiona tu academia de forma moderna
        <span class="text-brand-600">y sin complicarte.</span>
      </h1>

      <!-- SEO Paragraph -->
      <p
        class="text-gray-600 text-lg leading-relaxed max-w-md text-md text-justify"
      >
        FlowPass es una plataforma digital diseñada para academias, gimnasios y
        centros deportivos. Administra alumnos, pagos, asistencias y reportes
        desde un solo lugar, reduce tareas manuales y mejora la experiencia de
        tus estudiantes.
      </p>

      <!-- CTA -->
      <a
        href="https://calendar.app.google/niQmo8L4nZ7d4Kt8A"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir el calendario para agendar una demo de FlowPass"
      >
        <Button
          color="secondary"
          class="flex justify-center gap-2 px-6 py-3 text-lg font-semibold rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
        >
          Agendar demo
          <CalendarDays class="w-6 h-6 text-light-50" />
        </Button>
      </a>
    </div>

    <!-- IMAGE WITH SEO ALT -->
    <div class="relative flex justify-center md:block">
      <img
        src={Laptop}
        alt="Dashboard de FlowPass mostrando gestión de alumnos y pagos"
        class="relative w-full max-w-3xl scale-110 md:scale-125"
        loading="lazy"
      />
    </div>
  </div>
</section>
