// Contenido editable del home que depende de datos reales.
// Regla: nada inventado. Si un valor no está confirmado, queda en null/vacío y
// la sección correspondiente no se muestra.

/** Cifras de la franja bajo la portada. Contar "activas", nunca "registradas". */
// Fuente: docs/sql/cifras-landing.sql en producción, 2026-10-12. Redondeado HACIA ABAJO.
// Real: 42 activas (30 días) · 7,756 alumnos con plan (historico; 2,327 vigentes hoy) · S/ 3,352,788 cobrados 2026 (solo PE;
// MX aparte: $319,703 MXN) · 78,415 asistencias 2026 · 10,216 recordatorios 2026.
export const homeStats: { value: string | null; label: string }[] = [
  // +50 por decisión comercial (42 activas a 30 días; 47 negocios reales; varios cierres en curso PE/MX).
  { value: '+50', label: 'academias confían en FlowPass' },
  { value: '+7,700', label: 'alumnos gestionados en FlowPass' },
  // USD conservador: S/ 3,352,788 + $319,703 MXN ≈ US$ 0.88–0.93 M según tipo de cambio (PEN 3.6–3.9).
  { value: '+US$ 850 mil', label: 'cobrados por nuestros clientes en 2026' },
  { value: '+78 mil', label: 'asistencias registradas en 2026' }
];

/**
 * Logos de academias que usan FlowPass, con permiso. Guardar los archivos en
 * static/logos/ (PNG o SVG con fondo transparente). `href`: su Instagram o web.
 */
export const clientLogos: { src: string; name: string; href?: string }[] = [
  // { src: '/logos/academia-1.svg', name: 'Academia 1', href: 'https://instagram.com/...' },
];
