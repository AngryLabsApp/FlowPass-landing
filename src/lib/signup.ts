import { env } from "$env/dynamic/public";

/**
 * Crea la cuenta del registro por el API (POST /signup/account), que revisa el captcha (Turnstile) y envía el correo
 * de confirmación. La landing ya no habla con Supabase: en Supabase el registro público está apagado y la única puerta
 * es el API. El enlace del correo lleva al SaaS (`/auth/confirmar`), que es donde vive la sesión.
 * Mismo endpoint para "Reenviar correo": si la cuenta existe sin confirmar, el API manda un enlace nuevo.
 * Responde igual exista o no el correo. `code`: "captcha_failed" | "weak_password" | "rate_limited" | "unavailable" | "error".
 */
export async function createSignupAccount(body: {
  email: string;
  password: string;
  captcha_token: string;
  metadata?: Record<string, string | null | undefined>;
}): Promise<{ ok: true } | { ok: false; code: string; message?: string }> {
  if (!env.PUBLIC_API_URL) return { ok: false, code: "unavailable" };
  // El API solo acepta textos: los datos vacíos van como "".
  const metadata = Object.fromEntries(Object.entries(body.metadata ?? {}).map(([k, v]) => [k, v ?? ""]));
  try {
    const res = await fetch(`${env.PUBLIC_API_URL.replace(/\/$/, "")}/signup/account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, metadata }),
    });
    if (res.ok) return { ok: true };
    if (res.status === 429) return { ok: false, code: "rate_limited" };
    if (res.status === 404) return { ok: false, code: "unavailable" };
    const data = (await res.json().catch(() => null)) as { code?: string; error?: string } | null;
    return { ok: false, code: data?.code ?? "error", message: data?.error };
  } catch {
    return { ok: false, code: "error" };
  }
}

/**
 * Registro self-service en la landing. Una variable JSON por ambiente:
 * PUBLIC_SIGNUP={"self_service":true,"trial_days":14,"plans":{"pocket":"plan_pocket","lite":"plan_lite"}}
 * - self_service: registro abierto. Sin él (o false), todo va a /agenda y /registro solo sirve con link de invitación.
 * - trial_days: muestra "Pruébalo gratis N días" (menú y precios). Mismo número que el plan de prueba del SaaS.
 * - plans: plan de la landing (`pricingData.js`) → `tier_key` del catálogo. Un plan que no está sigue yendo a /agenda.
 * Sin la variable (o con el JSON mal escrito) la landing se ve como antes: todo va a /agenda.
 */
function signupConfig(): { self_service?: boolean; trial_days?: number; plans?: Record<string, string> } {
  try {
    return JSON.parse(env.PUBLIC_SIGNUP || "{}");
  } catch {
    return {};
  }
}

/** Registro abierto (`self_service: true`). Apagado: botones a /agenda, sin "Pruébalo gratis"; solo funciona el link de invitación. */
export function signupSelfService(): boolean {
  return signupConfig().self_service === true;
}

export function signupTierKey(landingPlanId: string): string | null {
  return signupSelfService() ? signupConfig().plans?.[landingPlanId] || null : null;
}

/**
 * Países donde se puede crear una cuenta: los decide el API (`GET /signup/countries`, variable SIGNUP.countries), no la
 * landing. El resto va a /agenda guardando su país. Si el API falla o no responde, solo PE y MX (nunca se abre un país por
 * un error de red). `signupOpenFor` es síncrono y usa lo ya cargado: llamar antes a `loadSignupCountries()` (onMount).
 */
const FALLBACK_COUNTRIES = ["PE", "MX"];
const COUNTRIES_CACHE_KEY = "fp_signup_countries";
let enabledCountries: string[] = FALLBACK_COUNTRIES;
let countriesLoad: Promise<string[]> | null = null;

export function loadSignupCountries(): Promise<string[]> {
  countriesLoad ??= (async () => {
    try {
      const cached = sessionStorage.getItem(COUNTRIES_CACHE_KEY);
      if (cached) return (enabledCountries = JSON.parse(cached) as string[]);
      if (!env.PUBLIC_API_URL) return enabledCountries;
      const res = await fetch(`${env.PUBLIC_API_URL.replace(/\/$/, "")}/signup/countries`);
      if (!res.ok) return enabledCountries; // 404 (API anterior o registro apagado) u otro error: PE y MX
      const list = ((await res.json()) as { data: { code: string }[] }).data.map((c) => c.code);
      if (list.length) {
        enabledCountries = list;
        sessionStorage.setItem(COUNTRIES_CACHE_KEY, JSON.stringify(list));
      }
    } catch {
      // sin red: se queda el fallback
    }
    return enabledCountries;
  })();
  return countriesLoad;
}

export function signupOpenFor(country: string | null | undefined): boolean {
  return signupSelfService() && enabledCountries.includes((country ?? "").toUpperCase());
}

/** Al revés que signupTierKey: `tier_key` del catálogo → plan de la landing (para mostrar su nombre). */
export function signupLandingPlanId(tierKey: string): string | null {
  return Object.entries(signupConfig().plans ?? {}).find(([, key]) => key === tierKey)?.[0] ?? null;
}

/** Días de la prueba gratis; null = no se muestra el botón de prueba. */
export function signupTrialDays(): number | null {
  if (!signupSelfService()) return null;
  const days = Number(signupConfig().trial_days);
  return days > 0 ? days : null;
}
