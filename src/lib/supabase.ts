import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "$env/dynamic/public";

// Cliente SOLO para crear cuentas (signUp) y reenviar el correo de confirmación.
// La sesión vive en el SaaS (app.flow-pass.com), nunca en la landing:
// - flowType "implicit": el enlace del correo se abre en otro dominio; con PKCE el
//   código solo se canjea en el mismo navegador y dominio donde se hizo signUp.
// - sin persistir ni detectar sesión en la URL.
// Variables en $env/dynamic/public: si faltan, no rompen el build (devuelve null).
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  if (!env.PUBLIC_SUPABASE_URL || !env.PUBLIC_SUPABASE_ANON_KEY) return null;
  client = createClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
    auth: { flowType: "implicit", persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}

/**
 * Registro self-service en la landing. Una variable JSON por ambiente:
 * PUBLIC_SIGNUP={"trial_days":14,"plans":{"pocket":"plan_pocket","lite":"plan_lite"}}
 * - trial_days: muestra "Pruébalo gratis N días" (menú y precios). Mismo número que el plan de prueba del SaaS.
 * - plans: plan de la landing (`pricingData.js`) → `tier_key` del catálogo. Un plan que no está sigue yendo a /agenda.
 * Sin la variable (o con el JSON mal escrito) la landing se ve como antes: todo va a /agenda.
 */
function signupConfig(): { trial_days?: number; plans?: Record<string, string> } {
  try {
    return JSON.parse(env.PUBLIC_SIGNUP || "{}");
  } catch {
    return {};
  }
}

export function signupTierKey(landingPlanId: string): string | null {
  return signupConfig().plans?.[landingPlanId] || null;
}

/** Al revés que signupTierKey: `tier_key` del catálogo → plan de la landing (para mostrar su nombre). */
export function signupLandingPlanId(tierKey: string): string | null {
  return Object.entries(signupConfig().plans ?? {}).find(([, key]) => key === tierKey)?.[0] ?? null;
}

/** Días de la prueba gratis; null = no se muestra el botón de prueba. */
export function signupTrialDays(): number | null {
  const days = Number(signupConfig().trial_days);
  return days > 0 ? days : null;
}

/** A dónde lleva el enlace del correo. Fase 1: /registro/confirmado (landing). Fase 2: el SaaS. */
export function signupRedirectUrl(): string {
  return env.PUBLIC_SIGNUP_REDIRECT_URL || `${location.origin}/registro/confirmado`;
}
