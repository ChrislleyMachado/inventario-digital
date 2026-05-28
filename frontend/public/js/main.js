/* ================================================================
   SIGSIS — main.js
   Funções de layout: sidebar, topbar, navegação
   Incluso em todas as páginas internas
   ================================================================ */

/* ---- Sidebar toggle (mobile) ---- */
function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const isOpen   = sidebar.classList.contains('open');

  sidebar.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* Fecha sidebar ao clicar no overlay */
document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) overlay.addEventListener('click', closeSidebar);

  /* ---- Marca item ativo no menu ---- */
  setActiveNavItem();

  /* ---- Fecha sidebar ao redimensionar para desktop ---- */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) {
      closeSidebar();
      document.body.style.overflow = '';
    }
  });
});

/**
 * Marca o item do menu lateral correspondente à página atual
 */
function setActiveNavItem() {
  const page = window.location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.nav-item[data-page]').forEach(function (item) {
    const pageName = item.getAttribute('data-page');
    if (page.startsWith(pageName) || page === pageName + '.html') {
      item.classList.add('active');
    }
  });
}
