// Point d'entrée des comportements client, chargé par BaseLayout.astro.
// Chaque comportement vit dans son propre module ; on les initialise ici.
// Les fonctions sont sûres si leurs éléments sont absents d'une page (elles
// sortent tôt), donc ce même point d'entrée convient à toutes les pages.
import { initScroll } from './scroll.js';
import { initReveal } from './reveal.js';
import { initMobileMenu } from './mobile-menu.js';
import { initCarousel } from './carousel.js';
import { initCalendar } from './calendar.js';

// Les scripts type="module" sont différés : le DOM est prêt à l'exécution.
initScroll();
initReveal();
initMobileMenu();
initCarousel();
initCalendar();
