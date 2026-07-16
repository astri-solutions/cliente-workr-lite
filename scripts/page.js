// scripts/page.js
import { siteConfig }  from './site.config.js';
import { initTheme }   from './components/theme.js';
import { initTopbar }  from './components/topbar.js';
import { initHeader }  from './components/header.js';
import { initFooter }  from './components/footer.js';
import { initSearch }  from './components/search.js';
import './icons.js';
import './reveal.js';
import './accordion.js';
import './counter.js';
import './empresa-tabs.js';

// Injeta cores e fontes do CMS antes de qualquer outro componente
initTheme(siteConfig);

// Atualiza title e favicon com os dados do portal
if (siteConfig.company?.name) {
  const raw = document.title.trim();
  // Substitui qualquer título de template ou título simples de página pelo formato correto
  if (!raw || raw.includes('Workr Lite')) {
    document.title = siteConfig.company.name + ' — RI';
  } else {
    document.title = raw + ' — ' + siteConfig.company.name;
  }
}
if (siteConfig.company?.favicon) {
  const faviconEl = document.querySelector('link[rel="icon"]');
  if (faviconEl) faviconEl.setAttribute('href', siteConfig.company.favicon);
}

// Inicializa todos os componentes compartilhados
initTopbar(siteConfig);
initHeader(siteConfig);
initFooter(siteConfig);
initSearch();

// Marca o link ativo no nav
document.querySelectorAll('.nav-dropdown__link').forEach(link => {
  if (link.getAttribute('href') === location.pathname.replace(/\/$/, '') ||
      link.getAttribute('href') === location.pathname + 'index.html') {
    link.setAttribute('aria-current', 'page');
  }
});

// Formulário de contato simples
document.querySelectorAll('[data-contact-form]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelector('[data-form-success]')?.classList.add('is-visible');
    form.reset();
  });
});
