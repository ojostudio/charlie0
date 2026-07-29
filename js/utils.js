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

async function carregarComponentes() {
  try {
    // 1. Carrega o Header
    const resHeader = await fetch('header.html');
    const headerHtml = await resHeader.text();
    document.getElementById('header-placeholder').innerHTML = headerHtml;

    // 2. Carrega o Footer
    const resFooter = await fetch('footer.html');
    const footerHtml = await resFooter.text();
    document.getElementById('footer-placeholder').innerHTML = footerHtml;

    // 3. BÔNUS: Descobre a página atual e deixa o menu azul!
    let path = window.location.pathname;
    let page = path.split("/").pop();
    if (page === '' || page === '/') page = 'index.html'; // Padrão para a home

    document.querySelectorAll('.main-nav a').forEach(link => {
      // Pega o href do link (ex: "cursos.html")
      const href = link.getAttribute('href');
      // Se o link bater com a página atual, adiciona a classe azul
      if (href === page) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });

    // Como o header acabou de nascer, precisamos avisar o JS do menu mobile para funcionar
    const header = document.querySelector('.site-header');
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        const isOpen = header.classList.toggle('nav-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
      });
    }

  } catch (erro) {
    console.error("Erro ao carregar o header/footer:", erro);
  }
}

// Executa a função assim que a página carregar
carregarComponentes();