<script>
  import {
    countries,
    plans,
    billingCycles,
    whatsappPackages,
    taxRates,
    PRICES_INCLUDE_TAX,
    getPlanPrice,
    formatPrice,
  } from "$lib/data/pricingData.js";
  import { siteConfig } from "$lib/config/site";
  import { trackContact } from "$lib/tracking/track";
  import whatsappIcon from "$lib/assets/icons/whatsapp-icon.svg";
  import { Sprout, Rocket, Trophy, Zap, Building2 } from "@lucide/svelte";
  import { onMount } from "svelte";

  const planIcons = new Map([
    ["pocket", Sprout],
    ["lite", Rocket],
    ["full", Trophy],
    ["ultra", Zap],
    ["enterprise", Building2],
  ]);

  $: selfServePlans = plans.filter((p) => !p.quoteBased);
  $: enterprisePlan = plans.find((p) => p.quoteBased);

  let selectedCountry = countries.find((c) => c.code === "US") ?? countries[0];
  let selectedCycle = billingCycles[0]; // mensual
  let withWhatsapp = true;

  /**
   * Detect user country from browser timezone + locale.
   * Returns "PE", "MX", or "US" (fallback).
   */
  function detectCountryCode() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
      if (tz.includes("Lima")) return "PE";
      const mxZones = ["Mexico", "Cancun", "Monterrey", "Tijuana", "Merida", "Chihuahua", "Mazatlan", "Hermosillo", "Matamoros", "Ojinaga", "Bahia_Banderas"];
      if (mxZones.some((z) => tz.includes(z))) return "MX";
      const lang = (navigator.language || "").toLowerCase();
      if (lang.endsWith("-pe")) return "PE";
      if (lang.endsWith("-mx")) return "MX";
    } catch (_) { /* ignore */ }
    return "US";
  }

  onMount(() => {
    const code = detectCountryCode();
    const match = countries.find((c) => c.code === code);
    if (match) selectedCountry = match;
  });


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

  /** @param {KeyboardEvent} e */
  function handleAddonKeydown(e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      toggleWhatsapp();
      const target = /** @type {HTMLElement} */ (e.currentTarget);
      const radios = target.querySelectorAll('[role="radio"]');
      /** @type {HTMLElement | null} */
      const next = /** @type {HTMLElement} */ (radios[withWhatsapp ? 1 : 0]);
      next?.focus();
    }
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
    <!-- Country selector (compact, top-right on desktop) -->
    <div class="country-select-wrap country-select-wrap--floating">
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

    <span class="section-eyebrow">Planes</span>
    <h2 class="section-title">El plan ideal para tu negocio</h2>
    <p class="section-subtitle">
      Elige el plan que mejor se adapte a tu tamaño. Sin sorpresas, sin contratos.
    </p>

    <!-- Controls: Cycle (hero) + WhatsApp toggle -->
    <div class="controls-stack">
      <div class="cycle-wrap">
        <div class="cycle-selector" role="group" aria-label="Seleccionar ciclo de facturación">
          {#each billingCycles as cycle}
            <button
              class="cycle-pill"
              class:active={selectedCycle.id === cycle.id}
              aria-pressed={selectedCycle.id === cycle.id}
              on:click={() => selectCycle(cycle)}
            >
              <span class="cycle-pill-label">{cycle.label}</span>
              {#if cycle.discount > 0}
                <span class="cycle-pill-tag">paga {Math.round(cycle.discount * 100)}% menos</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <div class="addon-group">
        <span class="addon-group-label" id="addon-group-label">
          <svg class="wa-icon" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.696 4.604 1.892 6.476L4 29l7.71-1.846A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm6.93 17.18c-.293.82-1.71 1.566-2.36 1.66-.6.087-1.36.123-2.196-.137-.505-.16-1.155-.376-1.988-.733-3.5-1.5-5.78-5.04-5.953-5.274-.173-.234-1.42-1.887-1.42-3.6 0-1.713.9-2.555 1.22-2.905.32-.35.7-.437.93-.437.235 0 .47.002.674.012.215.01.504-.082.79.604.293.7.997 2.413 1.084 2.588.087.175.146.38.029.613-.117.234-.176.38-.35.585-.176.205-.37.458-.527.616-.176.176-.36.367-.155.72.205.35.91 1.503 1.955 2.434 1.34 1.196 2.472 1.566 2.823 1.742.35.176.555.146.76-.088.205-.234.876-1.022 1.11-1.373.234-.35.468-.293.79-.176.32.117 2.034.96 2.384 1.135.35.176.585.263.672.41.087.146.087.847-.206 1.665z"/>
          </svg>
          ¿Quién avisa a tus alumnos?
        </span>
        <div
          class="addon-tabs"
          role="radiogroup"
          aria-labelledby="addon-group-label"
          on:keydown={handleAddonKeydown}
        >
          <button
            type="button"
            class="addon-tab"
            class:active={!withWhatsapp}
            role="radio"
            aria-checked={!withWhatsapp}
            tabindex={!withWhatsapp ? 0 : -1}
            on:click={() => { if (withWhatsapp) toggleWhatsapp(); }}
          >
            Yo lo hago
          </button>
          <button
            type="button"
            class="addon-tab"
            class:active={withWhatsapp}
            role="radio"
            aria-checked={withWhatsapp}
            tabindex={withWhatsapp ? 0 : -1}
            on:click={() => { if (!withWhatsapp) toggleWhatsapp(); }}
          >
            FlowPass lo hace
            <span class="addon-tab-badge" aria-label="Recomendado">Recomendado</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Plans grid -->
  <div class="plans-grid" aria-live="polite" aria-atomic="true">
    {#key `${selectedCountry.code}-${selectedCycle.id}-${withWhatsapp}`}
      {#each selfServePlans as plan}
        {@const price = getPlanPrice(plan, selectedCycle.id, selectedCountry.code, withWhatsapp)}
        <article
          class="plan-card"
          class:highlighted={plan.highlight}
          class:enterprise={plan.quoteBased}
          aria-label="Plan {plan.name}"
        >
          <div class="badge-stack">
            {#if plan.highlight}
              <div class="badge badge-popular" aria-label="Plan más popular">Más popular</div>
            {/if}
            {#if plan.quoteBased}
              <div class="badge badge-enterprise" aria-label="Plan a medida">Para cadenas</div>
            {/if}
          </div>

          <div class="plan-header">
            <div class="plan-name-row">
              {#if planIcons.get(plan.id)}
                <span class="plan-icon" aria-hidden="true">
                  <svelte:component this={planIcons.get(plan.id)} size={18} strokeWidth={2} />
                </span>
              {/if}
              <h3 class="plan-name">{plan.name}</h3>
            </div>
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

          {#if plan.quoteBased}
            <div class="plan-price plan-price--quote" aria-label="Precio bajo evaluación">
              <span class="price-quote">Bajo evaluación</span>
            </div>
          {:else}
            <div class="plan-price" aria-label="Precio mensual">
              <span class="price-amount">{formatPrice(price ?? 0, selectedCountry.code)}</span>
              <span class="price-period">/mes</span>
              {#if taxInline}
                <span class="price-tax">{taxInline}</span>
              {/if}
            </div>
            {#if plan.whatsappAuto || plan.whatsappManual}
              <div class="whatsapp-card" aria-label="WhatsApp incluido">
                <div class="whatsapp-card__header">
                  <svg class="wa-icon" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.696 4.604 1.892 6.476L4 29l7.71-1.846A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm6.93 17.18c-.293.82-1.71 1.566-2.36 1.66-.6.087-1.36.123-2.196-.137-.505-.16-1.155-.376-1.988-.733-3.5-1.5-5.78-5.04-5.953-5.274-.173-.234-1.42-1.887-1.42-3.6 0-1.713.9-2.555 1.22-2.905.32-.35.7-.437.93-.437.235 0 .47.002.674.012.215.01.504-.082.79.604.293.7.997 2.413 1.084 2.588.087.175.146.38.029.613-.117.234-.176.38-.35.585-.176.205-.37.458-.527.616-.176.176-.36.367-.155.72.205.35.91 1.503 1.955 2.434 1.34 1.196 2.472 1.566 2.823 1.742.35.176.555.146.76-.088.205-.234.876-1.022 1.11-1.373.234-.35.468-.293.79-.176.32.117 2.034.96 2.384 1.135.35.176.585.263.672.41.087.146.087.847-.206 1.665z"/>
                  </svg>
                  <span class="whatsapp-card__title">WhatsApp incluido</span>
                  <span class="whatsapp-card__badge" title="Integración directa con la API oficial de WhatsApp Business: máxima estabilidad y entregabilidad.">
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="badge-check"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4z" clip-rule="evenodd"/></svg>
                    API Oficial
                  </span>
                </div>
                <ul class="whatsapp-card__list">
                  {#if plan.whatsappAuto}
                    {#if withWhatsapp}
                      <li class="whatsapp-card__row">
                        <span class="row-icon row-icon--on" aria-hidden="true">✓</span>
                        <span><strong>{plan.whatsappAuto.includedReminders}</strong> recordatorios automáticos</span>
                      </li>
                    {:else}
                      <li class="whatsapp-card__row whatsapp-card__row--off">
                        <span class="row-icon row-icon--off" aria-hidden="true">⊘</span>
                        <span>Sin recordatorios automáticos</span>
                      </li>
                    {/if}
                  {/if}
                  {#if plan.whatsappManual}
                    <li class="whatsapp-card__row">
                      <span class="row-icon row-icon--on" aria-hidden="true">✓</span>
                      <span><strong>{plan.whatsappManual.included1ClickSends}</strong> envíos 1-click <span class="row-hint">(link de registro, credencial/QR)</span></span>
                    </li>
                  {/if}
                </ul>
                {#if withWhatsapp && plan.whatsappAuto && plan.whatsappManual}
                  <div class="whatsapp-card__total">
                    = <strong>{plan.whatsappAuto.includedReminders + plan.whatsappManual.included1ClickSends}</strong> mensajes/mes
                  </div>
                {:else if !withWhatsapp && plan.whatsappManual}
                  <div class="whatsapp-card__total">
                    = <strong>{plan.whatsappManual.included1ClickSends}</strong> mensajes/mes
                  </div>
                {/if}
              </div>
            {/if}
          {/if}

          <ul class="features-list" aria-label="Características incluidas">
            {#each plan.features as feature}
              <li class="feature-item" class:excluded={!feature.included}>
                <span class="feature-icon" aria-hidden="true">
                  {feature.included ? "✓" : "✕"}
                </span>
                <span>
                  {feature.label}{#if feature.included && feature.extraCost}<span class="extra-cost"> (+{formatPrice(feature.extraCost[selectedCountry.code], selectedCountry.code)}/sede)</span>{/if}
                </span>
              </li>
            {/each}
          </ul>

          <a
            href={plan.quoteBased ? enterpriseLink : whatsappLink}
            class="cta-button"
            class:cta-primary={plan.highlight || plan.quoteBased}
            class:cta-secondary={!plan.highlight && !plan.quoteBased}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={plan.quoteBased ? "Hablar con el equipo de Flow Enterprise" : `Escribir por WhatsApp para contratar ${plan.name}`}
            on:click={() => trackContact(`pricing_plan_${plan.id}`)}
          >
            <span class="cta-button-inner">
              Escríbenos
              <img
                src={whatsappIcon}
                alt=""
                aria-hidden="true"
                class="cta-button-icon"
                loading="lazy"
                width="18"
                height="18"
              />
            </span>
          </a>
        </article>
      {/each}
    {/key}
  </div>

  <!-- Enterprise wide card -->
  {#if enterprisePlan}
    <div class="enterprise-row">
      <article
        class="plan-card enterprise enterprise-wide"
        aria-label="Plan {enterprisePlan.name}"
      >
        <div class="badge-stack">
          <div class="badge badge-enterprise" aria-label="Plan a medida">Para cadenas</div>
        </div>

        <div class="enterprise-wide-grid">
          <div class="enterprise-wide-left">
            <div class="plan-header">
              <div class="plan-name-row">
                {#if planIcons.get(enterprisePlan.id)}
                  <span class="plan-icon" aria-hidden="true">
                    <svelte:component this={planIcons.get(enterprisePlan.id)} size={18} strokeWidth={2} />
                  </span>
                {/if}
                <h3 class="plan-name">{enterprisePlan.name}</h3>
              </div>
              <p class="plan-tagline">{enterprisePlan.tagline}</p>
              <div class="plan-students">
                <p class="plan-range">
                  <span class="range-icon" aria-hidden="true">🟢</span>
                  {enterprisePlan.activeStudents}
                </p>
              </div>
            </div>

            <div class="plan-price plan-price--quote" aria-label="Precio bajo evaluación">
              <span class="price-quote">Bajo evaluación</span>
            </div>

            <a
              href={enterpriseLink}
              class="cta-button cta-primary"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hablar con el equipo de Flow Enterprise"
              on:click={() => trackContact(`pricing_plan_${enterprisePlan.id}`)}
            >
              <span class="cta-button-inner">
                Escríbenos
                <img
                  src={whatsappIcon}
                  alt=""
                  aria-hidden="true"
                  class="cta-button-icon"
                  loading="lazy"
                  width="18"
                  height="18"
                />
              </span>
            </a>
          </div>

          <ul class="features-list enterprise-wide-features" aria-label="Características incluidas">
            {#each enterprisePlan.features as feature}
              <li class="feature-item" class:excluded={!feature.included}>
                <span class="feature-icon" aria-hidden="true">
                  {feature.included ? "✓" : "✕"}
                </span>
                <span>{feature.label}</span>
              </li>
            {/each}
          </ul>
        </div>
      </article>
    </div>
  {/if}

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
    position: relative;
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

  /* ─── Cycle selector (HERO) ──────────────────────────────── */
  .cycle-selector {
    display: inline-flex;
    gap: 0.25rem;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 9999px;
    padding: 0.35rem;
    backdrop-filter: blur(8px);
  }
  .cycle-pill {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.1rem;
    padding: 0.5rem 1.1rem;
    min-height: 40px;
    border-radius: 9999px;
    border: none;
    background: transparent;
    line-height: 1.15;
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
  .cycle-pill-label {
    font-size: 0.85rem;
    font-weight: 600;
  }
  .cycle-pill-tag {
    font-size: 0.6rem;
    font-weight: 800;
    color: #01f59e;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    line-height: 1;
  }
  .cycle-pill.active .cycle-pill-tag {
    color: #00a86b;
  }
  .cycle-wrap {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.45rem;
  }
  /* ─── Country select (dropdown) ──────────────────────────── */
  .country-select-wrap {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.9rem;
  }
  .country-select-wrap--floating {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    z-index: 2;
  }
  .country-select-wrap--floating .country-select-control {
    padding: 0.3rem 0.7rem;
    gap: 0.35rem;
  }
  .country-select-wrap--floating .country-select {
    font-size: 0.78rem;
    min-width: 0;
    padding-right: 1rem;
  }
  .country-select-wrap--floating .country-select-flag {
    font-size: 0.9rem;
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

  /* ─── Controls stack (cycle hero + WhatsApp below) ───────── */
  .controls-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }

  /* ─── Add-on tabs (segmented) ────────────────────────────── */
  .addon-group {
    display: inline-flex;
    align-items: center;
    gap: 0.65rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .addon-group-label {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: rgba(255,255,255,0.75);
    letter-spacing: 0.01em;
  }
  .wa-icon {
    width: 16px;
    height: 16px;
    color: #25D366;
    flex-shrink: 0;
  }
  .addon-tabs {
    display: inline-flex;
    gap: 0.25rem;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 9999px;
    padding: 0.3rem;
    backdrop-filter: blur(8px);
  }
  .addon-tab {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.95rem;
    min-height: 36px;
    border-radius: 9999px;
    border: none;
    background: transparent;
    font: inherit;
    font-size: 0.75rem;
    font-weight: 600;
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .addon-tab:hover { color: #fff; background: rgba(255,255,255,0.05); }
  .addon-tab:focus-visible {
    outline: 2px solid rgba(255,255,255,0.7);
    outline-offset: 2px;
  }
  .addon-tab.active {
    background: #fff;
    color: #09090f;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  }
  .addon-tab-badge {
    position: absolute;
    top: -0.6rem;
    right: -0.35rem;
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    background: #01f59e;
    color: #09090f;
    line-height: 1.2;
    box-shadow: 0 4px 12px rgba(1,245,158,0.4);
    pointer-events: none;
    white-space: nowrap;
  }

  /* ─── Plans grid ─────────────────────────────────────────── */
  .plans-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    max-width: 1280px;
    margin: 0 auto 1.5rem;
    align-items: stretch;
  }
  @media (max-width: 1024px) {
    .plans-grid { grid-template-columns: repeat(2, 1fr); }
  }

  /* ─── Enterprise wide card ───────────────────────────────── */
  .enterprise-row {
    max-width: 1280px;
    margin: 0 auto 4rem;
  }
  .plan-card.enterprise-wide {
    padding: 2rem 2.25rem;
  }
  .enterprise-wide-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    gap: 2.5rem;
    align-items: stretch;
  }
  .enterprise-wide-left {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .enterprise-wide-left .plan-header { min-height: auto; }
  .enterprise-wide-left .plan-price { min-height: auto; padding-top: 0.75rem; }
  .enterprise-wide-left .cta-button { margin-top: auto; }
  .enterprise-wide-features {
    border-left: 0.5px solid rgba(255,255,255,0.08);
    padding-left: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem 1.25rem;
  }
  @media (max-width: 768px) {
    .plan-card.enterprise-wide { padding: 1.75rem 1.5rem; }
    .enterprise-wide-grid { grid-template-columns: 1fr; gap: 1.25rem; }
    .enterprise-wide-features {
      border-left: none;
      padding-left: 0;
      border-top: 0.5px solid rgba(255,255,255,0.08);
      padding-top: 1.25rem;
      grid-template-columns: 1fr;
    }
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
  .plan-card.enterprise {
    background: linear-gradient(
      145deg,
      rgba(83,29,216,0.18) 0%,
      rgba(83,29,216,0.05) 60%,
      rgba(49,104,244,0.04) 100%
    );
    border-color: rgba(83,29,216,0.35);
    border-top-color: rgba(203,182,255,0.45);
    box-shadow:
      0 4px 6px rgba(0,0,0,0.1),
      0 20px 60px rgba(0,0,0,0.3),
      0 0 80px -16px rgba(83,29,216,0.4),
      inset 0 1px 0 rgba(203,182,255,0.18),
      inset 0 -1px 0 rgba(0,0,0,0.1);
  }
  .plan-card.enterprise:hover {
    border-color: rgba(83,29,216,0.55);
    box-shadow:
      0 4px 6px rgba(0,0,0,0.1),
      0 28px 72px rgba(0,0,0,0.35),
      0 0 100px -10px rgba(83,29,216,0.5),
      inset 0 1px 0 rgba(203,182,255,0.25),
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
  .badge-enterprise {
    background: linear-gradient(135deg, #531DD8 0%, #3168F4 100%);
    color: #fff;
    box-shadow: 0 4px 16px rgba(83,29,216,0.45);
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
    min-height: 7.5rem;
  }
  .plan-name-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .plan-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: rgba(1,245,158,0.1);
    color: #01f59e;
    flex-shrink: 0;
  }
  .plan-card.enterprise .plan-icon {
    background: rgba(83,29,216,0.2);
    color: #cbb6ff;
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
    min-height: 2.4rem;
  }
  .plan-students {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-top: auto;
    padding-top: 0.25rem;
    min-height: 2.6rem;
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
    min-height: 3.5rem;
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
  .plan-price--quote {
    align-items: center;
  }
  .price-quote {
    font-family: 'Epoch', 'Syne', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #cbb6ff;
    line-height: 1.1;
    letter-spacing: -0.01em;
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
  .whatsapp-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-top: -0.4rem;
    padding: 0.45rem 0.75rem;
    border-radius: 12px;
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1.2;
    border: 0.5px solid transparent;
    transition: background 0.25s, border-color 0.25s, color 0.25s;
    animation: fadePrice 0.3s ease;
    min-height: 2.4rem;
    width: 100%;
    justify-content: flex-start;
  }
  .whatsapp-chip--on {
    background: rgba(37,211,102,0.12);
    border-color: rgba(37,211,102,0.45);
    color: #25D366;
  }
  .whatsapp-chip--on .wa-icon { color: #25D366; }
  .whatsapp-chip--on strong { color: #fff; font-weight: 800; }
  .whatsapp-chip--off {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.45);
  }
  .whatsapp-card {
    margin-top: 0.4rem;
    padding: 0.55rem 0.7rem;
    border-radius: 12px;
    background: linear-gradient(180deg, rgba(37,211,102,0.08), rgba(37,211,102,0.04));
    border: 0.5px solid rgba(37,211,102,0.35);
    width: 100%;
    animation: fadePrice 0.3s ease;
  }
  .whatsapp-card__header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.4rem;
  }
  .whatsapp-card__header .wa-icon { color: #25D366; width: 14px; height: 14px; }
  .whatsapp-card__title {
    font-size: 0.72rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.01em;
  }
  .whatsapp-card__badge {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.12rem 0.4rem;
    border-radius: 999px;
    background: rgba(37,211,102,0.18);
    border: 0.5px solid rgba(37,211,102,0.45);
    color: #25D366;
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: help;
  }
  .whatsapp-card__badge .badge-check {
    width: 10px;
    height: 10px;
  }
  .whatsapp-card__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .whatsapp-card__row {
    display: flex;
    align-items: flex-start;
    gap: 0.4rem;
    font-size: 0.7rem;
    line-height: 1.25;
    color: rgba(255,255,255,0.88);
  }
  .whatsapp-card__row strong { color: #fff; font-weight: 800; }
  .whatsapp-card__row .row-hint {
    color: rgba(255,255,255,0.55);
    font-weight: 500;
    font-size: 0.65rem;
  }
  .whatsapp-card__row--off { color: rgba(255,255,255,0.45); }
  .row-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    font-size: 0.6rem;
    font-weight: 800;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .row-icon--on {
    background: rgba(37,211,102,0.2);
    color: #25D366;
  }
  .row-icon--off {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.35);
  }
  .whatsapp-card__total {
    margin-top: 0.4rem;
    padding-top: 0.4rem;
    border-top: 0.5px dashed rgba(37,211,102,0.3);
    font-size: 0.72rem;
    color: #fff;
    text-align: right;
  }
  .whatsapp-card__total strong { color: #25D366; font-weight: 800; }
  .chip-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
    flex-shrink: 0;
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
    margin-top: auto;
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

  /* Wrapper que alinea texto + logo WhatsApp dentro del CTA */
  .cta-button-inner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  .cta-button-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
  /* Tinta el SVG segun la variante:
     - primary: bg verde → icono negro (matchea el texto oscuro)
     - secondary: bg oscuro → icono blanco */
  .cta-primary .cta-button-icon { filter: brightness(0); }
  .cta-secondary .cta-button-icon { filter: brightness(0) invert(1); }

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

  /* ─── Responsive ─────────────────────────────────────────── */
  @media (max-width: 640px) {
    .plans-grid {
      display: flex;
      grid-template-columns: none;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-padding: 1.25rem;
      gap: 0.85rem;
      padding: 1.5rem 1.25rem 1rem;
      margin: 0 -1.25rem 1rem;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .plans-grid::-webkit-scrollbar { display: none; }
    .plans-grid > .plan-card {
      flex: 0 0 85%;
      scroll-snap-align: center;
      min-width: 0;
    }
    .plan-card:hover { transform: none; }
    .wa-grid { grid-template-columns: repeat(2, 1fr); }
    .perks-bar { gap: 0.5rem 1rem; }
    .badge-stack { flex-direction: column; gap: 0.25rem; }
    .controls-stack {
      gap: 1.25rem;
    }
    .cycle-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: 0.45rem;
    }
    .cycle-selector {
      display: flex;
      width: 100%;
      gap: 0.2rem;
    }
    .cycle-pill {
      flex: 1 1 0;
      min-width: 0;
      min-height: 44px;
      justify-content: center;
      padding: 0.4rem 0.4rem;
    }
    .cycle-pill-label { font-size: 0.78rem; }
    .cycle-pill-tag { font-size: 0.55rem; }
    .addon-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }
    .addon-group-label { justify-content: center; }
    .addon-tabs {
      display: flex;
      width: 100%;
      gap: 0.2rem;
    }
    .addon-tab {
      flex: 1 1 0;
      min-width: 0;
      min-height: 44px;
      justify-content: center;
      text-align: center;
      padding: 0.45rem 0.5rem;
      font-size: 0.72rem;
      white-space: normal;
      line-height: 1.2;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
    .addon-tab-badge {
      top: -0.55rem;
      right: -0.15rem;
      font-size: 0.52rem;
      padding: 0.12rem 0.4rem;
    }
    .country-select-wrap--floating {
      position: static;
      display: inline-flex;
      justify-content: center;
      width: auto;
      margin: 0 auto 1.25rem;
    }
    .plan-card.enterprise-wide { padding: 1.5rem 1.25rem; }
    .price-tax {
      font-size: 0.55rem;
      padding: 0.12rem 0.35rem;
      letter-spacing: 0.03em;
    }

    /* ─── Mobile typography ─────────────────────────────────── */
    .section-title { font-size: clamp(1.75rem, 7vw, 2.25rem); }
    .section-subtitle { font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; }
    .section-eyebrow { font-size: 0.7rem; }

    .addon-group-label { font-size: 0.72rem; }
    .plan-card { padding: 1.5rem 1.25rem 1.25rem; gap: 1rem; }
    .plan-name { font-size: 1.15rem; }
    .plan-tagline { font-size: 0.78rem; }
    .plan-range { font-size: 0.78rem; }
    .plan-range--registered { font-size: 0.68rem; }

    .price-amount { font-size: 1.625rem; }
    .price-period { font-size: 0.8rem; }
    .price-quote { font-size: 1.2rem; }

    .whatsapp-chip { font-size: 0.72rem; padding: 0.4rem 0.6rem; min-height: 2.2rem; }

    .feature-item { font-size: 0.82rem; line-height: 1.45; }
    .extra-cost { font-size: 0.7rem; }

    .cta-button { font-size: 0.85rem; padding: 0.8rem 1rem; }

    .badge { font-size: 0.62rem; padding: 0.25rem 0.7rem; }

    .perk-item { font-size: 0.75rem; }

    .wa-title { font-size: 1.25rem; }
    .wa-subtitle { font-size: 0.85rem; }
    .wa-name { font-size: 0.875rem; }
    .wa-messages { font-size: 0.75rem; }
    .wa-price { font-size: 1rem; }
    .wa-card { padding: 1rem 0.85rem; }
    .wa-note { font-size: 0.72rem; }

    .country-select-wrap--floating .country-select { font-size: 0.75rem; min-width: 0; }
    .country-select-wrap--floating .country-select-flag { font-size: 0.85rem; }
  }
</style>
