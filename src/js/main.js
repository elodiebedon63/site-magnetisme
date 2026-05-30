import linksConfig from '../config/links.json';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── SCROLL HANDLER (nav + parallax, throttle rAF, listener passif) ───
const navbar = document.getElementById('navbar');
const heroBg = prefersReducedMotion ? null : document.getElementById('heroBg');
const parallaxBg = prefersReducedMotion ? null : document.getElementById('parallaxBg');

let scrollTicking = false;
function onScroll() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
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

// ─── REVEAL ON SCROLL ───
const reveals = document.querySelectorAll('.reveal');
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

// ─── BURGER / MOBILE MENU ───
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
let mobileLastFocused = null;

function openMobile() {
  mobileLastFocused = document.activeElement;
  mobileMenu.classList.add('open');
  burgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  const first = mobileMenu.querySelector(FOCUSABLE);
  first?.focus();
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
document.getElementById('closeMenu').addEventListener('click', closeMobile);

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

// CARROUSEL
const slides = document.querySelectorAll('.carousel-slide');
const texts = document.querySelectorAll('.slide-text');
const dots = document.querySelectorAll('.carousel-dot');
const slideNum = document.getElementById('slideNum');
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
  slideNum.textContent = current + 1;
}

document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));
dots.forEach((dot) => dot.addEventListener('click', () => goTo(+dot.dataset.index)));

// ─── SOCIAL LINKS FROM CONFIG ───
function renderSocialLinks() {
  const container = document.querySelector('.social-links');
  if (!container || !linksConfig.social) return;

  container.innerHTML = '';
  linksConfig.social.forEach((link) => {
    const a = document.createElement('a');
    a.className = 'social-link';
    a.href = link.url;
    a.target = '_blank';
    a.title = link.label;
    a.innerHTML = link.icon;
    container.appendChild(a);
  });
}

// ─── NAV LINKS FROM CONFIG ───
function renderNavLinks() {
  const navLinksEl = document.querySelector('.nav-links');
  const mobileMenuEl = document.getElementById('mobileMenu');
  if (!navLinksEl || !linksConfig.nav) return;

  navLinksEl.innerHTML = '';

  linksConfig.nav.forEach((item) => {
    const li = document.createElement('li');

    // 👉 CAS GOOGLE CALENDAR
    if (item.type === 'calendar') {
      const container = document.createElement('div');
      container.id = 'calendarBtnNav';
      li.appendChild(container);
    } else {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      li.appendChild(a);
    }

    navLinksEl.appendChild(li);
  });

  // MOBILE
  if (mobileMenuEl) {
    const closeBtn = mobileMenuEl.querySelector('.mobile-close');
    mobileMenuEl.innerHTML = '';
    if (closeBtn) mobileMenuEl.appendChild(closeBtn);

    linksConfig.nav.forEach((item) => {
      if (item.type === 'calendar') {
        const div = document.createElement('div');
        div.id = 'calendarBtnMobile';
        // Ferme le menu mobile dès qu'un clic remonte du slot (y compris le
        // bouton Google injecté plus tard de façon async).
        div.addEventListener('click', closeMobile);
        mobileMenuEl.appendChild(div);
      } else {
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        a.addEventListener('click', closeMobile);
        mobileMenuEl.appendChild(a);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavLinks();
  renderSocialLinks();

  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

window.addEventListener('load', function () {
  const url =
    'https://calendar.google.com/calendar/appointments/schedules/AcZssZ16iinafw-9OpOMxmRSyT2MBK7xkPyoqgdx8vp7mH2tLkiVEgGKk23ZOHJq_tL7j6KuMOb-cYLf?gv=true';
  const config = {
    url,
    color: '#0B6281',
    label: 'Prendre rendez-vous',
  };

  const targets = [
    document.getElementById('calendarBtn'),
    document.getElementById('calendarBtnNav'),
    document.getElementById('calendarBtnMobile'),
  ].filter(Boolean);

  if (targets.length === 0) return;

  if (typeof calendar === 'undefined' || !calendar.schedulingButton) {
    targets.forEach((target) => {
      target.innerHTML = `<a class="hero-cta" href="${url}" target="_blank" rel="noopener noreferrer">${config.label}</a>`;
    });
    return;
  }

  targets.forEach((target) => {
    calendar.schedulingButton.load({ ...config, target });
  });
});
