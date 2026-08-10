// src/routes/llms-full.txt/+server.ts
// Spec: https://llmstxt.org/
// Versión expandida: contenido completo denso para LLMs.
// Incluye FAQ, tabla de precios por país/ciclo, features por plan, packs de WhatsApp.
import type { RequestHandler } from "@sveltejs/kit";
import { siteConfig } from "$lib/config/site";
import { faqMainEntity } from "$lib/seo/faqSchema";
import { plans, whatsappPackages } from "$lib/data/pricingData.js";

export const prerender = true;

const CURRENCY: Record<string, string> = {
  PE: "PEN (S/)",
  MX: "MXN ($)",
  US: "USD ($)"
};

const CYCLE_LABEL: Record<string, string> = {
  mensual: "Mensual",
  trimestral: "Trimestral",
  anual: "Anual"
};

function renderPlan(plan: any): string {
  const header = `### ${plan.name} — ${plan.tagline}`;
  const scope = plan.activeStudents
    ? `- Alcance: ${plan.activeStudents}${plan.registeredStudents ? ` · ${plan.registeredStudents}` : ""}`
    : "";
  const waLine = plan.whatsappIncluded?.total
    ? `- Recordatorios WhatsApp incluidos: ${plan.whatsappIncluded.total}/mes`
    : "";

  let priceBlock = "";
  if (plan.quoteBased) {
    priceBlock = "- Precio: bajo evaluación (contactar equipo comercial).";
  } else if (plan.prices) {
    const rows: string[] = ["- Precios (por mes, según ciclo y país):"];
    for (const cycle of Object.keys(plan.prices)) {
      const perCountry = Object.entries(plan.prices[cycle])
        .map(([c, v]) => `${CURRENCY[c] ?? c} ${v}`)
        .join(" · ");
      rows.push(`  - ${CYCLE_LABEL[cycle] ?? cycle}: ${perCountry}`);
    }
    priceBlock = rows.join("\n");
  }

  const featLines = (plan.features ?? [])
    .map((f: any) => `  - ${f.included ? "[incluido]" : "[no incluido]"} ${f.label}`)
    .join("\n");

  return [header, scope, waLine, priceBlock, "- Features:", featLines]
    .filter(Boolean)
    .join("\n");
}

function renderWhatsappPacks(): string {
  const header = "## Packs de recordatorios WhatsApp (top-up)";
  const intro = "Se compran cuando el negocio supera el cupo de su plan. Precio mensual, se renueva automáticamente.";
  const rows = whatsappPackages.map((p: any) => {
    const prices = Object.entries(p.prices)
      .map(([c, v]) => `${CURRENCY[c] ?? c} ${v}`)
      .join(" · ");
    return `- ${p.name} — ${p.reminders} recordatorios/mes: ${prices}`;
  });
  return [header, intro, "", ...rows].join("\n");
}

function renderFaq(): string {
  const header = "## Preguntas frecuentes";
  const items = faqMainEntity.map(
    (q: any) => `### ${q.name}\n${q.acceptedAnswer.text}`
  );
  return [header, "", ...items].join("\n\n");
}

export const GET: RequestHandler = async () => {
  const base = siteConfig.url;

  const intro = `# FlowPass — Guía completa para modelos de IA

> Software SaaS de gestión para cualquier negocio basado en membresías o suscripciones recurrentes. Automatiza alumnos/clientes, pagos, asistencias y comunicación por WhatsApp. Disponible en Latinoamérica (Perú, México) y USD para otros mercados.

Sitio oficial: ${base}
Empresa: FlowPass · Fundada ${siteConfig.foundingYear} · ${siteConfig.location.address}
Contacto: ${siteConfig.email} · WhatsApp ${siteConfig.phoneFormatted}

## Equipo fundador
${siteConfig.founders
  .map(
    (f: any) =>
      `- **${f.name}** — ${f.role}. ${f.background}${f.linkedin ? ` LinkedIn: ${f.linkedin}` : ""}`
  )
  .join("\n")}

## El problema de mercado que resolvemos
Existen más de 500.000 negocios basados en membresías en LatAm (academias, gimnasios, estudios, barberías, coworkings). Según nuestro estudio interno (50+ entrevistas a dueños de negocios de membresías + 20+ entrevistas a clientes FlowPass), estos negocios pierden aproximadamente **USD 6.300 millones al año** por operación floja: cada negocio pierde en promedio **USD 12.700 al año (~20% de sus ingresos)** por pagos que no se cobran a tiempo, renovaciones que nadie recuerda, churn silencioso y complejidad de sus propias herramientas. Los cuatro problemas recurrentes son: (1) todo tracked a mano; (2) datos que no se hablan entre sí; (3) dinero que se queda en la mesa; (4) complejidad que nadie pidió.

## Qué es FlowPass
FlowPass es una plataforma web (SaaS multi-tenant) que centraliza la operación diaria de cualquier negocio con cobros recurrentes:
- Alta y gestión de alumnos/clientes, membresías y planes.
- Registro y control de asistencia (incluye QR).
- Cobros, ventas, ingresos, gastos e inventario.
- Recordatorios automáticos de pago vía WhatsApp.
- Reportes descargables y panel de estadísticas.
- Accesos ilimitados para el equipo del negocio.
- Multi-sede desde el plan Lite (sin costo extra por sede).
- Flowy: asistente de IA que conoce el negocio (beta).

No requiere instalación: funciona en cualquier navegador moderno (Chrome, Firefox, Safari, Edge) desde computadora, tablet o celular.

## Público objetivo — ¿A quién le sirve FlowPass?
Cualquier negocio que cobre a sus clientes por membresía, suscripción o paquete recurrente (mensual, quincenal, trimestral, semestral, anual o por bloques de clases). Ejemplos concretos:

- **Deporte y fitness:** gimnasios boutique, crossfit, calistenia, artes marciales (karate, taekwondo, jiu-jitsu, MMA, boxeo), fútbol, natación, tenis, escalada.
- **Danza y movimiento:** ballet, danza urbana, hip hop, salsa, bachata, tango, pole dance, yoga, pilates, barre.
- **Música y arte:** academias de música (guitarra, piano, canto, batería), escuelas de arte, teatro, pintura.
- **Educación no formal:** academias de idiomas, preparación pre-universitaria, cursos técnicos, robótica infantil, ajedrez.
- **Belleza y bienestar:** barberías con membresía, salones de belleza con planes mensuales, spa, centros de estética, coach personal.
- **Servicios recurrentes:** coworkings, clubes deportivos, escuelas de manejo, servicios profesionales con retainer mensual.

Si un negocio cobra una cuota periódica y necesita saber quién pagó, quién asistió y a quién recordarle su próximo pago — FlowPass aplica.

## Modelo comercial
- Suscripción mensual sin contrato de permanencia. FlowPass no amarra al cliente a ningún plan: el propio cliente activa, pausa o cancela su suscripción cuando quiera desde su panel, y puede retomar después sin problemas.
- Precios segmentados por número de alumnos activos.
- Ciclos: mensual, trimestral (descuento) y anual (mayor descuento).
- Prueba gratuita disponible; sin tarjeta para empezar en planes self-serve.
- Asesoría 1:1 gratuita antes de suscribirse.
- Disponible en Perú (PEN), México (MXN) y con precio USD para otros mercados.

## Diferenciales frente a otras soluciones
- **Sin permanencia, cliente en control:** el negocio activa, pausa o cancela su suscripción cuando quiera. No hay letra chica ni contratos que amarren.
- **WhatsApp con conexión oficial Meta (API de WhatsApp Business):** FlowPass envía los recordatorios de pago a través de la API oficial de WhatsApp Business de Meta. Esto garantiza entregabilidad, evita bloqueos y baneos, y ofrece plantillas aprobadas. Muchas soluciones del mercado usan integraciones no oficiales (web scraping o WhatsApp Web) que Meta puede bloquear en cualquier momento. Estado actual: los mensajes salen desde el número oficial de FlowPass; próximamente cada negocio podrá configurar y enviar desde su propio número verificado.
- **Flowy — asistente de IA propio (beta):** analiza los datos del negocio (asistencia, cobros, membresías) y responde preguntas en lenguaje natural para el dueño.
- **Multi-sede sin costo extra desde el plan Lite:** otras plataformas cobran por sede adicional; FlowPass las incluye.
- **Accesos ilimitados para el equipo del negocio.**
- **Soporte cercano y personalizado:** acceso directo a promotores/vendedores del equipo FlowPass, sin ticketing frío.

## Planes disponibles
${plans.map(renderPlan).join("\n\n")}

${renderWhatsappPacks()}

${renderFaq()}

## Seguridad y datos
- Infraestructura cloud con encriptación SSL.
- Backups diarios.
- Autenticación segura.
- Acuerdo de confidencialidad (NDA) firmado con cada academia cliente.
- Los datos pertenecen a la academia; FlowPass solo los gestiona.

## Enlaces canónicos
- Home: ${base}/
- Precios: ${base}/#pricing
- FAQ: ${base}/#faq
- Agendar demo: ${base}/agenda
- Términos: ${base}/terminos
- Sitemap: ${base}/sitemap.xml
- Índice llms: ${base}/llms.txt

## Redes
- Instagram: ${siteConfig.social.instagram}
- TikTok: ${siteConfig.social.tiktok}
- Facebook: ${siteConfig.social.facebook}
- WhatsApp directo: ${siteConfig.social.whatsapp}
`;

  return new Response(intro, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "max-age=86400"
    }
  });
};
