// scripts/site.config.js
export const siteConfig = {

  company: {
    name:        'Workr Lite - Astri teste',
    nameShort:   'Workr Lite Teste',
    description:  'Relações com Investidores — Workr Lite Teste.',
    logoOriginal: '/assets/logotipo/logotipo-original.svg',
    logoNegative: '/assets/logotipo/logotipo-negative.svg',
    logoContrast: '/assets/logotipo/logotipo-negative.svg',
    favicon:      '/favicon.svg',
  },

  tickers: [
    { symbol: 'WKLA3', price: 'R$ 00,00', change: '0,00%', direction: 'up' },
  ],

  nav: [
    {
      label: 'A Companhia',
      href:  '/a-companhia.html',
      children: [],
    },
    {
      label: 'Governança',
      children: [
        { label: 'Composição Acionária', href: '/composicao-acionaria.html' },
        { label: 'Atas e Assembleias',   href: '/atas-assembleias.html'     },
        { label: 'Documentos CVM',       href: '/documentos-cvm.html'       },
      ],
    },
    {
      label: 'Investidores',
      children: [
        { label: 'Central de Resultados',  href: '/central-resultados.html'  },
        { label: 'Calendário de Eventos',  href: '/calendario-eventos.html'  },
        { label: 'Ratings',                href: '/ratings.html'             },
      ],
    },
    {
      label: 'Contato',
      children: [
        { label: 'Fale com RI', href: '/fale-com-ri.html' },
        { label: 'Mailing',     href: '/mailing.html'     },
      ],
    },
  ],

  footer: {
    address:   'Av. Brigadeiro Faria Lima, 2.277, 17º andar — São Paulo/SP, CEP 01452-000',
    email:     'workrlite@astri.com',
    phone:     '(11) 1234-5678',
    hours:     'Segunda a sexta, das 08h às 18h, exceto feriados.',
    copyright: `©Copyright Workr Lite - Astri teste ${new Date().getFullYear()}`,
    social: {
      linkedin:  '#',
      instagram: '#',
      facebook:  '#',
    },
    columns: [
      {
        title: 'A Companhia',
        links: [
          { label: 'A Companhia', href: '/a-companhia.html' },
        ],
      },
      {
        title: 'Governança',
        links: [
          { label: 'Composição Acionária', href: '/composicao-acionaria.html' },
          { label: 'Atas e Assembleias',   href: '/atas-assembleias.html'     },
          { label: 'Documentos CVM',       href: '/documentos-cvm.html'       },
        ],
      },
      {
        title: 'Investidores',
        links: [
          { label: 'Central de Resultados', href: '/central-resultados.html' },
          { label: 'Calendário de Eventos', href: '/calendario-eventos.html' },
          { label: 'Ratings',               href: '/ratings.html'            },
        ],
      },
      {
        title: 'Contato',
        links: [
          { label: 'Fale com RI', href: '/fale-com-ri.html' },
          { label: 'Mailing',     href: '/mailing.html'     },
        ],
      },
    ],
    legalLinks: [
      { label: 'Termos e Condições',      href: '/termos-e-condicoes.html'      },
      { label: 'Política de Privacidade', href: '/politica-de-privacidade.html' },
      { label: 'Definições de Cookies',   href: '/definicao-de-cookies.html'    },
    ],
    legalText: 'As informações contidas neste site são de caráter meramente informativo e não constituem oferta de valores mobiliários.',
  },

};
