import type { RequestHandler } from "@sveltejs/kit";
import { siteConfig } from "$lib/config/site";

export const GET: RequestHandler = async () => {
  const body = `
User-agent: *
Allow: /
Disallow: /admin/  # Si tienes rutas de admin, deshabilítalas
Disallow: /api/    # Deshabilitar APIs internas

Sitemap: ${siteConfig.url}/sitemap.xml
Host: ${siteConfig.url}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "max-age=86400"
    }
  });
};