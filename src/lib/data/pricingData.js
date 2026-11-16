/**
 * FlowPass — estructura de precios
 * 4 planes self-serve (Pocket / Lite / Full / Ultra) + Enterprise (bajo evaluación).
 *
 * Precios: solo el respaldo en USD vive acá. Los de cada país (PE, MX...) vienen del API (GET /signup/pricing, por IP)
 * y se leen de `livePricing.grid`. Packs de WhatsApp: solo USD; en países con precio propio se muestran sin monto.
 *
 * Lógica de precios:
 *  - Cada plan tiene una única grilla `prices`. WhatsApp automático viene incluido
 *    siempre; el cliente decide si activarlo. No hay dos precios distintos.
 *  - El precio de cada ciclo lo fija el Admin por plan (el respaldo USD, a mano en la grilla).
 *    El descuento NO es fijo por ciclo: la landing calcula el ahorro de cada tarjeta
 *    comparando con el precio mensual.
 *  - Cada plan trae un cupo mensual `whatsappIncluded.total` de mensajes WhatsApp
 *    (mezcla recordatorios automáticos + envíos 1-click). Si lo supera, suma un
 *    pack de `whatsappPackages`.
 *
 * IGV / IVA: los precios se muestran CON impuesto incluido (precio final al cliente).
 * Tu ingreso NETO es precio / 1.18 en Perú (/ 1.16 en México). Usa `getTaxBreakdown`,
 * y cuenta el MRR en neto, no en el precio final.
 */

import { livePricing } from "$lib/livePricing.svelte";

/** @type {Array<{code: string, label: string, flag: string, currency: string, currencyCode: string}>} */
export const countries = [
  {
    code: "PE",
    label: "Perú",
    flag: "🇵🇪",
    currency: "S/",
    currencyCode: "PEN",
  },
  {
    code: "MX",
    label: "México",
    flag: "🇲🇽",
    currency: "$",
    currencyCode: "MXN",
  },
  {
    code: "US",
    label: "Otros países",
    flag: "🌎",
    currency: "$",
    currencyCode: "USD",
  },
];

/**
 * Ciclos de facturación. Sin descuento fijo: cada plan puede tener uno distinto por ciclo,
 * así que el ahorro se calcula por tarjeta con sus precios (ver HomePricing: `savingOf`).
 * @type {Array<{id: string, label: string}>}
 */
export const billingCycles = [
  { id: "mensual", label: "Mensual" },
  { id: "trimestral", label: "Trimestral" },
  { id: "anual", label: "Anual" },
];

/**
 * Impuestos por país. Los precios de `plans` se muestran CON impuesto incluido
 * (precio final al cliente).
 *   PE: IGV 18% · MX: IVA 16% · US/otros: sin impuesto local.
 * @type {Record<string, number>}
 */
export const taxRates = { PE: 0.18, MX: 0.16, US: 0 };

/** Los precios de `plans` ya incluyen impuesto. */
export const PRICES_INCLUDE_TAX = true;

/**
 * PROMO DE LANZAMIENTO — configuración por país
 *
 * Precio flat por plan (aplica a todos los ciclos y con/sin WhatsApp auto).
 *
 * Estructura:
 *  - `active` global: interruptor maestro. Pon `false` para apagar toda la promo.
 *  - `countries[COUNTRY]`: config por país. Solo los países listados tienen promo.
 *    - `endsAt`: ISO con zona. Si es `null`, la promo no caduca por fecha.
 *    - `showCountdown`: si mostrar contador (requiere `endsAt`).
 *    - `label`: badge del banner (Ej. "Oferta de lanzamiento").
 *    - `headline`: título del banner.
 *    - `priceLockLabel`: texto pequeño bajo el precio en la card.
 *    - `prices[planId]`: precio final por plan.
 *
 * Para apagar la promo en un país específico: eliminar la key del país en `countries`.
 * Para apagar toda la promo: `promoConfig.active = false`.
 */
export const promoConfig = {
  active: true,
  // Vacío: la promo de lanzamiento (hasta 2026-08-31) venció. Un país nuevo = una entrada acá, con su precio.
  countries: /** @type {Record<string, {endsAt: string|null, showCountdown: boolean, label: string, headline: string, priceLockLabel: string, prices: Record<string, number>}>} */ ({}),
};

/**
 * Config de promo para un país, o null si no aplica.
 * @param {string} country
 */
export function getPromoCountryConfig(country) {
  if (!promoConfig.active) return null;
  return promoConfig.countries?.[country] ?? null;
}

/**
 * Devuelve true si la promo está activa para el país (respeta `endsAt`).
 * Si se omite country, retorna true si CUALQUIER país tiene promo activa.
 * @param {string} [country]
 * @param {number} [nowMs]
 * @returns {boolean}
 */
export function isPromoActive(country, nowMs) {
  const now = typeof nowMs === "number" ? nowMs : Date.now();
  if (country) {
    const cfg = getPromoCountryConfig(country);
    if (!cfg) return false;
    if (!cfg.endsAt) return true;
    const end = new Date(cfg.endsAt).getTime();
    return Number.isFinite(end) && now < end;
  }
  return Object.keys(promoConfig.countries ?? {}).some((c) =>
    isPromoActive(c, now),
  );
}

/**
 * Precio promo de un plan para un país, o null si no aplica.
 * @param {Plan} plan
 * @param {string} country
 * @param {number} [nowMs]
 * @returns {number|null}
 */
export function getPromoPrice(plan, country, nowMs) {
  if (!isPromoActive(country, nowMs)) return null;
  if (plan.quoteBased) return null;
  const cfg = getPromoCountryConfig(country);
  return cfg?.prices?.[plan.id] ?? null;
}

/**
 * @typedef {Object} Plan
 * @property {string} id
 * @property {string} name
 * @property {string} tagline
 * @property {string} activeStudents
 * @property {number} [maxActiveStudents]                                // techo del rango — usado para calcular precio/alumno
 * @property {string} [registeredStudents]
 * @property {boolean} highlight                                          // "Más popular"
 * @property {boolean} freeTrial                                          // "Empieza gratis, sin tarjeta"
 * @property {boolean} flowyBeta                                          // badge "Flowy · beta"
 * @property {boolean} [quoteBased]                                       // Enterprise: "Bajo evaluación"
 * @property {Record<string, Record<string, number>>} [prices]           // prices[ciclo][pais]
 * @property {{total: number, auto: number, manual: number}} [whatsappIncluded]  // cupo mensajes WhatsApp/mes: mitad recordatorios automáticos, mitad envíos manuales
 * @property {Array<{label: string, included: boolean, extraCost?: Record<string, number>}>} features
 * @property {Record<string, number>} [nonCardFee]                       // recargo mensual si paga sin tarjeta (solo PE)
 */

/** @type {Plan[]} */
export const plans = [
  {
    id: "pocket",
    name: "Flow Pocket",
    tagline: "Ideal para empezar",
    activeStudents: "0 – 30 alumnos activos",
    maxActiveStudents: 30,
    registeredStudents: "Hasta 400 alumnos registrados",
    highlight: false,
    freeTrial: false,
    flowyBeta: true,
    prices: {
      mensual: { US: 40 },
      trimestral: { US: 35 },
      anual: { US: 30 },
    },
    teamSeats: 5, // null = ilimitados
    extraSiteFee: { PE: 30 }, // por sede adicional de ESTE tamaño; MX/US a consultar
    nonCardFee: { PE: 10 }, // recargo mensual si paga sin tarjeta (Yape, Plin, transferencia). Solo Perú.
    whatsappIncluded: { total: 100, auto: 50, manual: 50 },
    features: [
      { label: "Gestión de alumnos, asistencia y membresías (clases, planes o paquetes)", included: true },
      { label: "Ventas, ingresos, gastos e inventario", included: true },
      { label: "Panel de estadísticas y reportes descargables", included: true },
      { label: "Hasta 5 accesos para tu equipo", included: true },
      {
        label: "Flowy · asistente de IA que conoce tu negocio (beta)",
        included: true,
      },
      { label: "Soporte Esencial", included: true },
      { label: "Membresías simultáneas por alumno", included: false },
      { label: "Sedes adicionales (consulta el precio)", included: true },
    ],
  },
  {
    id: "lite",
    name: "Flow Lite",
    tagline: "Para seguir creciendo",
    activeStudents: "30 – 80 alumnos activos",
    maxActiveStudents: 80,
    registeredStudents: "Hasta 1,000 alumnos registrados",
    highlight: false,
    freeTrial: false,
    flowyBeta: true,
    prices: {
      mensual: { US: 70 },
      trimestral: { US: 65 },
      anual: { US: 52 },
    },
    teamSeats: 10, // null = ilimitados
    extraSiteFee: { PE: 50 }, // por sede adicional de ESTE tamaño; MX/US a consultar
    nonCardFee: { PE: 20 }, // recargo mensual si paga sin tarjeta (Yape, Plin, transferencia). Solo Perú.
    whatsappIncluded: { total: 200, auto: 100, manual: 100 },
    features: [
      { label: "Gestión de alumnos, asistencia con geolocalización y membresías (clases, planes o paquetes)", included: true },
      { label: "Ventas, ingresos, gastos e inventario", included: true },
      { label: "Panel de estadísticas y reportes descargables", included: true },
      { label: "Hasta 10 accesos para tu equipo", included: true },
      { label: "Membresías simultáneas por alumno", included: true },
      { label: "Sedes adicionales (consulta el precio)", included: true },
      { label: "Flowy · asistente de IA que conoce tu negocio (beta)", included: true },
      { label: "Soporte Plus", included: true },
    ],
  },
  {
    id: "full",
    name: "Flow Full",
    tagline: "Para operaciones consolidadas",
    activeStudents: "80 – 200 alumnos activos",
    maxActiveStudents: 200,
    registeredStudents: "Hasta 2,000 alumnos registrados",
    highlight: true,
    freeTrial: false,
    flowyBeta: true,
    prices: {
      mensual: { US: 110 },
      trimestral: { US: 100 },
      anual: { US: 82 },
    },
    teamSeats: 15, // null = ilimitados
    extraSiteFee: { PE: 100 }, // por sede adicional de ESTE tamaño; MX/US a consultar
    nonCardFee: { PE: 30 }, // recargo mensual si paga sin tarjeta (Yape, Plin, transferencia). Solo Perú.
    whatsappIncluded: { total: 400, auto: 200, manual: 200 },
    features: [
      { label: "Gestión de alumnos, asistencia con geolocalización y membresías (clases, planes o paquetes)", included: true },
      { label: "Ventas, ingresos, gastos e inventario", included: true },
      { label: "Panel de estadísticas y reportes descargables", included: true },
      { label: "Hasta 15 accesos para tu equipo", included: true },
      { label: "Membresías simultáneas por alumno", included: true },
      { label: "Sedes adicionales (consulta el precio)", included: true },
      { label: "Flowy · asistente de IA que conoce tu negocio (beta)", included: true },
      { label: "Soporte Pro", included: true },
    ],
  },
  {
    id: "ultra",
    name: "Flow Ultra",
    tagline: "Para operaciones de alto volumen",
    activeStudents: "200 – 350 alumnos activos",
    maxActiveStudents: 350,
    registeredStudents: "Hasta 3,500 alumnos registrados",
    highlight: false,
    freeTrial: false,
    flowyBeta: true,
    prices: {
      mensual: { US: 150 },
      trimestral: { US: 135 },
      anual: { US: 112 },
    },
    teamSeats: 20, // null = ilimitados
    extraSiteFee: { PE: 200 }, // por sede adicional de ESTE tamaño; MX/US a consultar
    nonCardFee: { PE: 50 }, // recargo mensual si paga sin tarjeta (Yape, Plin, transferencia). Solo Perú.
    whatsappIncluded: { total: 700, auto: 350, manual: 350 },
    features: [
      { label: "Gestión de alumnos, asistencia con geolocalización y membresías (clases, planes o paquetes)", included: true },
      { label: "Ventas, ingresos, gastos e inventario", included: true },
      { label: "Panel de estadísticas y reportes descargables", included: true },
      { label: "Hasta 20 accesos para tu equipo", included: true },
      { label: "Membresías simultáneas por alumno", included: true },
      { label: "Sedes adicionales (consulta el precio)", included: true },
      { label: "Flowy · asistente de IA que conoce tu negocio (beta)", included: true },
      { label: "Soporte VIP", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Flow Enterprise",
    tagline: "Soluciones a medida",
    activeStudents: "Cadenas y marcas",
    highlight: false,
    freeTrial: false,
    flowyBeta: true,
    quoteBased: true, // la card muestra "Bajo evaluación" y CTA "Hablemos"
    features: [
      { label: "Todo lo de Flow Ultra", included: true },
      { label: "Sedes ilimitadas", included: true },
      { label: "Reportes consolidados de organización", included: true },
      { label: "Soporte Premium", included: true },
      { label: "Onboarding y migración asistida", included: true },
      { label: "Flowy entrenado con tu negocio (beta)", included: true },
      { label: "Desarrollo y personalización a medida", included: true },
    ],
  },
];

/**
 * Recordatorios automáticos de pago por WhatsApp — packs de top-up.
 * Úsalos cuando un cliente supera los recordatorios incluidos en su plan.
 * @type {Array<{name: string, reminders: number, highlight: boolean, prices: Record<string, number>}>}
 */
export const whatsappPackages = [
  {
    name: "Básico",
    reminders: 100,
    highlight: false,
    prices: { US: 10 },//Costo unitario: 0.4
  },
  {
    name: "Medio",
    reminders: 200,
    highlight: false,
    prices: { US: 18 },//Costo unitario: 0.35
  },
  {
    name: "Pro",
    reminders: 300,
    highlight: true,
    prices: { US: 25 },//Costo unitario: 0.30
  },
  {
    name: "Avanzado",
    reminders: 400,
    highlight: false,
    prices: { US: 30 },//Costo unitario: 0.25
  },
];

/**
 * Sede adicional: cada sede es 100% independiente (sus propios alumnos,
 * mensajes y accesos) y paga según SU tamaño, no el del plan principal.
 * Una sede chica suma desde S/30 aunque la principal sea Full.
 * Precios MX/US: pendientes (se muestran "a consultar").
 */
export const EXTRA_SITE_FROM = { PE: 30 };

/**
 * Facturación electrónica SUNAT — solo Perú, independiente del plan.
 * Packs mensuales de comprobantes (boletas y facturas).
 * @type {Array<{vouchers: number, prices: {PE: number}}>}
 */
export const sunatPackages = [
  { vouchers: 50, prices: { PE: 30 } },
  { vouchers: 150, prices: { PE: 50 } },
  { vouchers: 250, prices: { PE: 60 } },
  { vouchers: 500, prices: { PE: 70 } },
];

/** @type {string[]} */
export const perks = [
  "Sin contratos forzosos",
  "Soporte personalizado",
  "Conexión oficial a WhatsApp",
  "Acceso desde cualquier lugar",
];

/** Badge reusable para Flowy. */
export const FLOWY_BETA_BADGE = { label: "Flowy", tag: "beta" };

/* ----------------------------- Helpers ----------------------------- */

/**
 * Precio mensual a mostrar para un plan según ciclo y país.
 * La promo SOLO aplica al ciclo mensual (precio congelado 1 año). Trim y anual
 * conservan siempre sus descuentos de lista.
 * @param {Plan} plan
 * @param {string} [cycleId]
 * @param {string} [country]
 * @returns {number|null} precio/mes, o null si el plan es "bajo evaluación".
 */
export function getPlanPrice(plan, cycleId = "trimestral", country = "PE") {
  if (plan.quoteBased) return null;
  if (cycleId === "mensual") {
    const promo = getPromoPrice(plan, country);
    if (promo !== null) return promo;
  }
  return getBasePlanPrice(plan, cycleId, country);
}

/**
 * Precio original (sin promo) del plan — para mostrar tachado junto al promo.
 * @param {Plan} plan
 * @param {string} [cycleId]
 * @param {string} [country]
 * @returns {number|null}
 */
export function getBasePlanPrice(plan, cycleId = "mensual", country = "PE") {
  if (plan.quoteBased) return null;
  // Precio vivo de Admin si la tarjeta (id del plan) tiene plan vinculado; si no, la grilla fija (respaldo por celda).
  return livePricing.grid[plan.id]?.[cycleId]?.[country] ?? plan.prices?.[cycleId]?.[country] ?? null;
}

/**
 * Formatea un precio como string único (símbolo + monto + sufijo de moneda
 * cuando "$" es ambiguo). PE usa "S/" único, no lleva sufijo. Útil para
 * lugares donde el precio va en una sola línea (packs, extra-costs, etc).
 * Para el precio grande del hero de cada plan usa `formatPriceParts`.
 * @param {number} amount
 * @param {string} [country]
 * @returns {string} ej. "S/280" · "$1,500 MXN" · "$120,000 COP" · "$80 USD"
 */
export function formatPrice(amount, country = "PE") {
  const p = formatPriceParts(amount, country);
  return p.code ? `${p.symbol}${p.number} ${p.code}` : `${p.symbol}${p.number}`;
}

/**
 * Igual que `formatPrice` pero devuelve las partes por separado. Sirve para
 * renderizar el código de moneda más chico junto al monto grande (evita que
 * "$1,800 MXN" rompa en dos líneas dentro de un span gigante).
 * @param {number} amount
 * @param {string} [country]
 * @returns {{symbol: string, number: string, code: string}}
 */
export function formatPriceParts(amount, country = "PE") {
  const c = countries.find((x) => x.code === country) ?? countries[0];
  const useThousands = country === "MX" || country === "CO";
  // Entero como siempre; un equivalente mensual vivo con centavos (ej. 11.67) se muestra con 2 decimales.
  // Redondeo a centavos ANTES de decidir si es entero: 1083.333… × 3 = 3250.0000000000005 se muestra 3,250.
  amount = Math.round((amount + Number.EPSILON) * 100) / 100; // redondea (no trunca); EPSILON evita 1.005 → 1.00
  const whole = Number.isInteger(amount);
  const number = useThousands
    ? amount.toLocaleString("en-US", { minimumFractionDigits: whole ? 0 : 2 })
    : whole ? String(amount) : amount.toFixed(2);
  /** @type {Record<string, string>} */
  const codeByCountry = { MX: "MXN", CO: "COP", US: "USD" };
  return { symbol: c.currency, number, code: codeByCountry[country] ?? "" };
}

/**
 * Desglosa un precio CON impuesto incluido en neto + impuesto.
 * Útil para facturación y para contar el MRR en neto.
 * @param {number} amount
 * @param {string} [country]
 * @returns {{gross: number, net: number, tax: number, rate: number}}
 */
export function getTaxBreakdown(amount, country = "PE") {
  const rate = taxRates[country] ?? 0;
  const gross = amount;
  const net = Math.round((gross / (1 + rate)) * 100) / 100;
  const tax = Math.round((gross - net) * 100) / 100;
  return { gross, net, tax, rate };
}
