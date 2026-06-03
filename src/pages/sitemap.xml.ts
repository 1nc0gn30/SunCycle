export const prerender = true;

import type { APIRoute } from "astro";

const SITE = "https://suncycle.app";
const PAGES = ["", "/science", "/chronotype", "/about"];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    PAGES
      .map(
        (p) =>
          `  <url>\n    <loc>${SITE}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${p === "" ? "1.0" : "0.7"}</priority>\n  </url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
};
