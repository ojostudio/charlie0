/* ===================================================
   curso-render.js — Página template de curso.
   Lê ?id=<ID> na URL, busca em Firestore (coleção
   "cursos") e preenche a página com carrossel manual
   (imagens + vídeo, sem autoplay, navegação por setas).
=================================================== */
(() => {
  const WA = '5511991940017';

  const $loading  = document.getElementById('cursoLoading');
  const $notFound = document.getElementById('cursoNotFound');
  const $detail   = document.getElementById('cursoDetail');
  const $stage    = document.getElementById('carouselStage');
  const $nav      = document.getElementById('carouselNav');
  const $dots     = document.getElementById('cDots');
  const $prev     = document.getElementById('cPrev');
  const $next     = document.getElementById('cNext');
  if (!$detail) return;

  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  function showState(s){
    $loading.style.display  = s==='loading'  ? 'block':'none';
    $notFound.style.display = s==='notFound' ? 'block':'none';
    $detail.style.display   = s==='detail'   ? 'grid' :'none';
  }

  // --- Carrossel ---
  let slides = [], current = 0;

  function buildSlides(images, videoUrl) {
    slides = [];
    (images||[]).forEach(url => slides.push({ type:'image', url }));
    if (videoUrl) slides.push({ type:'video', url:videoUrl });

    $stage.innerHTML = '';
    slides.forEach((s, i) => {
      let el;
      if (s.type === 'image') {
        el = document.createElement('img');
        el.src = s.url;
        el.alt = '';
        el.loading = i===0 ? 'eager' : 'lazy';
      } else {
        el = document.createElement('video');
        el.src = s.url;
        el.controls = true;
        el.preload = 'metadata';
      }
      el.className = 'c-slide' + (i===0?' is-active':'');
      $stage.appendChild(el);
    });

    // Dots
    $dots.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'c-dot' + (i===0?' is-active':'');
      btn.setAttribute('aria-label', `Slide ${i+1}`);
      btn.onclick = () => goTo(i);
      $dots.appendChild(btn);
    });

    if (slides.length > 1) {
      $nav.style.display = 'flex';
      $prev.onclick = () => goTo((current - 1 + slides.length) % slides.length);
      $next.onclick = () => goTo((current + 1) % slides.length);
    } else {
      $nav.style.display = slides.length === 1 ? 'none' : 'none';
    }
  }

  function goTo(i) {
    const allSlides = $stage.querySelectorAll('.c-slide');
    const allDots = $dots.querySelectorAll('.c-dot');
    // Pausa vídeo anterior se houver
    if (allSlides[current]?.tagName === 'VIDEO') allSlides[current].pause();
    allSlides[current]?.classList.remove('is-active');
    allDots[current]?.classList.remove('is-active');
    current = i;
    allSlides[current]?.classList.add('is-active');
    allDots[current]?.classList.add('is-active');
  }

  // --- Render info ---
  function renderInfo(c) {
    const waMsg = `Olá! Vim pelo site da Charlie Zero e tenho interesse no curso "${c.titulo}". Poderia me passar mais informações?`;
    const waLink = `https://wa.me/${WA}?text=${encodeURIComponent(waMsg)}`;

    document.getElementById('cursoInfo').innerHTML = `
      ${c.categoria ? `<span class="curso-tag-chip">${esc(c.categoria)}</span>` : ''}
      <h1>${esc(c.titulo||'')}</h1>
      ${c.descCurta ? `<p class="curso-descCurta">${esc(c.descCurta)}</p>` : ''}
      <div class="curso-info-line"></div>
      ${c.info ? `<div class="curso-info-block">${esc(c.info)}</div>` : ''}
      ${c.descCompleta ? `<p class="curso-descCompleta">${esc(c.descCompleta)}</p>` : ''}
      <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-solid-blue curso-cta">
        Falar com a Equipe
      </a>
      <p class="curso-cta-hint">Atendimento pelo WhatsApp. Resposta rápida.</p>
    `;
  }

  // --- Load ---
  async function loadCurso() {
    showState('loading');
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) { showState('notFound'); return; }

    if (!window.CZ || !CZ.configured || !CZ.db) {
      showState('notFound'); return;
    }

    try {
      const doc = await CZ.db.collection('cursos').doc(id).get();
      if (!doc.exists || doc.data().status !== 'ativo') { showState('notFound'); return; }

      const c = doc.data();
      document.getElementById('pageTitle').textContent = `${c.titulo||'Curso'} | Charlie Zero`;

      buildSlides(c.images||[], c.videoUrl||'');
      renderInfo(c);
      showState('detail');
    } catch(e) {
      console.error(e);
      showState('notFound');
    }
  }

  loadCurso();
})();
