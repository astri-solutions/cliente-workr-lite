// scripts/sidebar-nav.js

document.querySelectorAll('[data-sidebar-nav]').forEach(nav => {
  const id = nav.dataset.sidebarNav;
  const btns = nav.querySelectorAll('.sidebar-nav__btn');
  const panels = document.querySelectorAll(`[data-sidebar-panel="${id}"]`);

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.panel;

      btns.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('is-active'));

      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      document.querySelector(`[data-sidebar-panel="${id}"][data-panel="${target}"]`)
        ?.classList.add('is-active');
    });
  });
});
