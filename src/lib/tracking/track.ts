// Tracking unificado — un solo punto que dispara eventos a Meta Pixel + GA4.
//
// Si más adelante agregas TikTok Pixel, LinkedIn Insight, etc., solo
// extiendes las funciones de abajo: los componentes siguen llamando
// `trackContact()` o `trackSchedule()` sin enterarse.

import { browser, dev } from '$app/environment';

type FbqArgs = readonly unknown[];
type GtagArgs = readonly unknown[];

declare global {
  interface Window {
    fbq?: (...args: FbqArgs) => void;
    gtag?: (...args: GtagArgs) => void;
  }
}

/**
 * Helper interno: envía evento a Meta Pixel + Google Analytics.
 * - `fbStandard`: nombre de evento estándar de Meta (Lead, Contact, Schedule, etc.).
 *   Usa `null` si quieres un CustomEvent en su lugar.
 * - `fbCustom`: nombre custom si no hay equivalente estándar.
 * - `gaEvent`: nombre del evento en GA4 (snake_case por convención).
 * - `params`: payload opcional con detalles (source, plan, etc.).
 */
function fire(
  fbStandard: string | null,
  fbCustom: string | null,
  gaEvent: string,
  params: Record<string, unknown> = {}
) {
  if (!browser) return;
  if (dev) {
    console.debug('[track]', { fbStandard, fbCustom, gaEvent, params });
    return;
  }

  // Meta Pixel
  try {
    if (window.fbq) {
      if (fbStandard) {
        window.fbq('track', fbStandard, params);
      } else if (fbCustom) {
        window.fbq('trackCustom', fbCustom, params);
      }
    }
  } catch (e) {
    // never let analytics break the UI
    console.warn('Meta Pixel error', e);
  }

  // Google Analytics 4
  try {
    window.gtag?.('event', gaEvent, params);
  } catch (e) {
    console.warn('GA event error', e);
  }
}

// ─── Eventos de negocio ──────────────────────────────────────────

/**
 * Click en cualquier botón "Agendar demo" del sitio.
 *
 * Funnel paso 1 — INTENT. Mide cuántos quieren agendar.
 * Los botones disparan esto y luego navegan a `/agenda` (el form).
 * La conversión real la dispara `trackLead` cuando el form se envía.
 *
 * Si ves Schedule >> Lead en reportes, hay drop-off en el form.
 */
export function trackSchedule(source: string) {
  fire('Schedule', null, 'schedule_demo_click', { source });
}

/** Click en WhatsApp / "Escríbenos". */
export function trackContact(source: string) {
  fire('Contact', null, 'whatsapp_click', { source, method: 'whatsapp' });
}

/** Click en correo electrónico (mailto). */
export function trackEmailClick(source: string) {
  fire('Contact', null, 'email_click', { source, method: 'email' });
}

/** Click en botón "Ingresar" hacia la plataforma. */
export function trackLogin(source: string) {
  fire(null, 'LoginClick', 'login_click', { source });
}

/** Click en botón "Crear acceso directo" — intent, no instalación todavía. */
export function trackPwaInstallClick(source: string) {
  fire(null, 'PwaInstallClick', 'pwa_install_click', { source });
}

/** Usuario aceptó el prompt y la PWA quedó instalada. */
export function trackPwaInstalled(source: string) {
  fire('Lead', 'PwaInstall', 'pwa_install_success', { source });
}

/**
 * Form de captación enviado con éxito (lead calificado).
 *
 * Funnel paso 2 — CONVERSION. Solo dispara si el POST al webhook
 * de n8n responde 2xx. Pasa params del lead (pais, tipo_academia,
 * alumnos, fuente) para que Meta Ads y GA4 puedan segmentar.
 *
 * Pareja conceptual de `trackSchedule` (intent). Ratio Lead/Schedule
 * = tasa de conversión del form.
 */
export function trackLead(source: string, params: Record<string, unknown> = {}) {
  fire('Lead', null, 'generate_lead', { source, ...params });
}
