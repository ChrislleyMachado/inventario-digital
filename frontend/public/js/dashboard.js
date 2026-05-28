/* ================================================================
   SIGSIS — dashboard.js
   Popula o dashboard com dados simulados
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {
  animateStats();
  renderRecentSystems();
  renderDistribution();
});

/* Dados simulados */
const STATS = {
  total:           47,
  producao:        28,
  desenvolvimento:  9,
  semDocumentacao: 12,
  criticos:         6,
  descontinuados:   4,
};

const RECENT_SYSTEMS = [
  { nome: 'SySocial',                    secretaria: 'Assistência Social',    status: 'producao',      data: '2026-05-20' },
  { nome: 'Banco de Talentos',           secretaria: 'Recursos Humanos',      status: 'desenvolvimento', data: '2026-05-18' },
  { nome: 'Portal de Projetos Inovadores', secretaria: 'Inovação e Tecnologia', status: 'producao',    data: '2026-05-15' },
  { nome: 'Sistema de Protocolo',        secretaria: 'Administração',         status: 'producao',      data: '2026-05-10' },
  { nome: 'Sistema de Patrimônio',       secretaria: 'Administração',         status: 'manutencao',    data: '2026-05-05' },
];

const DISTRIBUTION = [
  { label: 'Em Produção',      value: 28, total: 47, color: 'green' },
  { label: 'Em Desenvolvimento', value: 9, total: 47, color: 'blue'  },
  { label: 'Em Manutenção',    value: 5,  total: 47, color: 'orange' },
  { label: 'Descontinuados',   value: 4,  total: 47, color: 'gray'   },
  { label: 'Críticos',         value: 6,  total: 47, color: 'red'    },
];

/**
 * Anima os números dos cards de estatística
 */
function animateStats() {
  const targets = {
    'stat-total':          STATS.total,
    'stat-producao':       STATS.producao,
    'stat-desenvolvimento': STATS.desenvolvimento,
    'stat-sem-doc':        STATS.semDocumentacao,
    'stat-criticos':       STATS.criticos,
    'stat-descontinuados': STATS.descontinuados,
  };

  Object.entries(targets).forEach(function ([id, target]) {
    const el = document.getElementById(id);
    if (!el) return;

    let current = 0;
    const step  = Math.ceil(target / 30);
    const timer = setInterval(function () {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

/**
 * Renderiza a tabela de sistemas recentes
 */
function renderRecentSystems() {
  const tbody = document.getElementById('recent-tbody');
  if (!tbody) return;

  tbody.innerHTML = RECENT_SYSTEMS.map(function (s) {
    return `<tr>
      <td>
        <strong>${s.nome}</strong>
      </td>
      <td>${s.secretaria}</td>
      <td>${statusBadge(s.status)}</td>
      <td>${formatDate(s.data)}</td>
      <td>
        <a href="detalhes-sistema.html" class="btn btn-outline-primary btn-sm">
          <i class="bi bi-eye"></i> Ver
        </a>
      </td>
    </tr>`;
  }).join('');
}

/**
 * Renderiza as barras de distribuição por status
 */
function renderDistribution() {
  const container = document.getElementById('distribution-bars');
  if (!container) return;

  container.innerHTML = DISTRIBUTION.map(function (item) {
    const pct = Math.round((item.value / item.total) * 100);
    return `<div class="status-bar-item">
      <div class="status-bar-label">${item.label}</div>
      <div class="status-bar-track">
        <div class="status-bar-fill ${item.color}" style="width: 0%" data-width="${pct}%"></div>
      </div>
      <div class="status-bar-count">${item.value}</div>
    </div>`;
  }).join('');

  /* Anima as barras após render */
  setTimeout(function () {
    container.querySelectorAll('.status-bar-fill').forEach(function (bar) {
      bar.style.width = bar.getAttribute('data-width');
    });
  }, 100);
}
