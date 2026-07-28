/* ===================================================
   nav.js — Menu mobile (hambúrguer do header)
   Usado em todas as páginas do site.

   O header agora é injetado dinamicamente por
   partials.js, então este código só roda depois do
   evento "partialsLoaded".
=================================================== */
document.addEventListener('partialsLoaded', () => {
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
});
