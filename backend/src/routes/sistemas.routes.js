const router   = require('express').Router();
const { pool } = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

/* Gera o próximo código PMO-SIS-AAAA-NNNN */
async function gerarCodigo(conn) {
  const ano = new Date().getFullYear();
  const [[row]] = await conn.query(
    `SELECT codigo FROM sistemas WHERE codigo LIKE ? ORDER BY codigo DESC LIMIT 1`,
    [`PMO-SIS-${ano}-%`]
  );
  const seq = row ? parseInt(row.codigo.split('-')[3], 10) + 1 : 1;
  return `PMO-SIS-${ano}-${String(seq).padStart(4, '0')}`;
}

/* Busca secretaria_id pelo nome completo (aceita nome parcial) */
async function resolveSecretaria(conn, nome) {
  if (!nome) return null;
  const [[row]] = await conn.query(
    'SELECT id FROM secretarias WHERE nome LIKE ? LIMIT 1',
    [`%${nome.replace(/–.*/,'').trim()}%`]
  );
  return row ? row.id : null;
}

/* GET /api/sistemas */
router.get('/', async (req, res) => {
  const { busca = '', status = '', criticidade = '', secretaria = '' } = req.query;

  let where = 'WHERE s.ativo = 1';
  const params = [];

  if (status)      { where += ' AND s.status = ?';      params.push(status); }
  if (criticidade) { where += ' AND s.criticidade = ?'; params.push(criticidade); }
  if (secretaria)  { where += ' AND sec.nome LIKE ?';   params.push(`%${secretaria}%`); }
  if (busca) {
    where += ' AND (s.nome LIKE ? OR s.descricao LIKE ? OR s.codigo LIKE ?)';
    params.push(`%${busca}%`, `%${busca}%`, `%${busca}%`);
  }

  const [rows] = await pool.query(
    `SELECT s.id, s.codigo, s.nome, s.descricao, sec.nome AS secretaria,
            s.status, s.criticidade, s.resp_tec, s.tecnologias, s.data_implantacao
     FROM sistemas s
     LEFT JOIN secretarias sec ON sec.id = s.secretaria_id
     ${where}
     ORDER BY s.criado_em DESC`,
    params
  );

  const data = rows.map(r => ({
    ...r,
    tecnologias: r.tecnologias ? (typeof r.tecnologias === 'string' ? JSON.parse(r.tecnologias) : r.tecnologias) : [],
  }));

  res.json({ data, total: data.length });
});

/* GET /api/sistemas/:id */
router.get('/:id', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT s.*, sec.nome AS secretaria, sec.sigla AS secretaria_sigla
     FROM sistemas s
     LEFT JOIN secretarias sec ON sec.id = s.secretaria_id
     WHERE s.id = ? AND s.ativo = 1 LIMIT 1`,
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ erro: 'Sistema não encontrado' });

  const s = rows[0];
  s.tecnologias = s.tecnologias
    ? (typeof s.tecnologias === 'string' ? JSON.parse(s.tecnologias) : s.tecnologias)
    : [];
  res.json(s);
});

/* POST /api/sistemas */
router.post('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const {
      nome, descricao, finalidade, tipo, status, criticidade,
      secretaria, setor, resp_tec, resp_adm, fornecedor,
      tecnologias, banco_dados, url_producao, url_homologacao,
      data_implantacao, observacoes,
    } = req.body;

    if (!nome || !status || !criticidade || !tipo) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, tipo, status, criticidade' });
    }

    const codigo        = await gerarCodigo(conn);
    const secretaria_id = await resolveSecretaria(conn, secretaria);
    const tecJson       = tecnologias
      ? JSON.stringify(typeof tecnologias === 'string'
          ? tecnologias.split(',').map(t => t.trim()).filter(Boolean)
          : tecnologias)
      : null;

    const [result] = await conn.query(
      `INSERT INTO sistemas
         (codigo, nome, descricao, finalidade, tipo, status, criticidade,
          secretaria_id, setor, resp_tec, resp_adm, fornecedor,
          tecnologias, banco_dados, url_producao, url_homologacao,
          data_implantacao, observacoes, criado_por)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        codigo, nome, descricao || null, finalidade || null,
        tipo, status, criticidade, secretaria_id, setor || null,
        resp_tec || null, resp_adm || null, fornecedor || null,
        tecJson, banco_dados || null, url_producao || null, url_homologacao || null,
        data_implantacao || null, observacoes || null, req.usuario.id,
      ]
    );

    await conn.query(
      `INSERT INTO historico (sistema_id, usuario_id, acao, descricao) VALUES (?,?,?,?)`,
      [result.insertId, req.usuario.id, 'criacao', `Sistema "${nome}" cadastrado`]
    );

    await conn.commit();

    const [[criado]] = await conn.query(
      'SELECT s.*, sec.nome AS secretaria FROM sistemas s LEFT JOIN secretarias sec ON sec.id = s.secretaria_id WHERE s.id = ?',
      [result.insertId]
    );
    res.status(201).json(criado);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

/* PUT /api/sistemas/:id */
router.put('/:id', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[existing]] = await conn.query(
      'SELECT id, nome FROM sistemas WHERE id = ? AND ativo = 1 LIMIT 1',
      [req.params.id]
    );
    if (!existing) return res.status(404).json({ erro: 'Sistema não encontrado' });

    const {
      nome, descricao, finalidade, tipo, status, criticidade,
      secretaria, setor, resp_tec, resp_adm, fornecedor,
      tecnologias, banco_dados, url_producao, url_homologacao,
      data_implantacao, observacoes,
    } = req.body;

    const secretaria_id = await resolveSecretaria(conn, secretaria);
    const tecJson = tecnologias
      ? JSON.stringify(typeof tecnologias === 'string'
          ? tecnologias.split(',').map(t => t.trim()).filter(Boolean)
          : tecnologias)
      : null;

    await conn.query(
      `UPDATE sistemas SET
         nome=?, descricao=?, finalidade=?, tipo=?, status=?, criticidade=?,
         secretaria_id=?, setor=?, resp_tec=?, resp_adm=?, fornecedor=?,
         tecnologias=?, banco_dados=?, url_producao=?, url_homologacao=?,
         data_implantacao=?, observacoes=?
       WHERE id = ?`,
      [
        nome, descricao || null, finalidade || null, tipo, status, criticidade,
        secretaria_id, setor || null, resp_tec || null, resp_adm || null, fornecedor || null,
        tecJson, banco_dados || null, url_producao || null, url_homologacao || null,
        data_implantacao || null, observacoes || null, req.params.id,
      ]
    );

    await conn.query(
      `INSERT INTO historico (sistema_id, usuario_id, acao, descricao) VALUES (?,?,?,?)`,
      [req.params.id, req.usuario.id, 'edicao', `Sistema "${nome}" atualizado`]
    );

    await conn.commit();

    const [[atualizado]] = await conn.query(
      'SELECT s.*, sec.nome AS secretaria FROM sistemas s LEFT JOIN secretarias sec ON sec.id = s.secretaria_id WHERE s.id = ?',
      [req.params.id]
    );
    res.json(atualizado);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

/* GET /api/sistemas/:id/historico */
router.get('/:id/historico', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT h.id, h.acao, h.descricao, h.criado_em, u.nome AS usuario
     FROM historico h
     LEFT JOIN usuarios u ON u.id = h.usuario_id
     WHERE h.sistema_id = ?
     ORDER BY h.criado_em DESC`,
    [req.params.id]
  );
  res.json(rows);
});

/* DELETE /api/sistemas/:id (soft delete) */
router.delete('/:id', async (req, res) => {
  const [[row]] = await pool.query(
    'SELECT id, nome FROM sistemas WHERE id = ? AND ativo = 1 LIMIT 1',
    [req.params.id]
  );
  if (!row) return res.status(404).json({ erro: 'Sistema não encontrado' });

  await pool.query('UPDATE sistemas SET ativo = 0 WHERE id = ?', [req.params.id]);
  await pool.query(
    'INSERT INTO historico (sistema_id, usuario_id, acao, descricao) VALUES (?,?,?,?)',
    [req.params.id, req.usuario.id, 'remocao', `Sistema "${row.nome}" removido`]
  );

  res.json({ mensagem: 'Sistema removido com sucesso' });
});

module.exports = router;
