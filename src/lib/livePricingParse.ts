/** Grilla de precios por tarjeta: grid[slotKey][ciclo][país] = equivalente mensual. País "US" = "Otros países" (USD). */
export type LiveGrid = Record<string, Record<string, Record<string, number>>>;

const MONTHS: Record<string, number> = { mensual: 1, trimestral: 3, anual: 12 };
/** Clave de la grilla para el precio por defecto (`country_code` null): "Otros países", en USD. */
export const DEFAULT_PRICE_KEY = "US";
const DEFAULT_CURRENCY = "USD";

export interface LivePricingResult {
  grid: LiveGrid;
  /** Claves con precio en TODAS las tarjetas: los países con precio propio ("PE", "MX", "CO"…) y "US" (por defecto, USD). */
  available: string[];
  /** Moneda de cada clave, la que manda el API (la deriva el servidor del país). */
  currencies: Record<string, string>;
}

/**
 * Convierte la respuesta de GET /signup/pricing (`{ data }`, todos los países) en grilla por tarjeta.
 * Los países salen de los datos (no hay lista fija): uno nuevo con precio en el Admin aparece solo.
 * Un país entra solo si TODAS las tarjetas tienen su precio mensual (nunca se mezclan monedas en la vista), y con una
 * sola moneda. Precio no numérico o <= 0 o ciclo desconocido descartan la celda. El `promo` se ignora.
 * El API manda el TOTAL del ciclo; la landing guarda el equivalente mensual (total / 1, 3 o 12).
 * null = la respuesta no sirve para ningún país (el llamador usa el respaldo USD).
 */
export function parseLivePricing(body: unknown): LivePricingResult | null {
  const raw = (body as { data?: unknown })?.data;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const data: any[] = raw;
  const own: Record<string, LiveGrid> = {};
  const currencies: Record<string, string> = {};
  const mixed = new Set<string>();
  for (const row of data) {
    const slot = row?.slot;
    if (typeof slot !== "string" || !slot || !Array.isArray(row?.prices)) return null;
    for (const p of row.prices) {
      const months = MONTHS[p?.billing_cycle];
      const price = typeof p?.price === "number" ? p.price : NaN;
      const key = p?.country_code == null ? DEFAULT_PRICE_KEY : String(p.country_code).toUpperCase();
      const currency = typeof p?.currency === "string" ? p.currency : "";
      if (!months || !/^[A-Z]{2}$/.test(key) || !/^[A-Z]{3}$/.test(currency) || !Number.isFinite(price) || price <= 0) continue;
      if (key === DEFAULT_PRICE_KEY && currency !== DEFAULT_CURRENCY) continue;
      if (currencies[key] && currencies[key] !== currency) mixed.add(key);
      currencies[key] ??= currency;
      (((own[key] ??= {})[slot] ??= {})[p.billing_cycle] ??= {})[key] = price / months; // sin redondear: se redondea solo al mostrar
    }
  }
  const slots = data.map((r) => r.slot as string);
  const grid: LiveGrid = {};
  const available: string[] = [];
  for (const [key, g] of Object.entries(own)) {
    if (mixed.has(key) || !slots.every((slot) => g[slot]?.mensual?.[key])) continue; // tarjeta sin precio o dos monedas: fuera
    available.push(key);
    for (const [slot, cycles] of Object.entries(g))
      for (const [cycle, byKey] of Object.entries(cycles)) Object.assign((grid[slot] ??= {})[cycle] ??= {}, byKey);
  }
  if (!available.length) return null;
  const used = Object.fromEntries(available.map((k) => [k, currencies[k]]));
  return { grid, available, currencies: used };
}
