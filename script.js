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
