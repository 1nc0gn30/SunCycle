export const prerender = true;

import type { APIRoute } from "astro";

const SITE = "https://suncycle.app";

export const GET: APIRoute = () => {
  const updated = new Date().toUTCString();
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0">\n` +
    `  <channel>\n` +
    `    <title>SunCycle updates</title>\n` +
    `    <link>${SITE}/</link>\n` +
    `    <description>SunCycle release and science notes.</description>\n` +
    `    <language>en</language>\n` +
    `    <lastBuildDate>${updated}</lastBuildDate>\n` +
    `    <item>\n` +
    `      <title>SunCycle 1.0 — personal circadian light scheduler</title>\n` +
    `      <link>${SITE}/</link>\n` +
    `      <guid>${SITE}/#1.0</guid>\n` +
    `      <pubDate>${updated}</pubDate>\n` +
    `      <description>Initial release. Solar geometry, photobiology, four-window prescription, deep-linkable plans.</description>\n` +
    `    </item>\n` +
    `  </channel>\n` +
    `</rss>\n`;
  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
