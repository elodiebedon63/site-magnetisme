/**
 * Génère le JSON-LD (Schema.org LocalBusiness) du site dans debug/json-ld.json,
 * à des fins de débogage / validation (Rich Results Test, Schema Markup Validator…).
 *
 * Réutilise la source unique src/lib/business.ts (donc src/data/business.json) en
 * la chargeant via Vite — exactement comme le fait Astro au build, sans dupliquer
 * la logique du schéma. L'URL canonique et l'image Open Graph sont reconstituées
 * à partir de astro.config.mjs (site + base) et de l'image par défaut du layout.
 *
 * Usage : npm run debug:jsonld
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import astroConfig from '../astro.config.mjs';

// Image Open Graph par défaut (cf. BaseLayout.astro : ogImage).
const DEFAULT_OG_IMAGE = 'elodie-bedon-cabinet.jpg';

const { site, base } = astroConfig;
const pageUrl = new URL(base, site).href;
const imageUrl = new URL(`${base}${DEFAULT_OG_IMAGE}`, site).href;

// Charge business.ts via Vite (gère TS + import de JSON comme au build Astro).
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'silent',
});

try {
  const { localBusinessSchema } = await vite.ssrLoadModule('/src/lib/business.ts');
  const schema = localBusinessSchema(pageUrl, imageUrl);

  const outDir = fileURLToPath(new URL('../debug/', import.meta.url));
  const outFile = `${outDir}json-ld.json`;
  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, JSON.stringify(schema, null, 2) + '\n', 'utf8');

  console.log(`JSON-LD généré : debug/json-ld.json (${pageUrl})`);
} finally {
  await vite.close();
}
