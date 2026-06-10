const router         = require('express').Router();
const bcrypt         = require('bcryptjs');
const jwt            = require('jsonwebtoken');
const { pool }       = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

/* POST /api/auth/login */
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
    }

    const [rows] = await pool.query(
      `SELECT u.id, u.nome, u.email, u.senha_hash, u.cargo, u.role, u.ativo,
              s.nome AS secretaria
       FROM usuarios u
       LEFT JOIN secretarias s ON s.id = u.secretaria_id
       WHERE u.email = ? LIMIT 1`,
      [email]
    );

    if (!rows.length || !rows[0].ativo) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const usuario = rows[0];
    const ok = await bcrypt.compare(senha, usuario.senha_hash);
    if (!ok) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const payload = { id: usuario.id, nome: usuario.nome, email: usuario.email, role: usuario.role };
    const token   = jwt.sign(payload, process.env.JWT_SECRET || 'GSIS_secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });

    res.json({
      token,
      usuario: {
        id:         usuario.id,
        nome:       usuario.nome,
        email:      usuario.email,
        cargo:      usuario.cargo,
        secretaria: usuario.secretaria,
        role:       usuario.role,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

/* GET /api/auth/me */
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.nome, u.email, u.cargo, u.role,
              s.nome AS secretaria
       FROM usuarios u
       LEFT JOIN secretarias s ON s.id = u.secretaria_id
       WHERE u.id = ? LIMIT 1`,
      [req.usuario.id]
    );
    if (!rows.length) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

module.exports = router;
