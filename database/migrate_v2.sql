ALTER TABLE sistemas
  ADD COLUMN origem           ENUM('interno','licitacao','convenio','cessao','outro') DEFAULT NULL AFTER observacoes,
  ADD COLUMN contrato_numero  VARCHAR(100)  DEFAULT NULL AFTER origem,
  ADD COLUMN contrato_inicio  DATE          DEFAULT NULL AFTER contrato_numero,
  ADD COLUMN contrato_fim     DATE          DEFAULT NULL AFTER contrato_inicio,
  ADD COLUMN contrato_valor   DECIMAL(15,2) DEFAULT NULL AFTER contrato_fim,
  ADD COLUMN hospedagem       ENUM('servidor_proprio','nuvem','datacenter','contratada','outro') DEFAULT NULL AFTER contrato_valor,
  ADD COLUMN versao_atual     VARCHAR(50)   DEFAULT NULL AFTER hospedagem,
  ADD COLUMN acesso           ENUM('intranet','internet','ambos') DEFAULT NULL AFTER versao_atual;
