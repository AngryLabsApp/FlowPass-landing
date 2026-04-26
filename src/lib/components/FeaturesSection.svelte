<script lang="ts">
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
  import alumnosImg from "$lib/assets/images/features/alumnos.png";
  import pagosImg from "$lib/assets/images/features/pagos-final.png";
  import whatsappImg from "$lib/assets/images/features/whatsapp.png";
  import asistenciaImg from "$lib/assets/images/features/asistencia.png";

  const features = [
    {
      title: "Gestión simple de alumnos",
      description:
        "Administra tus alumnos, planes y asistencias sin depender de Excel. Información clave a un click.",
      img: alumnosImg,
    },
    {
      title: "Pagos siempre al día",
      description:
        "Control diario de cobros. Visualiza el estado de cada pago y mantén tu negocio organizado.",
      img: pagosImg,
    },
    {
      title: "Comunicación automática",
      description:
        "Recordatorios y mensajes por WhatsApp para mantener informados a tus alumnos.",
      img: whatsappImg,
    },
    {
      title: "Gestión de ingresos",
      description:
        "Monitorea ingresos y asistencias para entender el desempeño y crecimiento de tu negocio.",
      img: asistenciaImg,
    },
  ];
</script>

<section
  id="features"
  class="features-section"
  aria-labelledby="features-heading"
>
  <div class="features-container">
    <div class="features-header">
      <span class="features-eyebrow">
        <span class="dot"></span> Funciones
      </span>
      <h2 id="features-heading" class="features-title font-epoch">
        Todo lo que necesitas en
        <span class="grad">un solo lugar</span>
      </h2>
      <p class="features-subtitle font-oktah">
        FlowPass transforma la gestión diaria de tu negocio con funciones que
        realmente usas todos los días.
      </p>
    </div>

    <Splide
      extensions={{ AutoScroll }}
      options={{
        type: "loop",
        gap: "1.25rem",
        perPage: 3,
        arrows: false,
        pagination: true,
        drag: true,
        autoScroll: {
          speed: 0.6,
          pauseOnHover: true,
          pauseOnFocus: false,
        },
        breakpoints: {
          1024: { perPage: 2 },
          640: { perPage: 1, gap: "1rem" },
        },
      }}
      aria-label="Funciones principales de FlowPass"
      role="region"
      class="features-carousel"
    >
      {#each features as f, index}
        <SplideSlide>
          <article
            class="feature-card"
            aria-labelledby={`feature-${index}-title`}
          >
            <div class="feature-img-wrap">
              <img
                src={f.img}
                alt={`Captura: ${f.title}`}
                class="feature-img"
                loading="lazy"
                width="400"
                height="300"
              />
            </div>

            <div class="feature-body">
              <div class="feature-tag">
                <span class="bar" aria-hidden="true"></span>
                FlowPass
              </div>
              <h3 id={`feature-${index}-title`} class="feature-title font-epoch">
                {f.title}
              </h3>
              <p class="feature-desc font-oktah">{f.description}</p>
            </div>
          </article>
        </SplideSlide>
      {/each}
    </Splide>
  </div>
</section>

<style>
  .features-section {
    
    padding: 3rem 1.25rem;
  }
  @media (min-width: 768px) {
    .features-section { padding: 5rem 1.5rem; }
  }

  .features-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .features-header {
    text-align: center;
    max-width: 720px;
    margin: 0 auto 2.5rem;
  }
  @media (min-width: 768px) {
    .features-header { margin-bottom: 3.5rem; }
  }

  .features-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.05);
    border: 0.5px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(8px);
    margin-bottom: 1rem;
  }
  .features-eyebrow .dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #01f59e;
  }

  .features-title {
    font-size: clamp(2rem, 5vw, 3rem);
    line-height: 1.1;
    color: #ffffff;
    margin: 0 0 1rem;
    letter-spacing: -0.01em;
  }
  .features-title .grad {
    background: linear-gradient(90deg, #01f59e, #3168F4 60%, #531DD8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .features-subtitle {
    color: rgba(255,255,255,0.5);
    font-size: 1rem;
    line-height: 1.7;
    margin: 0;
  }
  @media (min-width: 768px) {
    .features-subtitle { font-size: 1.0625rem; }
  }

  /* Card */
  .feature-card {
    position: relative;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    overflow: hidden;
    transition: border-color 0.3s ease, transform 0.3s ease, background 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .feature-card:hover {
    border-color: rgba(1,245,158,0.2);
    background: rgba(255,255,255,0.05);
    transform: translateY(-4px);
  }

  .feature-img-wrap {
    width: 100%;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: rgba(255,255,255,0.02);
  }
  .feature-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s ease;
  }
  .feature-card:hover .feature-img {
    transform: scale(1.05);
  }

  .feature-body {
    padding: 1.25rem 1.25rem 1.5rem;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }
  @media (min-width: 768px) {
    .feature-body { padding: 1.5rem; }
  }

  .feature-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #01f59e;
  }
  .feature-tag .bar {
    width: 28px;
    height: 2px;
    border-radius: 999px;
    background: #01f59e;
    transition: width 0.3s ease;
  }
  .feature-card:hover .feature-tag .bar { width: 40px; }

  .feature-title {
    font-size: 1.375rem;
    font-weight: 700;
    color: #ffffff;
    line-height: 1.2;
    margin: 0;
  }
  @media (min-width: 768px) {
    .feature-title { font-size: 1.5rem; }
  }

  .feature-desc {
    font-size: 0.95rem;
    line-height: 1.65;
    color: rgba(255,255,255,0.5);
    margin: 0;
  }

  /* Splide pagination */
  .features-carousel :global(.splide__pagination__page) {
    background: rgba(255,255,255,0.2);
    opacity: 1;
  }
  .features-carousel :global(.splide__pagination__page.is-active) {
    background: #01f59e;
    transform: scale(1.2);
  }
</style>
