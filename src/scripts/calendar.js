// Bouton « Prendre rendez-vous » Google Agenda, injecté dans les emplacements
// #calendarBtn / #calendarBtnNav / #calendarBtnMobile au chargement complet.
// Repli gracieux (lien direct) si le script Google est bloqué.

const SCHEDULING_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ16iinafw-9OpOMxmRSyT2MBK7xkPyoqgdx8vp7mH2tLkiVEgGKk23ZOHJq_tL7j6KuMOb-cYLf?gv=true';

export function initCalendar() {
  window.addEventListener('load', () => {
    const config = { url: SCHEDULING_URL, color: '#0B6281', label: 'Prendre rendez-vous' };

    const targets = [
      document.getElementById('calendarBtn'),
      document.getElementById('calendarBtnNav'),
      document.getElementById('calendarBtnMobile'),
    ].filter(Boolean);

    if (targets.length === 0) return;

    // Script Google indisponible (adblocker, hors-ligne…) → lien de secours.
    if (typeof calendar === 'undefined' || !calendar.schedulingButton) {
      targets.forEach((target) => {
        target.innerHTML = `<a class="hero-cta" href="${SCHEDULING_URL}" target="_blank" rel="noopener noreferrer">${config.label}</a>`;
      });
      return;
    }

    targets.forEach((target) => {
      calendar.schedulingButton.load({ ...config, target });
    });
  });
}
