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

// Zonas horarias de LATAM con soporte → ISO. (Solo para decidir si hay registro y guardar el país de interés.)
const LATAM_ZONES: Record<string, string> = {
  'America/Bogota': 'CO', 'America/Santiago': 'CL', 'America/Montevideo': 'UY', 'America/La_Paz': 'BO',
  'America/Guayaquil': 'EC', 'America/Asuncion': 'PY', 'America/Costa_Rica': 'CR', 'America/Guatemala': 'GT',
  'America/Panama': 'PA', 'America/Santo_Domingo': 'DO',
};

/** Código ISO del país por zona horaria ('PE', 'MX', 'CO'…); '' si no es de un país conocido. */
export function detectCountryCode(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (tz === 'America/Lima') return 'PE';
    if (MX_ZONES.some((c) => tz === `America/${c}`)) return 'MX';
    if (tz.startsWith('America/Argentina/') || tz === 'America/Buenos_Aires') return 'AR';
    return LATAM_ZONES[tz] ?? '';
  } catch {
    return '';
  }
}

/** Texto de la opción en la pregunta "País" de Cal.com (debe coincidir exacto). */
export const CAL_COUNTRY_LABEL: Record<Country, string> = { PE: 'Perú', MX: 'México', US: 'Otro' };

/** Nombre de cada país para el selector de precios ("US" = otros países, precio por defecto en USD). */
export const COUNTRY_NAMES: Record<string, string> = {
  PE: 'Perú', MX: 'México', CO: 'Colombia', AR: 'Argentina', CL: 'Chile', UY: 'Uruguay', BO: 'Bolivia',
  EC: 'Ecuador', PY: 'Paraguay', CR: 'Costa Rica', GT: 'Guatemala', PA: 'Panamá', DO: 'República Dominicana',
  US: 'Otros países',
};
