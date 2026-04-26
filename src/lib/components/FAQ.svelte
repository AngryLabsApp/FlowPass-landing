<script lang="ts">
  const faqs = [
    {
      q: "🤔 ¿Qué es FlowPass?",
      a: `FlowPass es una herramienta que te ayuda a <strong>llevar el control de tu negocio sin complicarte</strong>. Desde un solo lugar puedes ver tus alumnos, sus pagos y asistencias, todo de manera digital.`
    },
    {
      q: "📱 ¿Tengo que instalar algo?",
      a: `No. FlowPass funciona directo desde internet. Puedes usarlo desde tu celular, tablet o computadora, sin descargar nada.`
    },
    {
      q: "💳 ¿Puedo registrar los pagos de mis alumnos?",
      a: `Sí. Podrás ver quién pagó, cuándo vence su plan y cuánto dinero ingresó a tu negocio. Todo queda guardado automáticamente.`
    },
    {
      q: "🧍 ¿Qué tipo de negocios pueden usar FlowPass?",
      a: `Funciona para <strong>cualquier negocio que vende clases, planes o membresías</strong>: academias deportivas, yoga, música, idiomas, salud mental, gimnasios y más.`
    },
    {
      q: "💬 ¿Puedo mandar recordatorios por WhatsApp?",
      a: `Sí. FlowPass puede <strong>enviar recordatorios automáticos</strong> a tus alumnos, por ejemplo cuando se acerca la fecha de pago o al darles la bienvenida.`
    },
    {
      q: "🔐 ¿Mis datos están seguros?",
      a: `Sí, completamente. Usamos <strong>servicios en la nube con altos estándares de seguridad</strong> para proteger toda la información de tu negocio y de tus alumnos.<br><br>Además, <strong>firmamos un acuerdo de confidencialidad</strong> con cada cliente. La información siempre es tuya.`
    },
    {
      q: "💚 ¿Cómo funciona FlowPass? ¿Se compra o se paga cada mes?",
      a: `FlowPass funciona con un modelo de <strong>suscripción mensual</strong>, igual que Netflix o Spotify. Pagas una cuota al mes y obtienes acceso completo, soporte personalizado y todas las actualizaciones.<br><br>Si en algún momento no deseas usarlo, <strong>puedes pausar tu cuenta</strong> y retomarla más adelante. Sin contratos.`
    },
    {
      q: "💰 ¿Cuánto cuesta FlowPass?",
      a: `El precio depende del <strong>número de alumnos</strong> que tenga tu negocio. Antes de activarlo, conversamos contigo para conocer tu caso y ofrecerte un precio justo.`
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
      ¿Tienes otra duda? Escríbenos por WhatsApp y te respondemos.
    </p>
  </div>
</section>

<style>
  .faq-section {
    background: #09090f;
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
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    overflow: hidden;
    transition: border-color 0.3s, background 0.3s;
  }
  .faq-item:hover {
    border-color: rgba(255,255,255,0.14);
  }
  .faq-item.open {
    border-color: rgba(1,245,158,0.25);
    background: rgba(1,245,158,0.03);
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
</style>
