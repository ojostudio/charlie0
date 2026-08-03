/* ===================================================
   contato-form.js — Envia o formulário de contato
   direto para o Firestore (coleção "leads"), pra
   aparecer como mensagem no painel administrativo.
=================================================== */
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const $msg = document.getElementById('contactFormMsg');
  const $btn = document.getElementById('contactFormSubmit');

  const SUBJECT_LABELS = {
    'cursos-cirrus': 'Cursos Cirrus',
    'cursos-anac': 'Cursos ANAC',
    'e-learning': 'Cursos E-learning',
    'gestao': 'Charlie 0 Gestão',
    'outros': 'Outros Assuntos'
  };

  function showMsg(text, type){
    $msg.textContent = text;
    $msg.className = 'contact-form-msg show ' + type;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!window.CZ || !CZ.configured || !CZ.db) {
      showMsg('Não foi possível enviar agora. Tente novamente em instantes ou fale com a gente pelo WhatsApp.', 'err');
      return;
    }

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !phone || !subject || !message) {
      showMsg('Preencha todos os campos antes de enviar.', 'err');
      return;
    }

    $btn.disabled = true;
    $btn.textContent = 'ENVIANDO...';

    try {
      await CZ.db.collection('leads').add({
        name,
        email,
        phone,
        subject,
        subjectLabel: SUBJECT_LABELS[subject] || subject,
        message,
        status: 'novo',
        archived: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdAtMs: Date.now(),
        source: 'contato.html'
      });

      showMsg('Mensagem enviada com sucesso! Nossa equipe vai retornar em breve.', 'ok');
      form.reset();
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      showMsg('Não foi possível enviar sua mensagem. Tente novamente em instantes.', 'err');
    } finally {
      $btn.disabled = false;
      $btn.textContent = 'ENVIAR MENSAGEM';
    }
  });
})();
