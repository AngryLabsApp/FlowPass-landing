// src/lib/stores/waCountry.svelte.ts
// Estado reactivo compartido para el selector de país del WhatsApp.
// Persiste la elección del visitante en localStorage entre visitas.

import { siteConfig } from "$lib/config/site";

export type CountryCode = keyof typeof siteConfig.phones;

const STORAGE_KEY = "fp_wa_country";
const VALID: CountryCode[] = Object.keys(siteConfig.phones) as CountryCode[];

class WaCountryStore {
  code = $state<CountryCode>('PE');

  /** Llamar en onMount para hidratar desde localStorage (browser-only). */
  init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (VALID as string[]).includes(saved)) this.code = saved as CountryCode;
    } catch { /* localStorage bloqueado — mantenemos default */ }
  }

  set(c: CountryCode) {
    this.code = c;
    try { localStorage.setItem(STORAGE_KEY, c); } catch {}
  }

  get phone() {
    return siteConfig.phones[this.code];
  }

  get countries() {
    return VALID.map((c) => siteConfig.phones[c]);
  }
}

export const waCountry = new WaCountryStore();
