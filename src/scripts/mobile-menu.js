// Menu mobile : ouverture/fermeture via le burger, piège de focus, fermeture au
// clic sur un lien et à la touche Échap.

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function initMobileMenu() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!burgerBtn || !mobileMenu) return;

  let mobileLastFocused = null;

  function openMobile() {
    mobileLastFocused = document.activeElement;
    mobileMenu.classList.add('open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileMenu.querySelector(FOCUSABLE)?.focus();
  }

  function closeMobile() {
    mobileMenu.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (mobileLastFocused && typeof mobileLastFocused.focus === 'function') {
      mobileLastFocused.focus();
    }
  }

  burgerBtn.addEventListener('click', openMobile);
  document.getElementById('closeMenu')?.addEventListener('click', closeMobile);

  // Le menu se ferme dès qu'un lien (ou le slot calendrier) est activé.
  mobileMenu.querySelectorAll('a, #calendarBtnMobile').forEach((el) => {
    el.addEventListener('click', closeMobile);
  });

  document.addEventListener('keydown', (e) => {
    if (!mobileMenu.classList.contains('open')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeMobile();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = mobileMenu.querySelectorAll(FOCUSABLE);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
