// scripts/components/topbar.js
import { initTopbarBehavior } from '../topbar.js';

export function initTopbar(config) {
  const el = document.getElementById('site-topbar');
  if (!el) return;

  const tickers = config.tickers.map((t, i) => `
    <div class="topbar__ticker${i === 0 ? ' is-active' : ''}" data-topbar-ticker>
      <span class="topbar__ticker-symbol">${t.symbol}</span>
      <span class="topbar__ticker-dot" aria-hidden="true">·</span>
      <span class="topbar__ticker-price">${t.price}</span>
      <span class="topbar__ticker-change topbar__ticker-change--${t.direction}"
        aria-label="${t.direction === 'up' ? 'Alta' : 'Baixa'} de ${t.change}">
        <svg viewBox="0 0 10 10" width="8" height="8" fill="currentColor" aria-hidden="true">
          <path d="${t.direction === 'up' ? 'M5 2 9 8H1z' : 'M5 8 9 2H1z'}"/>
        </svg>
        ${t.change}
      </span>
    </div>`).join('');

  el.className = 'topbar';
  el.setAttribute('role', 'navigation');
  el.setAttribute('aria-label', 'Barra de utilitários');
  el.innerHTML = `
    <div class="topbar__inner">
      <div class="topbar__left">
        <a href="/" class="topbar__link topbar__link--active">Relações com Investidores</a>
        <span class="topbar__sep" aria-hidden="true"></span>
        <a href="#" class="topbar__link">Institucional</a>
      </div>
      <div class="topbar__tickers" aria-label="Cotação" aria-live="polite">
        ${tickers}
      </div>
      <div class="topbar__right">
        <div class="topbar__a11y" role="group" aria-label="Acessibilidade">
          <span class="topbar__a11y-label">Acessibilidade</span>
          <button class="topbar__a11y-btn" type="button" data-a11y="contrast"
            aria-label="Alternar alto contraste" data-tooltip="Alto contraste">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
              <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>
            </svg>
          </button>
          <button class="topbar__a11y-btn topbar__a11y-btn--font-up" type="button"
            data-a11y="font-up" aria-label="Aumentar fonte" data-tooltip="Aumentar texto">A<sup>+</sup></button>
          <button class="topbar__a11y-btn topbar__a11y-btn--font-down" type="button"
            data-a11y="font-down" aria-label="Reduzir fonte" data-tooltip="Reduzir texto">A<sup>-</sup></button>
        </div>
        <div class="topbar__sep" aria-hidden="true"></div>
        <div class="topbar__lang" role="group" aria-label="Idioma">
          <button class="topbar__lang-btn is-active" type="button"
            data-lang="pt" aria-pressed="true" data-tooltip="Português">PT</button>
          <span class="topbar__lang-sep" aria-hidden="true">|</span>
          <button class="topbar__lang-btn" type="button"
            data-lang="en" aria-pressed="false" data-tooltip="English">EN</button>
        </div>
      </div>
    </div>`;

  initTopbarBehavior();
}
