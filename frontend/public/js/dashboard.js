/* ================================================================
   GSIS — dashboard.js
   Popula o dashboard com dados reais da API (Etapa 2)
   ================================================================ */

document.addEventListener('DOMContentLoaded', async function () {
  if (!requireAuth()) return;
  preencherTopbarUsuario();

  try {
    const res = await apiFetch('/api/dashboard');
    if (!res) return;

    animateStats(res.stats);
    renderDistribution(res.distribuicao, res.stats.total);
    renderRecentes(res.recentes);
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
  }
});

function animateStats(stats) {
  const targets = {
    'stat-total':           stats.total,
    'stat-producao':        stats.producao,
    'stat-desenvolvimento': stats.desenvolvimento,
    'stat-homologacao':     stats.homologacao,
    'stat-criticos':        stats.criticos,
    'stat-descontinuados':  stats.descontinuado,
    'stat-pendentes':       stats.pendentes,
  };

  Object.entries(targets).forEach(function ([id, target]) {
    const el = document.getElementById(id);
    if (!el) return;
    let current  = 0;
    const step   = Math.max(1, Math.ceil(target / 30));
    const timer  = setInterval(function () {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

function renderDistribution(distribuicao, total) {
  const container = document.getElementById('distribution-bars');
  if (!container) return;

  container.innerHTML = distribuicao.map(function (item) {
    const pct = total > 0 ? Math.round((item.total / total) * 100) : 0;
    return `<div class="status-bar-item">
      <div class="status-bar-label">${item.label}</div>
      <div class="status-bar-track">
        <div class="status-bar-fill ${item.color}" style="width:0%" data-width="${pct}%"></div>
      </div>
      <div class="status-bar-count">${item.total} <span class="status-bar-pct">${pct}%</span></div>
    </div>`;
  }).join('');

  container.insertAdjacentHTML('beforeend', `
    <div class="distribution-total">
      Total de sistemas cadastrados: <strong>${total}</strong>
    </div>
  `);

  setTimeout(function () {
    container.querySelectorAll('.status-bar-fill').forEach(function (bar) {
      bar.style.width = bar.getAttribute('data-width');
    });
  }, 100);
}

function renderRecentes(recentes) {
  const tbody = document.getElementById('recent-tbody');
  if (!tbody || !recentes) return;

  if (!recentes.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:30px;color:#94a3b8;">
      Nenhum sistema cadastrado ainda.</td></tr>`;
    return;
  }

  tbody.innerHTML = recentes.map(function (s) {
    return `<tr>
      <td><strong>${s.nome}</strong></td>
      <td>${s.secretaria || '—'}</td>
      <td>${statusBadge(s.status)}</td>
      <td>${timeAgo(s.atualizado_em)}</td>
    </tr>`;
  }).join('');
}

