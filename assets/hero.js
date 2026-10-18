/* EuroBud hero carousel: reliable automatic rotation, 3 slides, manual arrows, and swipe. */
(() => {
  'use strict';

  const hero = document.querySelector('[data-hero-slider]');
  if (!hero) return;

  const slides = [...hero.querySelectorAll('.hero-slide')];
  const dots = [...hero.querySelectorAll('[data-slide]')];
  const controls = hero.querySelector('.hero-controls');
  const previousButton = hero.querySelector('[data-hero-prev]');
  const nextButton = hero.querySelector('[data-hero-next]');
  const playbackButton = hero.querySelector('[data-hero-pause]');
  const counter = hero.querySelector('[data-slide-count]');
  const status = hero.querySelector('[data-hero-status]');

  if (slides.length < 2 || !controls || !previousButton || !nextButton || !playbackButton) return;

  const interval = 5000;
  let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
  let pausedByUser = false;
  let timer = null;
  let swipeStart = null;

  function syncPauseButton() {
    playbackButton.setAttribute('aria-pressed', String(pausedByUser));
    playbackButton.setAttribute('aria-label', pausedByUser
      ? 'Automatischen Wechsel starten'
      : 'Automatischen Wechsel pausieren');
  }

  function schedule() {
    window.clearTimeout(timer);
    timer = null;
    // The carousel must not stop merely because the pointer rests over the image
    // or because someone has used the slide arrows/dots.
    if (pausedByUser || document.hidden) return;
    timer = window.setTimeout(() => activate(index + 1, false), interval);
  }

  function activate(requested, manual = false) {
    index = (requested + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
      slide.querySelectorAll('a, button').forEach((element) => {
        if (active) element.removeAttribute('tabindex');
        else element.setAttribute('tabindex', '-1');
      });
    });

    dots.forEach((dot, i) => {
      const active = i === index;
      dot.setAttribute('aria-pressed', String(active));
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (counter) counter.textContent = String(index + 1).padStart(2, '0');
    if (manual && status) status.textContent = slides[index].getAttribute('aria-label') || '';
    schedule();
  }

  previousButton.addEventListener('click', () => activate(index - 1, true));
  nextButton.addEventListener('click', () => activate(index + 1, true));
  dots.forEach((dot) => dot.addEventListener('click', () => {
    const destination = Number.parseInt(dot.getAttribute('data-slide'), 10);
    if (Number.isInteger(destination)) activate(destination, true);
  }));

  playbackButton.addEventListener('click', () => {
    pausedByUser = !pausedByUser;
    syncPauseButton();
    schedule();
  });

  controls.addEventListener('keydown', (event) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const target = event.key === 'Home' ? 0
      : event.key === 'End' ? slides.length - 1
      : index + (event.key === 'ArrowRight' ? 1 : -1);
    activate(target, true);
  });

  hero.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch' || event.target.closest('a, button')) return;
    swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }, { passive: true });
  hero.addEventListener('pointerup', (event) => {
    if (!swipeStart || event.pointerId !== swipeStart.id) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      activate(index + (dx < 0 ? 1 : -1), true);
    }
  }, { passive: true });
  hero.addEventListener('pointercancel', () => { swipeStart = null; });

  document.addEventListener('visibilitychange', schedule);

  controls.hidden = false;
  syncPauseButton();
  activate(index);
})();
