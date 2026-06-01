/* ================================================================
   SIGSIS — sistemas.js
   Lista, busca e filtros de sistemas — dados reais da API (Etapa 2)
   ================================================================ */

let filteredData = [];

document.addEventListener('DOMContentLoaded', async function () {
  if (!requireAuth()) return;
  preencherTopbarUsuario();

  await carregarSistemas();
  initSearch();
  initFilters();
});

async function carregarSistemas(params = {}) {
  const query = new URLSearchParams();
  if (params.busca)       query.set('busca',       params.busca);
  if (params.status)      query.set('status',      params.status);
  if (params.secretaria)  query.set('secretaria',  params.secretaria);
  if (params.criticidade) query.set('criticidade', params.criticidade);

  try {
    const res = await apiFetch(`/api/sistemas?${query.toString()}`);
    if (!res) return;
    filteredData = res.data;
    renderTable(filteredData);
    updateCount(filteredData.length);
  } catch (err) {
    console.error('Erro ao carregar sistemas:', err);
    showToast('Erro ao carregar sistemas', 'error');
  }
}

function renderTable(data) {
  const tbody = document.getElementById('sistemas-tbody');
  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:#94a3b8;">
      <i class="bi bi-search" style="font-size:32px;display:block;margin-bottom:10px;"></i>
      Nenhum sistema encontrado com os filtros aplicados.
    </td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(function (s) {
    const desc = (s.descricao || '').substring(0, 52) + ((s.descricao || '').length > 52 ? '...' : '');
    return `<tr>
      <td><span class="sistema-codigo">${s.codigo}</span></td>
      <td class="td-nome">
        <strong>${s.nome}</strong>
        <span>${desc}</span>
      </td>
      <td>${s.secretaria || '—'}</td>
      <td>${statusBadge(s.status)}</td>
      <td>${criticidadeBadge(s.criticidade)}</td>
      <td>${s.resp_tec || '—'}</td>
      <td class="td-actions">
        <a href="detalhes-sistema.html?id=${s.id}" class="btn btn-outline-primary btn-sm">
          <i class="bi bi-eye"></i> Ver Detalhes
        </a>
      </td>
    </tr>`;
  }).join('');
}

function initSearch() {
  const input = document.getElementById('busca-sistema');
  if (!input) return;
  input.addEventListener('input', debounce(applyFilters, 350));
}

function initFilters() {
  ['filtro-status', 'filtro-secretaria', 'filtro-criticidade'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyFilters);
  });

  const btnLimpar = document.getElementById('btn-limpar-filtros');
  if (btnLimpar) btnLimpar.addEventListener('click', limparFiltros);
}

function applyFilters() {
  carregarSistemas({
    busca:       document.getElementById('busca-sistema')?.value.trim()    || '',
    status:      document.getElementById('filtro-status')?.value           || '',
    secretaria:  document.getElementById('filtro-secretaria')?.value.trim() || '',
    criticidade: document.getElementById('filtro-criticidade')?.value      || '',
  });
}

function limparFiltros() {
  ['busca-sistema', 'filtro-status', 'filtro-secretaria', 'filtro-criticidade'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  carregarSistemas();
}

function updateCount(n) {
  const el = document.getElementById('sistemas-count');
  if (el) el.textContent = `${n} sistema${n !== 1 ? 's' : ''} encontrado${n !== 1 ? 's' : ''}`;
}
