<script lang="ts">
  import { siteConfig } from "$lib/config/site";
  import { aboutSEO } from "$lib/config/seo";
  import { buildAboutGraph } from "$lib/seo/schemas";
  import "$lib/components/home/home.css";
  import { trackSchedule, trackContact } from "$lib/tracking/track";
  import Footer from "$lib/components/Footer.svelte";
  import { onMount } from "svelte";
  import { waCountry, type CountryCode } from "$lib/stores/waCountry.svelte";

  const currentDate = new Date().toISOString().split("T")[0];
  const aboutUrl = `${siteConfig.url}/about`;
  const jsonLdString = JSON.stringify(buildAboutGraph(currentDate)).replace(/</g, "\\u003c");

  onMount(() => waCountry.init());

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

<!-- El Navbar vive en +layout.svelte -->

<main class="home about-page">
  <!-- Hero -->
  <header class="about-hero">
    <span class="about-eyebrow">Sobre nosotros</span>
    <h1 class="about-h1 font-epoch">
      Somos 3 personas que <span class="hl">aman entrenar</span>.<br />
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
        <li>Multi-sede flexible: cada sede adicional paga según su tamaño, desde S/30.</li>
        <li>Portal del alumno con la marca de tu negocio.</li>
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
      asesoría gratis con nosotros o escríbenos directo por WhatsApp.
    </p>
    <div class="cta-country" role="group" aria-label="Elige tu país">
      <span class="cta-country__label">¿Desde dónde nos escribes?</span>
      <div class="cta-country__chips">
        {#each waCountry.countries as c}
          <button
            type="button"
            class="cta-country__chip"
            class:is-active={waCountry.code === c.code}
            aria-pressed={waCountry.code === c.code}
            onclick={() => waCountry.set(c.code as CountryCode)}
          >
            <span aria-hidden="true">{c.flag}</span> {c.label}
          </button>
        {/each}
      </div>
    </div>

    <div class="cta-actions">
      <a href="/agenda" class="cta-btn cta-btn--primary" onclick={() => trackSchedule("about_cta")}>Agenda 15 minutos</a>
      <a
        href={waCountry.phone.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        class="cta-btn cta-btn--ghost"
        onclick={() => trackContact("about_cta")}
      >
        <span aria-hidden="true">{waCountry.phone.flag}</span> WhatsApp {waCountry.phone.formatted}
      </a>
    </div>
  </section>

  <p class="back-home">
    <a href="/">← Volver al inicio</a>
  </p>
</main>

<Footer />

<style>
  /* Mismo lenguaje que la home: tokens de home.css, texto a la izquierda, sin degradados. */
  .about-page { padding-top: 120px; padding-bottom: 40px; }
  .about-hero, .about-block, .about-cta, .back-home { max-width: 1040px; margin-inline: auto; }

  .about-hero { padding-block: 24px 64px; }
  .about-eyebrow { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-text); font-weight: 600; }
  .about-h1 { font-size: clamp(40px, 5.6vw, 72px); margin-top: 16px; max-width: 16ch; }
  .about-h1 .hl { color: var(--accent-text); }
  .about-lede { margin-top: 22px; font-size: 19px; color: var(--fg-2); max-width: 60ch; }

  .about-block { padding-block: 56px; border-top: 1px solid var(--line); display: grid; grid-template-columns: 80px minmax(0, 1fr); column-gap: 24px; }
  .about-block > :not(.block-num) { grid-column: 2; }
  .block-num { grid-row: 1 / span 2; font-family: var(--display); font-size: 15px; color: var(--accent-text); padding-top: 10px; font-variant-numeric: tabular-nums; }
  .about-h2 { font-size: clamp(28px, 3.4vw, 42px); }
  .block-lede { margin-top: 14px; font-size: 17px; color: var(--fg-2); max-width: 62ch; }
  .prose { margin-top: 18px; display: grid; gap: 14px; font-size: 17px; color: var(--fg-2); max-width: 66ch; }
  .prose :global(strong) { color: var(--fg); }

  .problem-grid { margin-top: 28px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .problem-card { border: 1px solid var(--line); border-radius: 16px; padding: 22px; background: var(--panel); }
  .problem-title { font-size: 19px; }
  .problem-body { margin-top: 8px; color: var(--fg-2); font-size: 15px; }

  .cost-grid { margin-top: 28px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-block: 1px solid var(--line); }
  .cost-tile { padding: 24px 20px; border-left: 1px solid var(--line); display: grid; gap: 6px; align-content: start; }
  .cost-tile:first-child { border-left: 0; padding-left: 0; }
  .cost-metric { font-family: var(--display); font-size: 34px; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
  .cost-metric.xl { color: var(--accent-text); }
  .cost-label { font-size: 14px; color: var(--fg-2); }
  .cost-source { margin-top: 14px; font-size: 12.5px; color: var(--fg-3); }

  .check-list { list-style: none; padding: 0; margin: 4px 0; display: grid; gap: 10px; }
  .check-list li { display: flex; gap: 10px; color: var(--fg); }
  .check-list li::before { content: '✓'; flex: none; color: var(--accent-text); font-weight: 700; }

  .team-grid { margin-top: 28px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
  .founder-card { border: 1px solid var(--line); border-radius: 18px; overflow: hidden; background: var(--panel); display: flex; flex-direction: column; }
  .founder-photo { aspect-ratio: 4 / 4; background: var(--bg-2); display: grid; place-items: center; }
  .founder-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .photo-placeholder { font-family: var(--display); font-size: 48px; color: var(--fg-3); }
  .founder-body { padding: 20px; display: grid; gap: 8px; }
  .founder-name { font-size: 21px; display: flex; align-items: center; gap: 8px; }
  .founder-flag { font-size: 16px; }
  .founder-role { font-size: 13px; font-weight: 600; color: var(--accent-text); }
  .founder-background, .founder-story { font-size: 14.5px; color: var(--fg-2); }
  .hobby-chip { display: inline-block; margin-right: 6px; padding: 2px 9px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #531dd8; color: #fff; }
  .founder-linkedin { font-size: 14px; font-weight: 600; color: var(--fg); text-decoration: underline; text-underline-offset: 3px; }

  .about-cta { margin-top: 40px; padding: clamp(28px, 5vw, 56px); border-radius: 24px; background: #09090f; color: #fff; position: relative; overflow: hidden; isolation: isolate; }
  .about-cta::before { content: ''; position: absolute; inset: 0; z-index: -1; background: radial-gradient(55% 80% at 85% 20%, rgba(83, 29, 216, 0.55), transparent 70%), radial-gradient(35% 50% at 10% 100%, rgba(1, 245, 158, 0.2), transparent 70%); }
  .cta-title { font-size: clamp(34px, 4.6vw, 56px); color: #fff; }
  .cta-body { margin-top: 14px; font-size: 18px; color: rgba(255, 255, 255, 0.82); max-width: 52ch; }
  .cta-country { margin-top: 26px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; }
  .cta-country__label { font-size: 14px; color: rgba(255, 255, 255, 0.7); }
  .cta-country__chips { display: flex; gap: 8px; }
  .cta-country__chip { appearance: none; border: 1px solid rgba(255, 255, 255, 0.2); background: none; color: #fff; font: 600 13px var(--body); padding: 7px 14px; border-radius: 999px; cursor: pointer; }
  .cta-country__chip.is-active { background: #fff; color: #09090f; border-color: #fff; }
  .cta-actions { margin-top: 26px; display: flex; flex-wrap: wrap; gap: 12px; }
  .cta-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 22px; border-radius: 999px; font-weight: 600; font-size: 15px; text-decoration: none; }
  .cta-btn--primary { background: #01f59e; color: #04150e; }
  .cta-btn--ghost { background: #fff; color: #09090f; }

  .back-home { margin-top: 28px; font-size: 14px; }
  .back-home a { color: var(--fg-2); text-decoration: none; }
  .back-home a:hover { color: var(--fg); }

  @media (max-width: 900px) {
    .about-block { grid-template-columns: 1fr; }
    .about-block > :not(.block-num) { grid-column: 1; }
    .block-num { grid-row: auto; padding: 0 0 8px; }
    .team-grid { grid-template-columns: 1fr 1fr; }
    .cost-grid { grid-template-columns: 1fr; }
    .cost-tile { border-left: 0; padding-left: 0; border-top: 1px solid var(--line); }
    .cost-tile:first-child { border-top: 0; }
  }
  @media (max-width: 560px) {
    .about-page { padding-top: 100px; }
    .problem-grid, .team-grid { grid-template-columns: 1fr; }
  }
</style>
