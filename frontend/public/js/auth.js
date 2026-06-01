/* ================================================================
   SIGSIS — auth.js
   Autenticação real via API (Etapa 2)
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {
  /* Redireciona direto se já estiver logado */
  if (localStorage.getItem('sigsis_token')) {
    window.location.href = 'dashboard.html';
    return;
  }

  const form = document.getElementById('login-form');
  if (form) form.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
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

  btn.disabled = true;
  btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Autenticando...';
  clearLoginError();

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();

    if (!res.ok) {
      showLoginError(data.erro || 'Credenciais inválidas');
      return;
    }

    salvarSessao(data.token, data.usuario);
    window.location.href = 'dashboard.html';
  } catch {
    showLoginError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Entrar';
  }
}

function showLoginError(msg) {
  clearLoginError();
  const err = document.createElement('div');
  err.id = 'login-error';
  err.style.cssText = `
    background:#fde8e8; color:#c81e1e;
    border:1px solid #fca5a5; border-radius:8px;
    padding:10px 14px; font-size:13px; font-weight:500;
    margin-bottom:12px; display:flex; align-items:center; gap:8px;
  `;
  err.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${msg}`;
  const form = document.querySelector('#login-form');
  form.insertBefore(err, form.firstChild);
}

function clearLoginError() {
  const err = document.getElementById('login-error');
  if (err) err.remove();
}
