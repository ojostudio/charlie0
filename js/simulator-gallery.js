/* ===================================================
   simulator-gallery.js
   Galeria modal para a seção do simulador na home.
   Abre via botão [data-sim-gallery], fecha com ESC,
   click no overlay ou botão fechar.
   Suporte a teclado (← →) e swipe touch.
=================================================== */
(() => {
  const IMAGES = [
    { src: 'imagens/simulador-1.webp', alt: 'Simulador Cirrus — controles yoke' },
    { src: 'imagens/simulador-2.webp', alt: 'Simulador Cirrus — painel frontal' },
    { src: 'imagens/simulador-3.webp', alt: 'Simulador Cirrus — visão cockpit' },
    { src: 'imagens/simulador-4.webp', alt: 'Simulador Cirrus — sala completa' },
  ];

  const modal   = document.getElementById('simGalleryModal');
  const imgEl   = document.getElementById('simModalImg');
  const counter = document.getElementById('simCounter');
  const dotsEl  = document.getElementById('simDots');
  const prevBtn = document.getElementById('simPrev');
  const nextBtn = document.getElementById('simNext');

  if (!modal) return;

  let current = 0;
  let touchStartX = 0;

  /* --- Dots --- */
  IMAGES.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'sim-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Foto ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function getDots() { return dotsEl.querySelectorAll('.sim-dot'); }

  function goTo(index) {
    current = (index + IMAGES.length) % IMAGES.length;
    imgEl.src = IMAGES[current].src;
    imgEl.alt = IMAGES[current].alt;
    counter.textContent = `${current + 1} / ${IMAGES.length}`;
    getDots().forEach((d, i) => d.classList.toggle('is-active', i === current));
  }

  /* --- Open / Close --- */
  function open(startIndex = 0) {
    goTo(startIndex);
    modal.hidden = false;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    prevBtn.focus();
  }

  function close() {
    modal.classList.remove('is-open');
    modal.hidden = true;
    document.body.style.overflow = '';
    // Devolve foco ao botão que abriu
    const trigger = document.querySelector('[data-sim-gallery]');
    trigger?.focus();
  }

  /* --- Triggers --- */
  document.querySelectorAll('[data-sim-gallery]').forEach(btn => {
    btn.addEventListener('click', () => open(0));
  });

  document.querySelectorAll('[data-sim-close]').forEach(el => {
    el.addEventListener('click', close);
  });

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  /* --- Teclado --- */
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  /* --- Swipe touch --- */
  modal.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  modal.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? goTo(current + 1) : goTo(current - 1);
  }, { passive: true });
})();
