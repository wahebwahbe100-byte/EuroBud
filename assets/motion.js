/* EuroBud: a shared, accessible motion system for every page. */
(() => {
  'use strict';
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  if (preference.matches || !('IntersectionObserver' in window)) return;

  const targets = new Set();
  let observer;
  const register = (selector, { direction = '', stagger = 0, columns = 1, start = 0 } = {}) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (targets.has(element) || element.closest('dialog, [hidden]')) return;
      // One animated layer per component keeps forms and text predictable.
      if (element.parentElement?.closest('.motion-item')) return;
      element.classList.add('motion-item');
      const side = typeof direction === 'function' ? direction(element) : direction;
      if (side) element.dataset.motionDirection = side;
      element.style.setProperty('--motion-delay', `${Math.min(start + (index % columns) * stagger, 420)}ms`);
      targets.add(element);
    });
  };
  const reveal = (element, immediate = false) => {
    if (immediate) element.style.setProperty('--motion-delay', '0ms');
    element.classList.add('motion-visible');
    observer?.unobserve(element);
  };
  const revealAll = () => {
    root.classList.remove('motion-ready');
    observer?.disconnect();
    targets.forEach((element) => reveal(element, true));
  };

  try {
    // The first-screen copy enters one line at a time on every page.
    document.querySelectorAll('.hero-copy, .subhero-copy, .services-intro-copy').forEach((copy) => {
      [...copy.children].forEach((element, index) => {
        element.classList.add('motion-item', 'motion-intro');
        element.style.setProperty('--motion-delay', `${Math.min(70 + index * 100, 420)}ms`);
        targets.add(element);
      });
    });
    register('.benefits-grid > div', { stagger: 110, columns: 3 });
    register('.trust-item', { stagger: 95, columns: 4 });
    register('.why-heading > *', { stagger: 110, columns: 2 });
    register('.why-item', { stagger: 110, columns: 4 });
    register('.home-faq-intro', { direction: 'left' });
    register('.home-faq-item', { stagger: 95, columns: 4 });
    register('.section-heading');
    register('.service-card', { stagger: 95, columns: 3 });
    register('.project-card', { stagger: 75, columns: 3 });
    register('.project-filters, .gallery-status, .project-source');
    // Images and their descriptions arrive from opposite sides.
    register('.service-row-photo, .service-row-copy', {
      direction: (element) => {
        const row = element.closest('.service-row');
        const reversed = [...row.parentElement.children].indexOf(row) % 2 === 1;
        const photo = element.classList.contains('service-row-photo');
        return photo !== reversed ? 'left' : 'right';
      }
    });
    register('.about-image', { direction: 'left' });
    register('.about-copy', { direction: 'right' });
    register('.process-step', { stagger: 135, columns: 3 });
    register('.detail-grid > :first-child', { direction: 'left' });
    register('.detail-grid > :last-child', { direction: 'right' });
    register('.values-grid > article', { stagger: 110, columns: 3 });
    register('.contact-copy, .contact-details', { direction: 'left' });
    register('.contact-form-panel, .contact-grid > .inquiry-form', { direction: 'right' });
    register('.faq-grid > :first-child', { direction: 'left' });
    register('.faq details', { stagger: 100, columns: 4 });
    register('.cta-inner');
    register('.footer-top > div', { stagger: 80, columns: 4 });
    register('.legal .narrow > *, .not-found .container > *', { stagger: 70, columns: 3 });
    register('[data-reveal]');

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -3% 0px' });

    // Hidden states exist only after the observer is successfully constructed.
    root.classList.add('motion-ready');
    requestAnimationFrame(() => {
      targets.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.bottom <= 0) reveal(element, true);
        else if (element.classList.contains('motion-intro') && bounds.top < window.innerHeight) reveal(element);
        else observer.observe(element);
      });
    });
    // Keyboard focus, anchor links and printing must never land on hidden text.
    document.addEventListener('focusin', (event) => {
      const element = event.target.closest?.('.motion-item');
      if (element) reveal(element, true);
    });
    window.addEventListener('beforeprint', revealAll);
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) targets.forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight) reveal(element, true);
      });
    });
    preference.addEventListener('change', (event) => { if (event.matches) revealAll(); });
  } catch {
    // Reading the website never depends on animation support.
    revealAll();
  }
})();
