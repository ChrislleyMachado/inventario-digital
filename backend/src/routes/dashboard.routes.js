const router   = require('express').Router();
const { pool } = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

const PENDENTE_COND = `(
  tecnologias IS NULL OR tecnologias = '[]' OR tecnologias = 'null' OR tecnologias = '' OR
  hospedagem IS NULL OR
  acesso IS NULL OR
  versao_atual IS NULL OR versao_atual = '' OR
  data_implantacao IS NULL
)`;

/* GET /api/dashboard */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [[stats]] = await pool.query(`
      SELECT
        COUNT(*)                              AS total,
        SUM(status = 'producao')              AS producao,
        SUM(status = 'desenvolvimento')       AS desenvolvimento,
        SUM(status = 'homologacao')           AS homologacao,
        SUM(status = 'descontinuado')         AS descontinuado,
        SUM(criticidade = 'critica')          AS criticos,
        SUM(${PENDENTE_COND})                 AS pendentes
      FROM sistemas
      WHERE ativo = 1
    `);

    const [recentes] = await pool.query(`
      SELECT s.id, s.nome, sec.nome AS secretaria, s.status, s.atualizado_em
      FROM sistemas s
      LEFT JOIN secretarias sec ON sec.id = s.secretaria_id
      WHERE s.ativo = 1
      ORDER BY s.atualizado_em DESC
      LIMIT 5
    `);

    const distribuicao = [
      { status: 'producao',        label: 'Ativo',           total: Number(stats.producao),        color: 'green'  },
      { status: 'desenvolvimento', label: 'Desenvolvimento', total: Number(stats.desenvolvimento), color: 'cyan'   },
      { status: 'homologacao',     label: 'Homologação',     total: Number(stats.homologacao),     color: 'orange' },
      { status: 'descontinuado',   label: 'Descontinuado',   total: Number(stats.descontinuado),   color: 'gray'   },
    ];

    res.json({
      stats: {
        total:           Number(stats.total),
        producao:        Number(stats.producao),
        desenvolvimento: Number(stats.desenvolvimento),
        homologacao:     Number(stats.homologacao),
        descontinuado:   Number(stats.descontinuado),
        criticos:        Number(stats.criticos),
        pendentes:       Number(stats.pendentes),
      },
      distribuicao,
      recentes,
    });
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

module.exports = router;
