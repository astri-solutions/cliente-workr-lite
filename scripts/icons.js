// scripts/icons.js
// Injects the SVG sprite into the DOM so <use href="#icon-*"> works on any page.

fetch('/icons.svg')
  .then(r => r.text())
  .then(svg => {
    const div = document.createElement('div');
    div.style.cssText = 'display:none;position:absolute;width:0;height:0;overflow:hidden';
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML = svg;
    document.body.insertBefore(div, document.body.firstChild);
  });

/**
 * Helper — use in JS to render an icon:
 *   icon('chevron-down')           → <svg …><use href="#icon-chevron-down"/></svg>
 *   icon('warning', 24)            → size 24
 *   icon('gmail', 20, 'my-class')  → adds class
 */
export function icon(name, size = 20, className = '') {
  return `<svg width="${size}" height="${size}" aria-hidden="true"${className ? ` class="${className}"` : ''}><use href="#icon-${name}"/></svg>`;
}
