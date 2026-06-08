/** @type {Array<{code: string, label: string, flag: string, currency: string, currencyCode: string}>} */
export const countries = [
  {
    code: "PE",
    label: "Perú",
    flag: "🇵🇪",
    currency: "S/.",
    currencyCode: "PEN",
  },
  {
    code: "MX",
    label: "México",
    flag: "🇲🇽",
    currency: "$",
    currencyCode: "MXN",
  },
  {
    code: "US",
    label: "Otros países",
    flag: "🌎",
    currency: "USD",
    currencyCode: "USD",
  },
];

/**
 * @type {Array<{
 *   id: string,
 *   name: string,
 *   tagline: string,
 *   activeStudents: string,
 *   registeredStudents: string,
 *   highlight: boolean,
 *   features: Array<{label: string, included: boolean, extraCost?: Record<string, number>}>,
 *   prices: Record<string, number>
 * }>}
 */
export const plans = [
  {
    id: "pocket",
    name: "Flow Pocket",
    tagline: "Para academias que están comenzando",
    activeStudents: "0 – 50 alumnos activos",
    registeredStudents: "Hasta 150 alumnos registrados",
    highlight: false,
    features: [
      { label: "Gestión de alumnos, pagos y asistencia", included: true },
      { label: "30 notificaciones individuales WhatsApp/mes", included: true },
      { label: "1 Admin + 1 Colaborador", included: true },
      { label: "Acceso QR", included: false },
      { label: "Membresías simultáneas por alumno", included: false },
      { label: "Multi sede", included: false },
    ],
    prices: { PE: 150, MX: 600, US: 50 },
  },
  {
    id: "lite",
    name: "Flow Lite",
    tagline: "Para academias que ya están creciendo.",
    activeStudents: "50 – 100 alumnos activos",
    registeredStudents: "Hasta 400 alumnos registrados",
    highlight: false,
    features: [
      { label: "Gestión de alumnos, pagos y asistencia", included: true },
      { label: "80 notificaciones individuales WhatsApp/mes", included: true },
      { label: "1 Admin + 2 Colaboradores", included: true },
      { label: "Acceso QR", included: true },
      { label: "Membresías simultáneas por alumno", included: false },
      { label: "Multi sede", included: false },
    ],
    prices: { PE: 200, MX: 1000, US: 70 },
  },
  {
    id: "full",
    name: "Flow Full",
    tagline: "Todo lo que necesitas para escalar sin límites.",
    activeStudents: "100 – 150 alumnos activos",
    registeredStudents: "Hasta 800 alumnos registrados",
    highlight: true,
    features: [
      { label: "Gestión de alumnos, pagos y asistencia", included: true },
      { label: "160 notificaciones individuales WhatsApp/mes", included: true },
      { label: "1 Admin + 4 Colaboradores", included: true },
      { label: "Acceso QR", included: true },
      { label: "Membresías simultáneas por alumno", included: true },
      { label: "Multi sede", included: true, extraCost: { PE: 30, MX: 150, US: 10 } },
    ],
    prices: { PE: 320, MX: 1600, US: 90 },
  },
  {
    id: "ultra",
    name: "Flow Ultra",
    tagline: "Máxima potencia para grandes academias",
    activeStudents: "150 – 200 alumnos activos",
    registeredStudents: "Hasta 1250 alumnos registrados",
    highlight: false,
    features: [
      { label: "Gestión de alumnos, pagos y asistencia", included: true },
      { label: "250 notificaciones individuales WhatsApp/mes", included: true },
      { label: "1 Admin + 6 Colaboradores", included: true },
      { label: "Acceso QR", included: true },
      { label: "Membresías simultáneas por alumno", included: true },
      { label: "Multi sede", included: true, extraCost: { PE: 0, MX: 0, US: 0 } },
    ],
    prices: { PE: 450, MX: 2300, US: 130 },
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
  {
    name: "Básico",
    messages: 50,
    highlight: false,
    prices: { PE: 20, MX: 100, US: 5 },
  },
  {
    name: "Medio",
    messages: 100,
    highlight: false,
    prices: { PE: 40, MX: 100, US: 10 },
  },
  { name: "Pro", 
    messages: 200, 
    highlight: true, 
    prices: { PE: 60, MX: 200, US: 15 } },
  {
    name: "Avanzado",
    messages: 300,
    highlight: false,
    prices: { PE: 80, MX: 300, US: 20 },
  },
  // {
  //   name: "Intensivo",
  //   messages: 500,
  //   highlight: false,
  //   prices: { PE: 100, MX: 500, US: 25 },
  // },
];

/** @type {string[]} */
export const perks = [
  "Sin contratos forzosos",
  "Soporte personalizado",
  "Acceso desde cualquier lugar",
  "Conexión Oficial a WhatsApp",
];
