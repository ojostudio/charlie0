// Menu mobile
const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');

menuToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    header.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Ano dinâmico no rodapé
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Todos os botões são apenas visuais nesta versão de validação (sem destino real)
document.querySelectorAll('a.btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (btn.getAttribute('href') === '#') e.preventDefault();
  });
});

// Carrossel de depoimentos (seção Resultados)
(() => {
  const dots = document.querySelectorAll('.results-dots [data-dot]');
  const slides = document.querySelectorAll('.testimonial-slide');
  const photos = document.querySelectorAll('.results-person');
  if (!dots.length) return;

  let current = 0;
  let autoplayTimer = null;

  function goTo(index) {
    current = index;
    dots.forEach(d => {
      const active = d.dataset.dot === String(index);
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-selected', String(active));
    });
    slides.forEach(s => s.classList.toggle('is-active', s.dataset.slide === String(index)));
    photos.forEach(p => p.classList.toggle('is-active', p.dataset.slide === String(index)));
  }

  function next() {
    goTo((current + 1) % dots.length);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, 6000);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.dot));
      startAutoplay(); // reinicia a contagem ao clicar manualmente
    });
  });

  startAutoplay();
})();
