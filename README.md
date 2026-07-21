# cliente-workr-lite

Template estático (Vite + SCSS + JS puro) usado pelo Workr Lite CMS para gerar o site de RI de cada portal. Este repositório é a fonte de verdade tanto para **novas importações** (provisionamento de portal) quanto para o **self-heal** de portais já existentes (arquivos re-copiados a cada "Publicar" via `publish-config`).

## Padrão de filtros e listas (Documentos / Central de Resultados)

Conteúdo buscado do Supabase em runtime (`scripts/components/documentos.js`, `scripts/components/resultados.js`) segue um padrão visual único. Qualquer novo componente data-driven parecido (nova seção com filtro + lista) deve reutilizar exatamente essas classes — não criar variantes por página.

### Filtro (`.filter-box`)

```html
<label class="filter-box">
  <span class="filter-box__label">Filtrar por Ano</span>
  <select data-xxx-filter="ano">
    <option value="">Todos os anos</option>
    ...
  </select>
  <span class="filter-box__chevron" aria-hidden="true"></span>
</label>
```

- Rótulo pequeno (`__label`) sempre acima do valor selecionado.
- Texto do valor com peso normal (nunca bold).
- 100% de largura abaixo do breakpoint `tablet` (empilha verticalmente via `.filter-bar__group`).
- Definido em `styles/components/_filter.scss`.

Não usar a classe legada `.select` (select de uma linha só, sem rótulo visível) para filtros novos — ela existe apenas para compatibilidade com as páginas de referência estáticas (`cms-lista.html`, `cms-tabela.html`, etc.), que não são usadas por portais reais.

### Lista (`.doc-list`)

```html
<ul class="doc-list" role="list">
  <li class="doc-list__item">
    <div class="doc-list__info">
      <span class="doc-list__date">21 de jul. de 2026</span>
      <span class="doc-list__title">Nome do arquivo</span>
    </div>
    <div class="doc-list__actions">
      <a class="doc-list__link doc-list__icon" href="...">...</a>
    </div>
  </li>
</ul>
```

- Cada item é um card (fundo `--color-surface`, borda transparente) — nunca uma linha com `border-bottom` separando itens.
- Hover: borda `--color-primary` + fundo `--color-bg`.
- **Data sempre acima do nome** (`.doc-list__info` em coluna) — não lado a lado.
- `.doc-list__sep` (o antigo travessão entre data e nome) fica oculto — era usado no layout de uma linha só, não faz sentido empilhado.
- Ícone do tipo de arquivo: SVG vetorial inline (`fileBadgeSvg()` em `documentos.js`, reexportado para `resultados.js`) — nunca os arquivos raster em `/assets/icons/*.svg` (esses embutem um bitmap e ficam borrados em tamanho pequeno).
- Definido em `styles/components/_list.scss`.

### Empresa (tabs ou filtro)

Regra de negócio: com mais de uma empresa no portal, o conteúdo **nunca mistura** empresas na mesma visualização.

- Layout `sidebar`/`banner`: tabs dentro do conteúdo (`.tab-menu__nav`/`.tab-menu__tab`, construídos dinamicamente).
- Layout `tabmenu`: segundo filtro `.filter-box` ("Filtrar por Empresa") ao lado do filtro de Ano — nunca uma opção "Todas as empresas".
- Em ambos os casos, a **empresa principal já vem selecionada por padrão** ao carregar a página.

### Responsivo

- `.tab-menu__nav` (tanto o nav principal do layout tabmenu quanto os empresa-tabs) vira scroll horizontal abaixo do breakpoint `tablet` (`overflow-x: auto`, sem quebrar linha) — nunca gera scroll horizontal na página inteira.
- `.filter-box` ocupa 100% da largura abaixo de `tablet`.

## Deploy / self-heal

Qualquer arquivo novo em `scripts/components/`, `scripts/*.js` ou `styles/components/*.scss` usado por conteúdo data-driven **precisa ser adicionado à lista `templateFiles` em `supabase/functions/publish-config/index.ts`** (no repo `workr-lite-v1`). Sem isso, o arquivo nunca chega aos repositórios dos portais existentes — só `main.scss` está lá por padrão, e ele não força a cópia dos partials que importa.
