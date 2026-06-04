/**
 * Source unique des données de l'entreprise (src/data/business.json) et
 * dérivations associées : schéma Schema.org, horaires/coordonnées formatés,
 * fourchette de prix. Évite de dupliquer ces faits dans plusieurs JSON.
 *
 * Tout s'exécute au build (Astro statique) — aucun coût côté client.
 */
import business from '../data/business.json';
import content from '../data/content.json';

const seances = content.seances;

type Schema = Record<string, unknown>;

// Jours : ordre de la semaine → libellé FR (affichage) et nom Schema.org (EN).
const FR: Record<string, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche / Jours Fériés',
};
const EN: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

/** "09:00" → "9h" ; "13:30" → "13h30". */
function formatTime(t: string): string {
  const [h, m] = t.split(':');
  return m === '00' ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

/** Coordonnées formatées pour l'affichage / les liens. */
export const emailHref = () => `mailto:${business.email}`;
export const phoneHref = () => `tel:${business.phone.replace(/[^\d+]/g, '')}`;
/** "+33768485414" → "07 68 48 54 14" (format national FR). */
export const phoneDisplay = () =>
  business.phone
    .replace(/^\+33/, '0')
    .replace(/(\d{2})(?=\d)/g, '$1 ')
    .trim();

/** Libellé et lignes d'adresse pour l'affichage. */
export const addressLabel = () => business.address.name;
export const addressLines = () =>
  `${business.address.street}<br>${business.address.postalCode} ${business.address.locality}`;

/** Horaires formatés pour l'affichage : [{ day: "Lundi", time: "9h–12h et 13h30–18h" | "Fermé" }]. */
export function hoursDisplay(): { day: string; time: string }[] {
  return business.hours.map(({ day, ranges }) => ({
    day: FR[day],
    time: ranges.length
      ? ranges.map(([o, c]) => `${formatTime(o)}–${formatTime(c)}`).join(' et ')
      : 'Fermé',
  }));
}

/** Fourchette de prix dérivée des séances : "50 € – 90 €". */
export function priceRange(): string {
  const prices = seances.services.map((s) => parseInt(s.price, 10)).filter((n) => !Number.isNaN(n));
  return `${Math.min(...prices)} € – ${Math.max(...prices)} €`;
}

/** openingHoursSpecification Schema.org : une entrée par jour ouvré et par plage. */
function openingHours(): Schema[] {
  return business.hours.flatMap(({ day, ranges }) =>
    ranges.map(([opens, closes]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: EN[day],
      opens,
      closes,
    })),
  );
}

/**
 * Schéma LocalBusiness complet (Schema.org), enrichi de l'URL canonique et de
 * l'image Open Graph calculées par le layout pour la page courante.
 */
export function localBusinessSchema(url: string, image: string): Schema {
  return {
    '@context': 'https://schema.org',
    '@type': business.type,
    name: business.name,
    description: business.description,
    telephone: business.phone,
    email: business.email,
    priceRange: priceRange(),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${business.address.name}, ${business.address.street}`,
      addressLocality: business.address.locality,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    areaServed: { '@type': 'City', name: business.areaServed },
    openingHoursSpecification: openingHours(),
    sameAs: business.social.map((s) => s.url),
    url,
    image,
  };
}
