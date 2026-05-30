// Apparition au défilement : ajoute la classe `.visible` aux éléments `.reveal`
// dès qu'ils entrent dans le viewport (l'animation est gérée en CSS).

export function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  reveals.forEach((el) => observer.observe(el));
}
