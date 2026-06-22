// scripts/components/header.js
import { initNav } from '../nav.js';

export function initHeader(config) {
  const el = document.getElementById('site-header');
  if (!el) return;

  const navItems = config.nav.map(item => {
    if (!item.children || item.children.length === 0) {
      return `
        <li class="nav-list__item">
          <a class="nav-list__trigger nav-list__trigger--link" href="${item.href}">
            ${item.label}
          </a>
        </li>`;
    }

    const children = item.children.map(child =>
      `<li><a class="nav-dropdown__link" href="${child.href}">${child.label}</a></li>`
    ).join('');

    return `
      <li class="nav-list__item nav-list__item--has-sub">
        <button class="nav-list__trigger" type="button"
          aria-haspopup="true" aria-expanded="false" data-nav-trigger>
          ${item.label}
          <svg class="nav-list__chevron" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="4 6 8 10 12 6"/>
          </svg>
        </button>
        <ul class="nav-dropdown">${children}</ul>
      </li>`;
  }).join('');

  el.className = 'site-header';
  el.innerHTML = `
    <div class="site-header__inner">
      <a href="/" class="site-header__brand" aria-label="${config.company.name}">
        <img src="${config.company.logoOriginal}" alt="${config.company.name}"
             class="site-header__logo" />
      </a>
      <nav class="site-header__nav" id="site-nav" data-nav aria-label="Principal">
        <div class="site-header__drawer-top">
          <img src="${config.company.logoNegative}" alt="${config.company.name}"
               class="site-header__drawer-logo" />
          <button class="site-header__drawer-close" type="button"
            aria-label="Fechar menu" data-nav-close>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <ul class="nav-list">${navItems}</ul>
      </nav>
      <div class="site-header__actions">
        <button class="site-header__search" type="button"
          aria-label="Buscar" data-search-toggle>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <button class="site-header__hamburger" type="button"
          aria-label="Abrir menu" aria-expanded="false"
          aria-controls="site-nav" data-nav-hamburger>
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="site-header__overlay" data-nav-overlay aria-hidden="true"></div>`;

  initNav();

  // Alto contraste: trocar logo
  const logoEl = el.querySelector('.site-header__logo');
  if (logoEl && config.company.logoContrast) {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      logoEl.src = html.dataset.contrast === 'on'
        ? config.company.logoContrast
        : config.company.logoOriginal;
    });
    observer.observe(html, { attributes: true, attributeFilter: ['data-contrast'] });
  }
}
