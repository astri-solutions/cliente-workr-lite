// scripts/site.config.js
// Este arquivo é gerado/substituído pelo Workr Lite CMS ao criar um novo portal.
// Todos os campos marcados com ← são injetados automaticamente na criação do portal.
export const siteConfig = {

  // false → site normal. true → tela de manutenção em todas as páginas
  // (page.js), exceto em modo preview.
  maintenance: false,

  // Idiomas ativos do portal — o primeiro é o idioma principal (fallback de
  // todo texto por-locale: footer.content, cookies.content, splash, etc.).
  languages: ['pt-BR'],

  company: {
    name:        'Workr Lite - Astri teste',   // ← company.name
    nameShort:   'Workr Lite Teste',            // ← company.nameShort
    description:  'Relações com Investidores — Workr Lite Teste.',
    logoOriginal: '/assets/logotipo/logotipo-original.svg',
    logoNegative: '/assets/logotipo/logotipo-negative.svg',
    logoContrast: '/assets/logotipo/logotipo-negative.svg',
    favicon:      '/favicon.svg',
  },

  // Paleta de cores — injetada em runtime como CSS custom properties por theme.js.
  // Sobrescreve os valores estáticos de _colors.scss sem necessitar rebuild.
  colors: {
    primary:   '#00D865',   // ← cores.primary (500)
    secondary: '#0B5B68',   // ← cores.secondary (500)
    tertiary:  '#F4A261',   // ← cores.tertiary (500)
  },

  // Tipografia — carregada via Google Fonts em runtime por theme.js.
  fonts: {
    display: 'Plus Jakarta Sans',   // ← fontes.display
    body:    'Inter',               // ← fontes.body
  },

  // Ticker de cotação.
  // type 'static' → valores definidos em items[] (placeholder).
  // type 'iframe'  → embed do widget Enfoque via iframeUrl.
  ticker: {
    type:      'static',  // ← ticker.type ('static' | 'iframe')
    iframeUrl: '',        // ← ticker.iframeUrl (URL Enfoque)
    items: [
      { symbol: 'WKLA3', price: 'R$ 00,00', change: '0,00%', direction: 'up' },
    ],
  },

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

  // Empresas (sub-entidades do portal). Se length > 1, páginas de lista/resultados
  // exibem um tabmenu por empresa. Gerado pelo Workr Lite CMS na criação do portal.
  empresas: [
    { id: 'imc',     label: 'International Meal Company', short: 'IMC'     },
    { id: 'imc-fii', label: 'IMC Recebíveis FII',         short: 'IMC FII' },
  ],

  // Supabase — injetado pelo CMS ao provisionar/publicar.
  // Permite que cores e fontes sejam atualizadas em runtime sem Publicar.
  supabase: {
    url:      null,  // ← SUPABASE_URL
    anonKey:  null,  // ← SUPABASE_ANON_KEY
    portalId: null,  // ← portals.id (UUID)
  },

  header: {
    variant: 'navbar-default', // 'navbar-default' | 'navbar-dark' | 'navbar-blur'
  },

  // Barra superior (topbar.js) — links fixos + ticker de cotação.
  topbar: {
    ri: { label: 'Relações com Investidores', url: '/' },
    institucional: { label: 'Institucional', url: '#' },
    showTicker: true,
  },

  // Slides do banner/hero da home (carousel.js). Vazio = usa os placeholders
  // estáticos definidos no próprio carousel.js.
  banner: [],

  // Atalhos exibidos na home (page.js) — vazio = nenhum atalho é mostrado.
  home: {
    shortcuts: [],
  },

  // Modal de anúncio exibido na home a cada carregamento (splash.js).
  splash: {
    enabled: false,
    size: 'md', // 'sm' | 'md' | 'lg'
    imageUrl: '',
    titulo: '',
    texto: '',
    conteudo: '',
    legenda: '',
    buttons: [],
  },

  // Banner de consentimento de cookies (cookies.js) — texto por idioma em
  // content[lang], com fallback para o idioma principal.
  cookies: {
    enabled: true,
    content: {
      'pt-BR': {
        title: 'Nós usamos cookies',
        description: 'Utilizamos cookies para melhorar sua experiência de navegação. Ao continuar, você concorda com nossa política de cookies.',
        linkText: 'Saiba mais',
        acceptLabel: 'Aceitar todos',
        rejectLabel: 'Rejeitar',
        customizeLabel: 'Personalizar',
      },
    },
    buttons: [],
  },

  // Textos customizados para páginas de erro (404 etc.) — hoje só
  // sobrescrito via preview.js; nenhuma página estática ainda lê este campo.
  errorPages: {},

  // Nav items only visible after login (área restrita)
  restrictedNav: [
    {
      label: 'Área Restrita',
      children: [
        { label: 'Relatórios Exclusivos',        href: '/area-restrita.html' },
        { label: 'Apresentações a Investidores', href: '/area-restrita.html' },
        { label: 'Acordos de Acionistas',        href: '/area-restrita.html' },
        { label: 'Documentos Confidenciais',     href: '/area-restrita.html' },
      ],
    },
  ],

  footer: {
    variant: 'simple', // 'full' | 'simple'
    email: 'workrlite@astri.com',
    // Texto por idioma — footer.js lê footer.content[lang], com fallback
    // para o idioma principal (languages[0]). address/phone/hours/copyright/
    // disclaimer soltos direto em footer NÃO são lidos por nada — só o que
    // está aqui dentro de content[lang] chega à tela.
    content: {
      'pt-BR': {
        address:    'Av. Brigadeiro Faria Lima, 2.277, 17º andar — São Paulo/SP, CEP 01452-000',
        phone:      '(11) 1234-5678',
        hours:      'Segunda a sexta, das 08h às 18h, exceto feriados.',
        copyright:  `©Copyright Workr Lite - Astri teste ${new Date().getFullYear()}`,
        disclaimer: 'As informações contidas neste site são de caráter meramente informativo e não constituem oferta de valores mobiliários.',
      },
    },
    social: {
      linkedin:  '#',
      instagram: '#',
      facebook:  '#',
    },
    legalLinks: [
      { label: 'Termos e Condições',      href: '/termos-e-condicoes.html'      },
      { label: 'Política de Privacidade', href: '/politica-de-privacidade.html' },
      { label: 'Definições de Cookies',   href: '/definicao-de-cookies.html'    },
    ],
  },

};
