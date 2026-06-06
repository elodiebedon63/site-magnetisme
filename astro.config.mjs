import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

// --- Déploiement : github.io par défaut, ou domaine dédié (DNS custom) ---
// Le domaine dédié est résolu dans cet ordre de priorité :
//   1. Fichier CNAME à la racine du dépôt (créé/maintenu automatiquement par GitHub
//      quand on configure un domaine dans Settings → Pages).
//   2. Variable d'environnement CUSTOM_DOMAIN (ex. injectée par la CI via vars.CUSTOM_DOMAIN).
// Si aucun domaine n'est trouvé → valeurs par défaut (GitHub Pages sous /site-magnetisme/).
function resolveCustomDomain() {
  if (existsSync('./CNAME')) {
    const fromFile = readFileSync('./CNAME', 'utf8').trim();
    if (fromFile) return fromFile;
  }
  return process.env.CUSTOM_DOMAIN?.trim() || '';
}

const customDomain = resolveCustomDomain();

// Domaine dédié → racine du domaine ; sinon → sous-chemin GitHub Pages.
const site = customDomain ? `https://${customDomain}` : 'https://elodiebedon63.github.io';
const base = customDomain ? '/' : '/site-magnetisme/';

// Recopie le domaine dédié dans dist/CNAME pour que l'artefact publié (déploiement
// via GitHub Actions) conserve le rattachement au domaine custom.
const customDomainCNAME = {
  name: 'custom-domain-cname',
  hooks: {
    'astro:build:done': ({ dir }) => {
      if (!customDomain) return;
      writeFileSync(new URL('CNAME', dir), `${customDomain}\n`);
      console.log(`[CNAME] domaine dédié écrit dans dist/CNAME : ${customDomain}`);
    },
  },
};

// https://astro.build/config
export default defineConfig({
  // Génère sitemap-index.xml + sitemap-0.xml au build (toutes les pages de src/pages/).
  // Les URLs reprennent automatiquement `site` + `base`.
  integrations: [sitemap(), customDomainCNAME],
  // URL de production (sert au sitemap, aux URLs canoniques, aux balises Open Graph).
  site,
  // Sous-chemin GitHub Pages. Toujours accéder à un asset de `public/` via
  // `import.meta.env.BASE_URL` pour rester compatible avec ce préfixe.
  base,
  build: {
    // Regroupe le CSS en un seul fichier plutôt qu'un par composant : adapté à un site vitrine.
    inlineStylesheets: 'never',
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
});
