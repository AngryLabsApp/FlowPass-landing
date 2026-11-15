/** Grilla de precios por tarjeta: grid[slotKey][ciclo][país] = equivalente mensual. País "US" = "Otros países" (USD). */
export type LiveGrid = Record<string, Record<string, Record<string, number>>>;

const MONTHS: Record<string, number> = { mensual: 1, trimestral: 3, anual: 12 };
// Países de la landing: PE y MX con su moneda local; "otros países" (country_code null) solo en USD.
const CELL: { code: string | null; landing: string; currency: string }[] = [
  { code: "PE", landing: "PE", currency: "PEN" },
  { code: "MX", landing: "MX", currency: "MXN" },
  { code: null, landing: "US", currency: "USD" },
];

/**
 * Convierte la respuesta de GET /signup/pricing en grilla por tarjeta. Lo que no sirve se descarta celda por celda
 * (el llamador usa su respaldo): precio no numérico o <= 0, ciclo desconocido, moneda que no es la del país.
 * Nunca mezcla monedas. El `promo` del API se ignora. Una key desconocida para la landing queda en la grilla pero nadie la lee.
 * El API manda el TOTAL del ciclo; la landing muestra el equivalente mensual (total / 1, 3 o 12), redondeado a 2 decimales.
 */
export function parseLivePricing(body: unknown): LiveGrid {
  const out: LiveGrid = {};
  const rows = (body as { data?: unknown })?.data;
  if (!Array.isArray(rows)) return out;
  for (const row of rows) {
    const slot = row?.slot;
    if (typeof slot !== "string" || !slot || !Array.isArray(row?.prices)) continue;
    for (const p of row.prices) {
      const months = MONTHS[p?.billing_cycle];
      const cell = CELL.find((c) => c.code === (p?.country_code ?? null));
      const price = typeof p?.price === "number" ? p.price : NaN;
      if (!months || !cell || p?.currency !== cell.currency || !Number.isFinite(price) || price <= 0) continue;
      ((out[slot] ??= {})[p.billing_cycle] ??= {})[cell.landing] = Math.round((price / months) * 100) / 100;
    }
  }
  return out;
}
