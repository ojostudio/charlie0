/* ===================================================
   firebase-config.js — Charlie Zero
   Configuração central do Firebase (Auth + Firestore + Storage).

   COMO ATIVAR:
   1. Crie um projeto em console.firebase.google.com
   2. Ative Authentication → E-mail/senha
   3. Crie um Firestore (modo produção) e o Storage
   4. Cole as chaves do seu app abaixo em CZ.config
   5. Publique as regras de segurança (ver SETUP-FIREBASE.md)
   6. Crie o primeiro usuário admin direto no console do Firebase
      (Authentication → Add user) e depois crie o documento
      correspondente em Firestore, coleção "users", doc ID = UID
      do usuário, com os campos: { name, email, role: "admin" }
=================================================== */
window.CZ = window.CZ || {};

// -------------------------------------------------------------
// COLE AQUI AS CHAVES DO SEU APP FIREBASE (Configurações do projeto
// → Seus apps → SDK setup and configuration → Config)
// -------------------------------------------------------------
CZ.config = {
  apiKey: "AIzaSyCjlDo3M5pdA514tHg9AxCUz8iFCiFyDt8",
  authDomain: "charlie0.firebaseapp.com",
  projectId: "charlie0",
  storageBucket: "charlie0.firebasestorage.app",
  messagingSenderId: "28454291978",
  appId: "1:28454291978:web:223b162e33dab7dbfeedf3"
};

// Papéis de acesso válidos no painel administrativo
CZ.ROLES = ["admin", "editor"];

// "storage" = sobe imagem pro Firebase Storage (recomendado, ativar quando
//             o Storage do projeto estiver habilitado no console)
// "inline"  = SEM Storage: converte a imagem pra WebP comprimido no navegador
//             e salva como Base64 direto no Firestore. Funciona bem para
//             poucas imagens por produto; limite de ~1MB por documento.
CZ.IMAGE_MODE = "inline";

// Considera configurado se a apiKey foi de fato preenchida
CZ.configured = CZ.config.apiKey && CZ.config.apiKey !== "COLE_AQUI";

if (CZ.configured) {
  firebase.initializeApp(CZ.config);
  CZ.auth = firebase.auth();
  CZ.db = firebase.firestore();
  CZ.storage = CZ.IMAGE_MODE === "storage" ? firebase.storage() : null;
}
