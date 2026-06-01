-- ================================================================
-- SIGSIS — database/seeds.sql
-- Dados iniciais de desenvolvimento
-- Executado automaticamente pelo Docker na primeira inicialização
-- (após schema.sql, por ordem alfabética de arquivo)
-- ================================================================

SET NAMES utf8mb4;

-- ----------------------------------------------------------------
-- Secretarias municipais (ordem igual à constante SECRETARIAS em utils.js)
-- IDs: 1-20 em sequência
-- ----------------------------------------------------------------
INSERT INTO secretarias (nome, sigla) VALUES
  ('Assessoria de Controle Interno',                                                      'ACI'),
  ('Gabinete do Prefeito',                                                                'GABIN'),
  ('Procuradoria Geral do Município',                                                     'PGM'),
  ('Secretaria de Integração Municipal',                                                  'SEINT'),
  ('Secretaria Municipal de Agricultura e Abastecimento',                                 'SEMAGRI'),
  ('Secretaria Municipal de Assistência Social',                                          'SMAS'),
  ('Secretaria Municipal de Comunicação',                                                 'SEMCO'),
  ('Secretaria Municipal de Cultura',                                                     'SEMC'),
  ('Secretaria Municipal de Educação',                                                    'SEMED'),
  ('Secretaria Municipal de Eficiência Governamental',                                    'SEMEG'),
  ('Secretaria Municipal de Finanças e Desenvolvimento Econômico',                        'SEMFIDE'),
  ('Secretaria Municipal de Infraestrutura',                                              'SEINFRA'),
  ('Secretaria Municipal da Juventude',                                                   'SEMJU'),
  ('Secretaria Municipal de Meio Ambiente e Mineração',                                   'SEMMA'),
  ('Secretaria Municipal de Obras Públicas e Habitação',                                  'SEMOPH'),
  ('Secretaria Municipal de Planejamento e Administração',                                'SEMPLAD'),
  ('Secretaria Municipal de Promoção da Igualdade Racial e dos Direitos Humanos',         'SEMPIRDH'),
  ('Secretaria Municipal de Saúde',                                                       'SMS'),
  ('Secretaria Municipal de Segurança Pública e Defesa Social',                           'SEMUSP'),
  ('Secretaria Municipal do Esporte',                                                     'SEMESP');

-- ----------------------------------------------------------------
-- Sistemas de exemplo (os mesmos da Etapa 1, agora no banco)
-- Referências: SMAS=6, SEMPLAD=16, SEMEG=10, GABIN=2, SEMFIDE=11, SEINFRA=12
-- ----------------------------------------------------------------
INSERT INTO sistemas (codigo, nome, descricao, finalidade, tipo, status, criticidade, secretaria_id, resp_tec, resp_adm, tecnologias, banco_dados, data_implantacao) VALUES
  (
    'PMO-SIS-2024-0001',
    'SySocial',
    'Sistema de gestão de benefícios e programas sociais municipais',
    'Centralizar o gerenciamento de benefícios sociais e acompanhamento de famílias atendidas pela assistência social',
    'web', 'producao', 'alta', 6,
    'Carlos Mendes', NULL,
    '["HTML","CSS","JavaScript","Node.js","MySQL"]', 'MySQL',
    '2024-03-15'
  ),
  (
    'PMO-SIS-2024-0002',
    'Banco de Talentos',
    'Gestão de currículos e oportunidades de emprego no município',
    'Conectar cidadãos em busca de emprego com oportunidades ofertadas por empresas e órgãos municipais',
    'web', 'desenvolvimento', 'media', 16,
    'Ana Lima', NULL,
    '["Vue.js","Node.js","PostgreSQL"]', 'PostgreSQL',
    NULL
  ),
  (
    'PMO-SIS-2025-0001',
    'Portal de Projetos Inovadores',
    'Portal para submissão e acompanhamento de projetos de inovação',
    'Permitir que servidores e cidadãos submetam projetos inovadores para análise e eventual implementação pela prefeitura',
    'portal', 'producao', 'alta', 10,
    'Pedro Costa', NULL,
    '["React","Node.js","MySQL"]', 'MySQL',
    '2025-01-10'
  ),
  (
    'PMO-SIS-2023-0001',
    'Sistema de Protocolo',
    'Gerenciamento de documentos e protocolos administrativos',
    'Controlar o fluxo de documentos oficiais entre secretarias, garantindo rastreabilidade e cumprimento de prazos',
    'web', 'producao', 'critica', 16,
    'Roberto Silva', NULL,
    '["PHP","JavaScript","MySQL"]', 'MySQL',
    '2023-06-20'
  ),
  (
    'PMO-SIS-2023-0002',
    'Sistema de Patrimônio',
    'Controle e gestão de bens patrimoniais municipais',
    'Inventariar e controlar todos os bens móveis e imóveis pertencentes ao município',
    'web', 'homologacao', 'media', 16,
    'Fernando Alves', NULL,
    '["PHP","JavaScript","MySQL"]', 'MySQL',
    '2023-09-05'
  ),
  (
    'PMO-SIS-2022-0001',
    'Portal da Transparência',
    'Portal público de transparência das ações municipais',
    'Garantir o acesso da população a informações sobre receitas, despesas, contratos e demais atos administrativos',
    'portal', 'producao', 'critica', 2,
    'Diego Rocha', NULL,
    '["WordPress","PHP","MySQL"]', 'MySQL',
    '2022-01-01'
  ),
  (
    'PMO-SIS-2025-0002',
    'SIGCOB — Tributação',
    'Sistema de gestão e cobrança de tributos municipais',
    'Administrar o lançamento, cobrança e controle de tributos municipais como ISS, IPTU e taxas diversas',
    'web', 'homologacao', 'alta', 11,
    'Marina Souza', NULL,
    '["Java","Spring Boot","PostgreSQL"]', 'PostgreSQL',
    NULL
  ),
  (
    'PMO-SIS-2021-0001',
    'INFRASIS OS',
    'Sistema de ordens de serviço da Secretaria de Infraestrutura',
    'Gerenciar ordens de serviço de manutenção e obras da infraestrutura urbana municipal',
    'web', 'descontinuado', 'baixa', 12,
    'Marcos Vidal', NULL,
    '["HTML","CSS","JavaScript","Firebase"]', 'Firebase',
    '2021-05-15'
  );
