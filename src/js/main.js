import linksConfig from '../config/links.json';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── NAV SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── PARALLAX ───
if (!prefersReducedMotion) {
  const heroBg = document.getElementById('heroBg');
  const parallaxBg = document.getElementById('parallaxBg');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroBg) heroBg.style.transform = `translateY(${y * 0.32}px)`;
    if (parallaxBg) {
      const rect = parallaxBg.parentElement.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.18;
      parallaxBg.style.transform = `translateY(${offset}px)`;
    }
  });
}

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

burgerBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
document.getElementById('closeMenu').addEventListener('click', () => mobileMenu.classList.remove('open'));

window.closeMobile = function () {
  mobileMenu.classList.remove('open');
};

// CARROUSEL
const slides     = document.querySelectorAll('.carousel-slide');
const texts      = document.querySelectorAll('.slide-text');
const dots       = document.querySelectorAll('.carousel-dot');
const slideNum   = document.getElementById('slideNum');
let current = 0;
let autoTimer;

function goTo(index) {
  slides[current].classList.remove('active');
  texts[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
  texts[current].classList.add('active');
  dots[current].classList.add('active');
  slideNum.textContent = current + 1;
}

document.getElementById('prevBtn').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
document.getElementById('nextBtn').addEventListener('click', () => { goTo(current + 1); resetAuto(); });
dots.forEach(dot => dot.addEventListener('click', () => { goTo(+dot.dataset.index); resetAuto(); }));

// function resetAuto() { clearInterval(autoTimer); autoTimer = setInterval(() => goTo(current + 1), 5000); }
// resetAuto();

// ─── FORM ───
window.handleSubmit = function (e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.textContent = 'Message envoyé ✓';
  btn.style.background = 'var(--sage-dark)';
  btn.disabled = true;
};

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
    } 
    else {
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
        mobileMenuEl.appendChild(div);
      } else {
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.label;
        a.addEventListener('click', () => window.closeMobile());
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


document.addEventListener('DOMContentLoaded', function () {
  const openBtn = document.getElementById('openVideoModal');
  const modal = document.getElementById('videoModal');
  const closeBtn = document.getElementById('closeVideoModal');
  const iframe = document.getElementById('youtubeIframe');

  if (openBtn && modal && closeBtn) {
    openBtn.addEventListener('click', function () {
      modal.style.display = 'flex';
    });
    closeBtn.addEventListener('click', function () {
      modal.style.display = 'none';
      // Stop la vidéo quand on ferme
      iframe.src = iframe.src;
    });
    window.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        iframe.src = iframe.src;
      }
    });
  }
});
