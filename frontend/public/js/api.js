/* ================================================================
   SIGSIS — api.js
   Helper centralizado para chamadas à API e guarda de autenticação
   ================================================================ */

/* Em dev com Docker (frontend na porta 5500), aponta pro backend na 3001.
   Em produção (Nginx) ou rodando pelo próprio Express, usa caminho relativo. */
const API_BASE = (window.location.port === '5500' || window.location.port === '5501')
  ? 'http://localhost:3001'
  : '';

/* ---- Tokens / sessão ---- */
function getToken() {
  return localStorage.getItem('sigsis_token');
}

function getUsuario() {
  try { return JSON.parse(localStorage.getItem('sigsis_usuario') || 'null'); }
  catch { return null; }
}

function salvarSessao(token, usuario) {
  localStorage.setItem('sigsis_token', token);
  localStorage.setItem('sigsis_usuario', JSON.stringify(usuario));
}

function encerrarSessao() {
  localStorage.removeItem('sigsis_token');
  localStorage.removeItem('sigsis_usuario');
  window.location.href = 'login.html';
}

/* ---- Guard: redireciona para login se não autenticado ---- */
function requireAuth() {
  if (!getToken()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

/* ---- Preenche nome do usuário logado no topbar ---- */
function preencherTopbarUsuario() {
  const u = getUsuario();
  if (!u) return;
  const nomeEl = document.querySelector('.topbar-user-info strong');
  const infoEl = document.querySelector('.topbar-user-info small');
  const avatarEl = document.querySelector('.topbar-avatar');
  if (nomeEl) nomeEl.textContent = u.nome;
  if (infoEl) infoEl.textContent = `${u.secretaria || 'SEMEG'} · ${u.cargo || 'TI'}`;
  if (avatarEl) avatarEl.textContent = u.nome ? u.nome[0].toUpperCase() : 'A';
}

/* ---- Fetch autenticado ---- */
async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    encerrarSessao();
    return null;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.erro || `Erro ${res.status}`);
  }

  return data;
}
