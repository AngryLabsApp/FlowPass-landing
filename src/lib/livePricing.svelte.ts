import { env } from "$env/dynamic/public";
import { parseLivePricing, type LiveGrid } from "$lib/livePricingParse";
import { trackPricingFallback } from "$lib/tracking/track";

/** Espera máxima por intento. Con conexiones lentas (móvil) 2 s no alcanzaba y se mostraba USD aunque el API detectara el país. */
const PRICING_TIMEOUT_MS = 6000;

/** Estado de la carga de precios. Mientras LOADING la UI muestra skeleton (nunca USD de paso). */
export const LIVE_PRICING_STATUS = { LOADING: "loading", READY: "ready", FALLBACK: "fallback" } as const;
export type LivePricingStatus = (typeof LIVE_PRICING_STATUS)[keyof typeof LIVE_PRICING_STATUS];

/**
 * Precios vivos por país (GET /signup/pricing: el API detecta el país por IP). Solo en el navegador: la landing se
 * prerenderiza, así que el HTML estático sale en LOADING (skeleton). Si la red falla o tarda más de 6 s se reintenta
 * una vez; si vuelve a fallar (o la respuesta es rara, o no hay URL) pasa a FALLBACK = USD de `pricingData.js`. `pricingData.js` lee `livePricing.grid` antes que su grilla USD.
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

const fallback = (reason: string) => {
  trackPricingFallback(reason);
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
  if (!env.PUBLIC_API_URL) return fallback("no_api_url");
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
    const url = `${env.PUBLIC_API_URL.replace(/\/$/, "")}/signup/pricing`;
    // Un reintento solo ante fallo de red o timeout (no ante una respuesta del API: esa no cambia al repetir).
    const res = await fetch(url, { headers, cache, signal: AbortSignal.timeout(PRICING_TIMEOUT_MS) }).catch(() =>
      fetch(url, { headers, cache, signal: AbortSignal.timeout(PRICING_TIMEOUT_MS) }),
    );
    if (!res.ok) return fallback(`http_${res.status}`);
    const body = await res.json();
    const detected = (body as { detected_country?: unknown } | null)?.detected_country;
    livePricing.detectedCountry = typeof detected === "string" && /^[A-Z]{2}$/.test(detected) ? detected : "";
    const parsed = parseLivePricing(body);
    if (!parsed) return fallback("parse");
    livePricing.country = parsed.country;
    livePricing.grid = parsed.grid;
    livePricing.status = LIVE_PRICING_STATUS.READY;
  } catch (e) {
    fallback((e as Error)?.name === "TimeoutError" ? "timeout" : "network");
  }
}
