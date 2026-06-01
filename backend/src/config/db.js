const mysql   = require('mysql2/promise');
const bcrypt  = require('bcryptjs');

const pool = mysql.createPool({
  host:               process.env.MYSQL_HOST     || 'localhost',
  port:               process.env.MYSQL_PORT     || 3306,
  database:           process.env.MYSQL_DATABASE || 'gsis_db',
  user:               process.env.MYSQL_USER     || 'gsis_user',
  password:           process.env.MYSQL_PASSWORD || 'gsis_password',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           '-03:00',
});

async function initDB(tentativas = 5, intervalo = 3000) {
  for (let i = 1; i <= tentativas; i++) {
    try {
      const conn = await pool.getConnection();
      try {
        await conn.ping();
        console.log('MySQL: conexão estabelecida com sucesso');

        const [rows] = await conn.query('SELECT COUNT(*) as total FROM usuarios');
        if (rows[0].total === 0) {
          const hash = await bcrypt.hash('123', 10);
          await conn.query(
            `INSERT INTO usuarios (nome, email, senha_hash, cargo, role)
             VALUES (?, ?, ?, ?, ?)`,
            ['Administrador', 'chrislleymachado98@gmail.com', hash, 'Administrador SEMEG', 'admin']
          );
          console.log('Usuário admin criado: chrislleymachado98@gmail.com');
        }
        return;
      } finally {
        conn.release();
      }
    } catch (err) {
      console.log(`MySQL: tentativa ${i}/${tentativas} falhou — ${err.message}`);
      if (i === tentativas) throw err;
      await new Promise(r => setTimeout(r, intervalo));
    }
  }
}

module.exports = { pool, initDB };

