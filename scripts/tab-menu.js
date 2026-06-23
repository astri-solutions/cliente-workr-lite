// scripts/tab-menu.js
// Activates all [data-tab-nav] / [data-tab-panel] sets on the page.

document.querySelectorAll('[data-tab-nav]').forEach(nav => {
  const group = nav.dataset.tabNav;
  const tabs   = nav.querySelectorAll('[data-tab]');
  const panels = document.querySelectorAll(`[data-tab-panel="${group}"]`);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('is-active'));

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const target = document.querySelector(`[data-tab-panel="${group}"][data-panel="${tab.dataset.tab}"]`);
      target?.classList.add('is-active');
    });
  });
});
