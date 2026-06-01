require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { initDB } = require('./config/db');

const app  = express();
const PORT = process.env.PORT || 3001;

/* ---- Middlewares ---- */
const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---- Servir frontend estático ---- */
app.use(express.static(path.join(__dirname, '../../frontend/public')));

/* ---- Rotas da API ---- */
app.use('/api/auth',      require('./routes/auth.routes'));
app.use('/api/sistemas',  require('./routes/sistemas.routes'));
app.use('/api/usuarios',  require('./routes/usuarios.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

/* ---- Rota raiz ---- */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/login.html'));
});

/* ---- Health check ---- */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), etapa: 2 });
});

/* ---- Tratamento de erros global ---- */
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

/* ---- Inicializa banco e depois o servidor ---- */
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SIGSIS rodando em http://localhost:${PORT}`);
      console.log(`Etapa 2 — Backend completo com MySQL`);
    });
  })
  .catch(err => {
    console.error('Falha ao conectar ao banco:', err.message);
    process.exit(1);
  });

module.exports = app;
