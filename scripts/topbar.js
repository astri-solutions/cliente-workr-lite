// scripts/topbar.js
import { setLang } from './lib/i18n.js';

export function initTopbarBehavior() {
  // Tickers: rotação automática se houver mais de um
  const tickers = document.querySelectorAll('[data-topbar-ticker]');
  if (tickers.length > 1) {
    let current = 0;
    setInterval(() => {
      tickers[current].classList.remove('is-active');
      current = (current + 1) % tickers.length;
      tickers[current].classList.add('is-active');
    }, 4000);
  }

  // Acessibilidade
  document.querySelectorAll('[data-a11y]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.a11y;
      const html   = document.documentElement;

      if (action === 'contrast') {
        const on = html.dataset.contrast === 'on';
        html.dataset.contrast = on ? 'off' : 'on';
        btn.setAttribute('aria-pressed', String(!on));
      }

      if (action === 'font-up' || action === 'font-down') {
        const current = parseFloat(getComputedStyle(html).fontSize) || 16;
        const next    = action === 'font-up'
          ? Math.min(current + 2, 22)
          : Math.max(current - 2, 12);
        html.style.fontSize = next + 'px';
      }
    });
  });

  // Idioma — troca o idioma de todo o conteúdo do site, não só o botão ativo.
  // A escolha é persistida e a página recarrega para que todo componente
  // (documentos, resultados, textos estáticos) releia o idioma atual.
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.lang;
      if (document.documentElement.lang === code) return;
      setLang(code);
      document.documentElement.lang = code;
      location.reload();
    });
  });
}
