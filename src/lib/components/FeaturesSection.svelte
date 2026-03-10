<script lang="ts">
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
  import { Card } from "flowbite-svelte";
  import alumnosImg from "$lib/assets/images/features/alumnos.png";
  import pagosImg from "$lib/assets/images/features/pagos-final.png";
  import whatsappImg from "$lib/assets/images/features/whatsapp.png";
  import asistenciaImg from "$lib/assets/images/features/asistencia.png";

  const features = [
    {
      title: "Gestión simple de alumnos",
      description:
        "Administra fácilmente tus alumnos, planes y asistencias sin depender de hojas de Excel. Accede a información clave de tus alumnos.",
      img: alumnosImg,
    },
    {
      title: "Pagos siempre al día",
      description:
        "Lleva un control diario y visualiza fácilmente el estado de tus cobros. Mantén todos tus pagos organizados.",
      img: pagosImg,
    },
    {
      title: "Comunicación automática",
      description:
        "FlowPass envía recordatorios y mensajes por WhatsApp para mantener informados a tus alumnos.",
      img: whatsappImg,
    },
    {
      title: "Gestión de ingresos",
      description:
        "Monitorea los ingresos y la asistencia de tus alumnos para entender mejor el desempeño y crecimiento de tu academia",
      img: asistenciaImg,
    },
  ];
</script>

<section
  id="features"
  class="py-24 bg-light-100"
  aria-labelledby="features-heading">
  <div class="mx-auto">
    <div class="px-6 text-center">
      <h2
        id="features-heading"
        class="font-jakarta text-3xl md:text-4xl font-extrabold text-dark-200 mb-4"
      >
        Funciones principales de FlowPass
      </h2>
      <p class="text-neutral-600 text-lg max-w-2xl mx-auto mb-12">
        Descubre cómo <strong>FlowPass</strong> puede transformar la gestión diaria de tu academia con estas funcionalidades clave.
      </p>
    </div>

    <!-- En el Splide, mejorar atributos -->
    <Splide
      extensions={{ AutoScroll }}
      options={{
        type: "loop",
        gap: "1.5rem",
        perPage: 3,
        arrows: false,
        pagination: true,
        drag: false,
        autoScroll: {
          speed: 0.7,
          pauseOnHover: true,
          pauseOnFocus: false,
        },
        breakpoints: {
          1024: { perPage: 1 },
        },
      }}
      aria-label="Carrusel interactivo con las principales funciones de FlowPass para academias"
      role="region"
    >
      {#each features as f, index}
        <SplideSlide>
          <article class="group relative overflow-hidden rounded-3xl border border-light-200 bg-white shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
            aria-labelledby={`feature-${index}-title`}
          >
            <div class="w-full h-48 overflow-hidden rounded-t-3xl">
              <img
                src={f.img}
                alt={`Captura de pantalla de ${f.title} en FlowPass, software para academias`}
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                width="400"
                height="300"
              />
            </div>

            <div class="p-6 text-left space-y-3">
              <div class="flex items-center gap-2">
                <div
                  class="h-1.5 w-8 rounded-full bg-brand-500 group-hover:w-10 transition-all duration-300"
                  aria-hidden="true"
                ></div>
                <p
                  class="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600"
                >
                  FlowPass
                </p>
              </div>

              <h3
                id={`feature-${index}-title`}
                class="font-jakarta text-2xl font-bold text-dark-200 leading-snug group-hover:text-brand-600 transition-colors duration-300"
              >
                {f.title}
              </h3>

              <p class="text-neutral-600 text-base leading-relaxed">
                {f.description}
              </p>
            </div>
          </article>
        </SplideSlide>
      {/each}
    </Splide>
  </div>
</section>
