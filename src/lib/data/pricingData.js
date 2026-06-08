/**
 * FlowPass — estructura de precios
 * 3 planes self-serve (Start / Pro / Max) + Enterprise (bajo evaluación).
 *
 * Lógica de precios:
 *  - Cada plan tiene dos grillas: `prices` (WhatsApp manual incluido) y
 *    `pricesWhatsapp` (con recordatorios automáticos).
 *  - El toggle "con / sin WhatsApp automático" solo cambia de grilla.
 *  - Los descuentos por ciclo (trimestral ~-10%, anual ~-20%) están FIJADOS A MANO
 *    en números redondos dentro de cada grilla — no se calculan, para no arrastrar
 *    decimales feos (180 * 0.9 = 162 se ve roto; por eso se fija 160).
 *  - Quien supere los recordatorios incluidos suma un pack de `whatsappPackages`.
 *
 * IGV / IVA: los precios se muestran CON impuesto incluido (precio final al cliente).
 * Tu ingreso NETO es precio / 1.18 en Perú (/ 1.16 en México). Usa `getTaxBreakdown`,
 * y cuenta el MRR en neto, no en el precio final.
 */

/** @type {Array<{code: string, label: string, flag: string, currency: string, currencyCode: string}>} */
export const countries = [
  { code: "PE", label: "Perú", flag: "🇵🇪", currency: "S/", currencyCode: "PEN" },
  { code: "MX", label: "México", flag: "🇲🇽", currency: "$", currencyCode: "MXN" },
  { code: "US", label: "Otros países", flag: "🌎", currency: "$", currencyCode: "USD" },
];

/**
 * Ciclos de facturación. El descuento es informativo (los precios ya vienen
 * precalculados por ciclo en cada plan); úsalo para el badge "Ahorra ~X%".
 * @type {Array<{id: string, label: string, discount: number, note: string}>}
 */
export const billingCycles = [
  { id: "mensual", label: "Mensual", discount: 0, note: "Pago mes a mes" },
  { id: "trimestral", label: "Trimestral", discount: 0.1, note: "Ahorra ~10%" },
  { id: "anual", label: "Anual", discount: 0.2, note: "Ahorra ~20%" },
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
 * @typedef {Object} Plan
 * @property {string} id
 * @property {string} name
 * @property {string} tagline
 * @property {string} activeStudents
 * @property {string} [registeredStudents]
 * @property {boolean} highlight                                          // "Más popular"
 * @property {boolean} freeTrial                                          // "Empieza gratis, sin tarjeta"
 * @property {boolean} flowyBeta                                          // badge "Flowy · beta"
 * @property {boolean} [quoteBased]                                       // Enterprise: "Bajo evaluación"
 * @property {Record<string, Record<string, number>>} [prices]           // prices[ciclo][pais] — WhatsApp manual
 * @property {Record<string, Record<string, number>>} [pricesWhatsapp]   // con recordatorios automáticos
 * @property {{includedReminders: number}} [whatsappAuto]                // recordatorios incluidos en `pricesWhatsapp`
 * @property {Array<{label: string, included: boolean, extraCost?: Record<string, number>}>} features
 */

/** @type {Plan[]} */
export const plans = [
  {
    id: "start",
    name: "Flow Start",
    tagline: "Ordena tu operación y empieza con lo esencial.",
    activeStudents: "0 – 100 alumnos activos",
    registeredStudents: "Hasta 300 alumnos registrados",
    highlight: false,
    freeTrial: true,
    flowyBeta: false,
    prices: {
      mensual: { PE: 180, MX: 900, US: 50 },
      trimestral: { PE: 160, MX: 810, US: 45 },
      anual: { PE: 145, MX: 720, US: 40 },
    },
    pricesWhatsapp: {
      mensual: { PE: 200, MX: 1000, US: 60 },
      trimestral: { PE: 180, MX: 900, US: 55 },
      anual: { PE: 160, MX: 800, US: 50 },
    },
    whatsappAuto: { includedReminders: 100 },
    features: [
      { label: "Gestión de alumnos, pagos y asistencia", included: true },
      { label: "Acceso QR", included: true },
      { label: "WhatsApp manual · 100 mensajes/mes", included: true },
      { label: "1 Admin + 1 Colaborador", included: true },
      { label: "Flowy · asistente de IA que conoce tu negocio (beta)", included: true },
      { label: "Membresías simultáneas por alumno", included: false },
      { label: "Multi sede", included: false },
    ],
  },
  {
    id: "pro",
    name: "Flow Pro",
    tagline: "Para academias que ya están creciendo.",
    activeStudents: "100 – 200 alumnos activos",
    registeredStudents: "Hasta 1000 alumnos registrados",
    highlight: true,
    freeTrial: true,
    flowyBeta: true,
    prices: {
      mensual: { PE: 280, MX: 1400, US: 80 },
      trimestral: { PE: 250, MX: 1260, US: 70 },
      anual: { PE: 225, MX: 1120, US: 65 },
    },
    pricesWhatsapp: {
      mensual: { PE: 300, MX: 1500, US: 90 },
      trimestral: { PE: 270, MX: 1350, US: 80 },
      anual: { PE: 240, MX: 1200, US: 75 },
    },
    whatsappAuto: { includedReminders: 200 },
    features: [
      { label: "Todo lo de Flow Start", included: true },
      { label: "WhatsApp manual · 200 mensajes/mes", included: true },
      { label: "Membresías simultáneas por alumno", included: true },
      { label: "Flowy · asistente de IA que conoce tu negocio (beta)", included: true },
      { label: "2 Admin + 3 Colaboradores", included: true },
      { label: "Multi sede", included: true, extraCost: { PE: 50, MX: 250, US: 15 } },
    ],
  },
  {
    id: "max",
    name: "Flow Max",
    tagline: "Máxima potencia, multi-sede y todo incluido.",
    activeStudents: "200 – 300 alumnos activos",
    registeredStudents: "Hasta 2500 alumnos registrados",
    highlight: false,
    freeTrial: true,
    flowyBeta: true,
    prices: {
      mensual: { PE: 480, MX: 2400, US: 140 },
      trimestral: { PE: 430, MX: 2160, US: 125 },
      anual: { PE: 385, MX: 1920, US: 110 },
    },
    pricesWhatsapp: {
      mensual: { PE: 500, MX: 2500, US: 150 },
      trimestral: { PE: 450, MX: 2250, US: 135 },
      anual: { PE: 400, MX: 2000, US: 120 },
    },
    whatsappAuto: { includedReminders: 300 },
    features: [
      { label: "Todo lo de Flow Pro", included: true },
      { label: "WhatsApp manual · 300 mensajes/mes", included: true },
      { label: "Multi sede incluida", included: true },
      { label: "Flowy · asistente de IA que conoce tu negocio (beta)", included: true },
      { label: "3 Admin + 6 Colaboradores", included: true },
    ],
  },
  {
    id: "enterprise",
    name: "Flow Enterprise",
    tagline: "Para cadenas y marcas que necesitan algo a medida.",
    activeStudents: "Cadenas y marcas",
    highlight: false,
    freeTrial: false,
    flowyBeta: true,
    quoteBased: true, // la card muestra "Bajo evaluación" y CTA "Hablemos"
    features: [
      { label: "Todo lo de Flow Max", included: true },
      { label: "WhatsApp manual ilimitado", included: true },
      { label: "Sedes ilimitadas", included: true },
      { label: "Desarrollo y personalización a medida", included: true },
      { label: "Onboarding y migración asistida", included: true },
      { label: "Soporte prioritario dedicado", included: true },
      { label: "Reportes consolidados de organización", included: true },
      { label: "Flowy entrenado con tu negocio (beta)", included: true },
    ],
  },
];

/**
 * Recordatorios automáticos de pago por WhatsApp — packs de top-up.
 * Úsalos cuando un cliente supera los recordatorios incluidos en su plan.
 * @type {Array<{name: string, reminders: number, highlight: boolean, prices: Record<string, number>}>}
 */
export const whatsappPackages = [
  { name: "Básico", reminders: 50, highlight: false, prices: { PE: 20, MX: 100, US: 5 } },
  { name: "Medio", reminders: 100, highlight: false, prices: { PE: 40, MX: 180, US: 10 } },
  { name: "Pro", reminders: 200, highlight: true, prices: { PE: 60, MX: 300, US: 15 } },
  { name: "Avanzado", reminders: 300, highlight: false, prices: { PE: 80, MX: 400, US: 20 } },
];

/** @type {string[]} */
export const perks = [
  "Empieza gratis, sin tarjeta de crédito",
  "Sin contratos forzosos",
  "Soporte personalizado",
  "Conexión oficial a WhatsApp",
  "Acceso desde cualquier lugar",
];

/** Badge reusable para Flowy. */
export const FLOWY_BETA_BADGE = { label: "Flowy", tag: "beta" };

/* ----------------------------- Helpers ----------------------------- */

/**
 * Precio mensual a mostrar para un plan, según ciclo, país y si suma WhatsApp automático.
 * Lee de `pricesWhatsapp` cuando withWhatsapp = true, si no de `prices`.
 * @param {Plan} plan
 * @param {string} [cycleId]
 * @param {string} [country]
 * @param {boolean} [withWhatsapp]
 * @returns {number|null} precio/mes, o null si el plan es "bajo evaluación".
 */
export function getPlanPrice(plan, cycleId = "trimestral", country = "PE", withWhatsapp = false) {
  if (plan.quoteBased) return null;
  const grid = withWhatsapp && plan.pricesWhatsapp ? plan.pricesWhatsapp : plan.prices;
  return grid?.[cycleId]?.[country] ?? null;
}

/**
 * Formatea un precio con el símbolo del país (separador de miles solo para MXN).
 * @param {number} amount
 * @param {string} [country]
 * @returns {string} ej. "S/280" · "$1,500" · "$80 USD"
 */
export function formatPrice(amount, country = "PE") {
  const c = countries.find((x) => x.code === country) ?? countries[0];
  const n = country === "MX" ? Math.round(amount).toLocaleString("en-US") : Math.round(amount);
  const suffix = country === "US" ? " USD" : "";
  return `${c.currency}${n}${suffix}`;
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
