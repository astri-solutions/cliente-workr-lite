// scripts/sidebar-nav.js
import { siteConfig } from './site.config.js';

// Each channel already has a real, fully-rendered standalone page (with its
// own data-materias/document list/etc. wired up). This nav used to build an
// in-page tab/panel per channel and populate every panel with a static empty
// placeholder that was never connected to real content — clicking a sidebar
// item always showed "Em construção" instead of the channel's actual page.
// Simplest correct fix: navigate to the channel's real page.
function buildSidebar() {
  const navList = document.querySelector('.sidebar-nav__list');
  if (!navList) return;

  const channels = (siteConfig.nav ?? []).filter(ch => ch.enabled !== false);
  if (!channels.length) return;

  const currentPath = location.pathname.replace(/\/$/, '') || '/';

  // This homepage has no content of its own — it only ever showed each
  // channel's (broken) empty panel. Since channels now navigate to their
  // real pages, landing here should go straight to the first one instead
  // of showing a blank content area.
  if (currentPath === '/') {
    location.replace(channels[0].href);
    return;
  }

  navList.innerHTML = channels.map(ch => {
    const isActive = currentPath === ch.href.replace(/\.html$/, '') || currentPath === ch.href;
    return `<li class="sidebar-nav__item">
      <a class="sidebar-nav__btn${isActive ? ' is-active' : ''}" href="${ch.href}"
        role="tab" aria-selected="${isActive ? 'true' : 'false'}">${ch.label}</a>
    </li>`;
  }).join('');
}

buildSidebar();
