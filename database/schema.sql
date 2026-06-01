-- ================================================================
-- SIGSIS — database/schema.sql
-- Estrutura do banco de dados MySQL 8.0
-- Executado automaticamente pelo Docker na primeira inicialização
-- ================================================================

SET NAMES utf8mb4;
SET time_zone = '-03:00';

-- ----------------------------------------------------------------
-- Secretarias municipais
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS secretarias (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(200) NOT NULL,
  sigla     VARCHAR(30),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- Usuários do sistema
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(150) NOT NULL,
  email        VARCHAR(200) UNIQUE NOT NULL,
  senha_hash   VARCHAR(255) NOT NULL,
  cargo        VARCHAR(100),
  secretaria_id INT,
  role         ENUM('admin','gestor','visualizador') NOT NULL DEFAULT 'visualizador',
  ativo        TINYINT(1) NOT NULL DEFAULT 1,
  criado_em    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (secretaria_id) REFERENCES secretarias(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- Sistemas cadastrados
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sistemas (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  codigo          VARCHAR(25) UNIQUE NOT NULL,
  nome            VARCHAR(150) NOT NULL,
  descricao       TEXT,
  finalidade      TEXT,
  tipo            ENUM('web','desktop','mobile','api','portal','erp','outro') NOT NULL DEFAULT 'web',
  status          ENUM('producao','desenvolvimento','homologacao','descontinuado') NOT NULL DEFAULT 'desenvolvimento',
  criticidade     ENUM('critica','alta','media','baixa') NOT NULL DEFAULT 'media',
  secretaria_id   INT,
  setor           VARCHAR(100),
  tecnologias     JSON,
  banco_dados     VARCHAR(100),
  url_producao    VARCHAR(255),
  url_homologacao VARCHAR(255),
  fornecedor      VARCHAR(150),
  resp_tec        VARCHAR(150),
  resp_adm        VARCHAR(150),
  data_implantacao DATE,
  observacoes     TEXT,
  ativo           TINYINT(1) NOT NULL DEFAULT 1,
  criado_em       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  criado_por      INT,
  FOREIGN KEY (secretaria_id) REFERENCES secretarias(id) ON DELETE SET NULL,
  FOREIGN KEY (criado_por)    REFERENCES usuarios(id)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- Histórico de alterações (auditoria)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS historico (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  sistema_id INT,
  usuario_id INT,
  acao       VARCHAR(50) NOT NULL,
  descricao  TEXT,
  criado_em  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sistema_id) REFERENCES sistemas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
