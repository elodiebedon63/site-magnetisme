import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Formate une date au format français jj/mm/aaaa.
function formatFr(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

// Date de dernière modification d'une page, déterminée au build à partir de la
// date du dernier commit Git touchant le fichier (jj/mm/aaaa). Ainsi la mention
// « Dernière mise à jour » ne change que lorsque le contenu de la page change.
//
// Appeler avec `import.meta.url` depuis la page (.astro) concernée.
// Repli sur la date du jour si Git est indisponible ou le fichier non encore
// commité (ex. dev local). NB : en CI, le checkout doit récupérer l'historique
// complet (fetch-depth: 0) pour que la date soit exacte (cf. deploy.yml).
export function lastModified(moduleUrl: string): string {
  const filePath = fileURLToPath(moduleUrl);
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: 'utf8',
    }).trim();
    if (iso) return formatFr(new Date(iso));
  } catch {
    // git absent / hors dépôt → repli ci-dessous
  }
  return formatFr(new Date());
}
