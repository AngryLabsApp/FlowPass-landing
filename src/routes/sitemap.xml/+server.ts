// src/routes/sitemap.xml/+server.ts
import type { RequestHandler } from "@sveltejs/kit";
import { siteConfig } from "$lib/config/site";

export const GET: RequestHandler = async () => {
  const base = siteConfig.url;
  const currentDate = new Date().toISOString().split('T')[0];

  const pages = [
    { url: "", priority: "1.0", changefreq: "weekly" },
    { url: "/terminos", priority: "0.3", changefreq: "monthly" },
    // Añade aquí más páginas cuando las tengas
    // { url: "/blog", priority: "0.8", changefreq: "weekly" },
    // { url: "/precios", priority: "0.9", changefreq: "monthly" },
    // { url: "/caracteristicas", priority: "0.9", changefreq: "monthly" },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
      .map(
        (p) => `
      <url>
        <loc>${base}${p.url}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>${p.changefreq}</changefreq>
        <priority>${p.priority}</priority>
      </url>
    `
      )
      .join("")}
  </urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=3600" // Cache por 1 hora
    }
  });
};