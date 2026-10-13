// País del visitante según la zona horaria del navegador: sin permisos ni servicios externos.
// Se usa en precios (moneda) y en el calendario de Cal.com (pregunta "País" ya marcada).

export type Country = 'PE' | 'MX' | 'US';

const MX_ZONES = ['Mexico_City', 'Cancun', 'Merida', 'Monterrey', 'Matamoros', 'Chihuahua', 'Ciudad_Juarez', 'Ojinaga', 'Mazatlan', 'Bahia_Banderas', 'Hermosillo', 'Tijuana'];

/** 'PE' (Lima), 'MX' (zonas de México) o 'US' (cualquier otro lugar). `fallback` si no se puede leer. */
export function detectCountry(fallback: Country = 'PE'): Country {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (tz === 'America/Lima') return 'PE';
    if (MX_ZONES.some((c) => tz === `America/${c}`)) return 'MX';
    return tz ? 'US' : fallback;
  } catch {
    return fallback;
  }
}

/** Texto de la opción en la pregunta "País" de Cal.com (debe coincidir exacto). */
export const CAL_COUNTRY_LABEL: Record<Country, string> = { PE: 'Perú', MX: 'México', US: 'Otro' };
