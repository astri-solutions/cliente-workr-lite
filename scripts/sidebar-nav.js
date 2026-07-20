// scripts/sidebar-nav.js
// Sidebar-model portals (header.variant === 'sidebar') should show a
// persistent left nav on every content page, not just the homepage — and
// none of these pages should show the big hero banner, which is a
// 'banner'-model concept. This runs on every page via page.js and
// transforms the page in place when needed.
export function initSidebarNav(siteConfig) {
  if (siteConfig?.header?.variant !== 'sidebar') return;

  const channels = (siteConfig.nav ?? []).filter(ch => ch.enabled !== false);
  if (!channels.length) return;

  const currentPath = location.pathname.replace(/\/$/, '') || '/';

  // The homepage has no content of its own — land straight on the first channel.
  if (currentPath === '/') {
    location.replace(channels[0].href);
    return;
  }

  // The persistent side nav replaces the top nav — avoid showing both.
  document.getElementById('site-header')?.setAttribute('data-hide-nav', '');

  let navList = document.querySelector('.sidebar-nav__list');

  if (!navList) {
    // A regular content page (documentos-cvm.html, mailing.html, etc.) —
    // these ship with the 'banner'-model hero + top nav by default since the
    // same static files are shared across every layout. Strip the hero and
    // wrap the real content in the same persistent sidebar shell the
    // homepage uses, instead of duplicating a whole separate template.
    const pageSection = document.querySelector('main > .page-section');
    if (!pageSection) return;
    document.querySelector('.page-header')?.remove();

    const container = pageSection.querySelector('.page-section__container') ?? pageSection;

    const newSection = document.createElement('section');
    newSection.className = 'page-section page-section--flush-top';
    newSection.setAttribute('aria-label', 'Conteúdo RI');
    newSection.innerHTML = `
      <div class="page-section__container">
        <div class="sidebar-layout">
          <aside class="sidebar-nav" aria-label="Seções de conteúdo">
            <ul class="sidebar-nav__list"></ul>
          </aside>
          <div class="sidebar-content"></div>
        </div>
      </div>`;

    newSection.querySelector('.sidebar-content').appendChild(container);
    pageSection.replaceWith(newSection);
    navList = newSection.querySelector('.sidebar-nav__list');
  }

  navList.innerHTML = channels.map(ch => {
    const isActive = currentPath === ch.href.replace(/\.html$/, '') || currentPath === ch.href;
    return `<li class="sidebar-nav__item">
      <a class="sidebar-nav__btn${isActive ? ' is-active' : ''}" href="${ch.href}"
        role="tab" aria-selected="${isActive ? 'true' : 'false'}">${ch.label}</a>
    </li>`;
  }).join('');
}
