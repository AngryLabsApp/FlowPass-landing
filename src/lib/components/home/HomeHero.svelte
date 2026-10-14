<script lang="ts">
  import heroPhoto from '$lib/assets/images/home/hero.webp';
  import { trackAgendaClick } from '$lib/tracking/track';
</script>

<svelte:head>
  <!-- La foto de portada es el elemento más grande (LCP): se pide primero -->
  <link rel="preload" as="image" href={heroPhoto} type="image/webp" fetchpriority="high" />
</svelte:head>

<!-- Portada: la persona antes que el producto. Foto con gradación de marca encima. -->
<header class="hero">
  <div class="hero-photo" style={`--photo:url(${heroPhoto})`}>
    <div class="media" role="img" aria-label="Dueña de un estudio de danza haciendo las cuentas del mes a mano, de noche, en su casa"></div>
    <div class="copy">
      <p class="kicker">Academias, gimnasios y estudios · Perú y México</p>
      <h1>Tú enfócate en tu negocio. <span>Nosotros, en la operación.</span></h1>
      <p class="sub">Cobrar, recordar, anotar y emitir comprobantes. Cada mes, lo mismo. FlowPass lo hace por ti.</p>
      <div class="ctas">
        <a class="btn pill-green" href="/agenda" onclick={() => trackAgendaClick('hero')}>
          Agenda 15 minutos
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
        </a>
        <a class="btn pill-white" href="#features">Ver la plataforma</a>
      </div>
      <p class="trust">Sin permanencia · Operativo 24/7 · Soporte 1 a 1</p>
    </div>
  </div>
</header>

<style>
  .hero { padding-block: 88px 0; }
  .hero-photo {
    position: relative;
    max-width: 1280px;
    margin-inline: auto;
    border-radius: 24px;
    overflow: hidden;
    min-height: clamp(540px, 82vh, 780px);
    display: flex;
    align-items: flex-end;
    isolation: isolate;
    background: #09090f;
  }
  .media {
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      radial-gradient(28% 34% at 66% 74%, rgba(1, 245, 158, 0.55), transparent 70%),
      radial-gradient(45% 60% at 52% 30%, rgba(83, 29, 216, 0.85), transparent 75%),
      linear-gradient(rgba(83, 29, 216, 0.55), rgba(83, 29, 216, 0.55)),
      var(--photo) 72% center / cover no-repeat;
    background-blend-mode: soft-light, soft-light, soft-light, normal;
  }
  .hero-photo::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(180deg, rgba(9, 9, 15, 0.05) 30%, rgba(9, 9, 15, 0.82) 100%),
      linear-gradient(90deg, rgba(9, 9, 15, 0.6), transparent 65%),
      linear-gradient(rgba(83, 29, 216, 0.18), rgba(83, 29, 216, 0.18));
  }
  .copy { padding: clamp(24px, 4vw, 48px); max-width: 760px; color: #fff; }
  .kicker {
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.75);
  }
  h1 { font-size: clamp(30px, 5.6vw, 76px); margin-top: 16px; color: #fff; }
  h1 span { display: block; color: #01f59e; }
  .sub { margin-top: 18px; font-size: 18px; max-width: 46ch; color: rgba(255, 255, 255, 0.86); }
  .ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
  .trust { margin-top: 20px; font-size: 13px; color: rgba(255, 255, 255, 0.7); }
  /* Celular: foto arriba, texto abajo sobre negro (la foto no queda tapada). */
  @media (max-width: 560px) {
    .hero { padding-top: 84px; }
    .hero-photo { display: block; min-height: 0; border-radius: 18px; }
    .media {
      position: relative;
      height: 260px;
      background-position: 0 0, 0 0, 0 0, 74% 30%;
      -webkit-mask-image: linear-gradient(#000 55%, transparent);
      mask-image: linear-gradient(#000 55%, transparent);
    }
    .hero-photo::after { display: none; }
    .copy { padding: 0 22px 26px; margin-top: -36px; position: relative; }
    .kicker { font-size: 10.5px; letter-spacing: 0.1em; }
    h1 { font-size: clamp(28px, 8.4vw, 36px); margin-top: 10px; }
    .sub { font-size: 14px; margin-top: 12px; }
    .ctas { margin-top: 22px; }
    .ctas { gap: 8px; }
    .ctas .btn { flex: 1 1 100%; justify-content: center; padding: 11px 16px; font-size: 14px; line-height: 1.2; }
    .ctas .btn svg { width: 15px; height: 15px; }
    .trust { font-size: 10.5px; margin-top: 14px; white-space: nowrap; }
  }
</style>
