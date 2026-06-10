/* ================================================================
   GSIS — sistemas.js
   Lista, busca e filtros de sistemas — dados reais da API (Etapa 2)
   ================================================================ */

let filteredData = [];

document.addEventListener('DOMContentLoaded', async function () {
  if (!requireAuth()) return;
  preencherTopbarUsuario();

  const params = new URLSearchParams(window.location.search);
  if (params.get('status'))      { const el = document.getElementById('filtro-status');      if (el) el.value = params.get('status'); }
  if (params.get('criticidade')) { const el = document.getElementById('filtro-criticidade'); if (el) el.value = params.get('criticidade'); }
  if (params.get('busca'))       { const el = document.getElementById('busca-sistema');       if (el) el.value = params.get('busca'); }
  if (params.get('pendente'))    { const el = document.getElementById('filtro-pendente');     if (el) el.value = params.get('pendente'); }

  await carregarSistemas({
    status:      params.get('status')      || '',
    criticidade: params.get('criticidade') || '',
    busca:       params.get('busca')       || '',
    pendente:    params.get('pendente')    || '',
  });
  initSearch();
  initFilters();
});

async function carregarSistemas(params = {}) {
  const query = new URLSearchParams();
  if (params.busca)       query.set('busca',       params.busca);
  if (params.status)      query.set('status',      params.status);
  if (params.secretaria)  query.set('secretaria',  params.secretaria);
  if (params.criticidade) query.set('criticidade', params.criticidade);
  if (params.pendente)    query.set('pendente',    params.pendente);

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

function temFiltroAtivo() {
  return (
    (document.getElementById('busca-sistema')?.value      || '') !== '' ||
    (document.getElementById('filtro-status')?.value      || '') !== '' ||
    (document.getElementById('filtro-secretaria')?.value  || '') !== '' ||
    (document.getElementById('filtro-criticidade')?.value || '') !== '' ||
    (document.getElementById('filtro-pendente')?.value    || '') !== ''
  );
}

function renderTable(data) {
  const tbody = document.getElementById('sistemas-tbody');
  if (!tbody) return;

  if (!data.length) {
    if (temFiltroAtivo()) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:#94a3b8;">
        <i class="bi bi-search" style="font-size:32px;display:block;margin-bottom:10px;"></i>
        Nenhum sistema encontrado com os filtros aplicados.
      </td></tr>`;
    } else {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:48px 40px;color:#94a3b8;">
        <i class="bi bi-grid-3x3-gap" style="font-size:40px;display:block;margin-bottom:14px;color:#cbd5e1;"></i>
        <div style="font-size:15px;font-weight:600;color:#64748b;margin-bottom:6px;">Nenhum sistema cadastrado ainda</div>
        <div style="font-size:13px;margin-bottom:20px;">Registre o primeiro sistema no inventário municipal</div>
        <a href="novo-sistema.html" class="btn btn-primary">
          <i class="bi bi-plus-lg"></i> Novo Sistema
        </a>
      </td></tr>`;
    }
    return;
  }

  tbody.innerHTML = data.map(function (s) {
    const desc      = (s.descricao || '').substring(0, 52) + ((s.descricao || '').length > 52 ? '...' : '');
    const pendencias = [];
    if (!s.tecnologias || !s.tecnologias.length) pendencias.push('Tecnologias');
    if (!s.hospedagem)       pendencias.push('Hospedagem');
    if (!s.acesso)           pendencias.push('Tipo de Acesso');
    if (!s.versao_atual)     pendencias.push('Versão Atual');
    if (!s.data_implantacao) pendencias.push('Data de Implantação');

    const pendenciaIcon = pendencias.length
      ? `<span class="pendencia-icon">
           <i class="bi bi-exclamation-triangle-fill"></i>
           <span class="pendencia-tooltip">
             <strong>Pendências</strong>
             ${pendencias.map(p => `<span>${p}</span>`).join('')}
           </span>
         </span>`
      : '';

    return `<tr>
      <td>${formatCodigo(s.codigo)}</td>
      <td class="td-nome">
        <strong>${s.nome}</strong>${pendenciaIcon}
        <span>${desc}</span>
      </td>
      <td>${s.secretaria || '—'}</td>
      <td>${statusBadge(s.status)}</td>
      <td>${criticidadeBadge(s.criticidade)}</td>
      <td class="td-actions">
        <a href="detalhes-sistema.html?id=${s.id}" class="td-action-btn" title="Ver detalhes">
          <i class="bi bi-info-circle"></i>
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
  ['filtro-status', 'filtro-secretaria', 'filtro-criticidade', 'filtro-pendente'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyFilters);
  });

  const btnLimpar = document.getElementById('btn-limpar-filtros');
  if (btnLimpar) btnLimpar.addEventListener('click', limparFiltros);
}

function applyFilters() {
  carregarSistemas({
    busca:       document.getElementById('busca-sistema')?.value.trim()     || '',
    status:      document.getElementById('filtro-status')?.value            || '',
    secretaria:  document.getElementById('filtro-secretaria')?.value.trim() || '',
    criticidade: document.getElementById('filtro-criticidade')?.value       || '',
    pendente:    document.getElementById('filtro-pendente')?.value          || '',
  });
}

function limparFiltros() {
  ['busca-sistema', 'filtro-status', 'filtro-secretaria', 'filtro-criticidade', 'filtro-pendente'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  carregarSistemas();
}

function formatCodigo(codigo) {
  const idx = (codigo || '').lastIndexOf('-');
  if (idx === -1) return `<span class="sistema-codigo"><span class="codigo-prefix">${codigo}</span></span>`;
  const prefix = codigo.slice(0, idx);
  const seq    = codigo.slice(idx + 1);
  return `<span class="sistema-codigo"><span class="codigo-prefix">${prefix}</span><span class="codigo-seq">${seq}</span></span>`;
}

function updateCount(n) {
  const el = document.getElementById('sistemas-count');
  if (el) el.textContent = `${n} sistema${n !== 1 ? 's' : ''} encontrado${n !== 1 ? 's' : ''}`;
}

