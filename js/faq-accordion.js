/* ===================================================
   faq-accordion.js — Anima a abertura/fechamento dos
   itens <details class="faq-item"> da página Cursos.
   Substitui o toggle nativo (instantâneo) por uma
   transição suave de altura, mantendo a semântica e
   acessibilidade do <details>/<summary>.
=================================================== */
(() => {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  items.forEach(item => {
    const summary = item.querySelector('summary');
    const content = item.querySelector('.faq-content');
    if (!summary || !content) return;

    let animating = false;
    let opening = item.hasAttribute('open'); // estado-alvo da animação em curso

    // Estado inicial fechado: altura 0 (exceto se já vier aberto no HTML)
    if (!item.hasAttribute('open')) {
      content.style.height = '0px';
    }

    // Único listener de transitionend por item — evita empilhar
    // handlers e travar quando o usuário clica rápido demais.
    content.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'height') return;
      animating = false;
      if (opening) {
        content.style.height = 'auto';
      } else {
        item.removeAttribute('open');
      }
    });

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (animating) return; // ignora cliques durante a animação em curso
      animating = true;

      if (prefersReducedMotion) {
        item.toggleAttribute('open');
        content.style.height = item.hasAttribute('open') ? 'auto' : '0px';
        animating = false;
        return;
      }

      if (item.hasAttribute('open')) {
        opening = false;
        closeItem(item, content);
      } else {
        opening = true;
        openItem(item, content);
      }
    });
  });

  function openItem(item, content) {
    item.setAttribute('open', '');
    const target = content.scrollHeight;
    content.style.height = '0px';
    void content.offsetHeight; // força reflow para garantir que a transição parta de 0
    content.style.height = target + 'px';
  }

  function closeItem(item, content) {
    // Se a altura estiver "auto" (item aberto e parado), fixa em px
    // antes de animar para 0 — senão o navegador não tem de onde partir.
    const current = content.getBoundingClientRect().height;
    content.style.height = current + 'px';
    void content.offsetHeight; // força reflow
    content.style.height = '0px';
    // 'open' é removido pelo listener de transitionend acima
  }
})();
