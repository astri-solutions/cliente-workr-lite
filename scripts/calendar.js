// scripts/calendar.js

const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DAYS_PT   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'];

const CATEGORY_COLORS = {
  conferencia: '#e91e8c',
  divulgacao:  '#f97316',
  assembleia:  '#22c55e',
  investorday: '#3b82f6',
  outros:      '#111111',
};

const UPCOMING_EVENTS = [
  { day: 3,  month: 5, year: 2026, label: 'Divulgação de Resultados 2T26',   category: 'divulgacao'  },
  { day: 8,  month: 5, year: 2026, label: 'Teleconferência de Resultados 2T26', category: 'conferencia' },
  { day: 11, month: 5, year: 2026, label: 'The quick brown fox',              category: 'outros'      },
  { day: 17, month: 5, year: 2026, label: 'Investor Day 2026',                category: 'investorday' },
  { day: 18, month: 5, year: 2026, label: 'Assembleia Geral Ordinária',       category: 'assembleia'  },
  { day: 22, month: 5, year: 2026, label: '27ª Conferência Anual Santander',  category: 'conferencia' },
  { day: 24, month: 5, year: 2026, label: 'Morgan Stanley 29th Annual Latin America Conference', category: 'conferencia' },
];

const PAST_EVENTS = [
  { date: '09/06/2026', label: 'Aprovação do novo programa de recompra',  href: '#' },
  { date: '05/05/2026', label: 'Aprovação de resultados 1T26',             href: '#' },
  { date: '24/02/2026', label: 'Aprovação de resultados 4T25',             href: '#' },
];

const CATEGORY_LABELS = {
  conferencia: 'Conferências',
  divulgacao:  'Divulgação',
  assembleia:  'Assembléias',
  investorday: 'Investor Day',
  outros:      'Outros',
};

let currentYear  = 2026;
let currentMonth = 5; // June (0-indexed)

function eventsForMonth(year, month) {
  return UPCOMING_EVENTS.filter(e => e.year === year && e.month === month);
}

function renderCalendar() {
  const calEl    = document.getElementById('event-calendar');
  const legendEl = document.getElementById('event-legend');
  const pastEl   = document.getElementById('past-events');
  if (!calEl) return;

  const events   = eventsForMonth(currentYear, currentMonth);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevDays = new Date(currentYear, currentMonth, 0).getDate();

  // --- Calendar grid ---
  let cells = '';
  for (let i = 0; i < firstDay; i++) {
    cells += `<div class="cal-cell cal-cell--out">${prevDays - firstDay + 1 + i}</div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEvents = events.filter(e => e.day === d);
    const dots = dayEvents.map(e =>
      `<span class="cal-cell__dot" style="background:${CATEGORY_COLORS[e.category]}"></span>`
    ).join('');
    cells += `<div class="cal-cell">${d}${dots ? `<span class="cal-cell__dots">${dots}</span>` : ''}</div>`;
  }
  const totalCells = firstDay + daysInMonth;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    cells += `<div class="cal-cell cal-cell--out">${i}</div>`;
  }

  // --- Event list ---
  const eventItems = events.map(e => {
    const day = String(e.day).padStart(2, '0');
    const mon = MONTHS_PT[e.month].slice(0, 3);
    return `
      <div class="event-item">
        <span class="event-item__date" style="border-color:${CATEGORY_COLORS[e.category]};color:${CATEGORY_COLORS[e.category]}">${day}/${mon}</span>
        <span class="event-item__sep">-</span>
        <span class="event-item__label">${e.label}</span>
        <a href="#" class="doc-row__pdf" aria-label="Baixar PDF">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </a>
      </div>`;
  }).join('');

  calEl.innerHTML = `
    <div class="cal-nav">
      <span class="cal-nav__title">${MONTHS_PT[currentMonth]} / ${currentYear}</span>
      <div class="cal-nav__controls">
        <button class="cal-nav__btn" id="cal-prev" aria-label="Mês anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="cal-nav__btn" id="cal-next" aria-label="Próximo mês">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
    <div class="cal-widget">
      <div class="cal-grid">
        <div class="cal-header">
          ${DAYS_PT.map(d => `<div class="cal-header__day">${d}</div>`).join('')}
        </div>
        <div class="cal-body">${cells}</div>
      </div>
      <div class="event-list">${eventItems || '<p style="color:var(--color-text-muted);font-size:0.875rem">Nenhum evento neste mês.</p>'}</div>
    </div>`;

  document.getElementById('cal-prev').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  // --- Legend ---
  const usedCategories = [...new Set(UPCOMING_EVENTS.map(e => e.category))];
  legendEl.innerHTML = usedCategories.map(cat => `
    <span class="event-legend__item">
      <span class="event-legend__dot" style="background:${CATEGORY_COLORS[cat]}"></span>
      ${CATEGORY_LABELS[cat]}
    </span>`).join('');

  // --- Past events ---
  pastEl.innerHTML = `
    <div class="filter-bar" style="margin-bottom:32px">
      <h2 class="past-events__title">Eventos realizados</h2>
      <div class="filter-bar__group">
        <span class="filter-bar__label">Filtrar por:</span>
        <div class="select"><select aria-label="Ano"><option>2026</option><option>2025</option><option>2024</option></select></div>
      </div>
    </div>
    ${PAST_EVENTS.map(e => `
      <div class="event-past-item">
        <span class="event-past-item__date">${e.date}</span>
        <span class="event-past-item__sep">-</span>
        <span class="event-past-item__label">${e.label}</span>
        <a href="${e.href}" class="doc-row__pdf" aria-label="Baixar PDF">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </a>
      </div>`).join('')}`;
}

renderCalendar();
