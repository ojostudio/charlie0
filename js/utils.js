/* ===================================================
   utils.js — Pequenos utilitários usados em todas as
   páginas: ano dinâmico no rodapé e neutralização dos
   botões que ainda não têm destino real (href="#").

   O #year fica dentro do footer, que agora é injetado
   dinamicamente por partials.js — por isso este código
   roda depois do evento "partialsLoaded".
=================================================== */
document.addEventListener('partialsLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.querySelectorAll('a.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.getAttribute('href') === '#') e.preventDefault();
    });
  });
});
