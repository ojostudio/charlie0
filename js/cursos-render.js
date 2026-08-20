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
    const url = `curso.html?id=${encodeURIComponent(id)}`;
    const article = document.createElement('article');
    article.className = 'curso-horizontal-card';
    article.innerHTML = `
      <div class="curso-horizontal-media">
        <a href="${url}" tabindex="-1" aria-hidden="true" style="display:block;height:100%">
          ${cover
            ? `<img src="${esc(cover)}" alt="${esc(c.titulo||'')}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;">`
            : `<div class="placeholder-box" style="min-height:220px;"></div>`}
        </a>
      </div>
      <div class="curso-horizontal-body">
        <h2><a href="${url}" style="color:inherit;text-decoration:none">${esc(c.titulo||'')}</a></h2>
        <p class="desc">${esc(c.descCurta||'')}</p>
        <div class="curso-line" aria-hidden="true"></div>
        <div class="curso-footer">
          <div class="curso-stats">
            <span style="white-space:pre-line">${esc(c.info||'')}</span>
          </div>
          <a href="${url}" class="btn btn-outline">Saiba Mais</a>
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
      const snap = await CZ.db.collection('cursos').get();

      if (loading) loading.style.display = 'none';

      if (snap.empty) {
        if (empty) empty.style.display = 'block';
        return;
      }

      const items = [];
      snap.forEach(doc => {
        const d = doc.data();
        // Mostra cursos ativos OU sem campo status (criados antes do novo sistema)
        if (!d.status || d.status === 'ativo') items.push({ id: doc.id, ...d });
      });

      if (!items.length) { if (empty) empty.style.display = 'block'; return; }

      items.sort((a, b) => (a.ordem ?? 999) - (b.ordem ?? 999));
      items.forEach(c => lista.appendChild(renderCard(c.id, c)));

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
