// scripts/nav.js
export function initNav() {
  const nav       = document.querySelector('[data-nav]');
  const hamburger = document.querySelector('[data-nav-hamburger]');
  const closeBtn  = document.querySelector('[data-nav-close]');
  const overlay   = document.querySelector('[data-nav-overlay]');
  const triggers  = document.querySelectorAll('[data-nav-trigger]');

  // Drawer mobile
  function openDrawer() {
    nav?.classList.add('is-open');
    overlay?.classList.add('is-visible');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    nav?.classList.remove('is-open');
    overlay?.classList.remove('is-visible');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  // Dropdowns desktop
  triggers.forEach(trigger => {
    const item = trigger.closest('.nav-list__item');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('nav-list__item--open');

      // Fechar todos
      document.querySelectorAll('.nav-list__item--open').forEach(el => {
        el.classList.remove('nav-list__item--open');
        el.querySelector('[data-nav-trigger]')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('nav-list__item--open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Fechar ao clicar fora
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-list__item')) {
      document.querySelectorAll('.nav-list__item--open').forEach(el => {
        el.classList.remove('nav-list__item--open');
        el.querySelector('[data-nav-trigger]')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Scroll hide/show
  let lastY = 0;
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      header?.classList.toggle('is-hidden', y > lastY && y > 200);
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled', 'is-hidden');
    }
    lastY = y;
  }, { passive: true });
}
