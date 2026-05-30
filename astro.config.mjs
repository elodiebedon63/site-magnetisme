import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Génère sitemap-index.xml + sitemap-0.xml au build (toutes les pages de src/pages/).
  // Les URLs reprennent automatiquement `site` + `base`.
  integrations: [sitemap()],
  // URL de production (sert au sitemap, aux URLs canoniques, aux balises Open Graph).
  site: 'https://elodiebedon63.github.io',
  // Sous-chemin GitHub Pages. Remplacer par '/' si le site passe sur un domaine dédié.
  // Toujours accéder à un asset de `public/` via `import.meta.env.BASE_URL` pour rester
  // compatible avec ce préfixe (voir _doc/organisation.md).
  base: '/site-magnetisme/',
  build: {
    // Regroupe le CSS en un seul fichier plutôt qu'un par composant : adapté à un site vitrine.
    inlineStylesheets: 'never',
  },
  server: {
    port: 3000,
    open: true,
  },
});
