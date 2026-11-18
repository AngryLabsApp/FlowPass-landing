import { env } from "$env/dynamic/public";
import { DEFAULT_PRICE_KEY, parseLivePricing, type LiveGrid } from "$lib/livePricingParse";
import { trackPricingFallback } from "$lib/tracking/track";
import { COUNTRY_NAMES, detectCountryCode } from "$lib/utils/country";
import { loadSignupCountries } from "$lib/signup";

/** Una opción del selector "Precios para…": un país y con qué precios se le muestra. */
export interface PricingOption {
  /** País elegido ("CO") o "US" = otros países. Es el país con el que se registra. */
  code: string;
  label: string;
  /** Clave de la grilla: el mismo país si tiene precio propio, si no "US" (precio por defecto en USD). */
  priceKey: string;
  currency: string;
}

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
 * `country`: país elegido ("PE", "CO"… o "US" = otros países): el del selector, si no el de la zona horaria del navegador,
 * si no "US". Nunca la IP (VPN, bloqueadores y redes la falsean). Es el país con el que se registra.
 * `priceKey`: con qué precios se le muestra (su país si tiene precio propio en el Admin; si no "US", en USD).
 * `options`: el selector = países con precio propio + países abiertos al registro sin precio propio (en USD) + otros países.
 * `currencies`: moneda de cada `priceKey`.
 */
const DEFAULT_OPTION: PricingOption = { code: DEFAULT_PRICE_KEY, label: COUNTRY_NAMES.US, priceKey: DEFAULT_PRICE_KEY, currency: "USD" };
export const livePricing = $state<{
  status: LivePricingStatus;
  country: string;
  priceKey: string;
  options: PricingOption[];
  currencies: Record<string, string>;
  grid: LiveGrid;
}>({
  status: LIVE_PRICING_STATUS.LOADING,
  country: DEFAULT_PRICE_KEY,
  priceKey: DEFAULT_PRICE_KEY,
  options: [DEFAULT_OPTION],
  currencies: { [DEFAULT_PRICE_KEY]: "USD" },
  grid: {},
});

function storedCountry(): string {
  try {
    return localStorage.getItem(COUNTRY_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Aplica una opción del selector (sin recordarla). false si no existe. */
function applyCountry(code: string): boolean {
  const option = livePricing.options.find((o) => o.code === code);
  if (!option) return false;
  livePricing.country = option.code;
  livePricing.priceKey = option.priceKey;
  return true;
}

/** Cambia el país de los precios (selector) y lo recuerda en este navegador. */
export function setPricingCountry(code: string) {
  if (!applyCountry(code)) return;
  try {
    localStorage.setItem(COUNTRY_KEY, code);
  } catch {
    // navegación privada: solo dura esta visita
  }
}

const fallback = (reason: string) => {
  trackPricingFallback(reason);
  livePricing.country = DEFAULT_PRICE_KEY;
  livePricing.priceKey = DEFAULT_PRICE_KEY;
  livePricing.options = [DEFAULT_OPTION];
  livePricing.currencies = { [DEFAULT_PRICE_KEY]: "USD" };
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
    const [res, signupCountries] = await Promise.all([
      fetch(url, { signal: AbortSignal.timeout(PRICING_TIMEOUT_MS) }).catch(() =>
        fetch(url, { signal: AbortSignal.timeout(PRICING_TIMEOUT_MS) }),
      ),
      loadSignupCountries(), // nunca falla: sin API quedan PE y MX
    ]);
    if (!res.ok) return fallback(`http_${res.status}`);
    const parsed = parseLivePricing(await res.json());
    if (!parsed) return fallback("parse");
    const options = buildOptions(parsed.available, parsed.currencies, signupCountries);
    const pick = [storedCountry(), detectCountryCode()].find((c) => c && options.some((o) => o.code === c));
    livePricing.options = options;
    livePricing.currencies = parsed.currencies;
    livePricing.grid = parsed.grid;
    applyCountry(pick ?? (options.some((o) => o.code === DEFAULT_PRICE_KEY) ? DEFAULT_PRICE_KEY : options[0].code));
    livePricing.status = LIVE_PRICING_STATUS.READY;
  } catch (e) {
    fallback((e as Error)?.name === "TimeoutError" ? "timeout" : "network");
  }
}

/**
 * Opciones del selector, en este orden: países con precio propio, países abiertos al registro que pagan en USD
 * (si hay precio por defecto) y "Otros países". Así quien entra de Colombia ve "Colombia" aunque aún no tenga precio en COP.
 */
export function buildOptions(available: string[], currencies: Record<string, string>, signupCountries: string[]): PricingOption[] {
  const name = (code: string) => COUNTRY_NAMES[code] ?? code;
  const own = available
    .filter((k) => k !== DEFAULT_PRICE_KEY)
    .map((k) => ({ code: k, label: name(k), priceKey: k, currency: currencies[k] }));
  if (!available.includes(DEFAULT_PRICE_KEY)) return own;
  const inUsd = signupCountries
    .filter((c) => !available.includes(c))
    .map((c) => ({ code: c, label: name(c), priceKey: DEFAULT_PRICE_KEY, currency: currencies[DEFAULT_PRICE_KEY] }))
    .sort((a, b) => a.label.localeCompare(b.label, "es"));
  return [...own, ...inUsd, { ...DEFAULT_OPTION, currency: currencies[DEFAULT_PRICE_KEY] }];
}
