/* ================================================================
   SIGSIS — auth.js
   Autenticação simulada (Etapa 1 — sem backend real)
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', handleLogin);
  }
});

function handleLogin(e) {
  e.preventDefault();

  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const btn        = document.querySelector('.btn-login');

  const email = emailInput ? emailInput.value.trim() : '';
  const senha = senhaInput ? senhaInput.value.trim() : '';

  if (!email || !senha) {
    showLoginError('Preencha e-mail e senha para continuar.');
    return;
  }

  /* Simula carregamento */
  btn.disabled = true;
  btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Autenticando...';

  setTimeout(function () {
    /* Redireciona para o dashboard (simulado) */
    window.location.href = 'dashboard.html';
  }, 1000);
}

function showLoginError(msg) {
  let err = document.getElementById('login-error');
  if (!err) {
    err = document.createElement('div');
    err.id = 'login-error';
    err.style.cssText = `
      background: #fde8e8; color: #c81e1e;
      border: 1px solid #fca5a5; border-radius: 8px;
      padding: 10px 14px; font-size: 13px; font-weight: 500;
      margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
    `;
    const form = document.querySelector('#login-form');
    form.insertBefore(err, form.firstChild);
  }
  err.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${msg}`;
}
