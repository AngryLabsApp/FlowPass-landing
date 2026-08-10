<script>
  import {
    countries,
    plans,
    billingCycles,
    whatsappPackages,
    taxRates,
    PRICES_INCLUDE_TAX,
    getPlanPrice,
    getBasePlanPrice,
    getPromoPrice,
    formatPrice,
    formatPriceParts,
    promoConfig,
    isPromoActive,
    getPromoCountryConfig,
  } from "$lib/data/pricingData.js";
  import { siteConfig } from "$lib/config/site";
  import { trackContact } from "$lib/tracking/track";
  import whatsappIcon from "$lib/assets/icons/whatsapp-icon.svg";
  import { Sprout, Rocket, Trophy, Zap, Building2, Sparkles, X, Snowflake } from "@lucide/svelte";
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import PromoCountdown from "./PromoCountdown.svelte";
  import { waCountry } from "$lib/stores/waCountry.svelte";

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

  /** @type {import('$lib/data/pricingData.js').Plan | null} */
  let activeModalPlan = null;

  /** @param {import('$lib/data/pricingData.js').Plan} plan */
  function openBenefits(plan) {
    activeModalPlan = plan;
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
  }
  function closeBenefits() {
    activeModalPlan = null;
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  }
  /** @param {KeyboardEvent} e */
  function handleModalKeydown(e) {
    if (e.key === 'Escape' && activeModalPlan) closeBenefits();
  }
  onDestroy(() => {
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  });

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
    PRICES_INCLUDE_TAX && taxRate > 0 && taxLabel ? `· ${taxLabel} incluido` : "";

  // Config de promo del país seleccionado (o null si no hay promo)
  $: promoCountryCfg = isPromoActive(selectedCountry.code)
    ? getPromoCountryConfig(selectedCountry.code)
    : null;
  $: countryHasPromo = promoCountryCfg !== null;

  // Durante promo, forzar ciclo mensual (trim/anual quedan ocultos hasta que
  // termine la promo). Evita quedar en anual/trim al cambiar de país.
  $: if (countryHasPromo && selectedCycle.id !== "mensual") {
    selectedCycle = billingCycles[0];
  }

  /**
   * @param {{ code: string; label: string; flag: string; currency: string; currencyCode: string; }} country
   */
  function selectCountry(country) {
    selectedCountry = country;
    // Sincroniza el store global (PE/MX) para que los CTA de WhatsApp
    // en ContactSection, /about y el bubble flotante respeten la elección.
    if (browser && (country.code === 'PE' || country.code === 'MX')) {
      try {
        if (waCountry.code !== country.code) waCountry.set(country.code);
      } catch (_) { /* nunca bloquear el click por esto */ }
    }
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

  // WhatsApp destino según el país seleccionado en el selector de precios.
  // PE→número Perú, MX→número México, US/otros→fallback PE.
  $: contactPhone = siteConfig.phones[selectedCountry.code] ?? siteConfig.phones.PE;
  $: whatsappLink = `${contactPhone.whatsapp}?text=¡Hola!%20Quisiera%20conocer%20cómo%20FlowPass%20puede%20ayudar%20a%20mi%20academia.`;
  $: enterpriseLink = `${contactPhone.whatsapp}?text=¡Hola!%20Estoy%20interesado%20en%20Flow%20Enterprise%20para%20mi%20cadena.`;

</script>

<section
  id="precios"
  class="pricing-section"
  aria-label="Planes y precios de FlowPass"
>
  <!-- Header -->
  <div class="section-header">
    {#if countryHasPromo && promoCountryCfg}
      {@const cheapest = Math.min(...Object.values(promoCountryCfg.prices))}
      <div class="promo-banner" role="region" aria-label="Promoción hasta el 31 de agosto">
        <div class="promo-banner__glow" aria-hidden="true"></div>
        <div class="promo-banner__content">
          <div class="promo-banner__badge">
            <span aria-hidden="true">🔥</span>
            <span>PROMOCIÓN HASTA EL 31 DE AGOSTO</span>
          </div>
          <h3 class="promo-banner__headline">
            Contrata hoy y conserva este precio durante <strong>12 meses</strong>.
          </h3>
          <p class="promo-banner__subtitle">
            Planes desde <strong>{formatPrice(cheapest, selectedCountry.code)}/mes</strong> para clientes nuevos.
          </p>
          {#if promoCountryCfg.showCountdown && promoCountryCfg.endsAt}
            <div class="promo-banner__timer">
              <span class="promo-banner__timer-label">La promoción termina en</span>
              <PromoCountdown endsAt={promoCountryCfg.endsAt} compact />
            </div>
          {/if}
          <p class="promo-banner__fineprint">*Después del 31 de agosto volverán las tarifas regulares.</p>
        </div>
      </div>
    {/if}

    <span class="section-eyebrow">Planes</span>
    <h2 class="section-title">El plan ideal para tu negocio</h2>
    <p class="section-subtitle">
      Elige el plan que mejor se adapte a tu tamaño. Sin sorpresas, sin contratos.
    </p>

    <!-- Controls: Country + Cycle + WhatsApp toggle -->
    <div class="controls-stack">
      <div class="country-wrap">
        <span class="country-wrap-label" id="country-group-label">Ver precios en</span>
        <div
          class="country-pills"
          role="radiogroup"
          aria-labelledby="country-group-label"
        >
          {#each countries as country}
            <button
              type="button"
              class="country-pill"
              class:active={selectedCountry.code === country.code}
              role="radio"
              aria-checked={selectedCountry.code === country.code}
              tabindex={selectedCountry.code === country.code ? 0 : -1}
              on:click={() => selectCountry(country)}
            >
              <span class="country-pill-flag" aria-hidden="true">{country.flag}</span>
              <span class="country-pill-label">{country.label}</span>
            </button>
          {/each}
        </div>
      </div>

      {#if !countryHasPromo}
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
      {/if}

    </div>
  </div>

  <!-- Plans grid -->
  <div class="plans-grid" aria-live="polite" aria-atomic="true">
    {#key `${selectedCountry.code}-${selectedCycle.id}`}
      {#each plans as plan}
        {@const price = getPlanPrice(plan, selectedCycle.id, selectedCountry.code)}
        {@const promoPrice = getPromoPrice(plan, selectedCountry.code)}
        {@const refPrice = getBasePlanPrice(plan, "mensual", selectedCountry.code)}
        {@const isPromo = promoPrice !== null && selectedCycle.id === "mensual"}
        {@const hasSavings = isPromo && refPrice !== null && promoPrice < refPrice}
        <article
          class="plan-card"
          class:highlighted={plan.highlight}
          class:enterprise={plan.quoteBased}
          class:on-promo={isPromo}
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
            {@const parts = formatPriceParts(price ?? 0, selectedCountry.code)}
            {@const baseParts = hasSavings ? formatPriceParts(refPrice ?? 0, selectedCountry.code) : null}
            {@const savingsPct = hasSavings && refPrice ? Math.round((1 - (promoPrice ?? 0) / refPrice) * 100) : 0}
            <div class="plan-price" class:plan-price--promo={isPromo} aria-label="Precio mensual">
              {#if isPromo}
                <div class="price-strike-row">
                  <span class="badge badge-promo badge-inline" aria-label="Oferta de lanzamiento">
                    <Sparkles size={10} strokeWidth={2.6} />
                    Oferta
                  </span>
                  {#if hasSavings && baseParts}
                    <span class="price-strike">
                      <s>{baseParts.symbol}{baseParts.number}</s>
                    </span>
                  {/if}
                </div>
              {/if}
              <div class="price-main-row">
                <span class="price-amount">{parts.symbol}{parts.number}</span>
                {#if parts.code}
                  <span class="price-code">{parts.code}</span>
                {/if}
                <span class="price-period">/mes</span>
              </div>
              {#if taxInline}
                <span class="price-tax">{taxInline}</span>
              {/if}
              {#if isPromo && promoCountryCfg}
                <span class="price-lock">
                  <Snowflake size={11} strokeWidth={2.4} />
                  {promoCountryCfg.priceLockLabel}
                </span>
              {/if}
            </div>
          {/if}

          <button
            type="button"
            class="benefits-link"
            on:click={() => openBenefits(plan)}
            aria-label="Ver beneficios del plan {plan.name}"
          >
            Ver beneficios
            <span aria-hidden="true" class="benefits-link__arrow">→</span>
          </button>

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

<svelte:window on:keydown={handleModalKeydown} />

{#if activeModalPlan}
  <div
    class="benefits-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="benefits-modal-title"
    on:click|self={closeBenefits}
  >
    <div class="benefits-modal__dialog" role="document">
      <button
        type="button"
        class="benefits-modal__close"
        on:click={closeBenefits}
        aria-label="Cerrar"
      >
        <X size={18} strokeWidth={2.2} />
      </button>

      <div class="benefits-modal__header">
        {#if planIcons.get(activeModalPlan.id)}
          <span class="benefits-modal__icon" aria-hidden="true">
            <svelte:component this={planIcons.get(activeModalPlan.id)} size={22} strokeWidth={2} />
          </span>
        {/if}
        <div class="benefits-modal__titles">
          <h3 id="benefits-modal-title" class="benefits-modal__name">{activeModalPlan.name}</h3>
          <p class="benefits-modal__tagline">{activeModalPlan.tagline}</p>
        </div>
      </div>

      {#if activeModalPlan.whatsappIncluded}
        <div class="benefits-modal__wa" aria-label="Asistente de WhatsApp">
          <div class="benefits-modal__wa-header">
            <svg class="benefits-modal__wa-icon" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.696 4.604 1.892 6.476L4 29l7.71-1.846A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm6.93 17.18c-.293.82-1.71 1.566-2.36 1.66-.6.087-1.36.123-2.196-.137-.505-.16-1.155-.376-1.988-.733-3.5-1.5-5.78-5.04-5.953-5.274-.173-.234-1.42-1.887-1.42-3.6 0-1.713.9-2.555 1.22-2.905.32-.35.7-.437.93-.437.235 0 .47.002.674.012.215.01.504-.082.79.604.293.7.997 2.413 1.084 2.588.087.175.146.38.029.613-.117.234-.176.38-.35.585-.176.205-.37.458-.527.616-.176.176-.36.367-.155.72.205.35.91 1.503 1.955 2.434 1.34 1.196 2.472 1.566 2.823 1.742.35.176.555.146.76-.088.205-.234.876-1.022 1.11-1.373.234-.35.468-.293.79-.176.32.117 2.034.96 2.384 1.135.35.176.585.263.672.41.087.146.087.847-.206 1.665z"/>
            </svg>
            <div class="benefits-modal__wa-titles">
              <span class="benefits-modal__wa-name">Asistente de WhatsApp</span>
              <span class="benefits-modal__wa-official">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="benefits-modal__wa-check">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4z" clip-rule="evenodd"/>
                </svg>
                API oficial · WhatsApp Business
              </span>
            </div>
          </div>
          <ul class="benefits-modal__wa-list">
            <li>
              <span class="benefits-modal__wa-row-icon" aria-hidden="true">✓</span>
              <span>Actívalo o pausálo cuando quieras</span>
            </li>
          </ul>

          <div class="benefits-modal__wa-sum" aria-label="Desglose de cupo mensual">
            <ul class="benefits-modal__wa-sum-list">
              <li>
                <span class="benefits-modal__wa-row-icon benefits-modal__wa-row-icon--op" aria-hidden="true"></span>
                <span><strong>{activeModalPlan.whatsappIncluded.auto}</strong> recordatorios automáticos</span>
              </li>
              <li>
                <span class="benefits-modal__wa-row-icon benefits-modal__wa-row-icon--op" aria-hidden="true">+</span>
                <span><strong>{activeModalPlan.whatsappIncluded.manual}</strong> envíos manuales</span>
              </li>
              <li class="benefits-modal__wa-total">
                <span class="benefits-modal__wa-row-icon benefits-modal__wa-row-icon--op" aria-hidden="true">=</span>
                <span><strong>{activeModalPlan.whatsappIncluded.total}</strong> mensajes/mes en total</span>
              </li>
            </ul>
          </div>
        </div>
      {/if}

      <ul class="benefits-modal__list" aria-label="Beneficios incluidos">
        {#each activeModalPlan.features as feature}
          <li class="benefits-modal__row" class:excluded={!feature.included}>
            <span class="benefits-modal__row-icon" aria-hidden="true">
              {feature.included ? '✓' : '✕'}
            </span>
            <span>
              {feature.label}{#if feature.included && feature.extraCost}<span class="benefits-modal__extra"> (+{formatPrice(feature.extraCost[selectedCountry.code], selectedCountry.code)}/sede)</span>{/if}
            </span>
          </li>
        {/each}
      </ul>
    </div>
  </div>
{/if}

<style>
  /* ─── Layout ─────────────────────────────────────────────── */
  .pricing-section {
    padding: 2.25rem 1.25rem;
    color: #fff;
  }
  @media (min-width: 768px) {
    .pricing-section { padding: 3.5rem 1.5rem; }
  }

  /* ─── Header ─────────────────────────────────────────────── */
  .section-header {
    position: relative;
    max-width: 720px;
    margin: 0 auto 1.75rem;
    text-align: center;
  }

  /* ─── Promo banner ───────────────────────────────────────── */
  .promo-banner {
    position: relative;
    max-width: 640px;
    margin: 0 auto 2rem;
    padding: 1.05rem 1.35rem;
    border-radius: 20px;
    background:
      linear-gradient(140deg, rgba(1,245,158,0.14) 0%, rgba(83,29,216,0.14) 100%),
      linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
    border: 0.5px solid rgba(1,245,158,0.35);
    box-shadow:
      0 12px 48px -12px rgba(1,245,158,0.35),
      inset 0 1px 0 rgba(255,255,255,0.14);
    overflow: hidden;
    isolation: isolate;
  }
  .promo-banner__glow {
    position: absolute;
    inset: -40%;
    background: radial-gradient(closest-side, rgba(1,245,158,0.28), transparent 70%);
    filter: blur(30px);
    z-index: -1;
    animation: promoGlow 6s ease-in-out infinite;
  }
  @keyframes promoGlow {
    0%, 100% { transform: translate(-8%, -6%) scale(1); opacity: 0.55; }
    50% { transform: translate(8%, 6%) scale(1.08); opacity: 0.85; }
  }
  .promo-banner__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.55rem;
  }
  .promo-banner__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
    background: #01f59e;
    color: #09090f;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    box-shadow: 0 4px 16px rgba(1,245,158,0.4);
  }
  .promo-banner__headline {
    margin: 0.1rem 0 0;
    font-family: 'Epoch', 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.3;
    letter-spacing: -0.005em;
    text-align: center;
    max-width: 32ch;
  }
  .promo-banner__headline strong {
    color: #01f59e;
    font-weight: 800;
  }
  .promo-banner__subtitle {
    margin: 0;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.62);
    line-height: 1.4;
    text-align: center;
  }
  .promo-banner__subtitle strong {
    color: rgba(255,255,255,0.92);
    font-weight: 700;
  }
  .promo-banner__timer {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.15rem;
  }
  .promo-banner__timer-label {
    font-size: 0.62rem;
    font-weight: 700;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .promo-banner__fineprint {
    margin: 0.2rem 0 0;
    font-size: 0.68rem;
    color: rgba(255,255,255,0.45);
    font-style: italic;
    text-align: center;
  }
  @media (max-width: 640px) {
    .promo-banner { padding: 0.85rem 1rem; border-radius: 16px; }
    .promo-banner__headline { font-size: 0.98rem; line-height: 1.25; }
    .promo-banner__subtitle { font-size: 0.78rem; }
    .promo-banner__timer-label { font-size: 0.58rem; letter-spacing: 0.08em; }
    .promo-banner__fineprint { font-size: 0.64rem; }
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
  /* ─── Country pills ──────────────────────────────────────── */
  .country-wrap {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    max-width: 100%;
  }
  .country-wrap-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.01em;
  }
  .country-pills {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.3rem;
    padding: 0.25rem;
    background: rgba(255,255,255,0.04);
    border: 0.5px solid rgba(255,255,255,0.08);
    border-radius: 9999px;
    backdrop-filter: blur(8px);
    max-width: 100%;
  }
  .country-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.75rem;
    min-height: 32px;
    border-radius: 9999px;
    border: none;
    background: transparent;
    font: inherit;
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .country-pill:hover {
    color: #fff;
    background: rgba(255,255,255,0.05);
  }
  .country-pill:focus-visible {
    outline: 2px solid rgba(255,255,255,0.7);
    outline-offset: 2px;
  }
  .country-pill.active {
    background: #fff;
    color: #09090f;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  }
  .country-pill-flag {
    font-size: 0.9rem;
    line-height: 1;
  }
  .country-pill-label {
    line-height: 1;
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

  .wa-icon {
    width: 16px;
    height: 16px;
    color: #25D366;
    flex-shrink: 0;
  }

  /* ─── Plans grid ─────────────────────────────────────────── */
  .plans-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.85rem;
    max-width: 1400px;
    margin: 0 auto 1.5rem;
    align-items: stretch;
  }
  @media (max-width: 1199px) {
    .plans-grid { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  }
  @media (max-width: 900px) {
    .plans-grid { grid-template-columns: repeat(2, 1fr); }
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
    padding: 1.2rem 1.15rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
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
  .badge-promo {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: linear-gradient(135deg, #FFB020 0%, #FF7A45 100%);
    color: #1a0d00;
    box-shadow: 0 4px 16px rgba(255,122,69,0.5);
    padding: 0.28rem 0.7rem 0.28rem 0.55rem;
  }
  .badge-inline {
    font-size: 0.58rem;
    padding: 0.18rem 0.5rem 0.18rem 0.4rem;
    letter-spacing: 0.06em;
    box-shadow: 0 2px 8px rgba(255,122,69,0.4);
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
    gap: 0.15rem;
    min-height: 4.5rem;
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
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    letter-spacing: -0.01em;
  }
  .plan-tagline {
    font-size: 0.72rem;
    font-weight: 500;
    color: rgba(255,255,255,0.5);
    margin: 0;
    line-height: 1.3;
    letter-spacing: 0.005em;
  }
  .plan-students {
    display: flex;
    flex-direction: column;
    gap: 0.08rem;
    margin-top: auto;
    padding-top: 0.55rem;
    min-height: 2.1rem;
  }
  .plan-range {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: #01f59e;
    margin: 0;
    line-height: 1.3;
  }
  .plan-range--registered {
    font-size: 0.62rem;
    color: rgba(255,255,255,0.3);
    font-weight: 400;
    line-height: 1.2;
  }
  .range-icon { font-size: 0.72rem; }
  .plan-range--registered .range-icon { font-size: 0.6rem; }

  /* ─── Price ──────────────────────────────────────────────── */
  .plan-price {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
    border-top: 0.5px solid rgba(255,255,255,0.06);
    padding-top: 1.15rem;
  }
  .price-main-row {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    flex-wrap: wrap;
  }
  .price-strike-row {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.1rem;
  }
  .price-strike {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.4);
    font-weight: 500;
    text-decoration: line-through;
    text-decoration-color: rgba(255,255,255,0.35);
  }
  .price-strike s { text-decoration: line-through; }
  .price-savings {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 0.15rem 0.45rem;
    border-radius: 999px;
    background: linear-gradient(135deg, #FFB020 0%, #FF7A45 100%);
    color: #1a0d00;
    line-height: 1.2;
    box-shadow: 0 2px 8px rgba(255,122,69,0.35);
  }
  .plan-price--promo .price-amount {
    color: #01f59e;
    text-shadow: 0 0 24px rgba(1,245,158,0.35);
  }
  .price-lock {
    display: inline-flex;
    align-items: center;
    gap: 0.28rem;
    padding: 0.22rem 0.55rem;
    border-radius: 999px;
    background: rgba(49,104,244,0.14);
    border: 0.5px solid rgba(49,104,244,0.4);
    color: #9dc0ff;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    margin-top: 0.25rem;
    box-shadow: 0 2px 8px rgba(49,104,244,0.15);
  }
  .price-lock :global(svg) {
    color: #7ba7ff;
    flex-shrink: 0;
  }
  .plan-card.on-promo {
    border-top-color: rgba(255,176,32,0.4);
    box-shadow:
      0 4px 6px rgba(0,0,0,0.08),
      0 20px 60px rgba(0,0,0,0.32),
      0 0 60px -14px rgba(255,122,69,0.28),
      inset 0 1px 0 rgba(255,176,32,0.18),
      inset 0 -1px 0 rgba(0,0,0,0.08);
  }
  .plan-card.on-promo:hover {
    border-color: rgba(1,245,158,0.35);
    border-top-color: rgba(255,176,32,0.6);
    box-shadow:
      0 4px 6px rgba(0,0,0,0.08),
      0 28px 72px rgba(0,0,0,0.38),
      0 0 80px -10px rgba(255,122,69,0.4),
      inset 0 1px 0 rgba(255,176,32,0.25),
      inset 0 -1px 0 rgba(0,0,0,0.08);
  }
  .price-amount {
    font-size: 1.65rem;
    font-weight: 800;
    color: #fff;
    line-height: 1;
    animation: fadePrice 0.3s ease;
  }
  .price-period {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.4);
    font-weight: 500;
  }
  .price-code {
    font-size: 0.72rem;
    font-weight: 700;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.06em;
    padding: 0.15rem 0.4rem;
    border-radius: 6px;
    background: rgba(255,255,255,0.06);
    border: 0.5px solid rgba(255,255,255,0.08);
    align-self: center;
    line-height: 1;
  }
  .plan-price--quote {
    align-items: center;
  }
  .price-quote {
    font-family: 'Epoch', 'Syne', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #cbb6ff;
    line-height: 1.1;
    letter-spacing: -0.01em;
  }
  .price-tax {
    font-size: 0.72rem;
    font-weight: 500;
    color: rgba(255,255,255,0.4);
    white-space: nowrap;
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

  /* ─── Benefits link (opens modal) ────────────────────────── */
  .benefits-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    align-self: center;
    padding: 0.35rem 0.6rem;
    border: none;
    background: transparent;
    color: rgba(1,245,158,0.9);
    font: inherit;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    cursor: pointer;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s, transform 0.15s;
    margin-top: auto;
    text-decoration: none;
  }
  .benefits-link:hover {
    color: #01f59e;
    background: rgba(1,245,158,0.06);
    transform: translateY(-1px);
  }
  .benefits-link:focus-visible {
    outline: 2px solid rgba(1,245,158,0.6);
    outline-offset: 2px;
  }
  .benefits-link__arrow {
    transition: transform 0.2s;
  }
  .benefits-link:hover .benefits-link__arrow {
    transform: translateX(2px);
  }

  /* ─── CTA button ─────────────────────────────────────────── */
  .cta-button {
    display: block;
    text-align: center;
    padding: 0.75rem 0.9rem;
    min-height: 42px;
    border-radius: 12px;
    font-size: 0.85rem;
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

  /* ─── Benefits modal ─────────────────────────────────────── */
  .benefits-modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    background: rgba(9,9,15,0.72);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    animation: modalFadeIn 0.22s ease;
  }
  .benefits-modal__dialog {
    position: relative;
    width: 100%;
    max-width: 460px;
    max-height: min(85vh, 720px);
    overflow-y: auto;
    padding: 1.75rem 1.5rem 1.5rem;
    border-radius: 20px;
    color: #fff;
    background: linear-gradient(
      145deg,
      rgba(255,255,255,0.07) 0%,
      rgba(255,255,255,0.02) 100%
    ),
    linear-gradient(180deg, #14141c 0%, #0b0b12 100%);
    border: 1px solid rgba(1,245,158,0.22);
    border-top: 1px solid rgba(1,245,158,0.4);
    box-shadow:
      0 24px 80px rgba(0,0,0,0.55),
      0 0 80px -20px rgba(1,245,158,0.35),
      inset 0 1px 0 rgba(255,255,255,0.12);
    animation: modalPop 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .benefits-modal__close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 999px;
    border: 0.5px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .benefits-modal__close:hover {
    background: rgba(255,255,255,0.08);
    color: #fff;
    border-color: rgba(255,255,255,0.2);
  }
  .benefits-modal__close:focus-visible {
    outline: 2px solid rgba(1,245,158,0.6);
    outline-offset: 2px;
  }
  .benefits-modal__header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    padding-right: 2.25rem;
  }
  .benefits-modal__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(1,245,158,0.12);
    color: #01f59e;
    flex-shrink: 0;
  }
  .benefits-modal__titles {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }
  .benefits-modal__name {
    font-family: 'Epoch', 'Syne', sans-serif;
    font-size: 1.35rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
    line-height: 1.15;
  }
  .benefits-modal__tagline {
    margin: 0;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.55);
    line-height: 1.4;
  }
  .benefits-modal__wa {
    margin-bottom: 1.1rem;
    padding: 0.85rem 0.9rem;
    border-radius: 12px;
    background: linear-gradient(180deg, rgba(37,211,102,0.1), rgba(37,211,102,0.04));
    border: 0.5px solid rgba(37,211,102,0.4);
  }
  .benefits-modal__wa-header {
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    margin-bottom: 0.55rem;
  }
  .benefits-modal__wa-icon {
    width: 18px;
    height: 18px;
    color: #25D366;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .benefits-modal__wa-titles {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .benefits-modal__wa-name {
    font-size: 0.9rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
  }
  .benefits-modal__wa-official {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.62rem;
    font-weight: 700;
    color: rgba(37,211,102,0.9);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    line-height: 1.2;
  }
  .benefits-modal__wa-check {
    width: 10px;
    height: 10px;
    color: #25D366;
    flex-shrink: 0;
  }
  .benefits-modal__wa-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .benefits-modal__wa-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.45rem;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.9);
    line-height: 1.35;
  }
  .benefits-modal__wa-list strong { color: #fff; font-weight: 800; }
  .benefits-modal__wa-row-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    font-size: 0.65rem;
    font-weight: 800;
    flex-shrink: 0;
    margin-top: 2px;
    background: rgba(37,211,102,0.2);
    color: #25D366;
  }
  .benefits-modal__wa-row-icon--op {
    background: transparent;
    color: rgba(37,211,102,0.75);
    font-size: 0.9rem;
    font-weight: 700;
  }
  .benefits-modal__wa-sum {
    margin-top: 0.7rem;
    padding: 0.7rem 0.85rem;
    border-radius: 10px;
    background: rgba(37,211,102,0.08);
    border: 0.5px solid rgba(37,211,102,0.3);
  }
  .benefits-modal__wa-sum-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .benefits-modal__wa-sum-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.45rem;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.9);
    line-height: 1.35;
  }
  .benefits-modal__wa-sum-list strong { color: #fff; font-weight: 800; }
  .benefits-modal__wa-total {
    margin-top: 0.35rem;
    padding-top: 0.5rem;
    border-top: 0.5px solid rgba(37,211,102,0.35);
    font-size: 0.95rem !important;
    font-weight: 700;
    color: #fff !important;
  }
  .benefits-modal__wa-total strong {
    color: #25D366 !important;
    font-size: 1.05rem;
  }

  .benefits-modal__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  .benefits-modal__row {
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.85);
    line-height: 1.45;
  }
  .benefits-modal__row.excluded {
    color: rgba(255,255,255,0.35);
  }
  .benefits-modal__row-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    font-size: 0.72rem;
    font-weight: 800;
    flex-shrink: 0;
    margin-top: 1px;
    background: rgba(1,245,158,0.14);
    color: #01f59e;
  }
  .benefits-modal__row.excluded .benefits-modal__row-icon {
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.3);
  }
  .benefits-modal__extra {
    color: rgba(255,255,255,0.5);
    font-size: 0.82rem;
  }
  @keyframes modalFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes modalPop {
    from { opacity: 0; transform: scale(0.94) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @media (max-width: 640px) {
    .benefits-modal { padding: 1rem; align-items: flex-end; }
    .benefits-modal__dialog {
      max-height: 88vh;
      padding: 1.5rem 1.25rem 1.25rem;
      border-radius: 20px 20px 16px 16px;
    }
    .benefits-modal__name { font-size: 1.2rem; }
    .benefits-modal__tagline { font-size: 0.8rem; }
    .benefits-modal__row { font-size: 0.85rem; }
  }

  /* ─── Responsive ─────────────────────────────────────────── */
  @media (max-width: 640px) {
    .plans-grid {
      display: flex;
      flex-direction: column;
      grid-template-columns: none;
      gap: 0.85rem;
      padding: 0.5rem 0 1rem;
      margin: 0 0 1rem;
    }
    .plans-grid > .plan-card {
      width: 100%;
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
      min-height: 52px;
      justify-content: center;
      padding: 0.45rem 0.4rem;
      gap: 0.2rem;
    }
    .cycle-pill-label { font-size: 0.78rem; }
    .cycle-pill-tag { font-size: 0.58rem; letter-spacing: 0; }
    .country-wrap { width: 100%; gap: 0.4rem; }
    .country-wrap-label { font-size: 0.72rem; }
    .country-pills {
      display: flex;
      width: 100%;
      gap: 0.2rem;
      padding: 0.25rem;
      border-radius: 14px;
    }
    .country-pill {
      flex: 1 1 0;
      min-width: 0;
      min-height: 40px;
      justify-content: center;
      padding: 0.4rem 0.4rem;
      font-size: 0.7rem;
      gap: 0.3rem;
      white-space: normal;
      text-align: center;
      line-height: 1.15;
    }
    .country-pill.active { box-shadow: none; }
    .country-pill-flag { font-size: 0.9rem; }
    .price-tax { font-size: 0.65rem; }

    /* ─── Mobile typography ─────────────────────────────────── */
    .section-title { font-size: clamp(1.75rem, 7vw, 2.25rem); }
    .section-subtitle { font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; }
    .section-eyebrow { font-size: 0.7rem; }

    .plan-card { padding: 1.5rem 1.25rem 1.25rem; gap: 1rem; }
    .plan-name { font-size: 1.15rem; }
    .plan-tagline { font-size: 0.78rem; }
    .plan-range { font-size: 0.78rem; }
    .plan-range--registered { font-size: 0.68rem; }

    .price-amount { font-size: 1.625rem; }
    .price-period { font-size: 0.8rem; }
    .price-quote { font-size: 1.2rem; }
    .price-strike { font-size: 0.82rem; }
    .price-savings { font-size: 0.55rem; padding: 0.12rem 0.4rem; }
    .price-lock { font-size: 0.6rem; }
    .plan-price { gap: 0.25rem; }

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

  }
</style>
