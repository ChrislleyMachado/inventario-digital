const router   = require('express').Router();
const { pool } = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

/* GET /api/dashboard */
router.get('/', authMiddleware, async (req, res) => {
  const [[stats]] = await pool.query(`
    SELECT
      COUNT(*)                              AS total,
      SUM(status = 'producao')              AS producao,
      SUM(status = 'desenvolvimento')       AS desenvolvimento,
      SUM(status = 'homologacao')           AS homologacao,
      SUM(status = 'descontinuado')         AS descontinuado,
      SUM(criticidade = 'critica')          AS criticos
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
    { status: 'desenvolvimento', label: 'Desenvolvimento', total: Number(stats.desenvolvimento), color: 'blue'  },
    { status: 'homologacao',     label: 'Homologação',     total: Number(stats.homologacao),     color: 'cyan'  },
    { status: 'producao',        label: 'Ativo',           total: Number(stats.producao),        color: 'green' },
    { status: 'descontinuado',   label: 'Descontinuado',   total: Number(stats.descontinuado),   color: 'gray'  },
  ];

  res.json({
    stats: {
      total:           Number(stats.total),
      producao:        Number(stats.producao),
      desenvolvimento: Number(stats.desenvolvimento),
      homologacao:     Number(stats.homologacao),
      descontinuado:   Number(stats.descontinuado),
      criticos:        Number(stats.criticos),
      semDocumentacao: 0,
    },
    distribuicao,
    recentes,
  });
});

module.exports = router;
