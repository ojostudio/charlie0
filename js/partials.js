/* ===================================================
   partials.js — Carrega header e footer a partir de
   /partials/header.html e /partials/footer.html.

   Isso garante que o logo, o menu e o rodapé só
   precisem ser editados em UM lugar (os arquivos em
   /partials/) e o resultado se propague para todas as
   páginas automaticamente.

   Cada página só precisa ter:
     <div id="site-header"></div>
     ... conteúdo da página ...
     <div id="site-footer"></div>

   Ao final, dispara o evento "partialsLoaded" no
   document, para que nav.js e utils.js (que dependem
   do header/footer já estarem no DOM) rodem depois.
=================================================== */
(async () => {
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');

  async function inject(slot, path) {
    if (!slot) return;
    try {
      const res = await fetch(path);
      slot.outerHTML = await res.text();
    } catch (err) {
      console.error(`Não foi possível carregar ${path}:`, err);
    }
  }

  await Promise.all([
    inject(headerSlot, 'partials/header.html'),
    inject(footerSlot, 'partials/footer.html'),
  ]);

  // Marca o link ativo no menu principal com base na página atual
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#main-nav a[data-nav]').forEach(link => {
    const isActive = link.dataset.nav === currentPage;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
  });

  document.dispatchEvent(new CustomEvent('partialsLoaded'));
})();
