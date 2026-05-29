/* ================================================================
   SIGSIS — dashboard.js
   Popula o dashboard com dados simulados
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {
  animateStats();
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
  { nome: 'Sistema de Patrimônio',       secretaria: 'Administração',         status: 'homologacao',   data: '2026-05-05' },
];

const DISTRIBUTION = [
  { label: 'Desenvolvimento', value: 9,  total: 47, color: 'blue'  },
  { label: 'Homologação',     value: 6,  total: 47, color: 'cyan'  },
  { label: 'Ativo',           value: 28, total: 47, color: 'green' },
  { label: 'Descontinuado',   value: 4,  total: 47, color: 'gray'  },
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
 * Renderiza as barras de distribuição por status
 */
function renderDistribution() {
  const container = document.getElementById('distribution-bars');
  if (!container) return;

  const total = DISTRIBUTION[0].total;

  container.innerHTML = DISTRIBUTION.map(function (item) {
    const pct = Math.round((item.value / item.total) * 100);
    return `<div class="status-bar-item">
      <div class="status-bar-label">${item.label}</div>
      <div class="status-bar-track">
        <div class="status-bar-fill ${item.color}" style="width: 0%" data-width="${pct}%"></div>
      </div>
      <div class="status-bar-count">${item.value} <span class="status-bar-pct">${pct}%</span></div>
    </div>`;
  }).join('');

  container.insertAdjacentHTML('beforeend', `
    <div class="distribution-total">
      Total de sistemas cadastrados: <strong>${total}</strong>
    </div>
  `);

  /* Anima as barras após render */
  setTimeout(function () {
    container.querySelectorAll('.status-bar-fill').forEach(function (bar) {
      bar.style.width = bar.getAttribute('data-width');
    });
  }, 100);
}
