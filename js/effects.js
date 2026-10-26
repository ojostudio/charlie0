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
    // Home
    '.hero-copy', '.hero-media', '.hero-card', '.hero-plane', '.hero-person',
    '.course-card', '.stat', '.results-copy', '.results-visual',
    '.cta-banner', '.simulator-text', '.simulator-photo',
    '.frota-heading', '.frota-card',
    // Quem Somos
    '.intro-copy', '.intro-photo', '.team-card',
    '.certified-content', '.certified-card',
    // Cursos
    '.hero-cursos-content', '.curso-horizontal-card',
    '.cursos-black-box', '.faq-item',
    // Vitrine
    '.vitrine-card', '.vitrine-hero-img', '.cta-orange-banner',
    // Contato
    '.contact-box', '.contact-form-container', '.contact-title-group',
    // Charlie0 Gestão
    '.gestao-card', '.gestao-hero-content', '.gestao-intro',
    // Genéricos
    '.section-title', '.eyebrow'
  ];
  document.querySelectorAll(autoSelectors.join(',')).forEach(el => {
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
  });

  // Escalona o delay dentro de grids (cursos, stats)
  document.querySelectorAll(
    '.courses-grid, .stats-grid, .team-track, .faq-grid, ' +
    '.vitrine-grid, .gestao-cards-grid, .curso-line'
  ).forEach(group => {
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

    // rAF garante que o browser pintou o estado inicial (opacity:0, blur)
    // antes de observar — sem isso o hero (já no viewport) pularia a transição
    requestAnimationFrame(() => {
      document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
    });
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

  /* 3. Parallax bem discreto na hero-person img (desktop apenas) */
  if (!prefersReducedMotion && window.innerWidth > 900) {
    const heroPersonImg = document.querySelector('.hero-person img');
    if (heroPersonImg) {
      const onParallax = () => {
        const rect = heroPersonImg.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const offset = Math.max(-12, Math.min(12, rect.top * 0.03));
        heroPersonImg.style.transform = `translateY(${offset}px)`;
      };
      onParallax();
      window.addEventListener('scroll', onParallax, { passive: true });
    }
  }
  /* Parallax sutil na aeronave da seção "Homologado Cirrus" (quem-somos.html).
     Usa translateY(-50%) como base (mantém o posicionamento original) e
     adiciona ±10px conforme a seção passa pela tela. Não interfere com
     elementos acima ou abaixo pois a aeronave é position:absolute. */
  const certPlane = document.querySelector('.certified-plane');
  if (!prefersReducedMotion && certPlane) {
    const onCertParallax = () => {
      const rect = certPlane.closest('.certified')?.getBoundingClientRect();
      if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = rect.top / window.innerHeight;
      const offset = Math.max(-10, Math.min(10, progress * 20));
      certPlane.style.transform = `translateY(calc(-50% + ${offset}px))`;
    };
    onCertParallax();
    window.addEventListener('scroll', onCertParallax, { passive: true });
  }
})();
