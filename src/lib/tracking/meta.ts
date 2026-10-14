// Datos del navegador para la API de conversiones de Meta (los usa n8n).
// Con ellos Meta reconoce mejor a la persona y deduplica el evento del pixel.

import { browser } from '$app/environment';

function cookie(name: string): string {
  return document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))?.slice(name.length + 1) ?? '';
}

/** Cookies de Meta: `_fbp` (navegador) y `_fbc` (clic en anuncio; si falta, se arma con `fbclid`). */
export function metaCookies(): { fbp: string; fbc: string } {
  if (!browser) return { fbp: '', fbc: '' };
  const fbclid = new URLSearchParams(location.search).get('fbclid');
  const fbc = cookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : '');
  return { fbp: cookie('_fbp'), fbc: fbc.slice(0, 450) };
}

/** ID único del evento: va al pixel (eventID) y a n8n, así Meta no lo cuenta dos veces. */
export function newEventId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
