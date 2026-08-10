<script lang="ts">
  import tiktokIcon from "$lib/assets/icons/tiktok-icon.svg";
  import facebookIcon from "$lib/assets/icons/facebook-icon.svg";
  import instagramIcon from "$lib/assets/icons/instagram-icon.svg";
  import { siteConfig } from "$lib/config/site";

  const year = new Date().getFullYear();

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
      </div>

      <nav class="footer-nav" aria-label="Enlaces del footer">
        <a href="/#features">Funciones</a>
        <a href="/#precios">Precios</a>
        <a href="/#faq">Preguntas</a>
        <a href="/#contacto">Contacto</a>
        <a href="/terminos">Términos</a>
      </nav>

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
      <p>© {year} FlowPass. Todos los derechos reservados.</p>
      <p class="footer-credit">Hecho en Lima 🇵🇪 — para Latinoamérica.</p>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    background: #000;
    border-top: 0.5px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.4);
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
      align-items: center;
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
    color: rgba(255,255,255,0.4);
    line-height: 1.6;
    margin: 0;
  }

  .footer-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
    font-size: 0.875rem;
  }
  .footer-nav a {
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    transition: color 0.2s;
  }
  .footer-nav a:hover { color: #01f59e; }

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
    color: rgba(255,255,255,0.4);
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
