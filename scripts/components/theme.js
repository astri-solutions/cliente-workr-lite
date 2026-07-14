// scripts/components/theme.js
// Injeta as cores e fontes do siteConfig como CSS custom properties em runtime.
// Sobrescreve os valores estáticos definidos em _colors.scss e _typography.scss
// sem exigir rebuild de SCSS — basta o CMS atualizar site.config.js.

export function initTheme(config) {
  const colors = config.colors ?? {};
  const fonts  = config.fonts  ?? {};

  // ── Cores ────────────────────────────────────────────────────────────────
  if (colors.primary || colors.secondary || colors.tertiary) {
    const rules = [
      colors.primary   ? `  --color-primary:   ${colors.primary};`   : '',
      colors.secondary ? `  --color-secondary: ${colors.secondary};` : '',
      colors.tertiary  ? `  --color-tertiary:  ${colors.tertiary};`  : '',
    ].filter(Boolean).join('\n');

    const style = document.createElement('style');
    style.id = 'wl-theme-colors';
    style.textContent = `:root {\n${rules}\n}`;
    document.head.appendChild(style);
  }

  // ── Fontes — Google Fonts ─────────────────────────────────────────────────
  const weights = '400;500;600;700';
  const families = [];
  if (fonts.display) {
    families.push(`family=${encodeURIComponent(fonts.display)}:wght@${weights}`);
  }
  if (fonts.body && fonts.body !== fonts.display) {
    families.push(`family=${encodeURIComponent(fonts.body)}:wght@${weights}`);
  }

  if (families.length > 0) {
    const preconn1 = document.createElement('link');
    preconn1.rel = 'preconnect';
    preconn1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconn1);

    const preconn2 = document.createElement('link');
    preconn2.rel = 'preconnect';
    preconn2.href = 'https://fonts.gstatic.com';
    preconn2.crossOrigin = 'anonymous';
    document.head.appendChild(preconn2);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
    document.head.appendChild(link);
  }

  // ── Font-family custom properties ────────────────────────────────────────
  if (fonts.display || fonts.body) {
    const displayFamily = fonts.display ? `'${fonts.display}', sans-serif` : null;
    const bodyFamily    = fonts.body    ? `'${fonts.body}', sans-serif`    : null;

    const rules = [
      displayFamily ? `  --font-display: ${displayFamily};` : '',
      bodyFamily    ? `  --font-body:    ${bodyFamily};`    : '',
    ].filter(Boolean).join('\n');

    const style = document.createElement('style');
    style.id = 'wl-theme-fonts';
    style.textContent = `:root {\n${rules}\n}`;
    document.head.appendChild(style);
  }
}
