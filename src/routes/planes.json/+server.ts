// Beneficios de cada tarjeta de precios, para la "Lista de precios" que FlowPass Admin descarga como imagen/PDF.
// Una sola fuente: lo mismo que muestran las tarjetas de la landing. Sin precios: esos salen de Admin por país.
import type { RequestHandler } from "@sveltejs/kit";
import { plans } from "$lib/data/pricingData.js";

export const prerender = true;

export const GET: RequestHandler = () => {
  const data = plans.map((p) => ({
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    highlight: !!p.highlight,
    activeStudents: p.activeStudents,
    quoteBased: !!p.quoteBased,
    features: [
      ...p.features.filter((f) => f.included).map((f) => f.label),
      ...(p.whatsappIncluded ? [`${p.whatsappIncluded.total} mensajes de WhatsApp al mes`] : []),
    ],
  }));
  return new Response(JSON.stringify({ data }), {
    // En PROD el archivo es estático y el CORS lo pone nginx; esto cubre `pnpm dev`.
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
};
