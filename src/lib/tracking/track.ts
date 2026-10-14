// Tracking unificado — un solo punto que dispara eventos a Meta Pixel + GA4.
//
// Si más adelante agregas TikTok Pixel, LinkedIn Insight, etc., solo
// extiendes las funciones de abajo: los componentes siguen llamando
// `trackContact()` o `trackBooking()` sin enterarse.

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
 * - `eventID`: opcional. Si el mismo evento también llega por la API de
 *   conversiones (n8n), Meta usa este ID para no contarlo dos veces.
 */
function fire(
  fbStandard: string | null,
  fbCustom: string | null,
  gaEvent: string,
  params: Record<string, unknown> = {},
  eventID?: string
) {
  if (!browser) return;
  if (dev) {
    console.debug('[track]', { fbStandard, fbCustom, gaEvent, params });
    return;
  }

  // Meta Pixel
  try {
    if (window.fbq) {
      const opts = eventID ? [{ eventID }] : [];
      if (fbStandard) {
        window.fbq('track', fbStandard, params, ...opts);
      } else if (fbCustom) {
        window.fbq('trackCustom', fbCustom, params, ...opts);
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
 * Click en cualquier botón "Agenda 15 min" del sitio (Hero, Navbar,
 * precios, cierres de sección, páginas de disciplina).
 *
 * **Para comercial:** persona mostró INTENCIÓN de agendar (clickeó el
 * botón) pero todavía no eligió horario. Prospect tibio.
 *
 * Funnel paso 1 — INTENT. El botón dispara esto y luego navega a
 * `/agenda`. La reserva real la dispara `trackBooking`.
 *
 * Si ves AgendaClick >> Schedule en reportes, hay drop-off en el
 * calendario.
 *
 * Aparece en Meta como `AgendaClick` (custom), en GA4 como
 * `schedule_demo_click`.
 */
export function trackAgendaClick(source: string) {
  fire(null, 'AgendaClick', 'schedule_demo_click', { source });
}

/**
 * Reserva confirmada en el calendario de Cal.com (`/agenda`).
 *
 * **Para comercial:** la persona eligió día y hora: tiene reunión.
 * Es la conversión más fuerte del sitio.
 *
 * Funnel paso 2 — CONVERSION (agenda). Distinto de `trackLead`, que es
 * dejar datos para que un asesor escriba.
 *
 * `bookingUid` (el uid de la reserva en Cal.com) va como eventID: n8n
 * manda el mismo Schedule por la API de conversiones con ese uid y Meta
 * deduplica.
 *
 * Aparece en Meta como "Schedule" (evento estándar), en GA4 como
 * `schedule_booked`.
 */
export function trackBooking(
  source: string,
  params: Record<string, unknown> = {},
  bookingUid?: string
) {
  fire('Schedule', null, 'schedule_booked', { source, ...params }, bookingUid);
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
 * de engagement — vuelve más rápido a la plataforma. NO es un lead nuevo
 * (casi siempre es un cliente que ya usa FlowPass), por eso no va como Lead.
 *
 * Aparece en Meta como `PwaInstall` (custom), en GA4 como
 * `pwa_install_success`.
 */
export function trackPwaInstalled(source: string) {
  fire(null, 'PwaInstall', 'pwa_install_success', { source });
}

/**
 * El form de captación `/te-llamamos` se envió con éxito.
 *
 * **Para comercial:** la persona llenó nombre, WhatsApp, país, tipo
 * de academia, alumnos, etc. y el webhook de n8n confirmó recepción →
 * lead entró a la base. Un asesor le escribe por WhatsApp.
 *
 * Funnel paso 2 — CONVERSION (dejar datos). Solo dispara si el POST al webhook
 * responde 2xx. Pasa params del lead (`pais`, `tipo_academia`,
 * `alumnos`, `fuente`) para que Meta Ads y GA4 segmenten audiencias
 * (ej: "leads de Perú con +200 alumnos").
 *
 * Pareja conceptual con `trackAgendaClick`. La ratio Lead / AgendaClick =
 * tasa de conversión del form (ideal >40%).
 *
 * Aparece en Meta como "Lead" (evento estándar de conversión), en
 * GA4 como `generate_lead` (evento estándar de conversión).
 */
export function trackLead(source: string, params: Record<string, unknown> = {}) {
  fire('Lead', null, 'generate_lead', { source, ...params });
}

/**
 * La persona empezó a llenar el form de `/te-llamamos` (primer campo
 * que escribe o elige). Se dispara una sola vez por visita al form.
 *
 * **Para comercial:** FormStart vs Lead = cuántos abandonan el form.
 * Si muchos empiezan y pocos terminan, el form es muy largo.
 *
 * Aparece en Meta como `FormStart` (custom), en GA4 como `form_start`.
 */
export function trackFormStart(source: string) {
  fire(null, 'FormStart', 'form_start', { source });
}

/**
 * La sección de precios entró en pantalla (una vez por visita).
 *
 * **Para comercial:** sirve para remarketing: mostrar anuncios a quien
 * vio precios y no agendó ni dejó datos.
 *
 * Aparece en Meta como `ViewPricing` (custom), en GA4 como `view_pricing`.
 */
export function trackViewPricing(source: string) {
  fire(null, 'ViewPricing', 'view_pricing', { source });
}
