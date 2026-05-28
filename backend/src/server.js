/**
 * SIGSIS — backend/src/server.js
 * Servidor Express — Estrutura inicial (Etapa 1)
 *
 * Etapa 2 irá implementar:
 *   - Conexão com MySQL via mysql2
 *   - Autenticação JWT (POST /api/auth/login)
 *   - CRUD de sistemas (GET|POST|PUT|DELETE /api/sistemas)
 *   - CRUD de usuários (GET|POST|PUT|DELETE /api/usuarios)
 *   - Upload de documentos (POST /api/documentos)
 *   - Rota de dashboard (GET /api/dashboard)
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');
// const dotenv  = require('dotenv');
// dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

/* ---- Middlewares ---- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---- Servir frontend estático ---- */
app.use(express.static(path.join(__dirname, '../../frontend/public')));

/* ---- Rota raiz ---- */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/login.html'));
});

/* ================================================================
   ROTAS DA API — Serão implementadas na Etapa 2
   ================================================================ */

// app.use('/api/auth',       require('./routes/auth.routes'));
// app.use('/api/sistemas',   require('./routes/sistemas.routes'));
// app.use('/api/usuarios',   require('./routes/usuarios.routes'));
// app.use('/api/documentos', require('./routes/documentos.routes'));
// app.use('/api/dashboard',  require('./routes/dashboard.routes'));

/* ---- Health check (usado pelo Docker e monitoramento) ---- */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

/* ---- Status da aplicação ---- */
app.get('/api/status', (req, res) => {
  res.json({
    sistema: 'SIGSIS',
    versao:  '1.0.0',
    etapa:   1,
    status:  'online',
    mensagem: 'Backend estrutural — Etapa 1. Funcionalidades completas disponíveis na Etapa 2.',
  });
});

/* ---- Inicializa servidor ---- */
app.listen(PORT, () => {
  console.log(`SIGSIS rodando em http://localhost:${PORT}`);
  console.log(`Etapa 1 — Base visual. Backend completo na Etapa 2.`);
});

module.exports = app;
