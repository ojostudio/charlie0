/* ===================================================
   vitrine-render.js — Busca produtos ativos no Firestore
   (coleção "products") e renderiza os cards da vitrine,
   mantendo exatamente a estrutura/visual original dos
   cards (.vitrine-card). Cada card leva para
   produto.html?id=<ID> ao clicar.
=================================================== */
(() => {
  const grid = document.getElementById('vitrineGrid');
  const emptyMsg = document.getElementById('vitrineEmpty');
  if (!grid) return;

  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  function renderCard(id, p){
    const cover = (p.images && p.images[0]) || 'imagens/bag1.webp';
    const article = document.createElement('article');
    article.className = 'vitrine-card';
    article.innerHTML = `
      <img src="${esc(cover)}" alt="${esc(p.nome||'Produto Charlie Zero')}" class="vitrine-card-bg" loading="lazy">
      <div class="vitrine-card-content">
        <h3>${esc(p.nome||'')}</h3>
        <p>${esc(p.descCurta||'')}</p>
        <a href="produto.html?id=${encodeURIComponent(id)}" class="btn-outline-white">VER DETALHES</a>
      </div>`;
    return article;
  }

  async function loadVitrine(){
    if (!window.CZ || !CZ.configured || !CZ.db) {
      // Sem Firebase configurado ainda — não quebra a página, só avisa no console
      console.warn('Vitrine: Firebase ainda não configurado (js/firebase-config.js).');
      if (emptyMsg) emptyMsg.style.display = 'block';
      return;
    }
    try {
      const snap = await CZ.db.collection('products').where('status', '==', 'ativo').get();
      if (snap.empty) { if (emptyMsg) emptyMsg.style.display = 'block'; return; }

      const items = [];
      snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      items.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

      items.forEach(p => grid.appendChild(renderCard(p.id, p)));
      if (emptyMsg) emptyMsg.style.display = 'none';

      // Re-aplica o reveal-on-scroll (effects.js) aos cards recém-criados
      if (window.IntersectionObserver) {
        document.querySelectorAll('.vitrine-grid .vitrine-card').forEach((el, i) => {
          el.setAttribute('data-reveal', '');
          el.style.setProperty('--reveal-i', i);
          requestAnimationFrame(() => el.classList.add('is-visible'));
        });
      }
    } catch (e) {
      console.error('Erro ao carregar vitrine:', e);
      if (emptyMsg) { emptyMsg.style.display = 'block'; emptyMsg.textContent = 'Não foi possível carregar os produtos agora. Tente novamente em instantes.'; }
    }
  }

  loadVitrine();
})();
