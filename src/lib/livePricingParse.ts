/** Grilla de precios por tarjeta: grid[slotKey][ciclo][país] = equivalente mensual. País "US" = "Otros países" (USD). */
export type LiveGrid = Record<string, Record<string, Record<string, number>>>;

const MONTHS: Record<string, number> = { mensual: 1, trimestral: 3, anual: 12 };
// Países de la landing: PE y MX con su moneda local; "otros países" (country_code null) solo en USD.
const CELL: { code: string | null; landing: string; currency: string }[] = [
  { code: "PE", landing: "PE", currency: "PEN" },
  { code: "MX", landing: "MX", currency: "MXN" },
  { code: null, landing: "US", currency: "USD" },
];

export interface LivePricingResult {
  grid: LiveGrid;
  /** País de la respuesta en términos de la landing: "PE", "MX" o "US" (= otros países, USD). */
  country: string;
}

/**
 * Convierte la respuesta de GET /signup/pricing (`{ country, currency, data }`) en grilla por tarjeta.
 * Devuelve null (el llamador usa el respaldo USD) si la respuesta no sirve: país que la landing no conoce, moneda que no
 * es la del país, o alguna tarjeta sin celdas para ese país (nunca se mezclan monedas ni países).
 * Precio no numérico o <= 0, ciclo desconocido o moneda distinta descartan la celda. El `promo` del API se ignora.
 * El API manda el TOTAL del ciclo; la landing muestra el equivalente mensual (total / 1, 3 o 12).
 */
export function parseLivePricing(body: unknown): LivePricingResult | null {
  const b = body as { country?: unknown; currency?: unknown; data?: unknown };
  const target = CELL.find((c) => c.code === (b?.country ?? null));
  if (!target || b?.currency !== target.currency || !Array.isArray(b.data) || b.data.length === 0) return null;
  const grid: LiveGrid = {};
  for (const row of b.data) {
    const slot = row?.slot;
    if (typeof slot !== "string" || !slot || !Array.isArray(row?.prices)) return null;
    for (const p of row.prices) {
      const months = MONTHS[p?.billing_cycle];
      const price = typeof p?.price === "number" ? p.price : NaN;
      if (!months || (p?.country_code ?? null) !== target.code || p?.currency !== target.currency || !Number.isFinite(price) || price <= 0) continue;
      ((grid[slot] ??= {})[p.billing_cycle] ??= {})[target.landing] = price / months; // sin redondear: mensual × meses vuelve al total exacto; se redondea solo al mostrar
    }
    if (!grid[slot]?.mensual?.[target.landing]) return null; // tarjeta sin celda para el país: se descarta todo
  }
  return { grid, country: target.landing };
}
