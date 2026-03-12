<script>
  import {
    countries,
    plans,
    whatsappPackages,
    perks,
  } from "$lib/data/pricingData.js";

  let selectedCountry = countries[0];

  function selectCountry(country) {
    selectedCountry = country;
  }

  function formatPrice(price, currency) {
    if (price === 0) return `${currency} —`;
    return `${currency} ${price.toLocaleString("es")}`;
  }
  const whatsappNumber = "51977854515"; // sin + ni espacios
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=¡Hola!%20Quisiera%20conocer%20cómo%20FlowPass%20puede%20ayudar%20a%20mi%20academia.`;
</script>

<section
  id="precios"
  class="pricing-section"
  aria-label="Planes y precios de FlowPass"
>
  <!-- Header -->
  <div class="section-header">
    <p class="section-eyebrow">Planes</p>
    <h2 class="section-title">El plan ideal para tu academia</h2>
    <p class="section-subtitle">
      Elige el plan que mejor se adapte al tamaño y necesidades de tu academia.
      Sin sorpresas, sin contratos.
    </p>

    <!-- Country selector -->
    <div class="country-selector" role="group" aria-label="Seleccionar país">
      {#each countries as country}
        <button
          class="country-pill"
          class:active={selectedCountry.code === country.code}
          aria-pressed={selectedCountry.code === country.code}
          on:click={() => selectCountry(country)}
        >
          <span class="flag" aria-hidden="true">{country.flag}</span>
          <span>{country.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Perks -->
  <div class="perks-bar" aria-label="Beneficios incluidos en todos los planes">
    {#each perks as perk}
      <div class="perk-item">
        <span class="perk-icon" aria-hidden="true">✓</span>
        <span>{perk}</span>
      </div>
    {/each}
  </div>

  <!-- Plans grid -->
  <div class="plans-grid" aria-live="polite" aria-atomic="true">
    {#key selectedCountry.code}
      {#each plans as plan}
        <article
          class="plan-card"
          class:highlighted={plan.highlight}
          aria-label="Plan {plan.name}"
        >
          {#if plan.highlight}
            <div class="badge" aria-label="Plan más popular">Más popular</div>
          {/if}

          <div class="plan-header">
            <h3 class="plan-name">{plan.name}</h3>
            <p class="plan-tagline">{plan.tagline}</p>
            <div class="plan-students">
              <p class="plan-range">
                <span class="range-icon" aria-hidden="true">🟢</span>
                {plan.activeStudents}
              </p>
              <p class="plan-range plan-range--registered">
                <span class="range-icon" aria-hidden="true">📋</span>
                {plan.registeredStudents}
              </p>
            </div>
          </div>

          <div class="plan-price" aria-label="Precio mensual">
            <span class="price-amount">
              {formatPrice(
                plan.prices[selectedCountry.code],
                selectedCountry.currency,
              )}
            </span>
            <span class="price-period">/mes</span>
          </div>

          <ul class="features-list" aria-label="Características incluidas">
            {#each plan.features as feature}
              <li class="feature-item" class:excluded={!feature.included}>
                <span class="feature-icon" aria-hidden="true">
                  {feature.included ? "✓" : "✕"}
                </span>
                <span>{feature.label}</span>
              </li>
            {/each}
          </ul>

          <a
            href={whatsappLink}
            class="cta-button"
            class:cta-primary={plan.highlight}
            class:cta-secondary={!plan.highlight}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contratar plan {plan.name}"
          >
            Empezar ahora
          </a>
        </article>
      {/each}
    {/key}
  </div>

  <!-- WhatsApp packages -->
  <div class="wa-section">
    <div class="wa-header">
      <h3 class="wa-title">WhatsApp masivo — cobra sin perseguir a nadie.</h3>
      <p class="wa-subtitle">
        Envía recordatorios de pago a todos tus alumnos a la vez. Suma un
        paquete a tu plan y listo.
      </p>
    </div>

    <div class="wa-grid" aria-live="polite" aria-atomic="true">
      {#key selectedCountry.code}
        {#each whatsappPackages as pkg}
          <article
            class="wa-card"
            class:highlighted={pkg.highlight}
            aria-label="Paquete WhatsApp {pkg.name}"
          >
            {#if pkg.highlight}
              <div class="badge badge-sm" aria-label="Paquete más popular">
                Popular
              </div>
            {/if}
            <p class="wa-name">{pkg.name}</p>
            <p class="wa-messages">
              <strong>{pkg.messages.toLocaleString("es")}</strong> mensajes/mes
            </p>
            <p class="wa-price">
              {formatPrice(
                pkg.prices[selectedCountry.code],
                selectedCountry.currency,
              )}
              <span class="price-period">/mes</span>
            </p>
          </article>
        {/each}
      {/key}
    </div>

    <p class="wa-note">
      * Multi sede disponible como módulo adicional. Consulta condiciones.
    </p>
  </div>
</section>

<style>
  /* ─── Layout ─────────────────────────────────────────────── */
  .pricing-section {
    background: #f9fafb;
    padding: 5rem 1.25rem;
  }

  /* ─── Header ─────────────────────────────────────────────── */
  .section-header {
    max-width: 720px;
    margin: 0 auto 3rem;
    text-align: center;
  }

  .section-eyebrow {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #1ab060;
    margin-bottom: 0.5rem;
  }

  .section-title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1.2;
    margin-bottom: 0.75rem;
  }

  .section-subtitle {
    color: #6b7280;
    font-size: 1.0625rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  /* ─── Country selector ───────────────────────────────────── */
  .country-selector {
    display: inline-flex;
    gap: 0.5rem;
    background: #e8faf1;
    border-radius: 9999px;
    padding: 0.3rem;
  }

  .country-pill {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 1.1rem;
    border-radius: 9999px;
    border: none;
    background: transparent;
    font-size: 0.9rem;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
    transition:
      background 0.2s,
      color 0.2s,
      box-shadow 0.2s;
  }

  .country-pill:hover {
    background: rgba(45, 218, 127, 0.15);
  }

  .country-pill.active {
    background: #2dda7f;
    color: #fff;
    box-shadow: 0 2px 8px rgba(45, 218, 127, 0.4);
  }

  .flag {
    font-size: 1.1rem;
    line-height: 1;
  }

  /* ─── Perks bar ──────────────────────────────────────────── */
  .perks-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem 2rem;
    max-width: 860px;
    margin: 0 auto 3rem;
  }

  .perk-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.875rem;
    color: #374151;
    font-weight: 500;
  }

  .perk-icon {
    color: #1ab060;
    font-weight: 700;
  }

  /* ─── Plans grid ─────────────────────────────────────────── */
  .plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    max-width: 1100px;
    margin: 0 auto 4rem;
    align-items: start;
  }

  /* ─── Plan card ──────────────────────────────────────────── */
  .plan-card {
    position: relative;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 1.25rem;
    padding: 1.75rem 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    transition:
      box-shadow 0.25s,
      transform 0.25s;
  }

  .plan-card:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    transform: translateY(-3px);
  }

  .plan-card.highlighted {
    border-color: #2dda7f;
    box-shadow:
      0 0 0 3px rgba(45, 218, 127, 0.18),
      0 8px 32px rgba(45, 218, 127, 0.12);
  }

  /* ─── Badge ──────────────────────────────────────────────── */
  .badge {
    position: absolute;
    top: -0.85rem;
    left: 50%;
    transform: translateX(-50%);
    background: #2dda7f;
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.25rem 0.85rem;
    border-radius: 9999px;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(45, 218, 127, 0.35);
  }

  .badge-sm {
    font-size: 0.65rem;
    padding: 0.2rem 0.65rem;
    top: -0.75rem;
  }

  /* ─── Plan header ────────────────────────────────────────── */
  .plan-header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .plan-name {
    font-size: 1.25rem;
    font-weight: 800;
    color: #1a1a1a;
    margin: 0;
  }

  .plan-tagline {
    font-size: 0.8125rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.4;
  }

  .plan-students {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-top: 0.25rem;
  }

  .plan-range {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #1ab060;
    margin: 0;
  }

  .plan-range--registered {
    font-size: 0.72rem;
    color: #6b7280;
    font-weight: 500;
  }

  .range-icon {
    font-size: 0.75rem;
  }

  /* ─── Price ──────────────────────────────────────────────── */
  .plan-price {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
  }

  .price-amount {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1;
    animation: fadePrice 0.3s ease;
  }

  .price-period {
    font-size: 0.875rem;
    color: #9ca3af;
    font-weight: 500;
  }

  @keyframes fadePrice {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ─── Features ───────────────────────────────────────────── */
  .features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    flex: 1;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
    line-height: 1.45;
  }

  .feature-item.excluded {
    color: #9ca3af;
  }

  .feature-icon {
    font-size: 0.75rem;
    font-weight: 800;
    flex-shrink: 0;
    margin-top: 0.15rem;
  }

  .feature-item:not(.excluded) .feature-icon {
    color: #1ab060;
  }

  .feature-item.excluded .feature-icon {
    color: #d1d5db;
  }

  /* ─── CTA button ─────────────────────────────────────────── */
  .cta-button {
    display: block;
    text-align: center;
    padding: 0.7rem 1rem;
    border-radius: 0.625rem;
    font-size: 0.9rem;
    font-weight: 700;
    text-decoration: none;
    transition:
      background 0.2s,
      box-shadow 0.2s,
      transform 0.15s;
  }

  .cta-button:hover {
    transform: translateY(-1px);
  }

  .cta-primary {
    background: #2dda7f;
    color: #fff;
    box-shadow: 0 4px 14px rgba(45, 218, 127, 0.35);
  }

  .cta-primary:hover {
    background: #1ab060;
    box-shadow: 0 6px 18px rgba(45, 218, 127, 0.45);
  }

  .cta-secondary {
    background: #f3f4f6;
    color: #1a1a1a;
  }

  .cta-secondary:hover {
    background: #e8faf1;
    color: #1ab060;
  }

  /* ─── WhatsApp section ───────────────────────────────────── */
  .wa-section {
    max-width: 1100px;
    margin: 0 auto;
  }

  .wa-header {
    text-align: center;
    margin-bottom: 1.75rem;
  }

  .wa-title {
    font-size: 1.375rem;
    font-weight: 800;
    color: #1a1a1a;
    margin: 0 0 0.4rem;
  }

  .wa-subtitle {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0;
  }

  .wa-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .wa-card {
    position: relative;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1.25rem 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    transition:
      box-shadow 0.2s,
      transform 0.2s;
  }

  .wa-card:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
    transform: translateY(-2px);
  }

  .wa-card.highlighted {
    border-color: #2dda7f;
    box-shadow: 0 0 0 2px rgba(45, 218, 127, 0.2);
  }

  .wa-name {
    font-size: 0.9375rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
  }

  .wa-messages {
    font-size: 0.8125rem;
    color: #6b7280;
    margin: 0;
  }

  .wa-price {
    font-size: 1.125rem;
    font-weight: 800;
    color: #1a1a1a;
    margin: 0.25rem 0 0;
    animation: fadePrice 0.3s ease;
  }

  .wa-note {
    text-align: center;
    font-size: 0.78rem;
    color: #9ca3af;
    margin-top: 0.75rem;
  }

  /* ─── Responsive ─────────────────────────────────────────── */
  @media (max-width: 640px) {
    .pricing-section {
      padding: 3.5rem 1rem;
    }

    .plans-grid {
      grid-template-columns: 1fr;
    }

    .wa-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .perks-bar {
      gap: 0.75rem 1.25rem;
    }
  }
</style>
