import { env } from "$env/dynamic/public";
import { parseLivePricing, type LiveGrid } from "$lib/livePricingParse";
import { trackPricingFallback } from "$lib/tracking/track";
import { detectCountry } from "$lib/utils/country";

/** Elección del visitante en el selector "Precios para…" (solo en su navegador). */
const COUNTRY_KEY = "fp:pricing-country";

/** Espera máxima por intento. Con conexiones lentas (móvil) 2 s no alcanzaba y se mostraba USD aunque el API detectara el país. */
const PRICING_TIMEOUT_MS = 6000;

/** Estado de la carga de precios. Mientras LOADING la UI muestra skeleton (nunca USD de paso). */
export const LIVE_PRICING_STATUS = { LOADING: "loading", READY: "ready", FALLBACK: "fallback" } as const;
export type LivePricingStatus = (typeof LIVE_PRICING_STATUS)[keyof typeof LIVE_PRICING_STATUS];

/**
 * Precios vivos de todos los países (GET /signup/pricing). Solo en el navegador: la landing se
 * prerenderiza, así que el HTML estático sale en LOADING (skeleton). Si la red falla o tarda más de 6 s se reintenta
 * una vez; si vuelve a fallar (o la respuesta es rara, o no hay URL) pasa a FALLBACK = USD de `pricingData.js`. `pricingData.js` lee `livePricing.grid` antes que su grilla USD.
 * `country`: país cuyos precios se muestran, "PE" | "MX" | "US" (US = otros países, USD): el que eligió el visitante en
 * el selector, si no el de la zona horaria de su navegador, si no "US". Nunca la IP (VPN, bloqueadores y redes la falsean).
 * `available`: países con precio en todas las tarjetas (las opciones del selector).
 */
export const livePricing = $state<{ status: LivePricingStatus; country: string; available: string[]; grid: LiveGrid }>({
  status: LIVE_PRICING_STATUS.LOADING,
  country: "US",
  available: ["US"],
  grid: {},
});

function storedCountry(): string {
  try {
    return localStorage.getItem(COUNTRY_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Cambia el país de los precios (selector) y lo recuerda en este navegador. */
export function setPricingCountry(code: string) {
  if (!livePricing.available.includes(code)) return;
  livePricing.country = code;
  try {
    localStorage.setItem(COUNTRY_KEY, code);
  } catch {
    // navegación privada: solo dura esta visita
  }
}

const fallback = (reason: string) => {
  trackPricingFallback(reason);
  livePricing.country = "US";
  livePricing.available = ["US"];
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
    const url = `${env.PUBLIC_API_URL.replace(/\/$/, "")}/signup/pricing`;
    // Un reintento solo ante fallo de red o timeout (no ante una respuesta del API: esa no cambia al repetir).
    const res = await fetch(url, { signal: AbortSignal.timeout(PRICING_TIMEOUT_MS) }).catch(() =>
      fetch(url, { signal: AbortSignal.timeout(PRICING_TIMEOUT_MS) }),
    );
    if (!res.ok) return fallback(`http_${res.status}`);
    const parsed = parseLivePricing(await res.json());
    if (!parsed) return fallback("parse");
    const pick = [storedCountry(), detectCountry("US")].find((c) => parsed.available.includes(c));
    livePricing.available = parsed.available;
    livePricing.country = pick ?? (parsed.available.includes("US") ? "US" : parsed.available[0]);
    livePricing.grid = parsed.grid;
    livePricing.status = LIVE_PRICING_STATUS.READY;
  } catch (e) {
    fallback((e as Error)?.name === "TimeoutError" ? "timeout" : "network");
  }
}
