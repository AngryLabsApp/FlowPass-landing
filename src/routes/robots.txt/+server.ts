import type { RequestHandler } from "@sveltejs/kit";
import { siteConfig } from "$lib/config/site";

export const prerender = true;

// Bots de IA a los que permitimos rastrear el sitio de forma explícita.
// Ser explícito (no confiar solo en `User-agent: *`) es señal pública
// de que queremos aparecer en respuestas generadas por LLMs.
const AI_BOTS = [
  // OpenAI
  "GPTBot",           // Entrenamiento de modelos GPT
  "ChatGPT-User",     // Browsing en vivo desde ChatGPT
  "OAI-SearchBot",    // SearchGPT
  // Anthropic
  "ClaudeBot",        // Entrenamiento de modelos Claude
  "Claude-Web",       // Browsing en vivo desde Claude
  "anthropic-ai",     // Identificador histórico de Anthropic
  // Perplexity
  "PerplexityBot",    // Indexación para respuestas
  "Perplexity-User",  // Browsing en vivo desde Perplexity
  // Google (Gemini) — distinto de Googlebot (SEO tradicional)
  "Google-Extended",
  // Common Crawl — dataset usado por múltiples LLMs
  "CCBot",
  // Apple Intelligence
  "Applebot-Extended",
  // Meta AI (Llama)
  "Meta-ExternalAgent",
  "FacebookBot",
  // ByteDance (Doubao / TikTok search)
  "Bytespider",
  // DuckDuckGo (DuckAssist)
  "DuckAssistBot",
  // Amazon (Alexa / Rufus)
  "Amazonbot",
  // Cohere
  "cohere-ai",
  // Mistral
  "MistralAI-User",
  // You.com
  "YouBot"
];

export const GET: RequestHandler = async () => {
  const aiBlocks = AI_BOTS.map(
    (bot) => `User-agent: ${bot}\nAllow: /\nDisallow: /admin/\nDisallow: /api/`
  ).join("\n\n");

  const body = `# robots.txt de FlowPass
# Sitio: ${siteConfig.url}
# Permitimos rastreo a bots de búsqueda tradicionales y a bots de IA
# generativa para maximizar la aparición del producto en respuestas
# de ChatGPT, Claude, Perplexity, Gemini y otros asistentes.

# ─── Regla general (todos los bots no listados abajo) ──────────
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

# ─── Bots de IA generativa (permitidos explícitamente) ─────────
${aiBlocks}

# ─── Recursos ──────────────────────────────────────────────────
Sitemap: ${siteConfig.url}/sitemap.xml
Host: ${siteConfig.url}

# Guía específica para LLMs (spec: https://llmstxt.org/):
# ${siteConfig.url}/llms.txt
# ${siteConfig.url}/llms-full.txt
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "max-age=86400"
    }
  });
};
