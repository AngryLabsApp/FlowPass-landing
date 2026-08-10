<script lang="ts">
  import { siteConfig } from "$lib/config/site";
  import { aboutSEO } from "$lib/config/seo";
  import { buildAboutGraph } from "$lib/seo/schemas";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  const currentDate = new Date().toISOString().split("T")[0];
  const aboutUrl = `${siteConfig.url}/about`;
  const jsonLdString = JSON.stringify(buildAboutGraph(currentDate)).replace(/</g, "\\u003c");

  const problems = [
    {
      title: "Todo, apuntado a mano.",
      body: "Asistencias, pagos, actividades. Uno por uno, cada día."
    },
    {
      title: "Datos que no se hablan.",
      body: "Asistencias en un lado. Pagos en otro. El inventario en un tercero."
    },
    {
      title: "Plata que se queda en la mesa.",
      body: "Renovaciones que nadie recuerda. Planes vencidos que nadie atrapa. Churn silencioso."
    },
    {
      title: "Complejidad que nadie pidió.",
      body: "Herramientas con mil módulos, setups eternos. Los clientes usaban el 10%."
    }
  ];
</script>

<svelte:head>
  <title>{aboutSEO.title}</title>
  <meta name="description" content={aboutSEO.description} />
  <meta name="keywords" content={aboutSEO.keywords} />

  <link rel="canonical" href={aboutUrl} />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={aboutUrl} />
  <meta property="og:title" content={aboutSEO.title} />
  <meta property="og:description" content={aboutSEO.description} />
  <meta property="og:image" content={aboutSEO.image} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={aboutSEO.title} />
  <meta name="twitter:description" content={aboutSEO.description} />
  <meta name="twitter:image" content={aboutSEO.image} />

  {@html `<script type="application/ld+json">${jsonLdString}</script>`}
</svelte:head>

<Navbar />

<main class="about-page">
  <!-- Hero -->
  <header class="about-hero">
    <span class="about-eyebrow">Sobre nosotros</span>
    <h1 class="about-h1 font-epoch">
      Somos 3 personas que <span class="grad">aman entrenar</span>.<br />
      Y una libreta no era suficiente.
    </h1>
    <p class="about-lede">
      FlowPass nació en Lima en septiembre de 2025 y salió al mercado en noviembre,
      porque los negocios donde nosotros mismos entrenamos seguían llevando todo en
      papel. En 2026 eso ya no es un detalle lindo — es la diferencia entre crecer
      o quedarse.
    </p>
  </header>

  <!-- Historia -->
  <section class="about-block" id="historia">
    <span class="block-num">01</span>
    <h2 class="about-h2 font-epoch">Así empezó todo</h2>
    <div class="prose">
      <p>
        <strong>Angel</strong> baila salsa. <strong>Piero</strong> juega pádel.
        <strong>Grecia</strong> hace crossfit. Los tres somos alumnos antes que founders:
        nos gusta pagar una membresía, aparecer y entrenar.
      </p>
      <p>
        Y entrenando fue que vimos lo mismo una y otra vez. La academia con lista de
        asistencia en una libreta. El coach que anota los pagos en la última página de
        un cuaderno. El dueño que abre Excel un domingo para intentar entender cuánto
        facturó el mes.
      </p>
      <p>
        En septiembre de 2025, <strong>Grecia y Angel</strong> arrancaron a construir
        algo simple para cambiar eso. Los primeros clientes fueron un centro de
        entrenamiento, una academia de karate y una academia de baile, y funcionó.
        En noviembre de 2025 salimos comercialmente y poco después se sumó
        <strong>Piero</strong> para llevar FlowPass a más negocios, más ciudades y
        más países.
      </p>
      <p>
        Hoy somos un equipo de 3 fundadores construyendo una plataforma moderna,
        simple y de alta calidad para negocios basados en membresías. Y no queremos
        parar en Perú.
      </p>
    </div>
  </section>

  <!-- Los problemas que vimos -->
  <section class="about-block" id="problemas">
    <span class="block-num">02</span>
    <h2 class="about-h2 font-epoch">Lo que vimos, todos los días</h2>
    <p class="block-lede">
      Antes de escribir una sola línea de código, hicimos algo poco startup: mirar.
      Cientos de conversaciones con dueños de academias, gimnasios y estudios.
      Cuatro problemas aparecían en cada una.
    </p>
    <div class="problem-grid">
      {#each problems as p}
        <article class="problem-card">
          <h3 class="problem-title">{p.title}</h3>
          <p class="problem-body">{p.body}</p>
        </article>
      {/each}
    </div>
  </section>

  <!-- El costo oculto -->
  <section class="about-block cost" id="costo">
    <span class="block-num">03</span>
    <h2 class="about-h2 font-epoch">El costo oculto</h2>
    <p class="block-lede">
      Puede sonar chico, pero no lo es. Hicimos el ejercicio con más de 50 entrevistas
      a dueños de negocios de membresías en LatAm y 20+ entrevistas a clientes nuestros.
    </p>
    <div class="cost-grid">
      <div class="cost-tile">
        <span class="cost-metric">500K+</span>
        <span class="cost-label">negocios de membresías en LatAm</span>
      </div>
      <div class="cost-tile big">
        <span class="cost-metric xl">USD $6.3B</span>
        <span class="cost-label">perdidos cada año</span>
      </div>
      <div class="cost-tile">
        <span class="cost-metric">~USD $12.7K</span>
        <span class="cost-label">
          por negocio al año — ~20 % de sus ingresos — por pagos que se pierden,
          operación floja y churn.
        </span>
      </div>
    </div>
    <p class="cost-source">
      Fuente: (1) Estudio interno FlowPass — 50+ entrevistas a dueños de negocios.
      (2) 20+ entrevistas a clientes FlowPass.
    </p>
  </section>

  <!-- Por qué existimos -->
  <section class="about-block" id="mision">
    <span class="block-num">04</span>
    <h2 class="about-h2 font-epoch">Por qué existimos</h2>
    <div class="prose">
      <p>
        FlowPass existe para que un negocio de membresías —una academia, un gimnasio,
        una barbería, un estudio de música— pueda dejar la libreta y controlar su
        operación con una herramienta simple, moderna y de alta calidad.
      </p>
      <p>
        Nada de módulos que nadie usa. Nada de contratos que amarran. Nada de
        integraciones improvisadas con WhatsApp. Todo lo contrario:
      </p>
      <ul class="check-list">
        <li>Suscripción mensual sin permanencia — el cliente activa, pausa o cancela cuando quiera.</li>
        <li>Recordatorios por WhatsApp con conexión oficial a la API de Meta.</li>
        <li>Multi-sede sin costo extra desde el plan Lite.</li>
        <li>Flowy, nuestro asistente de IA propio que conoce tu negocio (beta).</li>
        <li>Soporte con acceso directo al equipo — sin ticketing frío.</li>
      </ul>
      <p>
        Y la visión con la que arrancamos sigue igual: estos negocios no están solo
        en Perú, están en todo el mundo. Vamos por ellos.
      </p>
    </div>
  </section>

  <!-- Equipo -->
  <section class="about-block team" id="equipo">
    <span class="block-num">05</span>
    <h2 class="about-h2 font-epoch">El equipo</h2>
    <p class="block-lede">
      Somos tres. Sin humo. Los que responden tu WhatsApp somos nosotros.
    </p>
    <div class="team-grid">
      {#each siteConfig.founders as f}
        <article class="founder-card">
          <div class="founder-photo" aria-hidden={f.photo ? undefined : true}>
            {#if f.photo}
              <img src={f.photo} alt={`Foto de ${f.name}, ${f.role}`} loading="lazy" />
            {:else}
              <span class="photo-placeholder">{f.name.charAt(0)}</span>
            {/if}
          </div>
          <div class="founder-body">
            <h3 class="founder-name">
              {f.name}
              <span class="founder-flag" aria-label={f.country === 'PE' ? 'Perú' : f.country === 'MX' ? 'México' : f.country}>
                {f.country === 'PE' ? '🇵🇪' : f.country === 'MX' ? '🇲🇽' : ''}
              </span>
            </h3>
            <p class="founder-role">{f.role}</p>
            <p class="founder-background">{f.background}</p>
            <p class="founder-story"><span class="hobby-chip">{f.hobby}</span> {f.story}</p>
            {#if f.linkedin}
              <a
                class="founder-linkedin"
                href={f.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`LinkedIn de ${f.name}`}
              >
                LinkedIn ↗
              </a>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  </section>

  <!-- CTA -->
  <section class="about-cta" id="hablemos">
    <h2 class="cta-title font-epoch">¿Charlamos?</h2>
    <p class="cta-body">
      Si tu negocio cobra por membresía y quieres dejar la libreta, agenda una
      demo con nosotros o escríbenos directo por WhatsApp.
    </p>
    <div class="cta-actions">
      <a href="/agenda" class="cta-btn cta-btn--primary">Agendar demo</a>
      <a
        href={siteConfig.social.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        class="cta-btn cta-btn--ghost"
      >
        WhatsApp {siteConfig.phoneFormatted}
      </a>
    </div>
  </section>

  <p class="back-home">
    <a href="/">← Volver al inicio</a>
  </p>
</main>

<Footer />

<style>
  .about-page {
    color: #fff;
    padding: 6rem 1.25rem 3rem;
    min-height: 100vh;
    max-width: 900px;
    margin: 0 auto;
  }
  @media (min-width: 768px) {
    .about-page { padding: 8rem 1.5rem 5rem; }
  }

  /* Hero */
  .about-hero {
    margin: 0 auto 4rem;
    text-align: center;
  }
  .about-eyebrow {
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
    margin-bottom: 1.25rem;
  }
  .about-eyebrow::before {
    content: "";
    width: 6px; height: 6px;
    border-radius: 999px;
    background: #01f59e;
  }
  .about-h1 {
    font-size: clamp(2rem, 6vw, 3.25rem);
    line-height: 1.1;
    color: #fff;
    margin: 0 0 1.25rem;
    letter-spacing: -0.01em;
  }
  .about-h1 .grad {
    background: linear-gradient(90deg, #01f59e, #3168F4 60%, #531DD8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .about-lede {
    color: rgba(255,255,255,0.7);
    font-size: 1.05rem;
    line-height: 1.65;
    max-width: 640px;
    margin: 0 auto;
  }

  /* Block base */
  .about-block {
    position: relative;
    background: rgba(255,255,255,0.03);
    border: 0.5px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 1.75rem 1.25rem;
    margin: 0 0 1.25rem;
    scroll-margin-top: 6rem;
  }
  @media (min-width: 768px) {
    .about-block { padding: 2.75rem; margin-bottom: 1.5rem; }
  }
  .block-num {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #01f59e;
    background: rgba(1,245,158,0.1);
    border: 0.5px solid rgba(1,245,158,0.25);
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    letter-spacing: 0.08em;
    margin-bottom: 0.75rem;
  }
  .about-h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    margin: 0 0 1rem;
    letter-spacing: -0.005em;
  }
  @media (min-width: 768px) {
    .about-h2 { font-size: 1.875rem; }
  }
  .block-lede {
    color: rgba(255,255,255,0.7);
    font-size: 0.98rem;
    line-height: 1.65;
    margin: 0 0 1.5rem;
    max-width: 640px;
  }

  /* Prose */
  .prose p {
    color: rgba(255,255,255,0.72);
    font-size: 1rem;
    line-height: 1.75;
    margin: 0 0 1rem;
  }
  .prose p:last-child { margin-bottom: 0; }
  .prose strong { color: #fff; font-weight: 600; }
  .check-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .check-list li {
    position: relative;
    padding-left: 1.6rem;
    color: rgba(255,255,255,0.72);
    font-size: 0.96rem;
    line-height: 1.6;
  }
  .check-list li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #01f59e;
    font-weight: 700;
  }

  /* Problem grid */
  .problem-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
  @media (min-width: 640px) {
    .problem-grid { grid-template-columns: repeat(2, 1fr); }
  }
  .problem-card {
    background: rgba(255,255,255,0.03);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 1.15rem 1.15rem 1.25rem;
  }
  .problem-title {
    color: #fff;
    font-size: 1.05rem;
    font-weight: 600;
    margin: 0 0 0.4rem;
    line-height: 1.25;
  }
  .problem-body {
    color: rgba(255,255,255,0.65);
    font-size: 0.9rem;
    line-height: 1.55;
    margin: 0;
  }

  /* Cost */
  .cost-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin: 0.5rem 0 1rem;
  }
  @media (min-width: 768px) {
    .cost-grid { grid-template-columns: 1fr 1.4fr 1fr; align-items: stretch; }
  }
  .cost-tile {
    background: rgba(1,245,158,0.05);
    border: 0.5px solid rgba(1,245,158,0.2);
    border-radius: 14px;
    padding: 1.25rem 1.15rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.4rem;
  }
  .cost-tile.big {
    background: linear-gradient(135deg, rgba(1,245,158,0.12), rgba(49,104,244,0.1));
    border-color: rgba(1,245,158,0.35);
  }
  .cost-metric {
    font-family: 'Epoch', 'OktahNeue', sans-serif;
    color: #fff;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.01em;
  }
  .cost-metric.xl {
    font-size: 2.5rem;
    background: linear-gradient(90deg, #01f59e, #3168F4);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  @media (min-width: 768px) {
    .cost-metric.xl { font-size: 3rem; }
  }
  .cost-label {
    color: rgba(255,255,255,0.7);
    font-size: 0.88rem;
    line-height: 1.5;
  }
  .cost-source {
    color: rgba(255,255,255,0.4);
    font-size: 0.78rem;
    font-style: italic;
    line-height: 1.5;
    margin: 0.75rem 0 0;
  }

  /* Team */
  .team-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media (min-width: 768px) {
    .team-grid { grid-template-columns: repeat(3, 1fr); }
  }
  .founder-card {
    background: rgba(255,255,255,0.03);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }
  .founder-photo {
    width: 100%;
    aspect-ratio: 1 / 1;
    max-width: 160px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(1,245,158,0.15), rgba(49,104,244,0.12));
    border: 0.5px solid rgba(255,255,255,0.1);
    display: grid;
    place-items: center;
    margin: 0 auto;
    overflow: hidden;
  }
  .founder-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .photo-placeholder {
    font-family: 'Epoch', sans-serif;
    font-size: 2.5rem;
    color: rgba(255,255,255,0.9);
    font-weight: 700;
  }
  .founder-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  .founder-flag { font-size: 0.9em; line-height: 1; }
  .founder-role {
    color: #01f59e;
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    margin: 0.15rem 0 0.5rem;
  }
  .founder-background {
    color: rgba(255,255,255,0.7);
    font-size: 0.88rem;
    line-height: 1.55;
    margin: 0 0 0.5rem;
  }
  .founder-story {
    color: rgba(255,255,255,0.62);
    font-size: 0.85rem;
    line-height: 1.55;
    margin: 0;
  }
  .hobby-chip {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #01f59e;
    background: rgba(1,245,158,0.08);
    border: 0.5px solid rgba(1,245,158,0.25);
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    margin-right: 0.4rem;
    vertical-align: middle;
  }
  .founder-linkedin {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.75rem;
    padding: 0.4rem 0.75rem;
    border-radius: 999px;
    background: rgba(255,255,255,0.05);
    border: 0.5px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.85);
    font-size: 0.8rem;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
    align-self: flex-start;
  }
  .founder-linkedin:hover {
    color: #01f59e;
    border-color: rgba(1,245,158,0.4);
    background: rgba(1,245,158,0.05);
  }

  /* CTA */
  .about-cta {
    background: linear-gradient(135deg, rgba(1,245,158,0.08), rgba(49,104,244,0.08));
    border: 0.5px solid rgba(1,245,158,0.25);
    border-radius: 24px;
    padding: 2.25rem 1.5rem;
    text-align: center;
    margin: 2rem 0 1rem;
  }
  @media (min-width: 768px) {
    .about-cta { padding: 3rem 2rem; }
  }
  .cta-title {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    color: #fff;
    line-height: 1.1;
    margin: 0 0 0.75rem;
    letter-spacing: -0.01em;
  }
  .cta-body {
    color: rgba(255,255,255,0.72);
    font-size: 1rem;
    line-height: 1.6;
    margin: 0 auto 1.5rem;
    max-width: 520px;
  }
  .cta-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
  }
  .cta-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.85rem 1.5rem;
    border-radius: 999px;
    font-size: 0.95rem;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
  }
  .cta-btn--primary {
    background: #01f59e;
    color: #0a0f1e;
    box-shadow: 0 8px 24px rgba(1,245,158,0.25);
  }
  .cta-btn--primary:hover { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(1,245,158,0.35); }
  .cta-btn--ghost {
    background: rgba(255,255,255,0.04);
    color: #fff;
    border: 0.5px solid rgba(255,255,255,0.15);
  }
  .cta-btn--ghost:hover { background: rgba(255,255,255,0.08); }

  .back-home {
    margin: 2rem 0 0;
    font-size: 0.9rem;
    text-align: center;
  }
  .back-home a {
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    transition: color 0.2s;
  }
  .back-home a:hover { color: #01f59e; }
</style>
