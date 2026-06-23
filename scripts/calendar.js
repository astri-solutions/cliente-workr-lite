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
  { day: 3,  month: 5, year: 2026, label: 'Divulgação de Resultados 2T26',            time: '00:00 - Horário de Brasília', category: 'divulgacao'  },
  { day: 8,  month: 5, year: 2026, label: 'Teleconferência de Resultados 2T26',        time: '10:00 - Horário de Brasília', category: 'conferencia' },
  { day: 11, month: 5, year: 2026, label: 'The quick brown fox',                        time: '14:00 - Horário de Brasília', category: 'outros'      },
  { day: 17, month: 5, year: 2026, label: 'Investor Day 2026',                          time: '09:00 - Horário de Brasília', category: 'investorday' },
  { day: 18, month: 5, year: 2026, label: 'Assembleia Geral Ordinária',                 time: '10:00 - Horário de Brasília', category: 'assembleia'  },
  { day: 22, month: 5, year: 2026, label: '27ª Conferência Anual Santander',            time: '08:00 - Horário de Brasília', category: 'conferencia' },
  { day: 24, month: 5, year: 2026, label: 'Morgan Stanley 29th Annual Latin America Conference', time: '09:00 - Horário de Brasília', category: 'conferencia' },
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
let currentMonth = 5;

// Build Google Calendar URL
function gmailUrl(e) {
  const pad = n => String(n).padStart(2,'0');
  const dt = `${e.year}${pad(e.month+1)}${pad(e.day)}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.label)}&dates=${dt}/${dt}`;
}

// Build Outlook URL
function outlookUrl(e) {
  const pad = n => String(n).padStart(2,'0');
  const dt = `${e.year}-${pad(e.month+1)}-${pad(e.day)}`;
  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(e.label)}&startdt=${dt}&enddt=${dt}&allday=true`;
}

// Icons
const PDF_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
const GMAIL_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Z" stroke="currentColor" stroke-width="1.5"/><path d="m2 7 10 7 10-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
const OUTLOOK_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="13" height="16" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M15 8h5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-5" stroke="currentColor" stroke-width="1.5"/><circle cx="8.5" cy="12" r="2.5" stroke="currentColor" stroke-width="1.5"/></svg>`;

// Tooltip element
let tooltip = null;
function getTooltip() {
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'cal-tooltip';
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

function showTooltip(el, events) {
  const t = getTooltip();
  t.innerHTML = events.map(e => `
    <div class="cal-tooltip__item" style="border-left-color:${CATEGORY_COLORS[e.category]}">
      <strong>${e.day}/${MONTHS_PT[e.month].slice(0,3)}</strong> — ${e.label}
      <div class="cal-tooltip__time">${e.time}</div>
    </div>`).join('');
  t.classList.add('is-visible');

  const rect = el.getBoundingClientRect();
  t.style.top  = `${rect.bottom + 8}px`;
  t.style.left = `${rect.left + rect.width / 2}px`;
}

function hideTooltip() {
  tooltip?.classList.remove('is-visible');
}

function eventsForMonth(year, month) {
  return UPCOMING_EVENTS.filter(e => e.year === year && e.month === month);
}

function renderCalendar() {
  const calEl    = document.getElementById('event-calendar');
  const legendEl = document.getElementById('event-legend');
  const pastEl   = document.getElementById('past-events');
  if (!calEl) return;

  hideTooltip();

  const events      = eventsForMonth(currentYear, currentMonth);
  const firstDay    = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const prevDays    = new Date(currentYear, currentMonth, 0).getDate();

  // Calendar cells
  let cells = '';
  for (let i = 0; i < firstDay; i++) {
    cells += `<div class="cal-cell cal-cell--out">${prevDays - firstDay + 1 + i}</div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEvents = events.filter(e => e.day === d);
    const dots = dayEvents.map(e =>
      `<span class="cal-cell__dot" style="background:${CATEGORY_COLORS[e.category]}"></span>`
    ).join('');
    const hasEvent = dayEvents.length > 0;
    cells += `<div class="cal-cell${hasEvent ? ' cal-cell--has-event' : ''}" data-day="${d}">${d}${dots ? `<span class="cal-cell__dots">${dots}</span>` : ''}</div>`;
  }
  const totalCells = firstDay + daysInMonth;
  const remaining  = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    cells += `<div class="cal-cell cal-cell--out">${i}</div>`;
  }

  // Event list items (date stacked above label)
  const eventItems = events.map(e => {
    const day = String(e.day).padStart(2, '0');
    const mon = MONTHS_PT[e.month].slice(0, 3);
    return `
      <div class="event-item">
        <span class="event-item__date" style="border-color:${CATEGORY_COLORS[e.category]};color:${CATEGORY_COLORS[e.category]}">${day}/${mon}</span>
        <div class="event-item__body">
          <span class="event-item__label">${e.label}</span>
          <span class="event-item__time">${e.time}</span>
        </div>
        <div class="event-item__actions">
          <a href="${gmailUrl(e)}" class="event-item__export" target="_blank" rel="noopener" title="Exportar para Google Calendar" aria-label="Exportar para Google Calendar">${GMAIL_ICON}</a>
          <a href="${outlookUrl(e)}" class="event-item__export" target="_blank" rel="noopener" title="Exportar para Outlook" aria-label="Exportar para Outlook">${OUTLOOK_ICON}</a>
          <a href="#" class="doc-row__pdf" aria-label="Baixar PDF">${PDF_ICON}</a>
        </div>
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

  // Tooltip on cells with events
  calEl.querySelectorAll('.cal-cell--has-event').forEach(cell => {
    const d = parseInt(cell.dataset.day);
    const dayEvents = events.filter(e => e.day === d);
    cell.addEventListener('mouseenter', () => showTooltip(cell, dayEvents));
    cell.addEventListener('mouseleave', hideTooltip);
  });

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

  // Legend
  const usedCategories = [...new Set(UPCOMING_EVENTS.map(e => e.category))];
  legendEl.innerHTML = usedCategories.map(cat => `
    <span class="event-legend__item">
      <span class="event-legend__dot" style="background:${CATEGORY_COLORS[cat]}"></span>
      ${CATEGORY_LABELS[cat]}
    </span>`).join('');

  // Past events
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
        <a href="${e.href}" class="doc-row__pdf" aria-label="Baixar PDF">${PDF_ICON}</a>
      </div>`).join('')}`;
}

renderCalendar();
