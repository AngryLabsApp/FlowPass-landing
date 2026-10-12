<script lang="ts">
  import '$lib/components/home/home.css';
  import Footer from '$lib/components/Footer.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import { siteConfig } from '$lib/config/site';
  import { contactSEO } from '$lib/config/seo';

  const url = `${siteConfig.url}/contacto`;
  const phones = [siteConfig.phones.PE, siteConfig.phones.MX];
  const socials = [
    { label: 'Instagram', href: siteConfig.social.instagram, handle: '@flowpass.app' },
    { label: 'Facebook', href: siteConfig.social.facebook, handle: 'flowpassapp' },
    { label: 'TikTok', href: siteConfig.social.tiktok, handle: '@flowpass.app' }
  ];
</script>

<svelte:head>
  <title>{contactSEO.title}</title>
  <meta name="description" content={contactSEO.description} />
  <link rel="canonical" href={url} />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={contactSEO.title} />
  <meta property="og:description" content={contactSEO.description} />
</svelte:head>

<!-- El Navbar vive en +layout.svelte -->
<main class="home contact">
  <div class="wrap grid">
    <section class="form-card" aria-labelledby="ct-title">
      <p class="eyebrow">Contacto</p>
      <h1 id="ct-title">Escríbenos.</h1>
      <p class="lead">Te respondemos en menos de 24 horas hábiles.</p>
      <ContactForm />
    </section>

    <aside class="info" aria-label="Datos de contacto y de la empresa">
      <div class="block">
        <h2>Correo</h2>
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        <a href={`mailto:${siteConfig.emailComercial}`}>{siteConfig.emailComercial} <small>· comercial</small></a>
      </div>
      <div class="block">
        <h2>WhatsApp</h2>
        {#each phones as p (p.code)}
          <a href={p.whatsapp} target="_blank" rel="noopener noreferrer">{p.flag} {p.label} · {p.formatted}</a>
        {/each}
      </div>
      <div class="block">
        <h2>Redes</h2>
        {#each socials as s (s.label)}
          <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label} · {s.handle}</a>
        {/each}
      </div>
      <div class="block legal">
        <h2>Empresa</h2>
        <p><b>{siteConfig.legal.name}</b></p>
        <p>RUC {siteConfig.legal.ruc}</p>
        <p>{siteConfig.legal.address}</p>
        <p class="links"><a href="/terminos">Términos y condiciones</a> · <a href="/privacidad">Privacidad</a></p>
      </div>
    </aside>
  </div>
</main>

<Footer />

<style>
  .contact { padding-block: 120px 64px; min-height: 100vh; }
  .grid { display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 32px; align-items: start; }
  .form-card { background: var(--panel); border: 1px solid var(--line); border-radius: 24px; padding: clamp(22px, 4vw, 40px); box-shadow: var(--shadow); }
  h1 { font-size: clamp(30px, 4.4vw, 48px); margin-top: 10px !important; }
  .form-card .lead { margin: 8px 0 22px; font-size: 15.5px; }
  .info { display: grid; gap: 14px; }
  .block { display: grid; gap: 6px; padding: 18px 20px; border: 1px solid var(--line); border-radius: 18px; background: var(--bg-2); }
  .block h2 { font-family: var(--body); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-3); margin-bottom: 2px; }
  .block a { color: var(--fg); text-decoration: none; font-size: 15px; word-break: break-word; }
  .block a:hover { color: var(--accent-text); }
  .block small { color: var(--fg-3); }
  .legal p { font-size: 14px; color: var(--fg-2); }
  .legal b { color: var(--fg); }
  .legal .links { margin-top: 4px; }
  .legal .links a { font-size: 13.5px; text-decoration: underline; color: var(--fg-2); }
  @media (max-width: 900px) {
    .grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .contact { padding-top: 96px; }
  }
</style>
