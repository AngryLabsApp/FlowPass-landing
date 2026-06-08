<script>
  import {
    countries,
    plans,
    billingCycles,
    whatsappPackages,
    perks,
    FLOWY_BETA_BADGE,
    taxRates,
    PRICES_INCLUDE_TAX,
    getPlanPrice,
    formatPrice,
  } from "$lib/data/pricingData.js";
  import { siteConfig } from "$lib/config/site";

  let selectedCountry = countries[0];
  let selectedCycle = billingCycles[1]; // trimestral
  let withWhatsapp = true;

  $: selfServePlans = plans.filter((p) => !p.quoteBased);
  $: enterprisePlan = plans.find((p) => p.quoteBased);

  /** @type {Record<string, string>} */
  const taxLabels = { PE: "IGV", MX: "IVA", US: "" };
  $: taxRate = taxRates[selectedCountry.code] ?? 0;
  $: taxLabel = taxLabels[selectedCountry.code] ?? "";
  $: taxInline =
    PRICES_INCLUDE_TAX && taxRate > 0 && taxLabel ? `${taxLabel} incluido` : "";

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
   * @param {{ id: string; label: string; discount: number; note: string; }} cycle
   */
  function selectCycle(cycle) {
    selectedCycle = cycle;
    window.gtag?.('event', 'price_click', {
      event_category: 'engagement',
      event_label: `cycle_${cycle.id}`,
      value: 1
    });
  }

  function toggleWhatsapp() {
    withWhatsapp = !withWhatsapp;
    window.gtag?.('event', 'price_click', {
      event_category: 'engagement',
      event_label: `whatsapp_auto_${withWhatsapp ? 'on' : 'off'}`,
      value: 1
    });
  }

  const whatsappLink = `https://wa.me/${siteConfig.phone}?text=¡Hola!%20Quisiera%20conocer%20cómo%20FlowPass%20puede%20ayudar%20a%20mi%20academia.`;
  const enterpriseLink = `https://wa.me/${siteConfig.phone}?text=¡Hola!%20Estoy%20interesado%20en%20Flow%20Enterprise%20para%20mi%20cadena.`;
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

    <!-- Cycle + WhatsApp toggle (same row) -->
    <div class="controls-row">
      <div class="cycle-selector" role="group" aria-label="Seleccionar ciclo de facturación">
        {#each billingCycles as cycle}
          <button
            class="cycle-pill"
            class:active={selectedCycle.id === cycle.id}
            aria-pressed={selectedCycle.id === cycle.id}
            on:click={() => selectCycle(cycle)}
          >
            <span>{cycle.label}</span>
            {#if cycle.discount > 0}
              <span class="cycle-save">Ahorra ~{Math.round(cycle.discount * 100)}%</span>
            {/if}
          </button>
        {/each}
      </div>

      <button
        class="addon-toggle"
        class:active={withWhatsapp}
        aria-pressed={withWhatsapp}
        on:click={toggleWhatsapp}
      >
        <span class="addon-switch" aria-hidden="true">
          <span class="addon-knob"></span>
        </span>
        <span class="addon-label">Recordatorios automáticos vía WhatsApp</span>
      </button>
    </div>

    <!-- Country selector (dropdown) -->
    <div class="country-select-wrap">
      <label class="country-select-label" for="country-select">País</label>
      <div class="country-select-control">
        <span class="country-select-flag" aria-hidden="true">{selectedCountry.flag}</span>
        <select
          id="country-select"
          class="country-select"
          value={selectedCountry.code}
          on:change={(e) => {
            const next = countries.find((c) => c.code === e.currentTarget.value);
            if (next) selectCountry(next);
          }}
          aria-label="Seleccionar país"
        >
          {#each countries as country}
            <option value={country.code}>{country.label}</option>
          {/each}
        </select>
        <span class="country-select-caret" aria-hidden="true">▾</span>
      </div>
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
    {#key `${selectedCountry.code}-${selectedCycle.id}-${withWhatsapp}`}
      {#each selfServePlans as plan}
        {@const price = getPlanPrice(plan, selectedCycle.id, selectedCountry.code, withWhatsapp)}
        <article
          class="plan-card"
          class:highlighted={plan.highlight}
          aria-label="Plan {plan.name}"
        >
          <div class="badge-stack">
            {#if plan.highlight}
              <div class="badge badge-popular" aria-label="Plan más popular">Más popular</div>
            {/if}
            {#if plan.flowyBeta}
              <div class="badge badge-flowy" aria-label="Incluye Flowy en beta">
                {FLOWY_BETA_BADGE.label} <span class="badge-tag">{FLOWY_BETA_BADGE.tag}</span>
              </div>
            {/if}
          </div>

          <div class="plan-header">
            <h3 class="plan-name">{plan.name}</h3>
            <p class="plan-tagline">{plan.tagline}</p>
            <div class="plan-students">
              <p class="plan-range">
                <span class="range-icon" aria-hidden="true">🟢</span>
                {plan.activeStudents}
              </p>
              {#if plan.registeredStudents}
                <p class="plan-range plan-range--registered">
                  <span class="range-icon" aria-hidden="true">📋</span>
                  {plan.registeredStudents}
                </p>
              {/if}
            </div>
          </div>

          <div class="plan-price" aria-label="Precio mensual">
            <span class="price-amount">{formatPrice(price ?? 0, selectedCountry.code)}</span>
            <span class="price-period">/mes</span>
            {#if taxInline}
              <span class="price-tax">{taxInline}</span>
            {/if}
          </div>
          {#if withWhatsapp && plan.whatsappAuto}
            <p class="price-breakdown">
              Incluye <strong>{plan.whatsappAuto.includedReminders}</strong> recordatorios automáticos/mes
            </p>
          {/if}
          {#if plan.freeTrial}
            <p class="free-trial">Empieza gratis · sin tarjeta de crédito</p>
          {/if}

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
            on:click={() => {
              window.gtag?.('event', 'price_click', {
                event_category: 'engagement',
                event_label: `plan_${plan.id}_button`,
                cycle: selectedCycle.id,
                with_whatsapp: withWhatsapp,
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
      <h3 class="wa-title">¿Necesitas más recordatorios? Suma un pack.</h3>
      <p class="wa-subtitle">
        Si superas los recordatorios automáticos incluidos en tu plan, agrega
        un paquete adicional al mes.
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
              <strong>{pkg.reminders.toLocaleString("es")}</strong> recordatorios/mes
            </p>
            <p class="wa-price">
              {formatPrice(pkg.prices[selectedCountry.code], selectedCountry.code)}
              <span class="price-period">/mes</span>
            </p>
          </article>
        {/each}
      {/key}
    </div>

    <p class="wa-note">
      * El costo de la API oficial de WhatsApp es variable, por eso los packs
      tienen precio fijo independiente del ciclo de facturación.
    </p>
  </div>

  <!-- Enterprise band -->
  {#if enterprisePlan}
    <aside class="enterprise-band" aria-label="Plan Enterprise">
      <div class="enterprise-content">
        <div class="enterprise-meta">
          <span class="enterprise-eyebrow">Para cadenas y marcas</span>
          <h3 class="enterprise-title">{enterprisePlan.name}</h3>
          <p class="enterprise-tagline">{enterprisePlan.tagline}</p>
        </div>

        <ul class="enterprise-features">
          {#each enterprisePlan.features as feature}
            <li>
              <span class="feature-icon" aria-hidden="true">✓</span>
              <span>{feature.label}</span>
            </li>
          {/each}
        </ul>

        <div class="enterprise-cta">
          <span class="enterprise-price">Bajo evaluación</span>
          <a
            href={enterpriseLink}
            class="cta-button cta-primary"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hablar con el equipo de Flow Enterprise"
            on:click={() => {
              window.gtag?.('event', 'price_click', {
                event_category: 'engagement',
                event_label: 'plan_enterprise_button',
                value: 1
              });
            }}
          >
            Hablemos
          </a>
        </div>
      </div>
    </aside>
  {/if}
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

  /* ─── Cycle selector ─────────────────────────────────────── */
  .cycle-selector {
    display: inline-flex;
    gap: 0.25rem;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 9999px;
    padding: 0.3rem;
    backdrop-filter: blur(8px);
  }
  .cycle-pill {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.85rem;
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
  .cycle-pill:hover { color: #fff; background: rgba(255,255,255,0.05); }
  .cycle-pill.active {
    background: #fff;
    color: #09090f;
  }
  .cycle-save {
    font-size: 0.65rem;
    font-weight: 800;
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    background: #01f59e;
    color: #09090f;
    letter-spacing: 0.02em;
  }
  .cycle-pill:not(.active) .cycle-save {
    background: rgba(1,245,158,0.15);
    color: #01f59e;
  }

  /* ─── Country select (dropdown) ──────────────────────────── */
  .country-select-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.9rem;
  }
  .country-select-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.02em;
  }
  .country-select-control {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.4rem 0.85rem;
    border-radius: 12px;
    background: rgba(255,255,255,0.05);
    border: 0.5px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(8px);
    transition: border-color 0.2s, background 0.2s;
  }
  .country-select-control:hover {
    border-color: rgba(1,245,158,0.35);
    background: rgba(255,255,255,0.07);
  }
  .country-select-control:focus-within {
    border-color: #01f59e;
    box-shadow: 0 0 0 3px rgba(1,245,158,0.15);
  }
  .country-select-flag {
    font-size: 1rem;
    line-height: 1;
  }
  .country-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    padding-right: 1.25rem;
    cursor: pointer;
    min-width: 150px;
  }
  .country-select option {
    background: #09090f;
    color: #fff;
  }
  .country-select-caret {
    position: absolute;
    right: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 0.7rem;
    color: rgba(255,255,255,0.5);
  }

  /* ─── Perks bar ──────────────────────────────────────────── */
  .perks-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem 1.5rem;
    max-width: 860px;
    margin: 0 auto 1.5rem;
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

  /* ─── Controls row (cycle + toggle) ──────────────────────── */
  .controls-row {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.6rem;
  }

  /* ─── Add-on toggle (inline) ─────────────────────────────── */
  .addon-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.45rem 0.9rem;
    min-height: 40px;
    border-radius: 9999px;
    border: 0.5px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
    font: inherit;
    backdrop-filter: blur(8px);
  }
  .addon-toggle:hover {
    border-color: rgba(1,245,158,0.3);
    background: rgba(255,255,255,0.06);
    color: #fff;
  }
  .addon-toggle.active {
    border-color: rgba(1,245,158,0.5);
    background: rgba(1,245,158,0.08);
    color: #fff;
  }
  .addon-switch {
    width: 32px;
    height: 18px;
    border-radius: 999px;
    background: rgba(255,255,255,0.15);
    position: relative;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .addon-toggle.active .addon-switch { background: #01f59e; }
  .addon-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.2s;
  }
  .addon-toggle.active .addon-knob { transform: translateX(14px); }
  .addon-label {
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1.2;
    white-space: nowrap;
  }

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

  /* ─── Badges ─────────────────────────────────────────────── */
  .badge-stack {
    position: absolute;
    top: -0.85rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.4rem;
    align-items: center;
  }
  .badge {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.3rem 0.85rem;
    border-radius: 9999px;
    white-space: nowrap;
  }
  .badge-popular {
    background: #01f59e;
    color: #09090f;
    box-shadow: 0 4px 16px rgba(1,245,158,0.35);
  }
  .badge-flowy {
    background: rgba(83,29,216,0.18);
    border: 0.5px solid rgba(83,29,216,0.45);
    color: #cbb6ff;
    text-transform: none;
    letter-spacing: normal;
    font-size: 0.68rem;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
  .badge-tag {
    font-size: 0.55rem;
    text-transform: uppercase;
    padding: 0.05rem 0.35rem;
    border-radius: 999px;
    background: rgba(255,255,255,0.12);
    letter-spacing: 0.08em;
  }
  .badge-sm {
    font-size: 0.6rem;
    padding: 0.2rem 0.6rem;
    position: absolute;
    top: -0.7rem;
    left: 50%;
    transform: translateX(-50%);
    background: #01f59e;
    color: #09090f;
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
  .price-tax {
    margin-left: auto;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.55);
    border: 0.5px solid rgba(255,255,255,0.08);
  }
  .price-breakdown {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.45);
    margin: -0.5rem 0 0;
    line-height: 1.5;
  }
  .free-trial {
    margin: -0.25rem 0 0;
    font-size: 0.72rem;
    color: #01f59e;
    font-weight: 600;
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
    margin: 0 auto 4rem;
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

  /* ─── Enterprise band ────────────────────────────────────── */
  .enterprise-band {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1.75rem;
    border-radius: 24px;
    background: linear-gradient(
      135deg,
      rgba(83,29,216,0.18) 0%,
      rgba(1,245,158,0.06) 50%,
      rgba(255,255,255,0.04) 100%
    );
    border: 0.5px solid rgba(255,255,255,0.1);
    border-top: 1px solid rgba(255,255,255,0.18);
    box-shadow:
      0 16px 48px rgba(0,0,0,0.28),
      inset 0 1px 0 rgba(255,255,255,0.1);
  }
  .enterprise-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    align-items: center;
  }
  @media (min-width: 900px) {
    .enterprise-content {
      grid-template-columns: 1.2fr 1.4fr auto;
      gap: 2rem;
    }
  }
  .enterprise-meta { display: flex; flex-direction: column; gap: 0.5rem; }
  .enterprise-eyebrow {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #cbb6ff;
  }
  .enterprise-title {
    font-family: 'Epoch', 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }
  .enterprise-tagline {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.6);
    margin: 0;
    line-height: 1.5;
  }
  .enterprise-features {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.45rem 1rem;
  }
  .enterprise-features li {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.8125rem;
    color: rgba(255,255,255,0.75);
    line-height: 1.45;
  }
  .enterprise-features .feature-icon { color: #01f59e; }
  .enterprise-cta {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.65rem;
    min-width: 180px;
  }
  .enterprise-price {
    font-size: 0.85rem;
    font-weight: 700;
    color: #fff;
    text-align: center;
    padding: 0.4rem 0.75rem;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
    border: 0.5px solid rgba(255,255,255,0.12);
  }

  /* ─── Responsive ─────────────────────────────────────────── */
  @media (max-width: 640px) {
    .plans-grid { grid-template-columns: 1fr; }
    .wa-grid { grid-template-columns: repeat(2, 1fr); }
    .perks-bar { gap: 0.5rem 1rem; }
    .badge-stack { flex-direction: column; gap: 0.25rem; }
    .controls-row { flex-direction: column; gap: 0.5rem; }
    .addon-label { white-space: normal; text-align: center; }
  }
</style>
