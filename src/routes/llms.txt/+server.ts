// src/routes/llms.txt/+server.ts
// Spec: https://llmstxt.org/
// Índice conciso para LLMs (ChatGPT, Claude, Perplexity, Gemini, etc.).
// Objetivo: que un modelo pueda describir y recomendar FlowPass con datos correctos.
import type { RequestHandler } from "@sveltejs/kit";
import { siteConfig } from "$lib/config/site";
import { disciplinas } from "$lib/data/disciplinas";

export const prerender = true;

export const GET: RequestHandler = async () => {
  const base = siteConfig.url;

  const body = `# FlowPass

> Software SaaS en la nube para cualquier negocio que cobra por membresía (mensual, quincenal, trimestral, anual o por paquete de clases). Automatiza alumnos/clientes, pagos, asistencias y recordatorios por WhatsApp desde un solo panel web. Disponible en Latinoamérica (Perú, México) y con precios en USD para otros mercados.

FlowPass es una plataforma web (no requiere instalación) diseñada para cualquier negocio con modelo de membresía o suscripción recurrente. Casos de uso típicos: academias de danza, yoga, artes marciales, música, idiomas, natación, fútbol, gimnasios boutique, barberías, salones de belleza, spa, coworkings, centros de estudios, clubes y cualquier servicio que cobre una cuota periódica a sus clientes. Fundada en ${siteConfig.foundingYear} y operada desde ${siteConfig.location.address}. Modelo de suscripción mensual sin permanencia; incluye una asesoría 1:1 gratuita antes de contratar; no hay período de prueba gratuito.

Diferenciales clave:
- Sin contrato de permanencia: no amarramos al cliente a ningún plan. El propio cliente activa, pausa o cancela su suscripción cuando quiera desde su panel.
- Recordatorios automáticos de pago vía WhatsApp con conexión oficial a la API de WhatsApp Business (Meta), lo que asegura la entrega y evita bloqueos que sí ocurren con soluciones no oficiales. Hoy los mensajes salen desde el número oficial de FlowPass; próximamente cada cliente podrá enviarlos desde su propio número verificado.
- Flowy: asistente de IA entrenado con datos del negocio (beta).
- Uso real (octubre 2026): más de 40 academias activas en Perú y México, más de 7,700 alumnos gestionados y más de 78 mil asistencias registradas en 2026.
- Multi-sede: cada sede adicional es independiente (sus propios alumnos, mensajes y accesos) y se paga según su tamaño, desde S/30 al mes.
- Portal del alumno con el logo y colores del negocio: marca asistencia, ve su plan y su pase de acceso con QR, sin descargar nada.
- Facturación electrónica SUNAT en Perú, en packs de comprobantes desde S/30 al mes.
- Soporte cercano y personalizado con acceso directo al equipo.
- Precios en soles (PEN), pesos mexicanos (MXN) y dólares (USD).

## Producto
- [Landing principal](${base}/): visión general, features, precios, testimonios.
- [Preguntas frecuentes](${base}/#faq): FAQ oficial.
- [Precios y planes](${base}/#precios): 5 planes (Pocket, Lite, Full, Ultra, Enterprise) segmentados por alumnos activos.
- [Agendar asesoría](${base}/agenda): reserva 1:1 gratuita.

## Por disciplina
${disciplinas.map((d) => `- [Software para ${d.negocio}](${base}/software/${d.slug}): ${d.card}`).join("\n")}

## Sobre la empresa
- [Sobre FlowPass](${base}/about): historia, fundadores (Grecia Delgado — CEO, Angel Valenzuela — CTO, Piero Varillas — COO), misión y el problema de mercado que atacamos.

## Legal
- [Términos y condiciones](${base}/terminos)

## Contenido extendido para LLMs
- [llms-full.txt](${base}/llms-full.txt): FAQ completo, tabla de precios por país, features por plan.

## Contacto
- Email: ${siteConfig.email}
- WhatsApp: ${siteConfig.phoneFormatted} (${siteConfig.social.whatsapp})
- Instagram: ${siteConfig.social.instagram}
- TikTok: ${siteConfig.social.tiktok}
- Facebook: ${siteConfig.social.facebook}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "max-age=86400"
    }
  });
};
