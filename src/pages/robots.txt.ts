import type { APIRoute } from 'astro';

// Génère /robots.txt au build. L'URL du sitemap est dérivée de `site` + `base`
// (astro.config.mjs) : pas besoin de la maintenir à la main.
const getRobotsTxt = (sitemapURL: URL) => `User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL(`${import.meta.env.BASE_URL}sitemap-index.xml`, site);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
