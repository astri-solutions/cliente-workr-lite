// scripts/components/theme.js
// Injeta as cores e fontes do siteConfig como CSS custom properties em runtime.
// Sobrescreve os valores estáticos definidos em _colors.scss e _typography.scss
// sem exigir rebuild de SCSS — basta o CMS atualizar site.config.js.

// ── Color utilities ──────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3
    ? h.split('').map(c => c + c).join('')
    : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Relative luminance for WCAG contrast
function luminance({ r, g, b }) {
  const c = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

// Generate 9-step scale (100–900) from a base hex color
function buildScale(hex) {
  const rgb = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(rgb);

  // Lightness targets for each shade — keeping hue/saturation, varying L
  // Shades 100-400 are lighter, 600-900 are darker
  const targets = {
    100: Math.min(97, l + (97 - l) * 0.90),
    200: Math.min(97, l + (97 - l) * 0.75),
    300: Math.min(97, l + (97 - l) * 0.55),
    400: Math.min(97, l + (97 - l) * 0.30),
    500: l,
    600: Math.max(0, l - (l) * 0.15),
    700: Math.max(0, l - (l) * 0.30),
    800: Math.max(0, l - (l) * 0.50),
    900: Math.max(0, l - (l) * 0.70),
  };

  // Desaturate lighter shades slightly so they feel natural
  const satScale = {
    100: s * 0.15, 200: s * 0.25, 300: s * 0.40, 400: s * 0.65,
    500: s,
    600: s * 0.90, 700: s * 0.80, 800: s * 0.70, 900: s * 0.60,
  };

  const scale = {};
  for (const shade of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {
    scale[shade] = hslToHex(h, satScale[shade], targets[shade]);
  }
  return scale;
}

function onColor(hex) {
  return luminance(hexToRgb(hex)) > 0.179 ? '#000000' : '#ffffff';
}

// ── Main ─────────────────────────────────────────────────────────────────────

export function initTheme(config) {
  const colors = config.colors ?? {};
  const fonts  = config.fonts  ?? {};

  // ── Cores ────────────────────────────────────────────────────────────────
  const rules = [];

  if (colors.primary) {
    const scale = buildScale(colors.primary);
    const on    = onColor(colors.primary);
    rules.push(
      `  --color-primary:        ${scale[500]};`,
      `  --color-primary-light:  ${scale[100]};`,
      `  --color-primary-hover:  ${scale[700]};`,
      `  --color-primary-active: ${scale[900]};`,
      `  --color-on-primary:     ${on};`,
      ...([100,200,300,400,500,600,700,800,900].map(n =>
        `  --color-primary-${n}:    ${scale[n]};`
      )),
    );
  }

  if (colors.secondary) {
    const scale = buildScale(colors.secondary);
    const on    = onColor(colors.secondary);
    rules.push(
      `  --color-secondary:        ${scale[500]};`,
      `  --color-secondary-light:  ${scale[100]};`,
      `  --color-secondary-hover:  ${scale[700]};`,
      `  --color-on-secondary:     ${on};`,
      ...([100,200,300,400,500,600,700,800,900].map(n =>
        `  --color-secondary-${n}:   ${scale[n]};`
      )),
    );
  }

  if (colors.tertiary) {
    rules.push(`  --color-tertiary: ${colors.tertiary};`);
  }

  if (rules.length > 0) {
    const style = document.createElement('style');
    style.id = 'wl-theme-colors';
    style.textContent = `:root {\n${rules.join('\n')}\n}`;
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

    const fontRules = [
      displayFamily ? `  --font-family-display: ${displayFamily};` : '',
      displayFamily ? `  --font-display:         ${displayFamily};` : '',
      bodyFamily    ? `  --font-family-base:     ${bodyFamily};`    : '',
      bodyFamily    ? `  --font-body:             ${bodyFamily};`   : '',
    ].filter(Boolean).join('\n');

    const style = document.createElement('style');
    style.id = 'wl-theme-fonts';
    style.textContent = `:root {\n${fontRules}\n}`;
    document.head.appendChild(style);
  }
}
