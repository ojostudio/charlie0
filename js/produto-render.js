/* ===================================================
   produto-render.js — Página template de produto.
   Lê ?id=<ID_DO_PRODUTO> na URL, busca o documento em
   Firestore (coleção "products") e preenche a página.
   Não existem páginas individuais por produto: esta
   mesma produto.html serve de template para todos.
=================================================== */
(() => {
  // -----------------------------------------------------------
  // Número de WhatsApp da empresa (COLOQUE aqui no formato
  // DDI+DDD+número, só dígitos — ex: "5511999999999")
  // -----------------------------------------------------------
  const WHATSAPP_NUMBER = "5511991940017";

  const $loading = document.getElementById('produtoLoading');
  const $notFound = document.getElementById('produtoNotFound');
  const $detail = document.getElementById('produtoDetail');
  if (!$detail) return;

  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function brl(n){ return (Number(n)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

  function showState(state){
    $loading.style.display = state === 'loading' ? 'block' : 'none';
    $notFound.style.display = state === 'not-found' ? 'block' : 'none';
    $detail.style.display = state === 'detail' ? 'grid' : 'none';
  }

  function renderProduct(p){
    document.getElementById('pageTitle').textContent = `${p.nome || 'Produto'} | Charlie Zero`;
    document.getElementById('produtoNome').textContent = p.nome || '';
    document.getElementById('produtoPreco').textContent = brl(p.preco);
    document.getElementById('produtoDesc').textContent = p.descCompleta || p.descCurta || '';

    const images = (p.images && p.images.length) ? p.images : ['imagens/bag1.webp'];
    const mainImg = document.getElementById('produtoMainImg');
    mainImg.src = images[0];
    mainImg.alt = p.nome || '';

    const thumbsBox = document.getElementById('produtoThumbs');
    thumbsBox.innerHTML = '';
    if (images.length > 1) {
      images.forEach((url, i) => {
        const btn = document.createElement('button');
        btn.className = 'produto-thumb' + (i === 0 ? ' is-active' : '');
        btn.innerHTML = `<img src="${esc(url)}" alt="">`;
        btn.addEventListener('click', () => {
          mainImg.src = url;
          thumbsBox.querySelectorAll('.produto-thumb').forEach(t => t.classList.remove('is-active'));
          btn.classList.add('is-active');
        });
        thumbsBox.appendChild(btn);
      });
    }

    const waMsg = `Olá! Tenho interesse no produto "${p.nome}" (${brl(p.preco)}) da Vitrine Charlie Zero. Gostaria de finalizar o pedido via Pix.`;
    const waLink = document.getElementById('produtoWhatsapp');
    waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`;

    showState('detail');
  }

  async function loadProduct(){
    showState('loading');
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) { showState('not-found'); return; }

    if (!window.CZ || !CZ.configured || !CZ.db) {
      console.warn('Produto: Firebase ainda não configurado (js/firebase-config.js).');
      showState('not-found');
      return;
    }

    try {
      const doc = await CZ.db.collection('products').doc(id).get();
      if (!doc.exists || doc.data().status !== 'ativo') { showState('not-found'); return; }
      renderProduct(doc.data());
    } catch (e) {
      console.error('Erro ao carregar produto:', e);
      showState('not-found');
    }
  }

  loadProduct();
})();
