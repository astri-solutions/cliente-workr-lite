// scripts/tab-menu.js
import { siteConfig } from './site.config.js';

// Tabmenu-model portals (header.variant === 'tabmenu') should show a
// persistent horizontal tab bar on every content page, not just the
// homepage — same fix as sidebar-nav.js's initSidebarNav, mirrored for the
// tab-based layout. This runs on every page via page.js.
export function initTabMenu(siteConfig) {
  if (siteConfig?.header?.variant !== 'tabmenu') return;

  const channels = (siteConfig.nav ?? []).filter(ch => ch.enabled !== false);
  if (!channels.length) return;

  const currentPath = location.pathname.replace(/\/$/, '') || '/';

  // The persistent tab bar replaces the top nav — avoid showing both.
  document.getElementById('site-header')?.setAttribute('data-hide-nav', '');

  let nav = document.querySelector('[data-tab-nav="home-tabs"]');

  if (!nav && currentPath !== '/') {
    // A regular content page — strip the hero banner (a 'banner'-model
    // concept) and wrap the real content in the same tab-bar shell the
    // homepage uses.
    const pageSection = document.querySelector('main > .page-section');
    if (!pageSection) return;
    document.querySelector('.page-header')?.remove();

    const container = pageSection.querySelector('.page-section__container') ?? pageSection;

    const newSection = document.createElement('section');
    newSection.className = 'page-section';
    newSection.setAttribute('aria-label', 'Conteúdo RI');
    newSection.innerHTML = `
      <div class="page-section__container">
        <nav class="tab-menu__nav" data-tab-nav="home-tabs" aria-label="Seções de conteúdo"></nav>
        <div class="tab-menu__content"></div>
      </div>`;

    newSection.querySelector('.tab-menu__content').appendChild(container);
    pageSection.replaceWith(newSection);
    nav = newSection.querySelector('[data-tab-nav="home-tabs"]');
  }

  if (!nav) {
    // On the homepage with no channels yet resolved — nothing to render.
    if (currentPath === '/') { location.replace(channels[0].href); return; }
    return;
  }

  if (currentPath === '/') {
    location.replace(channels[0].href);
    return;
  }

  nav.innerHTML = channels.map(ch => {
    const isActive = currentPath === ch.href.replace(/\.html$/, '') || currentPath === ch.href;
    return `<a class="tab-menu__tab${isActive ? ' is-active' : ''}" href="${ch.href}"
      role="tab" aria-selected="${isActive ? 'true' : 'false'}">${ch.label}</a>`;
  }).join('');
}

// Static in-page tab groups unrelated to top-level nav (e.g. empresa tabs
// rendered elsewhere) still use simple client-side panel switching.
document.querySelectorAll('[data-tab-nav]:not([data-tab-nav="home-tabs"])').forEach(staticNav => {
  const group = staticNav.dataset.tabNav;
  const tabs = staticNav.querySelectorAll('[data-tab]');
  const panels = document.querySelectorAll(`[data-tab-panel="${group}"]`);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      document.querySelector(`[data-tab-panel="${group}"][data-panel="${tab.dataset.tab}"]`)
        ?.classList.add('is-active');
    });
  });
});
