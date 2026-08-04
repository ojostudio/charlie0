/* ===================================================
   nav.js — Menu mobile (hambúrguer do header)
   Usado em todas as páginas do site.
=================================================== */
(() => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  if (!header || !menuToggle) return;

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

  // Dropdown "Acessar Cursos" — clique/toque abre e fecha (funciona junto
  // com o hover do desktop, que já é resolvido só em CSS)
  document.querySelectorAll('.cursos-dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dropdown = trigger.closest('.cursos-dropdown');
      const isOpen = dropdown.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
      // Fecha os outros dropdowns abertos
      document.querySelectorAll('.cursos-dropdown.is-open').forEach(d => {
        if (d !== dropdown) { d.classList.remove('is-open'); d.querySelector('.cursos-dropdown-trigger').setAttribute('aria-expanded', 'false'); }
      });
    });
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.cursos-dropdown.is-open').forEach(d => {
      if (!d.contains(e.target)) { d.classList.remove('is-open'); d.querySelector('.cursos-dropdown-trigger').setAttribute('aria-expanded', 'false'); }
    });
  });
})();
