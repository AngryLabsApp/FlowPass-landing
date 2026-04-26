<script lang="ts">
  import { siteConfig } from "$lib/config/site";

  const whatsappLink = `https://wa.me/${siteConfig.phone}?text=¡Hola!%20Tengo%20una%20duda%20sobre%20FlowPass.`;

  const faqs = [
    {
      q: "¿Qué es FlowPass?",
      a: `FlowPass es el software de gestión para negocios que venden clases, planes o membresías. <strong>Cobros, asistencias y recordatorios por WhatsApp</strong> — todo desde un solo lugar, sin Excel, sin caos.`
    },
    {
      q: "¿Qué tipo de negocios pueden usar FlowPass?",
      a: `Funciona para <strong>cualquier negocio que vende clases, planes o membresías</strong>: academias deportivas, yoga, música, idiomas, salud mental, gimnasios y más.`
    },
    {
      q: "¿Puedo mandar recordatorios por WhatsApp?",
      a: `Sí. FlowPass puede <strong>enviar recordatorios automáticos</strong> a tus alumnos, por ejemplo cuando se acerca la fecha de pago o al darles la bienvenida.`
    },
    {
      q: "¿Cómo empiezo?",
      a: `Agendas una demo gratuita y conoces la plataforma con datos reales. Si te convence, activamos tu cuenta y en menos de 24 horas ya estás operando.`
    },
    {
      q: "¿Tienen soporte técnico?",
      a: `Sí, todos los planes incluyen <strong>soporte personalizado por WhatsApp</strong>. No hablas con un bot — te responde el equipo de FlowPass directamente.`
    },
    {
      q: "¿Se compra o se paga mensual?",
      a: `FlowPass funciona con <strong>suscripción mensual</strong>, igual que Netflix o Spotify. Pagas cada mes y obtienes acceso completo, soporte y todas las actualizaciones.<br><br>Puedes <strong>cancelar cuando quieras</strong>. Sin contratos, sin permanencia.`
    },
    {
      q: "¿Cuánto cuesta?",
      a: `El precio depende del <strong>número de alumnos</strong> de tu negocio. Puedes ver todos los planes y precios en la sección <a href="/#precios" style="color:#01f59e;text-decoration:underline;">Precios</a> de esta página.`
    },
  ];

  let openIndex: number | null = 0;

  function toggle(i: number) {
    openIndex = openIndex === i ? null : i;
  }
</script>

<section id="faq" class="faq-section" aria-labelledby="faq-heading">
  <div class="faq-container">
    <div class="faq-header">
      <span class="faq-eyebrow">FAQ</span>
      <h2 id="faq-heading" class="faq-title font-epoch">
        Preguntas <span class="grad">frecuentes</span>
      </h2>
      <p class="faq-subtitle font-oktah">
        Resolvemos las dudas más comunes sobre FlowPass.
      </p>
    </div>

    <ul class="faq-list">
      {#each faqs as item, i}
        <li class="faq-item" class:open={openIndex === i}>
          <button
            type="button"
            class="faq-question"
            aria-expanded={openIndex === i}
            aria-controls={`faq-answer-${i}`}
            on:click={() => toggle(i)}
          >
            <span>{item.q}</span>
            <span class="faq-chevron" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </button>
          <div
            id={`faq-answer-${i}`}
            class="faq-answer"
            role="region"
            aria-hidden={openIndex !== i}
          >
            <div class="faq-answer-inner font-oktah">
              {@html item.a}
            </div>
          </div>
        </li>
      {/each}
    </ul>

    <p class="faq-footer font-oktah">
      ¿Tienes otra duda?
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" class="faq-footer-link">
        Escríbenos por WhatsApp
      </a>
      y te respondemos.
    </p>
  </div>
</section>

<style>
  .faq-section {
    
    padding: 3rem 1.25rem;
    color: #fff;
  }
  @media (min-width: 768px) {
    .faq-section { padding: 5rem 1.5rem; }
  }

  .faq-container {
    max-width: 760px;
    margin: 0 auto;
  }

  .faq-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .faq-eyebrow {
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
  .faq-eyebrow::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #01f59e;
  }

  .faq-title {
    font-size: clamp(2rem, 5vw, 3rem);
    line-height: 1.1;
    color: #fff;
    margin: 0 0 1rem;
    letter-spacing: -0.01em;
  }
  .faq-title .grad {
    background: linear-gradient(90deg, #01f59e, #3168F4 60%, #531DD8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .faq-subtitle {
    color: rgba(255,255,255,0.5);
    font-size: 1rem;
    line-height: 1.7;
    margin: 0;
  }

  .faq-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .faq-item {
    background: linear-gradient(
      145deg,
      rgba(255,255,255,0.06) 0%,
      rgba(255,255,255,0.02) 100%
    );
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border: 1px solid rgba(255,255,255,0.07);
    border-top: 1px solid rgba(255,255,255,0.14);
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
      0 4px 24px rgba(0,0,0,0.2),
      inset 0 1px 0 rgba(255,255,255,0.08);
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
  }
  .faq-item:hover {
    border-color: rgba(255,255,255,0.12);
    border-top-color: rgba(255,255,255,0.22);
    box-shadow:
      0 8px 32px rgba(0,0,0,0.28),
      inset 0 1px 0 rgba(255,255,255,0.1);
  }
  .faq-item.open {
    border-color: rgba(1,245,158,0.2);
    border-top-color: rgba(1,245,158,0.4);
    box-shadow:
      0 8px 32px rgba(0,0,0,0.25),
      0 0 40px -12px rgba(1,245,158,0.15),
      inset 0 1px 0 rgba(1,245,158,0.12);
  }

  .faq-question {
    width: 100%;
    background: transparent;
    border: 0;
    color: #fff;
    text-align: left;
    padding: 1rem 1.25rem;
    min-height: 44px;
    font-size: 0.95rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    cursor: pointer;
    transition: color 0.2s;
  }
  @media (min-width: 768px) {
    .faq-question { font-size: 1rem; padding: 1.25rem 1.5rem; }
  }
  .faq-question:hover { color: #01f59e; }

  .faq-chevron {
    color: rgba(255,255,255,0.5);
    transition: transform 0.3s, color 0.2s;
    flex-shrink: 0;
  }
  .faq-item.open .faq-chevron {
    transform: rotate(180deg);
    color: #01f59e;
  }

  .faq-answer {
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.4s ease;
  }
  .faq-item.open .faq-answer {
    max-height: 600px;
  }
  .faq-answer-inner {
    padding: 0 1.25rem 1.25rem;
    color: rgba(255,255,255,0.6);
    font-size: 0.9rem;
    line-height: 1.7;
  }
  @media (min-width: 768px) {
    .faq-answer-inner { padding: 0 1.5rem 1.5rem; font-size: 0.95rem; }
  }
  .faq-answer-inner :global(strong) { color: #fff; font-weight: 600; }

  .faq-footer {
    text-align: center;
    color: rgba(255,255,255,0.45);
    font-size: 0.9rem;
    margin: 2.5rem 0 0;
  }
  .faq-footer-link {
    color: #01f59e;
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: opacity 0.2s;
  }
  .faq-footer-link:hover { opacity: 0.8; }
</style>
