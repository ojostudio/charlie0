/* ===================================================
   carousel.js — Dois mecanismos de carrossel genéricos,
   reutilizáveis em qualquer página do site.

   1) CARROSSEL COM FADE (bolinhas)
      Ex.: seção "Resultados" na home.
      Marcação necessária:
        <section data-carousel="fade">
          ... elementos com [data-dot="0"], [data-dot="1"]...
          ... elementos com [data-slide="0"], [data-slide="1"]...
        </section>
      Todo elemento com [data-slide] cujo valor bater com o
      índice atual recebe a classe "is-active" (mostrar/
      esconder via CSS, ver .testimonial-slide/.results-person
      em 04-componentes.css). O JS não sabe nada sobre o que
      é texto ou imagem — só liga/desliga a classe.

   2) CARROSSEL COM SETAS (arraste horizontal)
      Ex.: "Conheça nossa equipe" em Quem Somos.
      Marcação necessária:
        <div data-carousel="slider">
          <button data-prev>‹</button>
          <div data-track>...cards...</div>
          <button data-next>›</button>
        </div>
=================================================== */

function initFadeCarousel(root, { interval = 6000 } = {}) {
  const dots = root.querySelectorAll('[data-dot]');
  const slideEls = root.querySelectorAll('[data-slide]');
  if (!dots.length) return;

  let current = 0;
  let timer = null;

  function goTo(index) {
    current = index;
    dots.forEach(d => {
      const active = d.dataset.dot === String(index);
      d.classList.toggle('is-active', active);
      d.setAttribute('aria-selected', String(active));
    });
    slideEls.forEach(s => s.classList.toggle('is-active', s.dataset.slide === String(index)));
  }

  function next() { goTo((current + 1) % dots.length); }
  function prev() { goTo((current - 1 + dots.length) % dots.length); }
  function start() { stop(); timer = setInterval(next, interval); }
  function stop() { if (timer) clearInterval(timer); }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.dot));
      start(); // reinicia a contagem ao clicar manualmente
    });
  });

  // Setas prev/next são opcionais — usadas junto com os dots
  // em carrosséis como o "Homologado Cirrus".
  root.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', () => { prev(); start(); });
  });
  root.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => { next(); start(); });
  });

  start();
}

function initArrowSlider(root) {
  const track = root.querySelector('[data-track]');
  const prevBtn = root.querySelector('[data-prev]');
  const nextBtn = root.querySelector('[data-next]');
  if (!track) return;

  function scrollByCard(direction) {
    const card = track.querySelector(':scope > *');
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0');
    const distance = card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    track.scrollBy({ left: distance * direction, behavior: 'smooth' });
  }

  prevBtn?.addEventListener('click', () => scrollByCard(-1));
  nextBtn?.addEventListener('click', () => scrollByCard(1));
}

document.querySelectorAll('[data-carousel="fade"]').forEach(el => initFadeCarousel(el));
document.querySelectorAll('[data-carousel="slider"]').forEach(el => initArrowSlider(el));
