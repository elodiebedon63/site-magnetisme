import { defineConfig } from 'vite';
import { resolve, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readdirSync, unlinkSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Plugin de nettoyage post-build :
 * — Vite copie tout `publicDir` (= src/assets/) dans `dist/`.
 * — On garde les sources JPG/PNG localement (pour pouvoir régénérer
 *   des WebP plus tard), mais on ne les publie pas.
 * — On retire aussi les fichiers explicitement non utilisés.
 *
 * Allowlist (gardés en prod) :
 *   - `*.webp` (carrousel + OG + favicon)
 *   - `*.svg`  (logo décoratif + favicon vectoriel)
 *   - `logo-cercle.png` (apple-touch-icon — iOS exige PNG)
 *   - `robots.txt`, `sitemap.xml`
 */
function stripPublicAssets() {
  const KEEP_EXTENSIONS = new Set(['.webp', '.svg', '.txt', '.xml', '.html', '.js', '.css', '.map']);
  const KEEP_FILES = new Set(['logo-cercle.png']);

  return {
    name: 'strip-public-assets',
    apply: 'build',
    closeBundle() {
      const dist = resolve(__dirname, 'dist');
      let removed = 0;
      let kept = 0;
      for (const entry of readdirSync(dist, { withFileTypes: true })) {
        // Les dossiers (notamment `dist/assets/` créé par Vite pour les bundles
        // JS/CSS) sont toujours conservés — on ne filtre qu'au niveau racine.
        if (entry.isDirectory()) {
          kept += 1;
          continue;
        }
        const ext = extname(entry.name).toLowerCase();
        if (KEEP_FILES.has(entry.name) || KEEP_EXTENSIONS.has(ext)) {
          kept += 1;
          continue;
        }
        unlinkSync(join(dist, entry.name));
        removed += 1;
        console.log(`[strip-public-assets] removed ${entry.name}`);
      }
      console.log(`[strip-public-assets] kept ${kept}, removed ${removed}`);
    },
  };
}

export default defineConfig({
  base: '/site-magnetisme/', // remplacer par '/' si DNS
  root: 'src',
  publicDir: 'assets',
  plugins: [stripPublicAssets()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
  server: {
    open: true,
    port: 3000,
  },
});
