<script lang="ts">
  import { siteConfig } from "$lib/config/site";
  import { termsSEO } from "$lib/config/seo";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  const lastUpdate = "15 de marzo de 2024";

  const sections = [
    { id: "aceptacion", num: "1", title: "Aceptación de los términos" },
    { id: "servicio", num: "2", title: "Descripción del servicio" },
    { id: "responsabilidades", num: "3", title: "Responsabilidades del usuario" },
    { id: "datos", num: "4", title: "Propiedad de los datos" },
    { id: "pagos", num: "5", title: "Pagos y suscripciones" },
    { id: "cancelacion", num: "6", title: "Cancelación y suspensión" },
    { id: "responsabilidad", num: "7", title: "Limitación de responsabilidad" },
    { id: "modificaciones", num: "8", title: "Modificaciones" },
    { id: "ley", num: "9", title: "Ley aplicable" },
    { id: "contacto", num: "10", title: "Contacto" },
  ];
</script>

<svelte:head>
  <title>{termsSEO.title}</title>
  <meta name="description" content={termsSEO.description} />
  <meta name="keywords" content={termsSEO.keywords} />

  <link rel="canonical" href={`${siteConfig.url}/terminos`} />

  <meta property="og:title" content={termsSEO.title} />
  <meta property="og:description" content={termsSEO.description} />
  <meta property="og:url" content={`${siteConfig.url}/terminos`} />
  <meta property="og:type" content="website" />

  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": termsSEO.title,
      "description": termsSEO.description,
      "url": `${siteConfig.url}/terminos`,
      "isPartOf": {
        "@type": "WebSite",
        "name": siteConfig.name,
        "url": siteConfig.url
      },
      "dateModified": lastUpdate
    })}
  </script>
</svelte:head>

<Navbar />

<main class="terms-page" id="terms">
  <header class="terms-header">
    <span class="terms-eyebrow">Legal</span>
    <h1 class="terms-h1 font-epoch">
      Términos y <span class="grad">condiciones</span>
    </h1>
    <p class="terms-meta">
      Última actualización: <time datetime="2024-03-15">{lastUpdate}</time>
    </p>
  </header>

  <div class="terms-layout">
    <!-- TOC sidebar -->
    <aside class="terms-toc" aria-label="Tabla de contenidos">
      <p class="toc-title">En esta página</p>
      <ol class="toc-list">
        {#each sections as s}
          <li>
            <a href={`#${s.id}`}>
              <span class="toc-num">{s.num}.</span>
              <span>{s.title}</span>
            </a>
          </li>
        {/each}
      </ol>
    </aside>

    <article class="terms-content">
      <section id="aceptacion">
        <h2 class="terms-h2 font-epoch"><span class="num">01</span> Aceptación de los términos</h2>
        <p>
          Al acceder y utilizar los servicios de <strong>FlowPass</strong> (en adelante, "la Plataforma"),
          usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte,
          no debe utilizar nuestros servicios.
        </p>
      </section>

      <section id="servicio">
        <h2 class="terms-h2 font-epoch"><span class="num">02</span> Descripción del servicio</h2>
        <p>
          FlowPass es un <strong>software como servicio (SaaS)</strong> diseñado para negocios que venden
          clases, planes o membresías. Permite gestionar alumnos, controlar pagos, registrar asistencias
          y automatizar comunicación por WhatsApp.
        </p>
        <p>
          La Plataforma se proporciona "tal cual". Nos esforzamos por mantenerla disponible y funcionando
          correctamente, pero no garantizamos disponibilidad ininterrumpida o libre de errores.
        </p>
      </section>

      <section id="responsabilidades">
        <h2 class="terms-h2 font-epoch"><span class="num">03</span> Responsabilidades del usuario</h2>
        <ul class="terms-list">
          <li>Proporcionar información veraz y actualizada al registrarse.</li>
          <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
          <li>Utilizar la Plataforma de acuerdo a la ley y estos términos.</li>
          <li>No intentar acceder a datos de otros usuarios o vulnerar la seguridad del sistema.</li>
        </ul>
      </section>

      <section id="datos">
        <h2 class="terms-h2 font-epoch"><span class="num">04</span> Propiedad de los datos</h2>
        <div class="callout">
          <strong>Los datos que usted ingresa en FlowPass son de su exclusiva propiedad.</strong>
        </div>
        <p>
          Solo actuamos como procesadores de datos, proporcionando las herramientas para su gestión.
          No vendemos, alquilamos ni compartimos sus datos con terceros sin su consentimiento explícito,
          excepto cuando sea requerido por ley.
        </p>
        <p>
          Firmamos un <strong>acuerdo de confidencialidad</strong> con cada negocio para garantizar
          la protección de su información.
        </p>
      </section>

      <section id="pagos">
        <h2 class="terms-h2 font-epoch"><span class="num">05</span> Pagos y suscripciones</h2>
        <p>
          FlowPass opera bajo un modelo de <strong>suscripción mensual</strong>. El precio se determina
          según la cantidad de alumnos activos. Los pagos se procesan de forma segura a través de
          nuestros proveedores de pago.
        </p>
        <p>
          Puede cancelar su suscripción en cualquier momento. <strong>No hay contratos de permanencia
          ni penalizaciones por cancelación.</strong> Al cancelar, seguirá teniendo acceso hasta el
          final del período pagado.
        </p>
      </section>

      <section id="cancelacion">
        <h2 class="terms-h2 font-epoch"><span class="num">06</span> Cancelación y suspensión</h2>
        <p>Nos reservamos el derecho de suspender o cancelar el acceso a la Plataforma si detectamos:</p>
        <ul class="terms-list">
          <li>Uso inapropiado o fraudulento del servicio.</li>
          <li>Incumplimiento de estos términos.</li>
          <li>Falta de pago después de los períodos establecidos.</li>
        </ul>
      </section>

      <section id="responsabilidad">
        <h2 class="terms-h2 font-epoch"><span class="num">07</span> Limitación de responsabilidad</h2>
        <p>
          FlowPass no será responsable por daños indirectos, pérdida de datos o lucro cesante derivados
          del uso o imposibilidad de uso de la Plataforma. Nuestra responsabilidad máxima estará limitada
          al monto pagado por el servicio en los últimos 12 meses.
        </p>
      </section>

      <section id="modificaciones">
        <h2 class="terms-h2 font-epoch"><span class="num">08</span> Modificaciones</h2>
        <p>
          Podemos actualizar estos términos ocasionalmente. Notificaremos cambios significativos a través
          de la Plataforma o por correo electrónico. El uso continuado del servicio después de los cambios
          constituye aceptación de los nuevos términos.
        </p>
      </section>

      <section id="ley">
        <h2 class="terms-h2 font-epoch"><span class="num">09</span> Ley aplicable</h2>
        <p>
          Estos términos se rigen por las leyes de la República del Perú. Cualquier disputa será resuelta
          en los tribunales de Lima, Perú.
        </p>
      </section>

      <section id="contacto">
        <h2 class="terms-h2 font-epoch"><span class="num">10</span> Contacto</h2>
        <p>Si tiene preguntas sobre estos términos, contáctenos:</p>
        <address class="contact-block">
          <a href={`mailto:${siteConfig.email}`} class="contact-row">
            <span class="contact-label">Correo</span>
            <span class="contact-value">{siteConfig.email}</span>
          </a>
          <a href={`https://wa.me/${siteConfig.phone}`} target="_blank" rel="noopener noreferrer" class="contact-row">
            <span class="contact-label">WhatsApp</span>
            <span class="contact-value">{siteConfig.phoneFormatted}</span>
          </a>
          <div class="contact-row static">
            <span class="contact-label">Ubicación</span>
            <span class="contact-value">Lima, Perú</span>
          </div>
        </address>
      </section>

      <p class="back-home">
        <a href="/">← Volver al inicio</a>
      </p>
    </article>
  </div>
</main>

<Footer />

<style>
  .terms-page {
    background: #09090f;
    color: #fff;
    padding: 6rem 1.25rem 3rem;
    min-height: 100vh;
  }
  @media (min-width: 768px) {
    .terms-page { padding: 8rem 1.5rem 5rem; }
  }

  /* Header */
  .terms-header {
    max-width: 760px;
    margin: 0 auto 3rem;
    text-align: center;
  }
  .terms-eyebrow {
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
    margin-bottom: 1rem;
  }
  .terms-eyebrow::before {
    content: "";
    width: 6px; height: 6px;
    border-radius: 999px;
    background: #01f59e;
  }
  .terms-h1 {
    font-size: clamp(2.25rem, 6vw, 3.5rem);
    line-height: 1.1;
    color: #fff;
    margin: 0 0 0.75rem;
    letter-spacing: -0.01em;
  }
  .terms-h1 .grad {
    background: linear-gradient(90deg, #01f59e, #3168F4 60%, #531DD8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .terms-meta {
    color: rgba(255,255,255,0.45);
    font-size: 0.9rem;
    margin: 0;
  }

  /* Layout: TOC + content */
  .terms-layout {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  @media (min-width: 1024px) {
    .terms-layout {
      grid-template-columns: 240px 1fr;
      gap: 3rem;
      align-items: start;
    }
  }

  /* TOC */
  .terms-toc {
    display: none;
  }
  @media (min-width: 1024px) {
    .terms-toc {
      display: block;
      position: sticky;
      top: 6rem;
      padding: 1.25rem;
      background: rgba(255,255,255,0.04);
      border: 0.5px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      max-height: calc(100vh - 8rem);
      overflow-y: auto;
    }
  }
  .toc-title {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    margin: 0 0 0.75rem;
  }
  .toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .toc-list a {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    padding: 0.35rem 0.5rem;
    border-radius: 8px;
    color: rgba(255,255,255,0.6);
    font-size: 0.85rem;
    line-height: 1.4;
    text-decoration: none;
    transition: color 0.2s, background 0.2s;
  }
  .toc-list a:hover {
    color: #01f59e;
    background: rgba(1,245,158,0.06);
  }
  .toc-num {
    color: rgba(255,255,255,0.35);
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
    min-width: 1.25rem;
  }

  /* Content */
  .terms-content {
    background: rgba(255,255,255,0.03);
    border: 0.5px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 1.75rem 1.25rem;
  }
  @media (min-width: 768px) {
    .terms-content { padding: 3rem 3rem; }
  }
  .terms-content section {
    padding: 1.5rem 0;
    border-bottom: 0.5px solid rgba(255,255,255,0.06);
    scroll-margin-top: 6rem;
  }
  .terms-content section:first-child { padding-top: 0; }
  .terms-content section:last-of-type { border-bottom: 0; }

  .terms-h2 {
    font-size: 1.375rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    margin: 0 0 1rem;
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  @media (min-width: 768px) {
    .terms-h2 { font-size: 1.625rem; }
  }
  .terms-h2 .num {
    font-size: 0.85rem;
    font-weight: 600;
    color: #01f59e;
    background: rgba(1,245,158,0.1);
    border: 0.5px solid rgba(1,245,158,0.25);
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    letter-spacing: 0.05em;
    font-family: 'OktahNeue', 'Inter', sans-serif;
    line-height: 1;
  }

  .terms-content p {
    color: rgba(255,255,255,0.7);
    font-size: 0.95rem;
    line-height: 1.75;
    margin: 0 0 0.85rem;
  }
  .terms-content p:last-child { margin-bottom: 0; }
  .terms-content strong { color: #fff; font-weight: 600; }

  .terms-list {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }
  .terms-list li {
    position: relative;
    padding-left: 1.4rem;
    color: rgba(255,255,255,0.7);
    font-size: 0.95rem;
    line-height: 1.6;
  }
  .terms-list li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: #01f59e;
    font-weight: 700;
  }

  .callout {
    background: rgba(1,245,158,0.06);
    border: 0.5px solid rgba(1,245,158,0.25);
    border-left: 3px solid #01f59e;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    margin: 0 0 1rem;
    color: #fff;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .contact-block {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
    font-style: normal;
  }
  .contact-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.85rem 1rem;
    min-height: 44px;
    background: rgba(255,255,255,0.03);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    color: #fff;
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .contact-row:not(.static):hover {
    border-color: rgba(1,245,158,0.3);
    background: rgba(1,245,158,0.05);
  }
  .contact-label {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(255,255,255,0.45);
  }
  .contact-value {
    font-size: 0.95rem;
    color: #fff;
    text-align: right;
    word-break: break-all;
  }

  .back-home {
    margin: 2rem 0 0;
    font-size: 0.9rem;
  }
  .back-home a {
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    transition: color 0.2s;
  }
  .back-home a:hover { color: #01f59e; }
</style>
