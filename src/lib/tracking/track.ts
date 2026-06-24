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
 * Click en cualquier botón "Agendar demo" del sitio (Hero, Navbar
 * desktop/mobile, ContactSection).
 *
 * **Para comercial:** persona mostró INTENCIÓN de agendar una demo
 * (clickeó el botón) pero todavía no llenó el form. Es prospect
 * tibio: vio el sitio, le interesó, pero no se comprometió aún.
 *
 * Funnel paso 1 — INTENT. El botón dispara esto y luego navega
 * a `/agenda`. La conversión real la dispara `trackLead` cuando
 * la persona completa el form de captación.
 *
 * Si ves Schedule >> Lead en reportes, hay drop-off en el form
 * (algo del form los espanta).
 *
 * Aparece en Meta como "Schedule", en GA4 como `schedule_demo_click`.
 */
export function trackSchedule(source: string) {
  fire('Schedule', null, 'schedule_demo_click', { source });
}

/**
 * Click en botón de WhatsApp / "Escríbenos" (burbuja flotante, Hero,
 * ContactSection, etc.).
 *
 * **Para comercial:** persona quiere chatear ya. No es tan calificado
 * como un Lead (no completó el form), pero es alta intención.
 * Útil para medir interés en canal WhatsApp y para reaching warm
 * audiences en campañas.
 *
 * Aparece en Meta como "Contacto" y en GA4 como `whatsapp_click`.
 */
export function trackContact(source: string) {
  fire('Contact', null, 'whatsapp_click', { source, method: 'whatsapp' });
}

/**
 * Click en correo electrónico (mailto:) — botones de "Escríbenos por mail",
 * pie de página, ContactSection.
 *
 * **Para comercial:** persona prefiere mail antes que WhatsApp.
 * Suele ser perfil más formal (B2B, owners corporativos).
 *
 * Aparece en Meta como "Contacto" y en GA4 como `email_click`.
 */
export function trackEmailClick(source: string) {
  fire('Contact', null, 'email_click', { source, method: 'email' });
}

/**
 * Click en botón "Ingresar" del navbar — lleva a la plataforma FlowPass.
 *
 * **Para comercial:** son clientes que YA tienen cuenta entrando al sistema.
 * No es lead nuevo. Ayuda a separar "tráfico de clientes activos" del
 * "tráfico de prospectos" en GA4.
 *
 * Evento custom (`LoginClick` en Meta, `login_click` en GA4).
 */
export function trackLogin(source: string) {
  fire(null, 'LoginClick', 'login_click', { source });
}

/**
 * Click en botón "Crear acceso directo" — el user pidió instalar la PWA.
 *
 * **Para comercial:** intención de instalar. NO confirma que instaló
 * (el sistema operativo puede cancelar o el user rechazar).
 * Pareja con `trackPwaInstalled` (la instalación real).
 *
 * Evento custom (`PwaInstallClick` / `pwa_install_click`).
 */
export function trackPwaInstallClick(source: string) {
  fire(null, 'PwaInstallClick', 'pwa_install_click', { source });
}

/**
 * El navegador confirmó que la PWA quedó instalada (prompt aceptado).
 *
 * **Para comercial:** usuario instaló FlowPass como app. Es señal fuerte
 * de engagement — vuelve más rápido a la plataforma. Se considera Lead
 * en Meta porque indica compromiso con la marca.
 *
 * Aparece en Meta como "Lead" + `PwaInstall` (custom), en GA4 como
 * `pwa_install_success`.
 */
export function trackPwaInstalled(source: string) {
  fire('Lead', 'PwaInstall', 'pwa_install_success', { source });
}

/**
 * El form de captación `/agenda` se envió con éxito.
 *
 * **Para comercial:** ESTE es el evento que importa. La persona
 * llenó nombre, WhatsApp, país, tipo de academia, alumnos, etc. y el
 * webhook de n8n confirmó recepción → lead calificado entró a la
 * base. Inicia contacto comercial.
 *
 * Funnel paso 2 — CONVERSION. Solo dispara si el POST al webhook
 * responde 2xx. Pasa params del lead (`pais`, `tipo_academia`,
 * `alumnos`, `fuente`) para que Meta Ads y GA4 segmenten audiencias
 * (ej: "leads de Perú con +200 alumnos").
 *
 * Pareja conceptual con `trackSchedule`. La ratio Lead / Schedule =
 * tasa de conversión del form (ideal >40%).
 *
 * Aparece en Meta como "Lead" (evento estándar de conversión), en
 * GA4 como `generate_lead` (evento estándar de conversión).
 */
export function trackLead(source: string, params: Record<string, unknown> = {}) {
  fire('Lead', null, 'generate_lead', { source, ...params });
}
