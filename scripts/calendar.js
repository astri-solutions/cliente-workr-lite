// scripts/calendar.js

const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MONTHS_SHORT = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const DAYS_PT = ['D','S','T','Q','Q','S','S'];

const CATEGORY_COLORS = {
  conferencia: '#e91e8c',
  divulgacao:  '#f97316',
  assembleia:  '#22c55e',
  investorday: '#9333ea',
  outros:      '#6b7280',
};

const CATEGORY_LABELS = {
  conferencia: 'Conferências',
  divulgacao:  'Divulgação de Resultados',
  assembleia:  'Assembleia Geral',
  investorday: 'Investor Day',
  outros:      'Outros',
};

const UPCOMING_EVENTS = [
  { day: 3,  month: 5, year: 2026, label: 'Divulgação de Resultados 2T26',                       time: '00:00 - Horário de Brasília', category: 'divulgacao'  },
  { day: 8,  month: 5, year: 2026, label: 'Teleconferência de Resultados 2T26',                   time: '10:00 - Horário de Brasília', category: 'conferencia' },
  { day: 11, month: 5, year: 2026, label: 'The quick brown fox',                                   time: '14:00 - Horário de Brasília', category: 'outros'      },
  { day: 17, month: 5, year: 2026, label: 'Investor Day 2026',                                     time: '09:00 - Horário de Brasília', category: 'investorday' },
  { day: 18, month: 5, year: 2026, label: 'Assembleia Geral Ordinária',                            time: '10:00 - Horário de Brasília', category: 'assembleia'  },
  { day: 22, month: 5, year: 2026, label: '27ª Conferência Anual Santander',                       time: '08:00 - Horário de Brasília', category: 'conferencia' },
  { day: 24, month: 5, year: 2026, label: 'Morgan Stanley 29th Annual Latin America Conference',   time: '09:00 - Horário de Brasília', category: 'conferencia' },
];

const PAST_EVENTS = [
  { date: '09/06/2026', label: 'Aprovação do novo programa de recompra', href: '#' },
  { date: '05/05/2026', label: 'Aprovação de resultados 1T26',            href: '#' },
  { date: '24/02/2026', label: 'Aprovação de resultados 4T25',            href: '#' },
];

let currentYear  = 2026;
let currentMonth = 5;

function gmailUrl(e) {
  const pad = n => String(n).padStart(2,'0');
  const dt = `${e.year}${pad(e.month+1)}${pad(e.day)}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.label)}&dates=${dt}/${dt}`;
}
function outlookUrl(e) {
  const pad = n => String(n).padStart(2,'0');
  const dt = `${e.year}-${pad(e.month+1)}-${pad(e.day)}`;
  return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(e.label)}&startdt=${dt}&enddt=${dt}&allday=true`;
}

const PDF_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
// Colored brand icons
const GMAIL_ICON = `<svg viewBox="0 0 48 48" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path fill="#EA4335" d="M6 40h6V23.8L4 18v18c0 2.2 1.8 4 4 4"/><path fill="#34A853" d="M36 40h6c2.2 0 4-1.8 4-4V18l-10 5.8"/><path fill="#4A90D9" d="M36 8l-12 8.7L12 8H6v10l18 10.4L42 18V8"/><path fill="#FBBC04" d="M4 18l8 5.8V8H6c-1.1 0-2 .9-2 2v8"/><path fill="#EA4335" d="M42 8h-6v15.8L44 18v-8c0-1.1-.9-2-2-2"/></svg>`;
const OUTLOOK_ICON = `<svg viewBox="0 0 48 48" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><rect width="28" height="34" x="2" y="7" rx="2" fill="#0072C6"/><rect width="18" height="22" x="28" y="13" rx="1" fill="#fff"/><rect width="18" height="22" x="28" y="13" rx="1" fill="none" stroke="#0072C6" stroke-width="1"/><path d="M28 13l10 9 10-9" fill="none" stroke="#0072C6" stroke-width="1.5"/><ellipse cx="15" cy="24" rx="6" ry="7" fill="#fff"/></svg>`;

// Tooltip
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
function hideTooltip() { tooltip?.classList.remove('is-visible'); }

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

  // Cells
  let cells = '';
  for (let i = 0; i < firstDay; i++) {
    cells += `<div class="cal-cell cal-cell--out">${prevDays - firstDay + 1 + i}</div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEvents = events.filter(e => e.day === d);
    const dots = dayEvents.map(e =>
      `<span class="cal-cell__dot" style="background:${CATEGORY_COLORS[e.category]}"></span>`
    ).join('');
    cells += `<div class="cal-cell${dayEvents.length ? ' cal-cell--has-event' : ''}" data-day="${d}">${d}${dots ? `<div class="cal-cell__dots">${dots}</div>` : ''}</div>`;
  }
  const remaining = (7 - (firstDay + daysInMonth) % 7) % 7;
  for (let i = 1; i <= remaining; i++) {
    cells += `<div class="cal-cell cal-cell--out">${i}</div>`;
  }

  // Event list — date plain text above label
  const eventItems = events.map(e => {
    const day = String(e.day).padStart(2,'0');
    const mon = MONTHS_SHORT[e.month];
    return `
      <div class="event-item">
        <div class="event-item__body">
          <span class="event-item__date">${day}/${mon}</span>
          <span class="event-item__label">${e.label}</span>
          <span class="event-item__time">${e.time}</span>
        </div>
        <div class="event-item__actions">
          <span class="event-item__export-label">Exportar</span>
          <a href="${gmailUrl(e)}" class="event-item__export" target="_blank" rel="noopener" title="Google Calendar" aria-label="Exportar para Google Calendar">${GMAIL_ICON}</a>
          <a href="${outlookUrl(e)}" class="event-item__export" target="_blank" rel="noopener" title="Outlook" aria-label="Exportar para Outlook">${OUTLOOK_ICON}</a>
        </div>
      </div>`;
  }).join('');

  calEl.innerHTML = `
    <div class="cal-box">
      <div class="cal-box__nav">
        <button class="cal-nav__btn" id="cal-prev" aria-label="Mês anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="cal-box__title">${MONTHS_PT[currentMonth]} / ${currentYear}</span>
        <button class="cal-nav__btn" id="cal-next" aria-label="Próximo mês">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div class="cal-header">
        ${DAYS_PT.map(d => `<div class="cal-header__day">${d}</div>`).join('')}
      </div>
      <div class="cal-body">${cells}</div>
    </div>
    <div class="event-list-wrap">
      <p class="event-list-wrap__title">Próximos eventos</p>
      <div class="event-list">${eventItems || '<p style="color:var(--color-text-muted);font-size:0.875rem;padding:16px 0">Nenhum evento neste mês.</p>'}</div>
    </div>`;

  // Tooltips
  calEl.querySelectorAll('.cal-cell--has-event').forEach(cell => {
    const d = parseInt(cell.dataset.day);
    const dayEvents = events.filter(e => e.day === d);
    cell.addEventListener('mouseenter', () => showTooltip(cell, dayEvents));
    cell.addEventListener('mouseleave', hideTooltip);
  });

  document.getElementById('cal-prev').addEventListener('click', () => {
    if (--currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    if (++currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  // Legend
  const usedCats = [...new Set(UPCOMING_EVENTS.map(e => e.category))];
  legendEl.innerHTML = usedCats.map(cat => `
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
