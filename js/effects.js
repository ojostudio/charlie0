/* ===================================================
   effects.js — Camada de polimento visual sutil.
   Usado em todas as páginas do site. Não altera
   estrutura nem conteúdo — apenas adiciona classes
   (.is-visible, .is-scrolled) que a 06-efeitos.css
   já sabe animar.
=================================================== */
(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Marca automaticamente elementos "revelaveis" que ainda
        não tenham sido marcados manualmente no HTML. */
  const autoSelectors = [
    '.hero-copy', '.hero-media', '.hero-card',
    '.course-card', '.stat', '.results-copy', '.results-visual',
    '.cta-banner', '.simulator-text', '.simulator-photo',
    '.section-title', '.eyebrow'
  ];
  document.querySelectorAll(autoSelectors.join(',')).forEach(el => {
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
  });

  // Escalona o delay dentro de grids (cursos, stats)
  document.querySelectorAll('.courses-grid, .stats-grid').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty('--reveal-i', i);
    });
  });

  if (prefersReducedMotion) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
  }

  /* 2. Header com sombra sutil ao rolar */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* 3. Parallax bem discreto na imagem do hero (desktop apenas) */
  if (!prefersReducedMotion && window.innerWidth > 900) {
    const heroImg = document.querySelector('.hero-media img, .hero-photo-box img');
    if (heroImg) {
      const onParallax = () => {
        const rect = heroImg.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const offset = Math.max(-12, Math.min(12, rect.top * 0.03));
        heroImg.style.transform = `translateY(${offset}px)`;
      };
      onParallax();
      window.addEventListener('scroll', onParallax, { passive: true });
    }
  }
})();
