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
  /** Países de la landing con precio en TODAS las tarjetas ("PE", "MX", "US" = otros países), en ese orden. */
  available: string[];
}

/**
 * Convierte la respuesta de GET /signup/pricing (`{ data }`, todos los países) en grilla por tarjeta.
 * Un país entra solo si TODAS las tarjetas tienen su precio mensual (nunca se mezclan monedas en la vista).
 * Precio no numérico o <= 0, ciclo desconocido o moneda que no es la del país descartan la celda. El `promo` se ignora.
 * El API manda el TOTAL del ciclo; la landing guarda el equivalente mensual (total / 1, 3 o 12).
 * null = la respuesta no sirve para ningún país (el llamador usa el respaldo USD).
 */
export function parseLivePricing(body: unknown): LivePricingResult | null {
  const raw = (body as { data?: unknown })?.data;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const data: any[] = raw;
  const grid: LiveGrid = {};
  const available: string[] = [];
  for (const cell of CELL) {
    const own: LiveGrid = {};
    let complete = true;
    for (const row of data) {
      const slot = row?.slot;
      if (typeof slot !== "string" || !slot || !Array.isArray(row?.prices)) return null;
      for (const p of row.prices) {
        const months = MONTHS[p?.billing_cycle];
        const price = typeof p?.price === "number" ? p.price : NaN;
        if (!months || (p?.country_code ?? null) !== cell.code || p?.currency !== cell.currency || !Number.isFinite(price) || price <= 0) continue;
        ((own[slot] ??= {})[p.billing_cycle] ??= {})[cell.landing] = price / months; // sin redondear: se redondea solo al mostrar
      }
      if (!own[slot]?.mensual?.[cell.landing]) complete = false;
    }
    if (!complete) continue;
    available.push(cell.landing);
    for (const [slot, cycles] of Object.entries(own))
      for (const [cycle, byCountry] of Object.entries(cycles)) Object.assign((grid[slot] ??= {})[cycle] ??= {}, byCountry);
  }
  return available.length ? { grid, available } : null;
}
