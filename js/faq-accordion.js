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

    // Estado inicial fechado: altura 0 (exceto se já vier aberto no HTML)
    if (!item.hasAttribute('open')) {
      content.style.height = '0px';
    }

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (prefersReducedMotion) {
        item.toggleAttribute('open');
        content.style.height = item.hasAttribute('open') ? 'auto' : '0px';
        content.style.opacity = item.hasAttribute('open') ? '1' : '0';
        return;
      }
      item.hasAttribute('open') ? closeItem(item, content) : openItem(item, content);
    });
  });

  function openItem(item, content) {
    item.setAttribute('open', '');
    const target = content.scrollHeight;
    content.style.height = '0px';
    // força reflow para garantir que a transição parta de 0
    void content.offsetHeight;
    content.style.height = target + 'px';

    content.addEventListener('transitionend', function onEnd(e) {
      if (e.propertyName !== 'height') return;
      content.style.height = 'auto';
      content.removeEventListener('transitionend', onEnd);
    });
  }

  function closeItem(item, content) {
    const current = content.scrollHeight;
    content.style.height = current + 'px';
    void content.offsetHeight;
    content.style.height = '0px';

    content.addEventListener('transitionend', function onEnd(e) {
      if (e.propertyName !== 'height') return;
      item.removeAttribute('open');
      content.removeEventListener('transitionend', onEnd);
    });
  }
})();
