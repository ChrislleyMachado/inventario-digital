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
    producao:      { label: 'Em Produção',      cls: 'badge-success' },
    desenvolvimento: { label: 'Em Desenvolvimento', cls: 'badge-primary' },
    manutencao:    { label: 'Manutenção',        cls: 'badge-warning' },
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
