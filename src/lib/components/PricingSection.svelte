<script>
  import {
    countries,
    plans,
    whatsappPackages,
    perks,
  } from "$lib/data/pricingData.js";
  import { siteConfig } from "$lib/config/site";

  let selectedCountry = countries[0];

  /**
   * @param {{ code: string; label: string; flag: string; currency: string; currencyCode: string; }} country
   */
  function selectCountry(country) {
    selectedCountry = country;
    window.gtag?.('event', 'price_click', {
      event_category: 'region',
      event_label: 'country_selection',
      value: 1
    });
  }

  /**
   * @param {number} price
   * @param {string} currency
   */
  function formatPrice(price, currency) {
    if (price === 0) return `${currency} —`;
    return `${currency} ${price.toLocaleString("es")}`;
  }

  const whatsappLink = `https://wa.me/${siteConfig.phone}?text=¡Hola!%20Quisiera%20conocer%20cómo%20FlowPass%20puede%20ayudar%20a%20mi%20academia.`;
</script>

<section
  id="precios"
  class="pricing-section"
  aria-label="Planes y precios de FlowPass"
>
  <!-- Header -->
  <div class="section-header">
    <span class="section-eyebrow">Planes</span>
    <h2 class="section-title">El plan ideal para tu negocio</h2>
    <p class="section-subtitle">
      Elige el plan que mejor se adapte a tu tamaño. Sin sorpresas, sin contratos.
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
                <span>
                  {feature.label}{#if feature.included && feature.extraCost}<span class="extra-cost"> (+{selectedCountry.currency}{feature.extraCost[selectedCountry.code]}/sede)</span>{/if}
                </span>
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
            on:click={() => {
              window.gtag?.('event', 'price_click', {
                event_category: 'engagement',
                event_label: `plan_${plan.name.toLowerCase()}_button`,
                value: 1
              });
            }}
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
            on:click={() => {
              window.gtag?.('event', 'price_click', {
                event_category: 'engagement',
                event_label: `whatsapp_${pkg.name.toLowerCase().replace(/\s+/g, '_')}_button`,
                package_name: pkg.name,
                package_price: pkg.prices[selectedCountry.code],
                country: selectedCountry.code,
                value: pkg.prices[selectedCountry.code] || 0
              });
            }}
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
    
    padding: 3rem 1.25rem;
    color: #fff;
  }
  @media (min-width: 768px) {
    .pricing-section { padding: 5rem 1.5rem; }
  }

  /* ─── Header ─────────────────────────────────────────────── */
  .section-header {
    max-width: 720px;
    margin: 0 auto 2.5rem;
    text-align: center;
  }

  .section-eyebrow {
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
    text-transform: none;
    letter-spacing: normal;
  }
  .section-eyebrow::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #01f59e;
  }

  .section-title {
    font-family: 'Epoch', 'Syne', sans-serif;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    color: #ffffff;
    line-height: 1.1;
    margin: 0 0 1rem;
    letter-spacing: -0.01em;
  }

  .section-subtitle {
    color: rgba(255,255,255,0.5);
    font-size: 1rem;
    line-height: 1.7;
    margin: 0 0 2rem;
  }

  /* ─── Country selector ───────────────────────────────────── */
  .country-selector {
    display: inline-flex;
    gap: 0.25rem;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 9999px;
    padding: 0.3rem;
    backdrop-filter: blur(8px);
  }

  .country-pill {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.35rem 0.7rem;
    min-height: 32px;
    border-radius: 9999px;
    border: none;
    background: transparent;
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    white-space: nowrap;
  }
  .country-pill:hover { color: #fff; background: rgba(255,255,255,0.05); }
  .country-pill.active {
    background: #01f59e;
    color: #09090f;
    box-shadow: 0 0 20px rgba(1,245,158,0.3);
  }

  .flag { font-size: 0.9rem; line-height: 1; }

  /* ─── Perks bar ──────────────────────────────────────────── */
  .perks-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem 1.5rem;
    max-width: 860px;
    margin: 0 auto 2.5rem;
  }
  .perk-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.8125rem;
    color: rgba(255,255,255,0.55);
    font-weight: 500;
  }
  .perk-icon { color: #01f59e; font-weight: 700; }

  /* ─── Plans grid ─────────────────────────────────────────── */
  .plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.25rem;
    max-width: 1100px;
    margin: 0 auto 4rem;
    align-items: stretch;
  }

  /* ─── Plan card ──────────────────────────────────────────── */
  .plan-card {
    position: relative;
    background: linear-gradient(
      145deg,
      rgba(255,255,255,0.07) 0%,
      rgba(255,255,255,0.02) 100%
    );
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.08);
    border-top: 1px solid rgba(255,255,255,0.18);
    border-radius: 20px;
    padding: 1.75rem 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    box-shadow:
      0 4px 6px rgba(0,0,0,0.08),
      0 16px 48px rgba(0,0,0,0.28),
      inset 0 1px 0 rgba(255,255,255,0.12),
      inset 0 -1px 0 rgba(0,0,0,0.08);
    transition: border-color 0.35s, transform 0.35s, box-shadow 0.35s;
  }
  .plan-card:hover {
    border-color: rgba(1,245,158,0.2);
    border-top-color: rgba(1,245,158,0.35);
    box-shadow:
      0 4px 6px rgba(0,0,0,0.08),
      0 24px 64px rgba(0,0,0,0.35),
      0 0 40px -8px rgba(1,245,158,0.12),
      inset 0 1px 0 rgba(255,255,255,0.16),
      inset 0 -1px 0 rgba(0,0,0,0.08);
    transform: translateY(-6px);
  }
  .plan-card.highlighted {
    background: linear-gradient(
      145deg,
      rgba(1,245,158,0.08) 0%,
      rgba(1,245,158,0.02) 60%,
      rgba(83,29,216,0.04) 100%
    );
    border-color: rgba(1,245,158,0.3);
    border-top-color: rgba(1,245,158,0.55);
    box-shadow:
      0 4px 6px rgba(0,0,0,0.1),
      0 20px 60px rgba(0,0,0,0.3),
      0 0 80px -12px rgba(1,245,158,0.35),
      inset 0 1px 0 rgba(1,245,158,0.2),
      inset 0 -1px 0 rgba(0,0,0,0.1);
  }
  .plan-card.highlighted:hover {
    transform: translateY(-6px);
    box-shadow:
      0 4px 6px rgba(0,0,0,0.1),
      0 28px 72px rgba(0,0,0,0.35),
      0 0 100px -10px rgba(1,245,158,0.45),
      inset 0 1px 0 rgba(1,245,158,0.25),
      inset 0 -1px 0 rgba(0,0,0,0.1);
  }

  /* ─── Badge ──────────────────────────────────────────────── */
  .badge {
    position: absolute;
    top: -0.85rem;
    left: 50%;
    transform: translateX(-50%);
    background: #01f59e;
    color: #09090f;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.3rem 0.85rem;
    border-radius: 9999px;
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(1,245,158,0.35);
  }
  .badge-sm {
    font-size: 0.6rem;
    padding: 0.2rem 0.6rem;
    top: -0.7rem;
  }

  /* ─── Plan header ────────────────────────────────────────── */
  .plan-header {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .plan-name {
    font-family: 'Epoch', 'Syne', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }
  .plan-tagline {
    font-size: 0.8125rem;
    color: rgba(255,255,255,0.5);
    margin: 0;
    line-height: 1.45;
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
    color: #01f59e;
    margin: 0;
  }
  .plan-range--registered {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.4);
    font-weight: 500;
  }
  .range-icon { font-size: 0.75rem; }

  /* ─── Price ──────────────────────────────────────────────── */
  .plan-price {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    padding-top: 0.25rem;
    border-top: 0.5px solid rgba(255,255,255,0.06);
    padding-top: 1rem;
  }
  .price-amount {
    font-size: 1.875rem;
    font-weight: 800;
    color: #fff;
    line-height: 1;
    animation: fadePrice 0.3s ease;
  }
  .price-period {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.4);
    font-weight: 500;
  }
  @keyframes fadePrice {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* ─── Features list ──────────────────────────────────────── */
  .features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    flex: 1;
  }
  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: rgba(255,255,255,0.7);
    line-height: 1.5;
  }
  .feature-item.excluded { color: rgba(255,255,255,0.3); }
  .feature-icon {
    font-size: 0.75rem;
    font-weight: 800;
    flex-shrink: 0;
    margin-top: 0.2rem;
  }
  .feature-item:not(.excluded) .feature-icon { color: #01f59e; }
  .feature-item.excluded .feature-icon { color: rgba(255,255,255,0.2); }
  .extra-cost { color: rgba(255,255,255,0.4); font-size: 0.75rem; }

  /* ─── CTA button ─────────────────────────────────────────── */
  .cta-button {
    display: block;
    text-align: center;
    padding: 0.85rem 1rem;
    min-height: 44px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 700;
    text-decoration: none;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s, color 0.2s;
  }
  .cta-button:hover { transform: translateY(-1px); }

  .cta-primary {
    background: #01f59e;
    color: #09090f;
    box-shadow: 0 4px 20px rgba(1,245,158,0.35);
  }
  .cta-primary:hover {
    box-shadow: 0 6px 28px rgba(1,245,158,0.5);
  }

  .cta-secondary {
    background: rgba(255,255,255,0.06);
    color: #fff;
    border: 0.5px solid rgba(255,255,255,0.1);
  }
  .cta-secondary:hover {
    background: rgba(1,245,158,0.08);
    border-color: rgba(1,245,158,0.3);
    color: #01f59e;
  }

  /* ─── WhatsApp section ───────────────────────────────────── */
  .wa-section {
    max-width: 1100px;
    margin: 0 auto;
  }
  .wa-header { text-align: center; margin-bottom: 1.75rem; }
  .wa-title {
    font-family: 'Epoch', 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.5rem;
    line-height: 1.2;
  }
  @media (min-width: 768px) {
    .wa-title { font-size: 1.75rem; }
  }
  .wa-subtitle {
    font-size: 0.95rem;
    color: rgba(255,255,255,0.5);
    margin: 0;
    line-height: 1.6;
  }

  .wa-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.875rem;
    margin-bottom: 1rem;
  }

  .wa-card {
    position: relative;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 1.25rem 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    transition: border-color 0.3s, transform 0.3s, background 0.3s;
    cursor: pointer;
  }
  .wa-card:hover {
    border-color: rgba(1,245,158,0.2);
    background: rgba(255,255,255,0.05);
    transform: translateY(-2px);
  }
  .wa-card.highlighted {
    border-color: rgba(1,245,158,0.4);
    background: rgba(1,245,158,0.04);
  }
  .wa-name {
    font-size: 0.9375rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }
  .wa-messages {
    font-size: 0.8125rem;
    color: rgba(255,255,255,0.5);
    margin: 0;
  }
  .wa-messages strong { color: #fff; }
  .wa-price {
    font-size: 1.125rem;
    font-weight: 800;
    color: #01f59e;
    margin: 0.25rem 0 0;
    animation: fadePrice 0.3s ease;
  }
  .wa-note {
    text-align: center;
    font-size: 0.78rem;
    color: rgba(255,255,255,0.35);
    margin-top: 0.75rem;
  }

  /* ─── Responsive ─────────────────────────────────────────── */
  @media (max-width: 640px) {
    .plans-grid { grid-template-columns: 1fr; }
    .wa-grid { grid-template-columns: repeat(2, 1fr); }
    .perks-bar { gap: 0.5rem 1rem; }
  }
</style>
