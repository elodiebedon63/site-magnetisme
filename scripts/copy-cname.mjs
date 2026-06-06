// Copie le fichier CNAME de la racine vers public/ avant le build Astro.
// Astro recopie ensuite automatiquement public/CNAME dans dist/.
// (cf. hook prebuild dans package.json)
import { existsSync, copyFileSync } from 'node:fs';

const src = 'CNAME';
const dest = 'public/CNAME';

if (existsSync(src)) {
  copyFileSync(src, dest);
  console.log(`[CNAME] ${src} copié dans ${dest}`);
} else {
  console.log('[CNAME] aucun fichier CNAME à la racine, rien à copier');
}
