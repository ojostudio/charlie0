/* ===================================================
   cursos-render.js — Busca cursos ativos no Firestore
   (coleção "cursos", ordenados por "ordem") e renderiza
   os cards horizontais da página Cursos.
   Cada card leva para curso.html?id=<ID>.
=================================================== */
(() => {
  const lista = document.getElementById('cursosLista');
  const loading = document.getElementById('cursosLoading');
  const empty = document.getElementById('cursosEmpty');
  if (!lista) return;

  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  function renderCard(id, c) {
    const cover = (c.images && c.images[0]) || '';
    const article = document.createElement('article');
    article.className = 'curso-horizontal-card';
    article.innerHTML = `
      <div class="curso-horizontal-media">
        ${cover
          ? `<img src="${esc(cover)}" alt="${esc(c.titulo||'')}" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`
          : `<div class="placeholder-box" style="min-height:220px;"></div>`}
      </div>
      <div class="curso-horizontal-body">
        <h2>${esc(c.titulo||'')}</h2>
        <p class="desc">${esc(c.descCurta||'')}</p>
        <div class="curso-line" aria-hidden="true"></div>
        <div class="curso-footer">
          <div class="curso-stats">
            <span style="white-space:pre-line">${esc(c.info||'')}</span>
          </div>
          <a href="curso.html?id=${encodeURIComponent(id)}" class="btn btn-outline">Saiba Mais</a>
        </div>
      </div>`;
    return article;
  }

  async function loadCursos() {
    if (!window.CZ || !CZ.configured || !CZ.db) {
      if (loading) loading.style.display = 'none';
      if (empty) empty.style.display = 'block';
      return;
    }
    try {
      const snap = await CZ.db.collection('cursos')
        .where('status','==','ativo')
        .orderBy('ordem','asc')
        .get();

      if (loading) loading.style.display = 'none';

      if (snap.empty) {
        if (empty) empty.style.display = 'block';
        return;
      }

      snap.forEach(doc => lista.appendChild(renderCard(doc.id, doc.data())));

      // Re-dispara reveal-on-scroll nos cards recém-criados
      document.querySelectorAll('.cursos-lista .curso-horizontal-card').forEach((el, i) => {
        el.setAttribute('data-reveal','');
        el.style.setProperty('--reveal-i', i);
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-visible')));
      });
    } catch(e) {
      console.error('Erro ao carregar cursos:', e);
      if (loading) loading.style.display = 'none';
      if (empty) { empty.style.display = 'block'; empty.textContent = 'Não foi possível carregar os cursos agora. Tente novamente em instantes.'; }
    }
  }

  loadCursos();
})();
