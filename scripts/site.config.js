// scripts/site.config.js
// Gerado pelo Workr Lite CMS — não editar manualmente.
export const siteConfig = {

  company: {
    name:        "",
    nameShort:   "",
    description: 'Relações com Investidores — .',
    logoOriginal: '/assets/logotipo/logotipo-original.svg',
    logoNegative: '/assets/logotipo/logotipo-negative.svg',
    logoContrast: '/assets/logotipo/logotipo-negative.svg',
    favicon:      '/favicon.svg',
  },

  colors: {
    primary:   "#34b4ca",
    secondary: "#781f71",
    tertiary:  "#F4A261",
  },

  fonts: {
    display: "Plus Jakarta Sans",
    body:    "Inter",
  },

  tickers: [
    { symbol: 'WRLT3', price: 'R$ 00,00', change: '0,00%', direction: 'up' }
  ],

  nav: [
    { label: 'A Companhia', href: '/a-companhia.html', children: [] },
    { label: 'Governança', children: [
        { label: 'Composição Acionária', href: '/composicao-acionaria.html' },
        { label: 'Atas e Assembleias',   href: '/atas-assembleias.html'     },
        { label: 'Documentos CVM',       href: '/documentos-cvm.html'       },
    ]},
    { label: 'Investidores', children: [
        { label: 'Central de Resultados', href: '/central-resultados.html' },
        { label: 'Calendário de Eventos', href: '/calendario-eventos.html' },
        { label: 'Ratings',               href: '/ratings.html'            },
    ]},
    { label: 'Contato', children: [
        { label: 'Fale com RI', href: '/fale-com-ri.html' },
        { label: 'Mailing',     href: '/mailing.html'     },
    ]},
  ],

  header: { variant: 'banner' },

  restrictedNav: [],

  footer: {
    variant: 'simple',
    address:   "",
    email:     "",
    phone:     "",
    hours:     "",
    copyright: "©Copyright  2026",
    social: { linkedin: "#", instagram: "#", facebook: "#" },
    legalLinks: [
      { label: "Termos e Condições", href: '/termos-e-condicoes.html' },
      { label: "Política de Privacidade", href: '/politica-de-privacidade.html' },
      { label: "Definições de Cookies", href: '/definicao-de-cookies.html' }
    ],
    legalText: "As informações contidas neste site são de caráter meramente informativo e não constituem oferta de valores mobiliários.",
  },

};
