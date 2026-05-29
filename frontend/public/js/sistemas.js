/* ================================================================
   SIGSIS — sistemas.js
   Lista, busca e filtros de sistemas cadastrados
   ================================================================ */

/* ---- Dataset simulado ---- */
const SISTEMAS_DATA = [
  {
    id: 1,
    codigo:        'PMO-SIS-2024-0001',
    nome:          'SySocial',
    descricao:     'Sistema de gestão de benefícios e programas sociais municipais',
    secretaria:    'Secretaria Municipal de Assistência Social – SMAS',
    status:        'producao',
    criticidade:   'alta',
    tecnologias:   ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MySQL'],
    responsavel:   'Carlos Mendes',
    data_impl:     '2024-03-15',
  },
  {
    id: 2,
    codigo:        'PMO-SIS-2024-0002',
    nome:          'Banco de Talentos',
    descricao:     'Gestão de currículos e oportunidades de emprego no município',
    secretaria:    'Secretaria Municipal de Planejamento e Administração – SEMPLAD',
    status:        'desenvolvimento',
    criticidade:   'media',
    tecnologias:   ['Vue.js', 'Node.js', 'PostgreSQL'],
    responsavel:   'Ana Lima',
    data_impl:     null,
  },
  {
    id: 3,
    codigo:        'PMO-SIS-2025-0001',
    nome:          'Portal de Projetos Inovadores',
    descricao:     'Portal para submissão e acompanhamento de projetos de inovação',
    secretaria:    'Secretaria Municipal de Eficiência Governamental – SEMEG',
    status:        'producao',
    criticidade:   'alta',
    tecnologias:   ['React', 'Node.js', 'MySQL'],
    responsavel:   'Pedro Costa',
    data_impl:     '2025-01-10',
  },
  {
    id: 4,
    codigo:        'PMO-SIS-2023-0001',
    nome:          'Sistema de Protocolo',
    descricao:     'Gerenciamento de documentos e protocolos administrativos',
    secretaria:    'Secretaria Municipal de Planejamento e Administração – SEMPLAD',
    status:        'producao',
    criticidade:   'critica',
    tecnologias:   ['PHP', 'JavaScript', 'MySQL'],
    responsavel:   'Roberto Silva',
    data_impl:     '2023-06-20',
  },
  {
    id: 5,
    codigo:        'PMO-SIS-2023-0002',
    nome:          'Sistema de Patrimônio',
    descricao:     'Controle e gestão de bens patrimoniais municipais',
    secretaria:    'Secretaria Municipal de Planejamento e Administração – SEMPLAD',
    status:        'manutencao',
    criticidade:   'media',
    tecnologias:   ['PHP', 'JavaScript', 'MySQL'],
    responsavel:   'Fernando Alves',
    data_impl:     '2023-09-05',
  },
  {
    id: 6,
    codigo:        'PMO-SIS-2022-0001',
    nome:          'Portal da Transparência',
    descricao:     'Portal público de transparência das ações municipais',
    secretaria:    'Gabinete do Prefeito',
    status:        'producao',
    criticidade:   'critica',
    tecnologias:   ['WordPress', 'PHP', 'MySQL'],
    responsavel:   'Diego Rocha',
    data_impl:     '2022-01-01',
  },
  {
    id: 7,
    codigo:        'PMO-SIS-2025-0002',
    nome:          'SIGCOB — Tributação',
    descricao:     'Sistema de gestão e cobrança de tributos municipais',
    secretaria:    'Secretaria Municipal de Finanças e Desenvolvimento Econômico – SEMFIDE',
    status:        'homologacao',
    criticidade:   'alta',
    tecnologias:   ['Java', 'Spring Boot', 'PostgreSQL'],
    responsavel:   'Marina Souza',
    data_impl:     null,
  },
  {
    id: 8,
    codigo:        'PMO-SIS-2021-0001',
    nome:          'INFRASIS OS',
    descricao:     'Sistema de ordens de serviço da Secretaria de Infraestrutura',
    secretaria:    'Secretaria Municipal de Infraestrutura – SEINFRA',
    status:        'descontinuado',
    criticidade:   'baixa',
    tecnologias:   ['HTML', 'CSS', 'JavaScript', 'Firebase'],
    responsavel:   'Marcos Vidal',
    data_impl:     '2021-05-15',
  },
];

let filteredData = [...SISTEMAS_DATA];

/* ---- Inicialização ---- */
document.addEventListener('DOMContentLoaded', function () {
  renderTable(filteredData);
  updateCount(filteredData.length);
  initSearch();
  initFilters();
});

/* ---- Render table ---- */
function renderTable(data) {
  const tbody = document.getElementById('sistemas-tbody');
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:40px; color:#94a3b8;">
      <i class="bi bi-search" style="font-size:32px; display:block; margin-bottom:10px;"></i>
      Nenhum sistema encontrado com os filtros aplicados.
    </td></tr>`;
    return;
  }

  tbody.innerHTML = data.map(function (s) {
    return `<tr>
      <td><span class="sistema-codigo">${s.codigo}</span></td>
      <td class="td-nome">
        <strong>${s.nome}</strong>
        <span>${s.descricao.substring(0, 52)}${s.descricao.length > 52 ? '...' : ''}</span>
      </td>
      <td>${s.secretaria}</td>
      <td>${statusBadge(s.status)}</td>
      <td>${criticidadeBadge(s.criticidade)}</td>
      <td>${s.responsavel}</td>
      <td class="td-actions">
        <a href="detalhes-sistema.html" class="btn btn-outline-primary btn-sm">
          <i class="bi bi-eye"></i> Ver Detalhes
        </a>
      </td>
    </tr>`;
  }).join('');
}

/* ---- Busca ---- */
function initSearch() {
  const input = document.getElementById('busca-sistema');
  if (!input) return;
  input.addEventListener('input', debounce(applyFilters, 250));
}

/* ---- Filtros ---- */
function initFilters() {
  ['filtro-status', 'filtro-secretaria', 'filtro-criticidade'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', applyFilters);
  });

  const btnLimpar = document.getElementById('btn-limpar-filtros');
  if (btnLimpar) btnLimpar.addEventListener('click', limparFiltros);
}

function applyFilters() {
  const busca       = normalize(document.getElementById('busca-sistema')?.value || '');
  const status      = document.getElementById('filtro-status')?.value || '';
  const secretaria  = document.getElementById('filtro-secretaria')?.value || '';
  const criticidade = document.getElementById('filtro-criticidade')?.value || '';

  filteredData = SISTEMAS_DATA.filter(function (s) {
    if (busca && !normalize(s.nome + ' ' + s.secretaria + ' ' + s.codigo + ' ' + s.descricao).includes(busca)) return false;
    if (status      && s.status      !== status)      return false;
    if (secretaria  && s.secretaria  !== secretaria)  return false;
    if (criticidade && s.criticidade !== criticidade) return false;
    return true;
  });

  renderTable(filteredData);
  updateCount(filteredData.length);
}

function limparFiltros() {
  ['busca-sistema', 'filtro-status', 'filtro-secretaria', 'filtro-criticidade'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  filteredData = [...SISTEMAS_DATA];
  renderTable(filteredData);
  updateCount(filteredData.length);
}

function updateCount(n) {
  const el = document.getElementById('sistemas-count');
  if (el) el.textContent = `${n} sistema${n !== 1 ? 's' : ''} encontrado${n !== 1 ? 's' : ''}`;
}
