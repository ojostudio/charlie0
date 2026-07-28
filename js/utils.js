/* ===================================================
   utils.js — Pequenos utilitários usados em todas as
   páginas: ano dinâmico no rodapé e neutralização dos
   botões que ainda não têm destino real (href="#").
=================================================== */
(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.querySelectorAll('a.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.getAttribute('href') === '#') e.preventDefault();
    });
  });
})();
