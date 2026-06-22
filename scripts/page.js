// scripts/page.js
import { siteConfig }  from './site.config.js';
import { initTopbar }  from './components/topbar.js';
import { initHeader }  from './components/header.js';
import { initFooter }  from './components/footer.js';
import { initSearch }  from './components/search.js';
import './reveal.js';
import './accordion.js';

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
