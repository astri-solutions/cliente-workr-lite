// scripts/components/footer.js
export function initFooter(config) {
  const el = document.getElementById('site-footer');
  if (!el) return;

  const { footer, company } = config;

  const columns = (footer.columns || []).map(col => `
    <div class="site-footer__block">
      <h4>${col.title}</h4>
      <ul>${col.links.map(l =>
        `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
      </ul>
    </div>`).join('');

  const legalLinks = (footer.legalLinks || []).map(l =>
    `<a href="${l.href}">${l.label}</a>`).join('');

  el.className = 'site-footer';
  el.innerHTML = `
    <div class="site-footer__inner">
      <div class="site-footer__top">
        <img src="${company.logoNegative}" alt="${company.name}" class="site-footer__logo" />
      </div>
      <div class="site-footer__grid">
        <div class="site-footer__info">
          <div class="site-footer__block">
            <h4>Endereço</h4>
            <p class="site-footer__address-text">${footer.address}</p>
          </div>
          <div class="site-footer__block">
            <h4>Entre em Contato</h4>
            <div class="site-footer__contact-details">
              <a href="mailto:${footer.email}">${footer.email}</a>
              <a href="tel:${footer.phone.replace(/\D/g,'')}">${footer.phone}</a>
              <p>${footer.hours}</p>
            </div>
          </div>
        </div>
        ${columns}
      </div>
      <div class="site-footer__bottom">
        <div class="site-footer__bottom-row site-footer__bottom-row--spread">
          <div class="site-footer__bottom-links">${legalLinks}</div>
          <div class="site-footer__social">
            <span>Siga a ${company.nameShort}:</span>
            ${footer.social.linkedin !== '#' ? `
            <a href="${footer.social.linkedin}" aria-label="LinkedIn" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
            </a>` : ''}
          </div>
        </div>
        <div class="site-footer__bottom-row site-footer__bottom-row--spread">
          <span>${footer.copyright}</span>
          <a href="https://astri.solutions" class="site-footer__powered" target="_blank" rel="noopener">
            <span>Powered by</span>
            <img src="/assets/logotipo/logotipo-negative.svg" alt="Astri Solutions" />
          </a>
        </div>
        <p class="site-footer__legal">${footer.legalText || ''}</p>
      </div>
    </div>`;
}
