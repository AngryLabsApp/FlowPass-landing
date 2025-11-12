<script lang="ts">
  import { Button } from "flowbite-svelte";
</script>

<section
  class="w-full bg-light-300 pt-24 pb-32"
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
      <p class="text-gray-600 text-lg leading-relaxed max-w-md text-md text-justify">
        FlowPass es una plataforma digital diseñada para academias, gimnasios y
        centros deportivos. Administra alumnos, pagos, asistencias y reportes
        desde un solo lugar, reduce tareas manuales y mejora la experiencia de
        tus estudiantes.
      </p>

      <!-- CTA -->
      <Button
        color="green"
        class="px-6 py-3 text-lg font-semibold rounded-xl"
        aria-label="Agendar una demo de FlowPass"
      >
        Agendar demo
      </Button>
    </div>

    <!-- IMAGE WITH SEO ALT -->
    <div class="relative flex justify-center md:block">
      <img
        src="src/lib/assets/images/laptop.svg"
        alt="Dashboard de FlowPass mostrando gestión de alumnos y pagos"
        class="relative w-full max-w-3xl scale-110 md:scale-125"
        loading="lazy"
      />
    </div>
  </div>
</section>
