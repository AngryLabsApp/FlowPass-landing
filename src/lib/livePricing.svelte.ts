import { env } from "$env/dynamic/public";
import { parseLivePricing, type LiveGrid } from "$lib/livePricingParse";

/** Estado de la carga de precios. Mientras LOADING la UI muestra skeleton (nunca USD de paso). */
export const LIVE_PRICING_STATUS = { LOADING: "loading", READY: "ready", FALLBACK: "fallback" } as const;
export type LivePricingStatus = (typeof LIVE_PRICING_STATUS)[keyof typeof LIVE_PRICING_STATUS];

/**
 * Precios vivos por país (GET /signup/pricing: el API detecta el país por IP). Solo en el navegador: la landing se
 * prerenderiza, así que el HTML estático sale en LOADING (skeleton). Cualquier fallo (sin URL, caído, lento >2 s,
 * respuesta rara) pasa a FALLBACK = USD de `pricingData.js`. `pricingData.js` lee `livePricing.grid` antes que su grilla USD.
 * `country`: "PE" | "MX" | "US" (US = otros países, USD).
 * `detectedCountry`: país que el API detectó por IP aunque no tenga precio propio (ej. "AR"); "" si no se reconoció.
 * Sirve para sugerir el país del registro; los precios siguen saliendo de `country`.
 */
export const livePricing = $state<{ status: LivePricingStatus; country: string; detectedCountry: string; grid: LiveGrid }>({
  status: LIVE_PRICING_STATUS.LOADING,
  country: "US",
  detectedCountry: "",
  grid: {},
});

const fallback = () => {
  livePricing.country = "US";
  livePricing.grid = {};
  livePricing.status = LIVE_PRICING_STATUS.FALLBACK;
};

let inflight: Promise<void> | null = null;
/** Una sola llamada al API; quien la pida de nuevo recibe la misma promesa (los componentes esperan con `await`). */
export function loadLivePricing(): Promise<void> {
  return (inflight ??= load());
}

async function load(): Promise<void> {
  if (!env.PUBLIC_API_URL) return fallback();
  try {
    const headers: Record<string, string> = {};
    let cache: RequestCache = "default";
    // Solo en desarrollo: simula el país con ?debug_country=PE (el API ignora el header si ENV=prod).
    if (import.meta.env.DEV) {
      const dbg = new URLSearchParams(location.search).get("debug_country");
      if (dbg) {
        headers["x-debug-country"] = dbg;
        cache = "no-store"; // la URL no cambia con el header: sin esto el navegador reutiliza otra simulación
      }
    }
    const res = await fetch(`${env.PUBLIC_API_URL.replace(/\/$/, "")}/signup/pricing`, { headers, cache, signal: AbortSignal.timeout(2000) });
    const body = res.ok ? await res.json() : null;
    const detected = (body as { detected_country?: unknown } | null)?.detected_country;
    livePricing.detectedCountry = typeof detected === "string" && /^[A-Z]{2}$/.test(detected) ? detected : "";
    const parsed = body ? parseLivePricing(body) : null;
    if (!parsed) return fallback();
    livePricing.country = parsed.country;
    livePricing.grid = parsed.grid;
    livePricing.status = LIVE_PRICING_STATUS.READY;
  } catch {
    fallback();
  }
}
