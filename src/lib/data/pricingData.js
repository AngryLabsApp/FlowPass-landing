/** @type {Array<{code: string, label: string, flag: string, currency: string, currencyCode: string}>} */
export const countries = [
  { code: 'PE', label: 'Perú',   flag: '🇵🇪', currency: 'S/.', currencyCode: 'PEN' },
  { code: 'MX', label: 'México', flag: '🇲🇽', currency: '$',   currencyCode: 'MXN' },
];

/**
 * @type {Array<{
 *   id: string,
 *   name: string,
 *   tagline: string,
 *   range: string,
 *   highlight: boolean,
 *   features: Array<{label: string, included: boolean}>,
 *   prices: Record<string, number>
 * }>}
 */
export const plans = [
  {
    id: 'pocket',
    name: 'Flow Pocket',
    tagline: 'Para academias que están comenzando',
    range: '0 – 30 alumnos',
    highlight: false,
    features: [
      { label: 'Gestión de alumnos, pagos y asistencia', included: true  },
      { label: '30 notificaciones individuales  WhatsApp / mes',       included: true  },
      { label: '1 usuario Admin',                        included: true  },
      { label: 'Acceso QR',                              included: false },
      { label: 'Múltiples planes de membresía',          included: false },
      { label: 'Multi sede',                             included: false },
    ],
    prices: { PE: 0, MX: 0 },
  },
  {
    id: 'lite',
    name: 'Flow Lite',
    tagline: 'Crece con más control',
    range: '30 – 80 alumnos',
    highlight: false,
    features: [
      { label: 'Gestión de alumnos, pagos y asistencia', included: true  },
      { label: '80 notificaciones WhatsApp / mes',       included: true  },
      { label: '2 usuarios Admin',                       included: true  },
      { label: 'Acceso QR',                              included: true  },
      { label: 'Múltiples planes de membresía',          included: false },
      { label: 'Multi sede',                             included: false },
    ],
    prices: { PE: 0, MX: 0 },
  },
  {
    id: 'full',
    name: 'Flow Full',
    tagline: 'El más elegido por academias en crecimiento',
    range: '80 – 160 alumnos',
    highlight: true,
    features: [
      { label: 'Gestión de alumnos, pagos y asistencia', included: true  },
      { label: '160 notificaciones WhatsApp / mes',      included: true  },
      { label: '4 usuarios Admin',                       included: true  },
      { label: 'Acceso QR',                              included: true  },
      { label: 'Múltiples planes de membresía',          included: true  },
      { label: 'Multi sede*',                            included: true  },
    ],
    prices: { PE: 0, MX: 0 },
  },
  {
    id: 'ultra',
    name: 'Flow Ultra',
    tagline: 'Máxima potencia para grandes academias',
    range: '160 – 250 alumnos',
    highlight: false,
    features: [
      { label: 'Gestión de alumnos, pagos y asistencia', included: true },
      { label: '250 notificaciones WhatsApp / mes',      included: true },
      { label: '6 usuarios Admin',                       included: true },
      { label: 'Acceso QR',                              included: true },
      { label: 'Múltiples planes de membresía',          included: true },
      { label: 'Multi sede*',                            included: true },
    ],
    prices: { PE: 0, MX: 0 },
  },
];

/**
 * @type {Array<{
 *   name: string,
 *   messages: number,
 *   highlight: boolean,
 *   prices: Record<string, number>
 * }>}
 */
export const whatsappPackages = [
  { name: 'Básico',    messages: 30,  highlight: false, prices: { PE: 0, MX: 0 } },
  { name: 'Medio',     messages: 80,  highlight: true,  prices: { PE: 0, MX: 0 } },
  { name: 'Pro',       messages: 160, highlight: false, prices: { PE: 0, MX: 0 } },
  { name: 'Avanzado',  messages: 250, highlight: false, prices: { PE: 0, MX: 0 } },
  { name: 'Intensivo', messages: 500, highlight: false, prices: { PE: 0, MX: 0 } },
];

/** @type {string[]} */
export const perks = [
  'Sin contratos forzosos',
  'Soporte personalizado',
  'Acceso desde cualquier lugar',
  'Conexión Oficial a WhatsApp',
];
