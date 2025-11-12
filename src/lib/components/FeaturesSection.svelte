<script lang="ts">
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
  import { Card } from "flowbite-svelte";

  const features = [
    {
      title: "Gestión simple de alumnos",
      description:
        "Administra fácilmente tus alumnos, planes y asistencias sin depender de hojas de Excel. Accede a información clave de tus alumnos.",
      img: "src/lib/assets/images/features/alumnos.png",
    },
    {
      title: "Pagos siempre al día",
      description:
        "Lleva un control diario y visualiza fácilmente el estado de tus cobros. Mantén todos tus pagos organizados.",
      img: "src/lib/assets/images/features/pagos-final.png",
    },
    {
      title: "Comunicación automática",
      description:
        "FlowPass envía recordatorios y mensajes por WhatsApp para mantener informados a tus alumnos.",
      img: "src/lib/assets/images/features/whatsapp.png",
    },
    {
      title: "Gestión de ingresos",
      description:
        "Monitorea los ingresos y la asistencia de tus alumnos para entender mejor el desempeño y crecimiento de tu academia",
      img: "src/lib/assets/images/features/asistencia.png",
    },
  ];
</script>

<section
  id="features"
  class="py-24 bg-light-100"
  aria-label="Funciones principales de FlowPass"
>
  <div class="max-w-6xl mx-auto px-6 text-center">
    <h2
      class="font-jakarta text-3xl md:text-4xl font-extrabold text-dark-200 mb-4"
    >
      Funciones principales
    </h2>
    <p class="text-neutral-600 text-lg max-w-2xl mx-auto mb-12">
      FlowPass automatiza la gestión de tu academia: controla alumnos, pagos,
      ingresos y comunicación sin complicaciones.
    </p>

    <Splide
      extensions={{ AutoScroll }}
      options={{
        type: "loop",
        gap: "1.5rem",
        perPage: 2,
        arrows: false,
        pagination: true,
        drag: false,
        autoScroll: {
          speed: 0.7, // Velocidad del autoscroll (ajusta si quieres más rápido o lento)
          pauseOnHover: true,
          pauseOnFocus: false,
        },
        breakpoints: {
          1024: { perPage: 1 },
        },
      }}
      aria-label="Carrusel de funciones de FlowPass"
      class="overflow-hidden"
    >
      {#each features as f}
        <SplideSlide>
          <Card
            class="group relative overflow-hidden rounded-3xl border border-light-200 bg-white shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
          >
            <!-- Imagen superior -->
            <div class="w-full h-48 overflow-hidden rounded-t-3xl">
              <img
                src={f.img}
                alt={`Ilustración de ${f.title}`}
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            </div>

            <!-- Contenido -->
            <div class="p-6 text-left space-y-3">
              <div class="flex items-center gap-2">
                <div
                  class="h-1.5 w-8 rounded-full bg-brand-500 group-hover:w-10 transition-all duration-300"
                ></div>
                <p
                  class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600"
                >
                  FlowPass
                </p>
              </div>

              <h3
                class="font-jakarta text-2xl font-bold text-dark-200 leading-snug group-hover:text-brand-600 transition-colors duration-300"
              >
                {f.title}
              </h3>

              <p class="text-neutral-600 text-base leading-relaxed">
                {f.description}
              </p>
            </div>

            <!-- Efecto decorativo sutil -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-brand-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
            />
          </Card>
        </SplideSlide>
      {/each}
    </Splide>
  </div>
</section>
