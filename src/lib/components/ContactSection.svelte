<script lang="ts">
  import { ChatBubbleOvalLeftEllipsis, AtSymbol, CalendarDays } from "svelte-heros-v2";
  import { siteConfig } from "$lib/config/site";
  import { trackContact, trackEmailClick, trackSchedule } from "$lib/tracking/track";

  const whatsappLink = `https://wa.me/${siteConfig.phone}?text=¡Hola!%20Quisiera%20conocer%20cómo%20FlowPass%20puede%20ayudar%20a%20mi%20negocio.`;
  const mailtoLink = `mailto:${siteConfig.email}?subject=Consulta%20sobre%20FlowPass`;
  const calendarLink = "https://calendar.app.google/niQmo8L4nZ7d4Kt8A";
</script>

<section
  id="contacto"
  class="contact-section"
  aria-labelledby="contact-heading"
>
  <div class="contact-container">
    <div class="contact-header">
      <span class="contact-eyebrow">Contacto</span>
      <h2 id="contact-heading" class="contact-title font-epoch">
        Hablemos de tu <span class="grad">negocio</span>
      </h2>
      <p class="contact-subtitle font-oktah">
        ¿Quieres una <strong>demo personalizada</strong>? Escríbenos y te mostramos cómo FlowPass puede ayudarte.
      </p>
    </div>

    <div class="contact-grid">
      <a
        href={calendarLink}
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="contact-card primary"
        aria-label="Agendar demo gratuita"
        onclick={() => trackSchedule('contact_section')}
      >
        <span class="card-icon"><CalendarDays class="w-6 h-6" /></span>
        <span class="card-title">Agendar demo</span>
        <span class="card-desc">15 min, gratis, sin compromiso.</span>
      </a>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="contact-card"
        aria-label="WhatsApp FlowPass"
        onclick={() => trackContact('contact_section')}
      >
        <span class="card-icon"><ChatBubbleOvalLeftEllipsis class="w-6 h-6" /></span>
        <span class="card-title">WhatsApp</span>
        <span class="card-desc">{siteConfig.phoneFormatted}</span>
      </a>

      <a
        href={mailtoLink}
        class="contact-card"
        aria-label="Enviar correo a FlowPass"
        onclick={() => trackEmailClick('contact_section')}
      >
        <span class="card-icon"><AtSymbol class="w-6 h-6" /></span>
        <span class="card-title">Correo</span>
        <span class="card-desc">{siteConfig.email}</span>
      </a>
    </div>
  </div>
</section>

<style>
  .contact-section {
    
    padding: 3rem 1.25rem;
    color: #fff;
  }
  @media (min-width: 768px) {
    .contact-section { padding: 5rem 1.5rem; }
  }

  .contact-container {
    max-width: 1100px;
    margin: 0 auto;
  }

  .contact-header {
    text-align: center;
    margin-bottom: 2.5rem;
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
  }

  .contact-eyebrow {
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
  .contact-eyebrow::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #01f59e;
  }

  .contact-title {
    font-size: clamp(2rem, 5vw, 3rem);
    line-height: 1.1;
    color: #fff;
    margin: 0 0 1rem;
    letter-spacing: -0.01em;
  }
  .contact-title .grad {
    background: linear-gradient(90deg, #01f59e, #3168F4 60%, #531DD8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .contact-subtitle {
    color: rgba(255,255,255,0.5);
    font-size: 1rem;
    line-height: 1.7;
    margin: 0;
  }
  .contact-subtitle strong { color: #fff; }

  .contact-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media (min-width: 640px) {
    .contact-grid { grid-template-columns: repeat(3, 1fr); }
  }

  .contact-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem;
    min-height: 160px;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    color: #fff;
    text-decoration: none;
    transition: border-color 0.3s, transform 0.3s, background 0.3s;
  }
  .contact-card:hover {
    border-color: rgba(1,245,158,0.25);
    background: rgba(255,255,255,0.05);
    transform: translateY(-3px);
  }
  .contact-card.primary {
    background: rgba(1,245,158,0.06);
    border-color: rgba(1,245,158,0.3);
  }
  .contact-card.primary:hover {
    background: rgba(1,245,158,0.1);
    box-shadow: 0 0 40px -10px rgba(1,245,158,0.4);
  }

  .card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(1,245,158,0.12);
    color: #01f59e;
  }

  .card-title {
    font-family: 'Epoch', 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
  }

  .card-desc {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.55);
    line-height: 1.5;
  }
</style>
