import { env } from "$env/dynamic/public";
import { parseLivePricing, type LiveGrid } from "$lib/livePricingParse";

/**
 * Precios vivos desde Admin (GET /signup/pricing). Solo en el navegador: la landing se prerenderiza, así que HTML,
 * SEO y llms-full quedan con los precios de `pricingData.js` (respaldo). Cualquier fallo (sin URL, caído, lento >2 s,
 * respuesta rara) deja todo como estaba. `pricingData.js` lee `livePricing.grid` antes que su grilla fija.
 */
export const livePricing = $state<{ grid: LiveGrid }>({ grid: {} });

let started = false;
export async function loadLivePricing(): Promise<void> {
  if (started || !env.PUBLIC_API_URL) return;
  started = true;
  try {
    const res = await fetch(`${env.PUBLIC_API_URL.replace(/\/$/, "")}/signup/pricing`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) livePricing.grid = parseLivePricing(await res.json());
  } catch {
    /* respaldo */
  }
}
