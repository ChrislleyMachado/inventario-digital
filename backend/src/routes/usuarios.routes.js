const router   = require('express').Router();
const bcrypt   = require('bcryptjs');
const { pool } = require('../config/db');
const { authMiddleware, adminOnly } = require('../middleware/auth.middleware');

router.use(authMiddleware);

/* GET /api/usuarios */
router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT u.id, u.nome, u.email, u.cargo, u.role, u.ativo, u.criado_em,
            s.nome AS secretaria
     FROM usuarios u
     LEFT JOIN secretarias s ON s.id = u.secretaria_id
     ORDER BY u.nome`
  );
  res.json({ data: rows });
});

/* POST /api/usuarios — somente admin */
router.post('/', adminOnly, async (req, res) => {
  const { nome, email, senha, cargo, secretaria_id, role } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios' });
  }

  const [[existe]] = await pool.query('SELECT id FROM usuarios WHERE email = ? LIMIT 1', [email]);
  if (existe) return res.status(409).json({ erro: 'E-mail já cadastrado' });

  const hash = await bcrypt.hash(senha, 10);
  const [result] = await pool.query(
    `INSERT INTO usuarios (nome, email, senha_hash, cargo, secretaria_id, role)
     VALUES (?,?,?,?,?,?)`,
    [nome, email, hash, cargo || null, secretaria_id || null, role || 'visualizador']
  );

  res.status(201).json({ id: result.insertId, nome, email, cargo, role: role || 'visualizador' });
});

/* PUT /api/usuarios/:id — somente admin */
router.put('/:id', adminOnly, async (req, res) => {
  const { nome, cargo, secretaria_id, role, ativo, senha } = req.body;

  const fields  = [];
  const params  = [];

  if (nome !== undefined)          { fields.push('nome = ?');           params.push(nome); }
  if (cargo !== undefined)         { fields.push('cargo = ?');          params.push(cargo); }
  if (secretaria_id !== undefined) { fields.push('secretaria_id = ?');  params.push(secretaria_id || null); }
  if (role !== undefined)          { fields.push('role = ?');           params.push(role); }
  if (ativo !== undefined)         { fields.push('ativo = ?');          params.push(ativo ? 1 : 0); }
  if (senha)                       { fields.push('senha_hash = ?');     params.push(await bcrypt.hash(senha, 10)); }

  if (!fields.length) return res.status(400).json({ erro: 'Nenhum campo para atualizar' });

  params.push(req.params.id);
  await pool.query(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`, params);
  res.json({ mensagem: 'Usuário atualizado' });
});

module.exports = router;
