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
 * Logos de academias que usan FlowPass, con permiso (entregados por Grecia, 2026-10-13).
 * Archivos en static/logos/ (webp recortado, ≤240×160). `href` opcional: su Instagram o web.
 */
export const clientLogos: { src: string; name: string; href?: string }[] = [
  { src: '/logos/01.webp', name: 'CFT' },
  { src: '/logos/02.webp', name: 'Dojo Ryu Kai' },
  { src: '/logos/03.webp', name: 'Educasport' },
  { src: '/logos/04.webp', name: 'Alpha' },
  { src: '/logos/05.webp', name: 'Daus Academia de Violín' },
  { src: '/logos/06.webp', name: 'Dojo Imperio Karate' },
  { src: '/logos/07.webp', name: 'Kimura Karate' },
  { src: '/logos/08.webp', name: 'Moonshot Brain Lab' },
  { src: '/logos/10.webp', name: 'Niño Azul' },
  { src: '/logos/11.webp', name: 'Olimpo Swim' },
  { src: '/logos/12.webp', name: 'Legacy Studio' },
  { src: '/logos/13.webp', name: 'Club Deportivo Leonas del Sur' },
  { src: '/logos/14.webp', name: 'Academia Nekoma' },
  { src: '/logos/15.webp', name: 'Miss Alice Academy' },
  { src: '/logos/16.webp', name: 'Newton Sports Club' },
  { src: '/logos/17.webp', name: 'Academia de vóley' },
  { src: '/logos/18.webp', name: 'Domus Voleibol Club' },
  { src: '/logos/19.webp', name: 'Club Deportivo Atlético Zárate' },
  { src: '/logos/20.webp', name: 'Trakul Muay Thai' },
  { src: '/logos/21.webp', name: 'Hero Fight Club' },
  { src: '/logos/22.webp', name: 'Andrax' },
  { src: '/logos/23.webp', name: 'Zyrius Academia de Fútbol' },
  { src: '/logos/24.webp', name: 'Bacano' },
  { src: '/logos/25.webp', name: 'SV' },
  { src: '/logos/26.webp', name: 'Taekwondo AMA Perú' },
  { src: '/logos/27.webp', name: 'CVC' },
  { src: '/logos/28.webp', name: 'JP Sport' },
  { src: '/logos/29.webp', name: 'Athos' },
  { src: '/logos/30.webp', name: 'Al Son de mi Tierra' },
  { src: '/logos/31.webp', name: 'Escuela de Atletismo' },
  { src: '/logos/32.webp', name: 'S.F.C.' },
  { src: '/logos/33.webp', name: 'ADT Divisiones Menores Huancayo' },
  { src: '/logos/34.webp', name: 'Pinina Dance Center' },
  { src: '/logos/35.webp', name: 'Super Kids School' },
];
