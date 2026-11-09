<script lang="ts">
  import tiktokIcon from "$lib/assets/icons/tiktok-icon.svg";
  import facebookIcon from "$lib/assets/icons/facebook-icon.svg";
  import instagramIcon from "$lib/assets/icons/instagram-icon.svg";
  import { siteConfig } from "$lib/config/site";
  import { trackPlayStoreClick } from "$lib/tracking/track";
  import { disciplinas } from "$lib/data/disciplinas";

  const year = new Date().getFullYear();
  // Las disciplinas con más clientes primero; el resto en "Ver todas".
  const destacadas = ["academias-de-baile", "artes-marciales", "escuelas-de-futbol", "escuelas-de-natacion", "escuelas-de-musica", "centros-fitness"]
    .map((slug) => disciplinas.find((d) => d.slug === slug))
    .filter((d) => d !== undefined);

  const socials = [
    { href: siteConfig.social.tiktok, icon: tiktokIcon, label: "TikTok", event: "tiktok_footer" },
    { href: siteConfig.social.facebook, icon: facebookIcon, label: "Facebook", event: "facebook_footer" },
    { href: siteConfig.social.instagram, icon: instagramIcon, label: "Instagram", event: "instagram_footer" },
  ];
</script>

<footer class="site-footer" aria-labelledby="footer-heading">
  <h2 id="footer-heading" class="sr-only">Información de FlowPass</h2>

  <div class="footer-container">
    <div class="footer-top">
      <div class="footer-brand">
        <span class="footer-logo font-epoch">FlowPass</span>
        <p class="footer-tagline font-oktah">
          Software de gestión para negocios que venden clases, planes o membresías.
        </p>
        <a
          class="play-badge"
          href={siteConfig.playStore}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Descarga la app de FlowPass en Google Play"
          onclick={() => trackPlayStoreClick('footer')}
        >
          <svg viewBox="0 0 24 26" width="22" height="24" aria-hidden="true">
            <path d="M1 1l12.2 12L1 25c-.6-.3-1-.9-1-1.7V2.7C0 1.9.4 1.3 1 1z" fill="#00d7fe" />
            <path d="M17.3 8.9L13.2 13 1 1c.2-.1.4-.2.7-.2.3 0 .6.1.9.2l14.7 7.9z" fill="#00f076" />
            <path d="M17.3 17.1L2.6 25c-.3.2-.6.2-.9.2-.3 0-.5-.1-.7-.2l12.2-12 4.1 4.1z" fill="#ff3a44" />
            <path d="M22 14.6l-4.7 2.5-4.1-4.1 4.1-4.1L22 11.4c.6.3 1 .9 1 1.6s-.4 1.3-1 1.6z" fill="#ffd400" />
          </svg>
          <span class="play-text">
            <span class="play-small">Disponible en</span>
            <span class="play-big">Google Play</span>
          </span>
        </a>
      </div>

      <div class="footer-cols">
        <nav aria-label="Producto">
          <p class="footer-h">Producto</p>
          <a href="/#features">Funciones</a>
          <a href="/#precios">Precios</a>
          <a href="/#faq">Preguntas</a>
          <a href="/about">Nosotros</a>
          <a href="/blog">Blog</a>
          <a href="/te-llamamos">Contacto</a>
        </nav>
        <nav aria-label="Por disciplina">
          <p class="footer-h">Por disciplina</p>
          {#each destacadas as d (d.slug)}<a href={`/software/${d.slug}`}>{d.name}</a>{/each}
          <a href="/software">Ver todas →</a>
        </nav>
        <div class="footer-contact">
          <p class="footer-h">Contacto</p>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <a href={`mailto:${siteConfig.emailSoporte}`}>{siteConfig.emailSoporte}</a>
          <a href={siteConfig.phones.PE.whatsapp} target="_blank" rel="noopener noreferrer">{siteConfig.phones.PE.flag} {siteConfig.phones.PE.formatted}</a>
          <a href={siteConfig.phones.MX.whatsapp} target="_blank" rel="noopener noreferrer">{siteConfig.phones.MX.flag} {siteConfig.phones.MX.formatted}</a>
          <a href="/contacto">¿Tuviste un problema? Soporte →</a>
          <a href={siteConfig.social.googleReview} target="_blank" rel="noopener noreferrer">¿Ya usas FlowPass? Déjanos tu opinión ★</a>
        </div>
        <nav aria-label="Legal">
          <p class="footer-h">Legal</p>
          <a href="/terminos">Términos</a>
          <a href="/alumnos/terminos">Términos para alumnos</a>
          <a href="/privacidad">Privacidad</a>
        </nav>
      </div>

      <ul class="footer-socials">
        {#each socials as s}
          <li>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label={`FlowPass en ${s.label}`}
              onclick={() => {
                window.gtag?.('event', 'social_click', {
                  event_category: 'social',
                  event_label: s.event,
                  value: 1
                });
              }}
            >
              <img src={s.icon} alt="" class="social-icon" loading="lazy" width="20" height="20" aria-hidden="true" />
              <span class="sr-only">{s.label}</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <hr class="footer-divider" />

    <div class="footer-bottom">
      <p>© {year} FlowPass · {siteConfig.legal.name} · RUC {siteConfig.legal.ruc}</p>
      <p class="footer-credit">Hecho por peruanos 🇵🇪 y mexicanos 🇲🇽, para Latinoamérica.</p>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    background: #000;
    border-top: 0.5px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.62);
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 1.25rem 2rem;
  }
  @media (min-width: 768px) {
    .footer-container { padding: 4rem 1.5rem 2rem; }
  }

  .footer-top {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: flex-start;
  }
  @media (min-width: 768px) {
    .footer-top {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
    }
  }

  .footer-brand {
    max-width: 320px;
  }
  .footer-logo {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
    margin-bottom: 0.5rem;
  }
  .footer-tagline {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.62);
    line-height: 1.6;
    margin: 0;
  }

  .play-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 1.25rem;
    min-height: 48px;
    padding: 0.4rem 1rem 0.4rem 0.75rem;
    border-radius: 10px;
    background: #000;
    border: 1px solid rgba(255,255,255,0.35);
    color: #fff;
    text-decoration: none;
    transition: border-color 0.2s, transform 0.2s;
  }
  .play-badge:hover { border-color: #01f59e; transform: translateY(-2px); }
  .play-badge:focus-visible { outline: 2px solid #01f59e; outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) { .play-badge:hover { transform: none; } }
  .play-text { display: flex; flex-direction: column; line-height: 1.1; }
  .play-small { font-size: 0.625rem; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255,255,255,0.75); }
  .play-big { font-size: 1.05rem; font-weight: 600; letter-spacing: -0.01em; }

  .footer-cols { display: grid; grid-template-columns: repeat(4, auto); gap: 2rem 3rem; }
  .footer-cols nav,
  .footer-contact { display: flex; flex-direction: column; gap: 0.55rem; font-size: 0.875rem; }
  .footer-h { margin: 0 0 0.35rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.6); }
  .footer-cols a,
  .footer-h { white-space: nowrap; }
  .footer-cols a { color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.2s; }
  .footer-cols a:hover { color: #01f59e; }
  @media (max-width: 1100px) {
    .footer-cols { grid-template-columns: repeat(2, auto); }
  }
  @media (max-width: 640px) {
    /* En celular las columnas se ajustan al ancho y el texto sí puede bajar de línea */
    .footer-cols { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.75rem 1.5rem; }
    .footer-cols a,
    .footer-h { white-space: normal; overflow-wrap: anywhere; }
  }

  .footer-socials {
    display: flex;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .footer-socials a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
  }
  .footer-socials a:hover {
    border-color: rgba(1,245,158,0.3);
    background: rgba(1,245,158,0.06);
    transform: translateY(-2px);
  }
  .social-icon {
    width: 18px;
    height: 18px;
    filter: brightness(0) invert(1);
    opacity: 0.7;
  }
  .footer-socials a:hover .social-icon { opacity: 1; }

  .footer-divider {
    border: 0;
    height: 0.5px;
    background: rgba(255,255,255,0.06);
    margin: 2rem 0 1.5rem;
  }

  .footer-bottom {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    text-align: center;
    font-size: 0.8125rem;
    color: rgba(255,255,255,0.62);
  }
  @media (min-width: 768px) {
    .footer-bottom {
      flex-direction: row;
      justify-content: space-between;
      text-align: left;
    }
  }
  .footer-credit { color: rgba(255,255,255,0.3); margin: 0; }
</style>
