/**
 * FlowPass — estructura de precios
 * 4 planes self-serve (Pocket / Lite / Full / Ultra) + Enterprise (bajo evaluación).
 *
 * Lógica de precios:
 *  - Cada plan tiene una única grilla `prices`. WhatsApp automático viene incluido
 *    siempre; el cliente decide si activarlo. No hay dos precios distintos.
 *  - Los descuentos por ciclo (trimestral ~-10%, anual ~-20%) están FIJADOS A MANO
 *    en números redondos dentro de cada grilla — no se calculan, para no arrastrar
 *    decimales feos (180 * 0.9 = 162 se ve roto; por eso se fija 160).
 *  - Cada plan trae un cupo mensual `whatsappIncluded.total` de mensajes WhatsApp
 *    (mezcla recordatorios automáticos + envíos 1-click). Si lo supera, suma un
 *    pack de `whatsappPackages`.
 *
 * IGV / IVA: los precios se muestran CON impuesto incluido (precio final al cliente).
 * Tu ingreso NETO es precio / 1.18 en Perú (/ 1.16 en México). Usa `getTaxBreakdown`,
 * y cuenta el MRR en neto, no en el precio final.
 */

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
  countries: {
    PE: {
      endsAt: "2026-08-31T23:59:59-05:00", // 31 agosto 2026, medianoche Lima
      showCountdown: true,
      label: "Oferta de lanzamiento",
      headline: "Precio congelado por 1 año",
      priceLockLabel: "Precio congelado por 1 año",
      prices: { pocket: 100, lite: 200, full: 300, ultra: 400 },
    },
    MX: {
      endsAt: "2026-08-31T23:59:59-06:00", // 31 agosto 2026, medianoche CDMX
      showCountdown: true,
      label: "Oferta de lanzamiento",
      headline: "Precio congelado por 1 año",
      priceLockLabel: "Precio congelado por 1 año",
      prices: { pocket: 500, lite: 1000, full: 1500, ultra: 2000 },
    },
  },
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
 * @property {{total: number}} [whatsappIncluded]                        // cupo mensajes WhatsApp/mes (auto + 1-click sumados)
 * @property {Array<{label: string, included: boolean, extraCost?: Record<string, number>}>} features
 */

/** @type {Plan[]} */
export const plans = [
  {
    id: "pocket",
    name: "Flow Pocket",
    tagline: "Ideal para empezar",
    activeStudents: "0 – 30 alumnos activos",
    maxActiveStudents: 30,
    registeredStudents: "Hasta 150 alumnos registrados",
    highlight: false,
    freeTrial: true,
    flowyBeta: true,
    prices: {
      mensual: { PE: 120, MX: 600, US: 35 },
      trimestral: { PE: 105, MX: 550, US: 30 },
      anual: { PE: 90, MX: 450, US: 25 },
    },
    whatsappIncluded: { total: 100 },
    features: [
      { label: "Gestión de alumnos, asistencia y membresías (clases, planes o paquetes)", included: true },
      { label: "Ventas, ingresos, gastos e inventario", included: true },
      { label: "Panel de estadísticas y reportes descargables", included: true },
      { label: "Accesos ilimitados para tu equipo", included: true },
      {
        label: "Flowy · asistente de IA que conoce tu negocio (beta)",
        included: true,
      },
      { label: "Soporte Esencial", included: true },
      { label: "Membresías simultáneas por alumno", included: false },
      { label: "Varias sedes en un solo panel", included: false },
    ],
  },
  {
    id: "lite",
    name: "Flow Lite",
    tagline: "Para seguir creciendo",
    activeStudents: "30 – 80 alumnos activos",
    maxActiveStudents: 80,
    registeredStudents: "Hasta 400 alumnos registrados",
    highlight: false,
    freeTrial: true,
    flowyBeta: true,
    prices: {
      mensual: { PE: 230, MX: 1150, US: 65 },
      trimestral: { PE: 205, MX: 1050, US: 60 },
      anual: { PE: 180, MX: 900, US: 55 },
    },
    whatsappIncluded: { total: 200 },
    features: [
      { label: "Gestión de alumnos, asistencia y membresías (clases, planes o paquetes)", included: true },
      { label: "Ventas, ingresos, gastos e inventario", included: true },
      { label: "Panel de estadísticas y reportes descargables", included: true },
      { label: "Accesos ilimitados para tu equipo", included: true },
      { label: "Membresías simultáneas por alumno", included: true },
      { label: "Varias sedes en un solo panel — incluidas sin costo extra", included: true },
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
    registeredStudents: "Hasta 800 alumnos registrados",
    highlight: true,
    freeTrial: true,
    flowyBeta: true,
    prices: {
      mensual: { PE: 350, MX: 1800, US: 110 },
      trimestral: { PE: 315, MX: 1630, US: 100 },
      anual: { PE: 280, MX: 1460, US: 90 },
    },
    whatsappIncluded: { total: 400 },
    features: [
      { label: "Gestión de alumnos, asistencia y membresías (clases, planes o paquetes)", included: true },
      { label: "Ventas, ingresos, gastos e inventario", included: true },
      { label: "Panel de estadísticas y reportes descargables", included: true },
      { label: "Accesos ilimitados para tu equipo", included: true },
      { label: "Membresías simultáneas por alumno", included: true },
      { label: "Varias sedes en un solo panel — incluidas sin costo extra", included: true },
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
    registeredStudents: "Hasta 1250 alumnos registrados",
    highlight: false,
    freeTrial: true,
    flowyBeta: true,
    prices: {
      mensual: { PE: 500, MX: 2500, US: 150 },
      trimestral: { PE: 450, MX: 2260, US: 135 },
      anual: { PE: 390, MX: 2020, US: 120 },
    },
    whatsappIncluded: { total: 700 },
    features: [
      { label: "Gestión de alumnos, asistencia y membresías (clases, planes o paquetes)", included: true },
      { label: "Ventas, ingresos, gastos e inventario", included: true },
      { label: "Panel de estadísticas y reportes descargables", included: true },
      { label: "Accesos ilimitados para tu equipo", included: true },
      { label: "Membresías simultáneas por alumno", included: true },
      { label: "Varias sedes en un solo panel — incluidas sin costo extra", included: true },
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
    reminders: 50,
    highlight: false,
    prices: { PE: 20, MX: 100, US: 5 },
  },
  {
    name: "Medio",
    reminders: 100,
    highlight: false,
    prices: { PE: 40, MX: 180, US: 10 },
  },
  {
    name: "Pro",
    reminders: 200,
    highlight: true,
    prices: { PE: 60, MX: 300, US: 15 },
  },
  {
    name: "Avanzado",
    reminders: 300,
    highlight: false,
    prices: { PE: 80, MX: 400, US: 20 },
  },
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
 * Si hay promo activa para el país, la promo pisa el precio de lista.
 * @param {Plan} plan
 * @param {string} [cycleId]
 * @param {string} [country]
 * @returns {number|null} precio/mes, o null si el plan es "bajo evaluación".
 */
export function getPlanPrice(plan, cycleId = "trimestral", country = "PE") {
  if (plan.quoteBased) return null;
  const promo = getPromoPrice(plan, country);
  if (promo !== null) return promo;
  return plan.prices?.[cycleId]?.[country] ?? null;
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
  return plan.prices?.[cycleId]?.[country] ?? null;
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
  const number = useThousands
    ? Math.round(amount).toLocaleString("en-US")
    : String(Math.round(amount));
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
