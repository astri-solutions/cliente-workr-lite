// scripts/components/timeline.js
// Drives the "Linha do tempo" matéria block: fills the vertical line as the
// user scrolls through it, fades each year in, and enlarges the year label
// of whichever item is currently centered in the viewport.
export function initTimelines(root = document) {
  root.querySelectorAll('.timeline--vertical[data-timeline]').forEach(initVerticalTimeline);
}

function initVerticalTimeline(el) {
  if (el.dataset.timelineInit) return;
  el.dataset.timelineInit = '1';

  const itemsEl = el.querySelector('.timeline__items');
  const fillEl = el.querySelector('[data-timeline-fill]');
  const items = [...el.querySelectorAll('.timeline__item')];
  if (!itemsEl || items.length === 0) return;

  // Fade each item in once it enters the viewport, and mark whichever item
  // is closest to vertical center as "active" (enlarges its year).
  const visibilityObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.15 });

  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-active', entry.isIntersecting);
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  items.forEach(item => {
    visibilityObserver.observe(item);
    activeObserver.observe(item);
  });

  // Line fill — how far the viewport's vertical center has progressed from
  // the top of the first item to the bottom of the last one.
  if (fillEl) {
    let ticking = false;
    function updateFill() {
      ticking = false;
      const rect = itemsEl.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const total = rect.height;
      if (total <= 0) return;
      const progressed = viewportCenter - rect.top;
      const pct = Math.max(0, Math.min(100, (progressed / total) * 100));
      fillEl.style.height = `${pct}%`;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateFill);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateFill();
  }
}
