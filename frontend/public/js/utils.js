/* ================================================================
   SIGSIS — utils.js
   Funções utilitárias compartilhadas
   ================================================================ */

/**
 * Formata uma data ISO para dd/mm/aaaa
 */
function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('T')[0].split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Formata uma data ISO com hora
 */
function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Retorna o tempo relativo (ex: "há 2 dias")
 */
function timeAgo(iso) {
  if (!iso) return '—';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60)   return 'agora mesmo';
  if (diff < 3600)  return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `há ${Math.floor(diff / 86400)} dias`;
  return formatDate(iso);
}

/**
 * Gera o padrão de código interno visual (PMO-SIS-AAAA-NNNN)
 */
function formatCodigoInterno(seq, ano) {
  const a = ano || new Date().getFullYear();
  const n = String(seq || 1).padStart(4, '0');
  return `PMO-SIS-${a}-${n}`;
}

/**
 * Retorna o label e badge HTML para um status de sistema
 */
function statusBadge(status) {
  const map = {
    producao:      { label: 'Ativo',           cls: 'badge-success' },
    desenvolvimento: { label: 'Desenvolvimento', cls: 'badge-primary' },
    homologacao:   { label: 'Homologação',       cls: 'badge-cyan'    },
    descontinuado: { label: 'Descontinuado',     cls: 'badge-gray'    },
    critico:       { label: 'Crítico',           cls: 'badge-danger'  },
  };
  const s = map[status] || { label: status, cls: 'badge-gray' };
  return `<span class="badge ${s.cls}">${s.label}</span>`;
}

/**
 * Retorna o HTML de badge de criticidade
 */
function criticidadeBadge(crit) {
  const map = {
    critica: { label: 'Crítica', cls: 'badge-danger'  },
    alta:    { label: 'Alta',    cls: 'badge-warning' },
    media:   { label: 'Média',   cls: 'badge-cyan'    },
    baixa:   { label: 'Baixa',   cls: 'badge-success' },
  };
  const c = map[crit] || { label: crit, cls: 'badge-gray' };
  return `<span class="badge ${c.cls}">${c.label}</span>`;
}

/**
 * Debounce: evita execução excessiva durante digitação
 */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Normaliza texto para busca (remove acentos, lowercase)
 */
function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/* Lista oficial de secretarias municipais */
const SECRETARIAS = [
  'Assessoria de Controle Interno',
  'Gabinete do Prefeito',
  'Procuradoria Geral do Município',
  'Secretaria de Integração Municipal',
  'Secretaria Municipal de Agricultura e Abastecimento – SEMAGRI',
  'Secretaria Municipal de Assistência Social – SMAS',
  'Secretaria Municipal de Comunicação – SEMCO',
  'Secretaria Municipal de Cultura – SEMC',
  'Secretaria Municipal de Educação – SEMED',
  'Secretaria Municipal de Eficiência Governamental – SEMEG',
  'Secretaria Municipal de Finanças e Desenvolvimento Econômico – SEMFIDE',
  'Secretaria Municipal de Infraestrutura – SEINFRA',
  'Secretaria Municipal da Juventude – SEMJU',
  'Secretaria Municipal de Meio Ambiente e Mineração – SEMMA',
  'Secretaria Municipal de Obras Públicas e Habitação – SEMOPH',
  'Secretaria Municipal de Planejamento e Administração – SEMPLAD',
  'Secretaria Municipal de Promoção da Igualdade Racial e dos Direitos Humanos – SEMPIRDH',
  'Secretaria Municipal de Saúde – SMS',
  'Secretaria Municipal de Segurança Pública e Defesa Social – SEMUSP',
  'Secretaria Municipal do Esporte – SEMESP',
];

/**
 * Cria um campo de autocomplete sobre um <input> dentro de .autocomplete-wrapper.
 * @param {HTMLInputElement} inputEl  - o campo de texto
 * @param {string[]} options          - lista de opções
 * @param {Function} [onChange]       - chamado com o valor após seleção ou limpeza
 */
function createAutocomplete(inputEl, options, onChange) {
  const wrapper = inputEl.closest('.autocomplete-wrapper');
  const list    = wrapper.querySelector('.autocomplete-list');
  let activeIdx = -1;

  function render(items) {
    list.innerHTML = '';
    activeIdx = -1;
    if (!items.length) { list.classList.remove('open'); return; }
    items.forEach(function (item) {
      const li = document.createElement('li');
      li.className = 'autocomplete-item';
      li.textContent = item;
      li.addEventListener('mousedown', function (e) {
        e.preventDefault();
        pick(item);
      });
      list.appendChild(li);
    });
    list.classList.add('open');
  }

  function pick(value) {
    inputEl.value = value;
    list.classList.remove('open');
    activeIdx = -1;
    if (onChange) onChange(value);
  }

  function filtered(q) {
    if (!q) return options;
    const n = normalize(q);
    return options.filter(function (o) { return normalize(o).includes(n); });
  }

  function setActive(idx) {
    const items = list.querySelectorAll('.autocomplete-item');
    items.forEach(function (el, i) { el.classList.toggle('active', i === idx); });
    if (items[idx]) items[idx].scrollIntoView({ block: 'nearest' });
  }

  inputEl.addEventListener('input', function () {
    render(filtered(this.value));
    if (!this.value && onChange) onChange('');
  });

  inputEl.addEventListener('focus', function () {
    render(filtered(this.value));
  });

  inputEl.addEventListener('blur', function () {
    setTimeout(function () { list.classList.remove('open'); activeIdx = -1; }, 150);
  });

  inputEl.addEventListener('keydown', function (e) {
    if (!list.classList.contains('open')) return;
    const items = list.querySelectorAll('.autocomplete-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, items.length - 1);
      setActive(activeIdx);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      setActive(activeIdx);
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      pick(items[activeIdx].textContent);
    } else if (e.key === 'Escape') {
      list.classList.remove('open');
    }
  });
}

/**
 * Exibe uma notificação toast simples
 */
function showToast(msg, type = 'info') {
  const colors = {
    success: '#057a55',
    error:   '#c81e1e',
    warning: '#c27803',
    info:    '#1a56db',
  };
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: ${colors[type] || colors.info};
    color: white; padding: 12px 20px; border-radius: 8px;
    font-size: 13.5px; font-weight: 600; box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    display: flex; align-items: center; gap: 10px;
    transform: translateY(80px); transition: transform 0.3s ease;
    max-width: 320px; line-height: 1.4;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.transform = 'translateY(0)'; });
  setTimeout(() => {
    toast.style.transform = 'translateY(80px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
