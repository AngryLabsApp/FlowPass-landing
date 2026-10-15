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

/** A dónde lleva el enlace del correo. Fase 1: /registro/confirmado (landing). Fase 2: el SaaS. */
export function signupRedirectUrl(): string {
  return env.PUBLIC_SIGNUP_REDIRECT_URL || `${location.origin}/registro/confirmado`;
}
