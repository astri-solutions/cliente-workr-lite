// scripts/carousel.js

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    title: 'Relações com Investidores',
    subtitle: 'Transparência e acesso às informações financeiras da companhia.',
    cta: { label: 'Central de Resultados', href: '/central-resultados.html' },
  },
  {
    img: 'https://images.unsplash.com/photo-1611974955409-f0c5c1d31b0b?auto=format&fit=crop&w=1920&q=80',
    title: 'Resultados Financeiros',
    subtitle: 'Acesse os relatórios trimestrais, apresentações e demonstrações financeiras.',
    cta: { label: 'Ver Resultados', href: '/central-resultados.html' },
  },
  {
    img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1920&q=80',
    title: 'Calendário de Eventos',
    subtitle: 'Fique por dentro dos próximos eventos e teleconferências de resultados.',
    cta: { label: 'Ver Calendário', href: '/calendario-eventos.html' },
  },
];

let current = 0;
let autoplayTimer = null;

function renderCarousel() {
  const el = document.getElementById('home-carousel');
  if (!el) return;

  el.innerHTML = `
    <div class="carousel__track" id="carousel-track">
      ${SLIDES.map((s, i) => `
        <div class="carousel__slide${i === 0 ? ' is-active' : ''}" aria-hidden="${i !== 0}">
          <img class="carousel__bg" src="${s.img}" alt="" aria-hidden="true" />
          <div class="carousel__overlay" aria-hidden="true"></div>
          <div class="carousel__body">
            <h1 class="carousel__title">${s.title}</h1>
            <p class="carousel__subtitle">${s.subtitle}</p>
            <a href="${s.cta.href}" class="carousel__cta">${s.cta.label}</a>
          </div>
        </div>`).join('')}
    </div>
    <div class="carousel__controls" aria-label="Navegação do carrossel">
      <button class="carousel__btn carousel__btn--prev" id="carousel-prev" aria-label="Slide anterior">
        <img src="/assets/icons/chevron-left.svg" width="20" height="20" aria-hidden="true" alt="">
      </button>
      <div class="carousel__dots" role="tablist" aria-label="Slides">
        ${SLIDES.map((_, i) => `
          <button class="carousel__dot${i === 0 ? ' is-active' : ''}" role="tab" aria-selected="${i === 0}" aria-label="Slide ${i + 1}" data-index="${i}"></button>
        `).join('')}
      </div>
      <button class="carousel__btn carousel__btn--next" id="carousel-next" aria-label="Próximo slide">
        <img src="/assets/icons/chevron-right.svg" width="20" height="20" aria-hidden="true" alt="">
      </button>
    </div>`;

  el.querySelector('#carousel-prev').addEventListener('click', () => goTo(current - 1));
  el.querySelector('#carousel-next').addEventListener('click', () => goTo(current + 1));
  el.querySelectorAll('.carousel__dot').forEach(btn => {
    btn.addEventListener('click', () => goTo(parseInt(btn.dataset.index)));
  });

  startAutoplay();
}

function goTo(index) {
  const el = document.getElementById('home-carousel');
  if (!el) return;
  const slides = el.querySelectorAll('.carousel__slide');
  const dots   = el.querySelectorAll('.carousel__dot');

  slides[current].classList.remove('is-active');
  slides[current].setAttribute('aria-hidden', 'true');
  dots[current].classList.remove('is-active');
  dots[current].setAttribute('aria-selected', 'false');

  current = ((index % SLIDES.length) + SLIDES.length) % SLIDES.length;

  slides[current].classList.add('is-active');
  slides[current].setAttribute('aria-hidden', 'false');
  dots[current].classList.add('is-active');
  dots[current].setAttribute('aria-selected', 'true');

  restartAutoplay();
}

function startAutoplay() {
  autoplayTimer = setInterval(() => goTo(current + 1), 5000);
}

function restartAutoplay() {
  clearInterval(autoplayTimer);
  startAutoplay();
}

renderCarousel();
