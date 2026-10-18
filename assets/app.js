(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const desktopMedia = window.matchMedia('(min-width: 761px)');
  let menuCloseTimer;
  function setMenu(open, restoreFocus = false) {
    if (!menuButton || !mobileNav) return;
    window.clearTimeout(menuCloseTimer);
    mobileNav.classList.remove('is-closing');
    mobileNav.inert = !open;
    if (open) mobileNav.hidden = false;
    else if (!mobileNav.hidden && !desktopMedia.matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      mobileNav.classList.add('is-closing');
      menuCloseTimer = window.setTimeout(() => {
        mobileNav.hidden = true;
        mobileNav.classList.remove('is-closing');
      }, 260);
    } else mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    document.body.classList.toggle('menu-open', open);
    if (restoreFocus) menuButton.focus();
  }
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileNav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  desktopMedia.addEventListener('change', () => { if (desktopMedia.matches) setMenu(false); });
  document.addEventListener('keydown', (event) => {
    if (menuButton?.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') setMenu(false, true);
    if (event.key === 'Tab') {
      const items = [menuButton, ...mobileNav.querySelectorAll('a,button')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-gallery]')];
  const filterStatus = document.querySelector('.filter-status');
  filters.forEach((button) => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
    projects.forEach((project) => {
      project.hidden = category !== 'Alle' && project.dataset.category !== category;
      if (!project.hidden) project.classList.add('motion-visible');
    });
    const count = projects.filter((project) => !project.hidden).length;
    if (filterStatus) filterStatus.textContent = `${count} ${count === 1 ? 'Bild wird' : 'Bilder werden'} angezeigt.`;
  }));

  const lightbox = document.querySelector('.lightbox');
  let activeProject = null;
  function visibleProjects() { return projects.filter((project) => !project.hidden); }
  function showProject(project) {
    if (!lightbox || !project) return;
    activeProject = project;
    const source = project.querySelector('img');
    const picture = lightbox.querySelector('.lightbox-image');
    picture.src = source.getAttribute('src');
    picture.alt = source.alt;
    lightbox.querySelector('.lightbox-title').textContent = project.dataset.title;
    lightbox.querySelector('.lightbox-description').textContent = project.dataset.caption;
    const visible = visibleProjects();
    lightbox.querySelector('.gallery-count').textContent = `${visible.indexOf(project) + 1} / ${visible.length}`;
    lightbox.querySelectorAll('.gallery-prev,.gallery-next').forEach((button) => { button.disabled = visible.length < 2; });
    if (!lightbox.open) {
      lightbox.showModal();
      document.body.classList.add('modal-open');
    }
  }
  function moveProject(offset) {
    const visible = visibleProjects();
    if (!visible.length) return;
    showProject(visible[(visible.indexOf(activeProject) + offset + visible.length) % visible.length]);
  }
  projects.forEach((project) => project.addEventListener('click', () => showProject(project)));
  lightbox?.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox?.querySelector('.gallery-prev').addEventListener('click', () => moveProject(-1));
  lightbox?.querySelector('.gallery-next').addEventListener('click', () => moveProject(1));
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
  lightbox?.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    activeProject?.focus();
  });
  lightbox?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveProject(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveProject(1); }
  });

  const selectedSlug = new URLSearchParams(window.location.search).get('leistung');
  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    const selectedOption = [...form.elements.service.options].find((option) => option.dataset.slug === selectedSlug);
    if (selectedOption) form.elements.service.value = selectedOption.value;
    const result = form.querySelector('.form-result');
    const copyStatus = form.querySelector('.copy-status');
    let message = '';
    form.addEventListener('input', () => {
      // Never leave a previously generated draft available after an edit.
      result.hidden = true;
      copyStatus.textContent = '';
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const details = String(data.get('message') || '').trim();
      const service = String(data.get('service') || '').trim();
      const location = String(data.get('location') || '').trim();
      if (!name || details.length < 10) {
        const field = !name ? form.elements.name : form.elements.message;
        field.setCustomValidity(!name ? 'Bitte geben Sie Ihren Namen ein.' : 'Bitte beschreiben Sie Ihr Projekt in mindestens 10 Zeichen.');
        field.reportValidity();
        field.addEventListener('input', () => field.setCustomValidity(''), { once: true });
        return;
      }
      message = [
        'Hallo EuroBud,', '', 'ich möchte ein Projekt mit Ihnen besprechen.', '',
        `Name: ${name}`, `E-Mail: ${email}`,
        service ? `Bereich: ${service}` : '', location ? `Ort: ${location}` : '', '',
        'Mein Vorhaben:', details, '', 'Ich freue mich auf Ihre Rückmeldung.'
      ].filter((line, index, list) => line !== '' || (index > 0 && list[index - 1] !== '')).join('\n');
      const subject = `Projektanfrage${service ? ' – ' + service : ''} – ${name}`;
      result.querySelector('.email-draft').href = `mailto:zywickisebastian4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      result.querySelector('.whatsapp-draft').href = `https://wa.me/4915212072198?text=${encodeURIComponent(message)}`;
      result.hidden = false;
      result.focus({ preventScroll: true });
      result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
    });
    form.querySelector('.copy-message').addEventListener('click', async () => {
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(message);
        copyStatus.textContent = 'Nachricht kopiert. Sie können sie jetzt in Ihre E-Mail einfügen.';
      } catch {
        copyStatus.textContent = 'Kopieren ist hier nicht verfügbar. Bitte verwenden Sie „E-Mail öffnen“ oder „WhatsApp öffnen“.';
      }
    });
  });
})();
