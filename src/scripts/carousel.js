// Carrousel « À propos » : synchronise images, textes, pastilles et compteur.

export function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const texts = document.querySelectorAll('.slide-text');
  const dots = document.querySelectorAll('.carousel-dot');
  const slideNum = document.getElementById('slideNum');
  if (slides.length === 0) return;

  let current = 0;

  function goTo(index) {
    slides[current].classList.remove('active');
    slides[current].setAttribute('aria-hidden', 'true');
    texts[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].removeAttribute('aria-current');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');
    texts[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-current', 'true');
    if (slideNum) slideNum.textContent = current + 1;
  }

  document.getElementById('prevBtn')?.addEventListener('click', () => goTo(current - 1));
  document.getElementById('nextBtn')?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot) => dot.addEventListener('click', () => goTo(+dot.dataset.index)));
}
