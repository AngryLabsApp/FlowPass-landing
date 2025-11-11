<script>
  import { fade, fly } from "svelte/transition";
</script>

<section
  class="border min-h-[80vh] flex flex-col items-center justify-center text-center px-6
         bg-gradient-to-b from-white to-green-50 select-none"
>
  <!-- Título -->
  <h1
    class="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight"
    transition:fly={{ y: 20, duration: 600 }}
  >
    Gestiona tu academia <span class="text-green-600">sin complicarte</span>.
  </h1>

  <!-- Subtítulo -->
  <p
    class="text-lg md:text-xl text-gray-600 max-w-2xl mb-10"
    transition:fade={{ duration: 900 }}
  >
    FlowPass te ayuda a administrar alumnos, pagos, asistencias e ingresos desde
    un solo lugar — rápido, moderno y sencillo.
  </p>

  <!-- Botón -->
  <a
    href="#demo"
    class="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-2xl shadow-lg
           text-lg font-medium transition-transform hover:scale-105"
    transition:fade={{ duration: 1200 }}
  >
    Probar FlowPass
  </a>
</section>
