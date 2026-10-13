// Páginas por disciplina (SEO / IA): una por cada rubro donde FlowPass tiene clientes reales.
// Regla: solo funciones que FlowPass ya tiene. Nada de cifras ni testimonios inventados.
// Ruta: /software/<slug>. Para sumar una disciplina, agregarla aquí (sitemap y home la toman solas).

export type Disciplina = {
  slug: string;
  /** Nombre corto para tarjetas: "Vóley" */
  name: string;
  /** Tipo de negocio en plural: "academias de vóley" */
  negocio: string;
  /** Frase corta para la tarjeta del listado */
  card: string;
  /** Línea bajo el titular */
  sub: string;
  /** Cómo llama el rubro a sus clientes (por defecto alumno/alumnos) */
  who?: { one: string; many: string };
  /** Lo que hoy duele (máx. 3) */
  pains: string[];
  /** Cómo lo resuelve FlowPass (máx. 3) */
  wins: string[];
  faqs: { q: string; a: string }[];
  keywords: string;
};

export const disciplinas: Disciplina[] = [
  {
    slug: 'academias-de-voley',
    who: { one: 'jugador', many: 'jugadores' },
    name: 'Vóley',
    negocio: 'academias de vóley',
    card: 'Grupos por nivel, mensualidades y asistencia.',
    sub: 'Cobra mensualidades, controla la asistencia por grupo y avisa los vencimientos por WhatsApp.',
    pains: ['Cobrar uno por uno a cada familia.', 'Listas de asistencia en papel por cada grupo.', 'No saber quién está al día.'],
    wins: ['Grupos por nivel u horario, cada uno con su lista.', 'Recordatorios de pago automáticos por WhatsApp.', 'Quién debe y quién pagó, en un vistazo.'],
    faqs: [
      { q: '¿Puedo separar a mis alumnos por categoría o nivel?', a: 'Sí. Creas grupos (por nivel, edad u horario) y cada alumno queda en el suyo, con su asistencia y su plan.' },
      { q: '¿Los padres reciben los recordatorios?', a: 'Sí. FlowPass envía el recordatorio por WhatsApp al número que registres, unos días antes del vencimiento.' }
    ],
    keywords: 'software academia de vóley, sistema para escuela de voleibol, cobrar mensualidades vóley'
  },
  {
    slug: 'artes-marciales',
    name: 'Artes marciales',
    negocio: 'academias de artes marciales',
    card: 'Karate, taekwondo, jiu-jitsu: clases, grupos y mensualidad.',
    sub: 'Para dojos y academias de karate, taekwondo, jiu-jitsu y más: cobros, asistencia y grupos en un solo lugar.',
    pains: ['Mensualidades anotadas en un cuaderno.', 'Alumnos que dejan de venir y te enteras tarde.', 'Grupos de niños y adultos mezclados en el Excel.'],
    wins: ['Grupos por nivel o edad, con su propia lista.', 'Ranking de asistencia: ves quién se está alejando.', 'Recordatorios de pago automáticos por WhatsApp.'],
    faqs: [
      { q: '¿Puedo organizar a los alumnos por grado o cinturón?', a: 'Sí, con grupos. Creas un grupo por nivel y asignas a cada alumno.' },
      { q: '¿El alumno puede marcar su asistencia al llegar?', a: 'Sí. Marca con su código o con el QR de su pase, y la clase se descuenta de su plan.' }
    ],
    keywords: 'software para dojo, sistema academia de karate, app taekwondo mensualidades, gestión artes marciales'
  },
  {
    slug: 'escuelas-de-musica',
    name: 'Música',
    negocio: 'escuelas de música',
    card: 'Clases por instrumento, paquetes y mensualidades.',
    sub: 'Clases individuales o grupales, paquetes de sesiones y mensualidades, sin cuadernos.',
    pains: ['Paquetes de clases que nadie sabe cuántas quedan.', 'Horarios y profesores en hojas distintas.', 'Cobros que se olvidan.'],
    wins: ['Planes por sesiones: cada clase se descuenta sola.', 'Cada alumno con su plan, sus clases y su pago.', 'Recordatorios automáticos antes del vencimiento.'],
    faqs: [
      { q: '¿Sirve para paquetes de clases, no solo mensualidades?', a: 'Sí. Puedes crear planes por número de sesiones (por ejemplo 4 u 8 clases) y FlowPass descuenta cada asistencia.' },
      { q: '¿Mis profesores pueden usarlo?', a: 'Sí. Cada plan incluye accesos para tu equipo, con su propio usuario.' }
    ],
    keywords: 'software escuela de música, sistema para academia de música, control de clases de música'
  },
  {
    slug: 'escuelas-de-natacion',
    name: 'Natación',
    negocio: 'escuelas de natación',
    card: 'Grupos por nivel, pagos mensuales y asistencia.',
    sub: 'Grupos por nivel y horario, pagos mensuales y asistencia en la entrada de la piscina.',
    pains: ['Colas en recepción para anotar quién entra.', 'Pagos mensuales que se pierden entre chats.', 'Turnos llenos sin saber quién viene de verdad.'],
    wins: ['Check-in en la entrada con código o QR.', 'Grupos por nivel y horario.', 'Recordatorios de pago automáticos por WhatsApp.'],
    faqs: [
      { q: '¿Cómo registran la asistencia en la piscina?', a: 'El alumno marca con su código de 4 dígitos o su QR en la entrada, o tú lo registras desde el panel.' },
      { q: '¿Funciona si tengo más de una piscina o sede?', a: 'Sí. Cada sede adicional tiene sus propios alumnos y se paga según su tamaño.' }
    ],
    keywords: 'software escuela de natación, sistema para piscina, control de asistencia natación'
  },
  {
    slug: 'escuelas-de-futbol',
    who: { one: 'jugador', many: 'jugadores' },
    name: 'Fútbol',
    negocio: 'escuelas de fútbol',
    card: 'Categorías, entrenamientos y pagos.',
    sub: 'Categorías por edad, asistencia a entrenamientos y cobro de mensualidades a cada familia.',
    pains: ['Cobrar a decenas de familias por WhatsApp, una por una.', 'No saber quién faltó a los entrenamientos.', 'Categorías en hojas de cálculo distintas.'],
    wins: ['Grupos por categoría, cada uno con su lista.', 'Recordatorios de pago automáticos.', 'Ves quién viene y quién se está alejando.'],
    faqs: [
      { q: '¿Puedo separar por categorías (sub-8, sub-10…)?', a: 'Sí. Cada categoría es un grupo con sus alumnos, su asistencia y sus planes.' },
      { q: '¿Puedo emitir boletas?', a: 'En Perú, sí: FlowPass se conecta con SUNAT para emitir boletas y facturas, en packs desde S/30.' }
    ],
    keywords: 'software escuela de fútbol, sistema academia de fútbol, cobrar mensualidades fútbol'
  },
  {
    slug: 'academias-de-baile',
    name: 'Baile',
    negocio: 'academias de baile',
    card: 'Danza, salsa, ballet: grupos, cuotas y asistencia.',
    sub: 'Para academias de danza, ballet, salsa y más: grupos por nivel, mensualidades y asistencia.',
    pains: ['Alumnas con varios planes y nadie sabe cuál vence.', 'La caja del mes se cuadra a mano.', 'Recordatorios que salen cuando te acuerdas.'],
    wins: ['Varios planes activos por alumno.', 'Caja del mes cuadrada sola: ingresos y gastos.', 'Recordatorios automáticos por WhatsApp.'],
    faqs: [
      { q: '¿Una alumna puede tener dos planes a la vez?', a: 'Sí, por ejemplo ballet y contemporáneo. Cada plan lleva su fecha y sus clases.' },
      { q: '¿Mis alumnas tienen dónde ver su plan?', a: 'Sí. Cada una tiene su portal, con tu marca, para ver su plan y marcar asistencia.' }
    ],
    keywords: 'software academia de baile, sistema para academia de danza, app escuela de ballet'
  },
  {
    slug: 'desarrollo-infantil',
    who: { one: 'niño', many: 'niños' },
    name: 'Desarrollo infantil',
    negocio: 'centros de desarrollo infantil',
    card: 'Talleres, estimulación y pagos de las familias.',
    sub: 'Talleres y programas de estimulación: inscripciones, asistencia y pagos de cada familia.',
    pains: ['Datos de cada familia repartidos en chats.', 'Pagos de talleres difíciles de seguir.', 'Asistencia anotada a mano.'],
    wins: ['Cada niño con su plan, su asistencia y su pago.', 'Recordatorios a los padres por WhatsApp.', 'Datos guardados de forma segura.'],
    faqs: [
      { q: '¿Quién recibe los avisos, el niño o el padre?', a: 'El número que registres: normalmente el de la madre, el padre o el apoderado.' },
      { q: '¿Cómo cuidan los datos de los niños?', a: 'Tu centro es el responsable de los datos y FlowPass los procesa solo para darte el servicio. Lo detallamos en nuestra política de privacidad.' }
    ],
    keywords: 'software centro de estimulación temprana, sistema desarrollo infantil, gestión de talleres para niños'
  },
  {
    slug: 'centros-fitness',
    who: { one: 'socio', many: 'socios' },
    name: 'Centro fitness',
    negocio: 'centros fitness y gimnasios',
    card: 'Membresías, acceso y vencimientos.',
    sub: 'Membresías, control de acceso en recepción y vencimientos de cada socio.',
    pains: ['Socios que entran con la membresía vencida.', 'Renovaciones que se escapan.', 'Reportes de ventas armados a mano.'],
    wins: ['Check-in con código o QR en recepción.', 'Vencimientos por colores: hoy, esta semana, ya venció.', 'Ventas del mes y socios activos, sin armar nada.'],
    faqs: [
      { q: '¿Avisa cuando una membresía está por vencer?', a: 'Sí. Ves los vencimientos por colores y FlowPass envía el recordatorio por WhatsApp.' },
      { q: '¿Cuánto cuesta?', a: 'Depende de tus socios activos. Los planes están en esta misma página, en la sección de precios.' }
    ],
    keywords: 'software para gimnasio, sistema de membresías gym, control de acceso gimnasio'
  },
  {
    slug: 'gimnasios-de-box',
    who: { one: 'socio', many: 'socios' },
    name: 'Box',
    negocio: 'gimnasios de box',
    card: 'Clases, membresías y control de acceso.',
    sub: 'Clases de box, membresías y acceso en la puerta, sin listas en papel.',
    pains: ['Planes por clases que se cuentan a mano.', 'Pagos que se cruzan entre efectivo y transferencias.', 'No saber quién dejó de venir.'],
    wins: ['Planes por clases que se descuentan solos.', 'Pagos y caja del mes en un solo lugar.', 'Ranking de asistencia por alumno.'],
    faqs: [
      { q: '¿Sirve para planes de 8 o 12 clases?', a: 'Sí. Creas el plan con el número de clases y cada asistencia se descuenta sola.' },
      { q: '¿Puedo registrar pagos en efectivo?', a: 'Sí. Registras cada pago con su método y la caja del mes se cuadra sola.' }
    ],
    keywords: 'software gimnasio de box, sistema academia de boxeo, membresías box'
  },
  {
    slug: 'escuelas-de-idiomas',
    name: 'Idiomas',
    negocio: 'escuelas de idiomas',
    card: 'Grupos por nivel, horarios y cobranza.',
    sub: 'Grupos por nivel, asistencia a clases y cobro de mensualidades o ciclos.',
    pains: ['Ciclos y mensualidades mezclados en el Excel.', 'Alumnos que se atrasan sin que lo notes.', 'Asistencia que nadie consolida.'],
    wins: ['Grupos por nivel y horario.', 'Planes mensuales, por ciclo o por paquete.', 'Recordatorios de pago automáticos.'],
    faqs: [
      { q: '¿Puedo cobrar por ciclo en vez de por mes?', a: 'Sí. Cada plan tiene su duración: mensual, por ciclo, trimestral o la que uses.' },
      { q: '¿Sirve para clases virtuales?', a: 'Sí. La asistencia se puede registrar desde el panel y el alumno ve su plan en su portal.' }
    ],
    keywords: 'software escuela de idiomas, sistema academia de inglés, gestión de alumnos idiomas'
  },
  {
    slug: 'escuelas-de-belleza',
    name: 'Belleza',
    negocio: 'escuelas de belleza',
    card: 'Barbería, peluquería y estética: cursos, cuotas y asistencia.',
    sub: 'Para institutos y academias de barbería, peluquería, colorimetría y estética: alumnos por curso, cuotas y asistencia.',
    pains: ['Cuotas de cada curso anotadas a mano.', 'Asistencia a clases prácticas en papel.', 'No saber quién está atrasado en sus pagos.'],
    wins: ['Grupos por curso o turno, cada uno con su lista.', 'Cuotas con recordatorio automático por WhatsApp.', 'Quién debe y quién pagó, en un vistazo.'],
    faqs: [
      { q: '¿Puedo tener varios cursos a la vez (barbería, colorimetría…)?', a: 'Sí. Cada curso es un plan y un alumno puede tener más de uno activo.' },
      { q: '¿Sirve para cobrar el curso en cuotas?', a: 'Sí. Creas el plan con su duración y FlowPass avisa antes de cada vencimiento.' }
    ],
    keywords: 'software escuela de belleza, sistema academia de barbería, gestión instituto de peluquería y estética'
  },
  {
    slug: 'academias-de-basquet',
    who: { one: 'jugador', many: 'jugadores' },
    name: 'Básquet',
    negocio: 'academias de básquet',
    card: 'Categorías, entrenamientos y mensualidades.',
    sub: 'Categorías por edad, entrenamientos y mensualidades de cada jugador.',
    pains: ['Cobrar a cada familia por chat.', 'Asistencia a entrenamientos en papel.', 'No saber quién está al día.'],
    wins: ['Grupos por categoría con su lista.', 'Recordatorios de pago automáticos.', 'Quién debe y quién pagó, en un vistazo.'],
    faqs: [
      { q: '¿Puedo tener varias categorías y horarios?', a: 'Sí. Cada categoría u horario es un grupo con sus jugadores.' },
      { q: '¿Funciona en el celular?', a: 'Sí. El panel funciona en el celular y cada jugador tiene su portal.' }
    ],
    keywords: 'software academia de básquet, sistema escuela de baloncesto, cobrar mensualidades básquet'
  },
  {
    slug: 'escuelas-de-patinaje',
    name: 'Patinaje',
    negocio: 'escuelas de patinaje',
    card: 'Grupos por nivel, clases y pagos.',
    sub: 'Grupos por nivel, clases y pagos, con avisos automáticos a cada familia.',
    pains: ['Grupos y niveles en hojas distintas.', 'Pagos que se pierden entre chats.', 'Asistencia anotada a mano.'],
    wins: ['Grupos por nivel con su lista.', 'Recordatorios de pago por WhatsApp.', 'Asistencia con código o QR.'],
    faqs: [
      { q: '¿Puedo tener clases sueltas y mensualidades?', a: 'Sí. Creas planes por clases o mensuales, según lo que vendas.' },
      { q: '¿Cuánto tarda en estar listo?', a: 'Te ayudamos a cargar tus alumnos y planes para que empieces rápido.' }
    ],
    keywords: 'software escuela de patinaje, sistema academia de patinaje, gestión de alumnos patinaje'
  }
];

export const disciplinaBySlug = (slug: string) => disciplinas.find((d) => d.slug === slug);
