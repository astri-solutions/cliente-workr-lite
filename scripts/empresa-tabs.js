// scripts/empresa-tabs.js
// Inicializa o tabmenu por empresa em páginas de lista/resultados/documentos.
// Lê siteConfig.empresas: se length > 1, exibe abas; se único/nenhum, achata painéis.
import { siteConfig } from './site.config.js';

const empresas = siteConfig.empresas ?? [];

document.querySelectorAll('[data-empresa-section]').forEach(section => {
  const nav = section.querySelector('[data-tab-nav]');
  if (!nav) return;

  const group  = nav.dataset.tabNav;
  const tabs   = nav.querySelectorAll('[data-tab]');
  const panels = section.querySelectorAll(`[data-tab-panel="${group}"]`);

  if (empresas.length <= 1) {
    // Portal com empresa única: oculta o nav, mostra todos os painéis diretamente.
    nav.hidden = true;
    panels.forEach(p => p.classList.add('is-active'));
    return;
  }

  // Múltiplas empresas: atualiza rótulos das abas pelo config e ativa a primeira.
  tabs.forEach(tab => {
    const emp = empresas.find(e => e.id === tab.dataset.tab);
    if (emp) tab.textContent = emp.label;
  });

  // Garante estado inicial correto (primeira aba ativa).
  if (![...tabs].some(t => t.classList.contains('is-active'))) {
    tabs[0]?.classList.add('is-active');
    tabs[0]?.setAttribute('aria-selected', 'true');
    panels[0]?.classList.add('is-active');
  }

  // Ativa abas ao clicar.
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const target = section.querySelector(`[data-tab-panel="${group}"][data-panel="${tab.dataset.tab}"]`);
      target?.classList.add('is-active');
    });
  });
});
