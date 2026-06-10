const router   = require('express').Router();
const { pool } = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);

/* Gera o próximo código GSIS{AA}-NNNN */
async function gerarCodigo(conn) {
  const ano  = new Date().getFullYear();
  const aa   = String(ano).slice(2);
  const [[row]] = await conn.query(
    `SELECT codigo FROM sistemas WHERE codigo LIKE ? ORDER BY codigo DESC LIMIT 1`,
    [`GSIS${aa}-%`]
  );
  const seq = row ? parseInt(row.codigo.split('-')[1], 10) + 1 : 1;
  return `GSIS${aa}-${String(seq).padStart(4, '0')}`;
}

/* GET /api/sistemas/proximo-codigo */
router.get('/proximo-codigo', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const codigo = await gerarCodigo(conn);
    res.json({ codigo });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao calcular próximo código' });
  } finally {
    conn.release();
  }
});

/* Busca secretaria_id pelo nome completo (aceita nome parcial) */
async function resolveSecretaria(conn, nome) {
  if (!nome) return null;
  const [[row]] = await conn.query(
    'SELECT id FROM secretarias WHERE nome LIKE ? LIMIT 1',
    [`%${nome.replace(/–.*/,'').trim()}%`]
  );
  return row ? row.id : null;
}

/* Condição SQL reutilizável para sistemas com preenchimento incompleto */
const PENDENTE_COND = `(
  s.tecnologias IS NULL OR s.tecnologias = '[]' OR s.tecnologias = 'null' OR s.tecnologias = '' OR
  s.hospedagem IS NULL OR
  s.acesso IS NULL OR
  s.versao_atual IS NULL OR s.versao_atual = '' OR
  s.data_implantacao IS NULL
)`;

/* GET /api/sistemas */
router.get('/', async (req, res) => {
  try {
    const { busca = '', status = '', criticidade = '', secretaria = '', pendente = '' } = req.query;

    let where = 'WHERE s.ativo = 1';
    const params = [];

    if (status)           { where += ' AND s.status = ?';      params.push(status); }
    if (criticidade)      { where += ' AND s.criticidade = ?'; params.push(criticidade); }
    if (secretaria)       { where += ' AND sec.nome LIKE ?';   params.push(`%${secretaria}%`); }
    if (pendente === '1') { where += ` AND ${PENDENTE_COND}`; }
    if (busca) {
      where += ' AND (s.nome LIKE ? OR s.descricao LIKE ? OR s.codigo LIKE ?)';
      params.push(`%${busca}%`, `%${busca}%`, `%${busca}%`);
    }

    const [rows] = await pool.query(
      `SELECT s.id, s.codigo, s.nome, s.descricao, sec.nome AS secretaria,
              s.status, s.criticidade, s.resp_tec, s.tecnologias, s.data_implantacao,
              s.hospedagem, s.acesso, s.versao_atual,
              ${PENDENTE_COND} AS incompleto
       FROM sistemas s
       LEFT JOIN secretarias sec ON sec.id = s.secretaria_id
       ${where}
       ORDER BY s.criado_em DESC`,
      params
    );

    const data = rows.map(r => ({
      ...r,
      tecnologias: r.tecnologias ? (typeof r.tecnologias === 'string' ? JSON.parse(r.tecnologias) : r.tecnologias) : [],
      incompleto:  Boolean(r.incompleto),
    }));

    res.json({ data, total: data.length });
  } catch (err) {
    console.error('Erro ao listar sistemas:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

/* GET /api/sistemas/:id */
router.get('/:id', async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Erro ao buscar sistema:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
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
      origem, contrato_numero, contrato_inicio, contrato_fim, contrato_valor,
      hospedagem, versao_atual, acesso,
    } = req.body;

    const erros = [];
    if (!nome?.trim())       erros.push('Nome do sistema');
    if (!descricao?.trim())  erros.push('Descrição');
    if (!tipo)               erros.push('Tipo do sistema');
    if (!status)             erros.push('Status');
    if (!criticidade)        erros.push('Importância');
    if (!secretaria?.trim()) erros.push('Secretaria responsável');
    if (!origem)             erros.push('Origem do sistema');
    const respArr = Array.isArray(resp_tec) ? resp_tec : [];
    if (!respArr.some(r => r?.nome?.trim())) erros.push('Responsável técnico');
    if (erros.length > 0) {
      return res.status(400).json({ erro: `Campos obrigatórios não preenchidos: ${erros.join(', ')}` });
    }

    const codigo        = await gerarCodigo(conn);
    const secretaria_id = await resolveSecretaria(conn, secretaria);
    if (!secretaria_id) {
      return res.status(400).json({ erro: 'Secretaria não encontrada. Selecione uma opção válida da lista.' });
    }
    const tecJson       = tecnologias
      ? JSON.stringify(typeof tecnologias === 'string'
          ? tecnologias.split(',').map(t => t.trim()).filter(Boolean)
          : tecnologias)
      : null;

    /* resp_tec é array de objetos — serializar para VARCHAR */
    const respTecJson = respArr.length ? JSON.stringify(respArr) : null;

    /* fornecedor é objeto — guardar só o nome na coluna VARCHAR */
    const fornecedorNome = typeof fornecedor === 'object' && fornecedor !== null
      ? fornecedor.nome?.trim() || null
      : (fornecedor || null);

    const [result] = await conn.query(
      `INSERT INTO sistemas
         (codigo, nome, descricao, finalidade, tipo, status, criticidade,
          secretaria_id, setor, resp_tec, resp_adm, fornecedor,
          tecnologias, banco_dados, url_producao, url_homologacao,
          data_implantacao, observacoes,
          origem, contrato_numero, contrato_inicio, contrato_fim, contrato_valor,
          hospedagem, versao_atual, acesso, criado_por)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        codigo, nome, descricao || null, finalidade || null,
        tipo, status, criticidade, secretaria_id, setor || null,
        respTecJson, resp_adm || null, fornecedorNome,
        tecJson, banco_dados || null, url_producao || null, url_homologacao || null,
        data_implantacao || null, observacoes || null,
        origem || null, contrato_numero || null,
        contrato_inicio || null, contrato_fim || null,
        contrato_valor ? parseFloat(contrato_valor) : null,
        hospedagem || null, versao_atual || null, acesso || null,
        req.usuario.id,
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
    try { await conn.rollback(); } catch (_) {}
    console.error('Erro ao criar sistema:', err);
    res.status(500).json({ erro: err.message || 'Erro interno ao salvar sistema' });
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
      origem, contrato_numero, contrato_inicio, contrato_fim, contrato_valor,
      hospedagem, versao_atual, acesso,
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
         data_implantacao=?, observacoes=?,
         origem=?, contrato_numero=?, contrato_inicio=?, contrato_fim=?, contrato_valor=?,
         hospedagem=?, versao_atual=?, acesso=?
       WHERE id = ?`,
      [
        nome, descricao || null, finalidade || null, tipo, status, criticidade,
        secretaria_id, setor || null, resp_tec || null, resp_adm || null, fornecedor || null,
        tecJson, banco_dados || null, url_producao || null, url_homologacao || null,
        data_implantacao || null, observacoes || null,
        origem || null, contrato_numero || null,
        contrato_inicio || null, contrato_fim || null,
        contrato_valor ? parseFloat(contrato_valor) : null,
        hospedagem || null, versao_atual || null, acesso || null,
        req.params.id,
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
    try { await conn.rollback(); } catch (_) {}
    console.error('Erro ao atualizar sistema:', err);
    res.status(500).json({ erro: err.message || 'Erro interno ao atualizar sistema' });
  } finally {
    conn.release();
  }
});

/* GET /api/sistemas/:id/historico */
router.get('/:id/historico', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT h.id, h.acao, h.descricao, h.criado_em, u.nome AS usuario
       FROM historico h
       LEFT JOIN usuarios u ON u.id = h.usuario_id
       WHERE h.sistema_id = ?
       ORDER BY h.criado_em DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

/* DELETE /api/sistemas/:id (soft delete) */
router.delete('/:id', async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Erro ao remover sistema:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

module.exports = router;
