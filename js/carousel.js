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

function initArrowSlider(root, { autoplayInterval = 4500 } = {}) {
  const track = root.querySelector('[data-track]');
  const prevBtn = root.querySelector('[data-prev]');
  const nextBtn = root.querySelector('[data-next]');
  if (!track) return;

  let currentIndex = 0;
  let timer = null;

  function getStepWidth() {
    const card = track.querySelector(':scope > *');
    if (!card) return (track.parentElement ? track.parentElement.clientWidth : track.clientWidth) * 0.35;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0');
    return card.getBoundingClientRect().width + gap;
  }

  function slideTo(index) {
    const cards = track.querySelectorAll(':scope > *');
    const stepW = getStepWidth();
    const winW = track.parentElement ? track.parentElement.getBoundingClientRect().width : stepW;
    const visible = stepW > 0 ? Math.round(winW / stepW) : 1;
    const maxIndex = Math.max(0, cards.length - visible);
    // Avança em loop: ao chegar no fim, volta ao início
    currentIndex = index > maxIndex ? 0 : Math.max(0, index);
    track.style.transform = `translateX(-${currentIndex * stepW}px)`;
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => slideTo(currentIndex + 1), autoplayInterval);
  }

  function stopAutoplay() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  prevBtn?.addEventListener('click', () => { slideTo(currentIndex - 1); startAutoplay(); });
  nextBtn?.addEventListener('click', () => { slideTo(currentIndex + 1); startAutoplay(); });

  // Pausa ao passar o mouse (desktop) ou tocar (mobile)
  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  root.addEventListener('touchstart', stopAutoplay, { passive: true });
  root.addEventListener('touchend',   startAutoplay, { passive: true });

  startAutoplay();
}

document.querySelectorAll('[data-carousel="fade"]').forEach(el => initFadeCarousel(el));
document.querySelectorAll('[data-carousel="slider"]').forEach(el => initArrowSlider(el));
