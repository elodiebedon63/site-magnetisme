// Effet de défilement : ombre/fond de la nav + parallaxe du hero et du bandeau.
// Throttle via requestAnimationFrame, listener passif. Respecte prefers-reduced-motion.

export function initScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const navbar = document.getElementById('navbar');
  const heroBg = prefersReducedMotion ? null : document.getElementById('heroBg');
  const parallaxBg = prefersReducedMotion ? null : document.getElementById('parallaxBg');

  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (navbar) navbar.classList.toggle('scrolled', y > 60);
      if (heroBg) heroBg.style.transform = `translateY(${y * 0.32}px)`;
      if (parallaxBg) {
        const rect = parallaxBg.parentElement.getBoundingClientRect();
        const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.18;
        parallaxBg.style.transform = `translateY(${offset}px)`;
      }
      scrollTicking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}
