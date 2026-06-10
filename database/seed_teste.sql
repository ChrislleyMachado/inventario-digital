INSERT INTO sistemas (
  codigo, nome, descricao, finalidade, tipo, status, criticidade,
  secretaria_id, setor, resp_tec, resp_adm, fornecedor,
  tecnologias, banco_dados, url_producao, url_homologacao,
  data_implantacao, observacoes,
  origem, contrato_numero, contrato_inicio, contrato_fim, contrato_valor,
  hospedagem, versao_atual, acesso, criado_por
) VALUES

-- 1. Folha de Pagamento — crítico, ativo, licitação
('PMO-SIS-2026-0001','Sistema de Folha de Pagamento',
 'Gestão e processamento da folha de pagamento dos servidores municipais',
 'Garantir o pagamento correto e no prazo de todos os servidores públicos municipais',
 'erp','producao','critica', 16,'DGRH','Carlos Mendes','Fernanda Lima','Govtech Sistemas Ltda',
 '["Java","Spring Boot","Oracle"]','Oracle',
 'https://folha.oriximina.pa.gov.br',NULL,
 '2019-03-01','Sistema legado migrado em 2019. Crítico para pagamento de 1.200 servidores.',
 'licitacao','Contrato 007/2019','2019-01-15','2026-12-31',185000.00,
 'contratada','4.3.1','intranet',1),

-- 2. Portal do Cidadão — ativo, alta, interno
('PMO-SIS-2026-0002','Portal do Cidadão',
 'Portal de serviços públicos digitais para os cidadãos de Oriximiná',
 'Disponibilizar serviços municipais online reduzindo filas e deslocamentos',
 'portal','producao','alta', 2,'Gabinete','Pedro Costa','Diego Rocha','SEMEG — Desenvolvimento Interno',
 '["React","Node.js","MySQL"]','MySQL',
 'https://cidadao.oriximina.pa.gov.br','https://hom.cidadao.oriximina.pa.gov.br',
 '2023-08-15','Integrado ao Gov.br para autenticação. +3.000 acessos/mês.',
 'interno',NULL,NULL,NULL,NULL,
 'nuvem','2.0.4','internet',1),

-- 3. Sistema de Saúde Digital — desenvolvimento, alta, licitação
('PMO-SIS-2026-0003','SaúdeDigital — Prontuário Eletrônico',
 'Prontuário eletrônico do paciente para as unidades de saúde municipais',
 'Digitalizar os atendimentos de saúde e unificar o histórico dos pacientes',
 'web','desenvolvimento','alta', 18,'Atenção Básica','Marina Souza','Dr. Henrique Alves','MedSoft Tecnologia',
 '["Vue.js","Node.js","PostgreSQL"]','PostgreSQL',
 NULL,'https://hom.saude.oriximina.pa.gov.br',
 NULL,'Previsto para implantação no 3º trimestre de 2026. Em fase de homologação nas UBSs.',
 'licitacao','Contrato 014/2025','2025-03-01','2027-02-28',320000.00,
 'nuvem','0.9.2','intranet',1),

-- 4. Controle de Frotas — ativo, média, licitação vencendo em breve
('PMO-SIS-2026-0004','FrotasMunic — Controle de Veículos',
 'Gerenciamento da frota de veículos oficiais da prefeitura',
 'Controlar saídas, manutenções e consumo de combustível dos veículos municipais',
 'web','producao','media', 12,'Garagem Municipal','Marcos Vidal','Roberto Silva','AutoGov Sistemas',
 '["PHP","JavaScript","MySQL"]','MySQL',
 'https://frotas.oriximina.pa.gov.br',NULL,
 '2021-06-10','Contrato com renovação pendente. Averiguar renovação urgente.',
 'licitacao','Contrato 021/2021','2021-06-01','2026-06-30',48000.00,
 'servidor_proprio','1.8.0','intranet',1),

-- 5. Sistema de Licitações — ativo, crítica, interno
('PMO-SIS-2026-0005','LICITA — Gestão de Licitações',
 'Controle e acompanhamento dos processos licitatórios municipais',
 'Garantir transparência e rastreabilidade nos processos de compras públicas',
 'web','producao','critica', 16,'Comissão de Licitações','Ana Lima','Fernanda Lima','SEMEG — Desenvolvimento Interno',
 '["Node.js","Express","MySQL","React"]','MySQL',
 'https://licitacoes.oriximina.pa.gov.br',NULL,
 '2022-04-01','Integrado ao Portal da Transparência. Publicação automática de editais.',
 'interno',NULL,NULL,NULL,NULL,
 'servidor_proprio','3.1.0','internet',1),

-- 6. Aplicativo Municipal — desenvolvimento, baixa, interno
('PMO-SIS-2026-0006','App Oriximiná',
 'Aplicativo mobile de serviços e notícias da Prefeitura de Oriximiná',
 'Aproximar a prefeitura do cidadão através de canal digital no smartphone',
 'mobile','desenvolvimento','baixa', 10,'SEMEG — TI','Pedro Costa','Diego Rocha','SEMEG — Desenvolvimento Interno',
 '["React Native","Node.js","MySQL"]','MySQL',
 NULL,NULL,
 NULL,'Em desenvolvimento pela equipe interna. Previsão: 4º trimestre 2026.',
 'interno',NULL,NULL,NULL,NULL,
 'nuvem','0.3.0','internet',1),

-- 7. Sistema de Ouvidoria — homologação, média, convênio
('PMO-SIS-2026-0007','OuvidoriaWeb',
 'Sistema de registro e acompanhamento de manifestações da ouvidoria municipal',
 'Receber, registrar e dar encaminhamento às manifestações dos cidadãos',
 'web','homologacao','media', 2,'Ouvidoria Municipal','Carlos Mendes','Patricia Sousa','CGU — Governo Federal',
 '["Java","Angular","PostgreSQL"]','PostgreSQL',
 NULL,'https://hom.ouvidoria.oriximina.pa.gov.br',
 NULL,'Sistema cedido pela CGU via convênio. Em processo de customização local.',
 'convenio','Convênio 003/2025','2025-07-01','2027-06-30',0.00,
 'nuvem','2.4.0','internet',1),

-- 8. Gestão Escolar — ativo, alta, licitação
('PMO-SIS-2026-0008','EDUSIS — Gestão Escolar',
 'Sistema de gestão das escolas municipais: matrículas, frequência e notas',
 'Digitalizar a gestão pedagógica e administrativa das 28 escolas municipais',
 'web','producao','alta', 9,'Departamento de Ensino','Sandra Barros','Lucia Oliveira','EduTech Brasil',
 '["PHP","Laravel","MySQL"]','MySQL',
 'https://edu.oriximina.pa.gov.br',NULL,
 '2020-02-10','Atende 28 escolas e 6.000 alunos. Integrado ao Censo Escolar/INEP.',
 'licitacao','Contrato 003/2020','2020-01-01','2026-12-31',95000.00,
 'contratada','5.2.3','intranet',1),

-- 9. Sistema de Obras — homologação, alta, licitação
('PMO-SIS-2026-0009','OBRAS — Gestão de Obras Públicas',
 'Acompanhamento e fiscalização de obras públicas municipais',
 'Controlar cronograma, medições e contratos de obras em andamento',
 'web','homologacao','alta', 15,'Fiscalização de Obras','Fernando Alves','Roberto Silva','EngeGov Sistemas',
 '["Vue.js","Node.js","PostgreSQL"]','PostgreSQL',
 NULL,'https://hom.obras.oriximina.pa.gov.br',
 NULL,'Piloto com 5 obras em andamento. Aguardando aprovação da SEMOPH para go-live.',
 'licitacao','Contrato 018/2025','2025-05-01','2027-04-30',72000.00,
 'nuvem','1.0.0-beta','intranet',1),

-- 10. Portal de Empregos — desenvolvimento, média, interno
('PMO-SIS-2026-0010','EmpregaMunic',
 'Portal de intermediação de empregos e qualificação profissional',
 'Conectar trabalhadores a oportunidades de emprego e cursos de qualificação',
 'portal','desenvolvimento','media', 16,'SINE Municipal','Ana Lima','Patricia Sousa','SEMEG — Desenvolvimento Interno',
 '["React","Node.js","MySQL"]','MySQL',
 NULL,NULL,
 NULL,'Substituirá o cadastro manual em planilhas. Previsão de lançamento: ago/2026.',
 'interno',NULL,NULL,NULL,NULL,
 'nuvem','0.5.0','internet',1),

-- 11. Sistema Tributário — ativo, crítica, licitação
('PMO-SIS-2026-0011','TRIBUTAFÁCIL — Gestão Tributária',
 'Arrecadação, fiscalização e cobrança de tributos municipais (ISS, IPTU, taxas)',
 'Maximizar a arrecadação municipal e oferecer ao contribuinte acesso digital aos débitos',
 'web','producao','critica', 11,'Divisão de Arrecadação','Marina Souza','Fernanda Lima','GovFinance Ltda',
 '["Java","Spring","Oracle"]','Oracle',
 'https://tributos.oriximina.pa.gov.br',NULL,
 '2018-01-15','Sistema mais crítico da fazenda. Processa R$ 12M/ano em arrecadação.',
 'licitacao','Contrato 001/2018','2018-01-01','2026-12-31',210000.00,
 'servidor_proprio','7.1.4','ambos',1),

-- 12. Controle de Estoque — descontinuado, baixa, interno
('PMO-SIS-2026-0012','ESTOQUE v1 — Almoxarifado',
 'Controle de materiais e insumos do almoxarifado central',
 'Registrar entradas e saídas de materiais de consumo da prefeitura',
 'desktop','descontinuado','baixa', 16,'Almoxarifado Central','Carlos Mendes',NULL,'SEMEG — Desenvolvimento Interno',
 '["Delphi","Firebird"]','Firebird',
 NULL,NULL,
 '2010-03-01','Substituído pelo módulo de almoxarifado do ERP em 2024. Mantido apenas para consulta de histórico.',
 'interno',NULL,NULL,NULL,NULL,
 'servidor_proprio','1.0.0','intranet',1),

-- 13. Protocolo Digital — ativo, alta, interno
('PMO-SIS-2026-0013','PROTOCOLO — Gestão Documental',
 'Protocolo eletrônico de documentos e processos administrativos',
 'Eliminar papel e agilizar o trâmite de processos entre secretarias',
 'web','producao','alta', 16,'Protocolo Geral','Carlos Mendes','Fernanda Lima','SEMEG — Desenvolvimento Interno',
 '["Node.js","React","MySQL"]','MySQL',
 'https://protocolo.oriximina.pa.gov.br','https://hom.protocolo.oriximina.pa.gov.br',
 '2024-01-10','Integrado ao sistema de assinatura digital Gov.br. 500 processos/mês.',
 'interno',NULL,NULL,NULL,NULL,
 'servidor_proprio','2.2.0','intranet',1),

-- 14. Gestão de Convênios — desenvolvimento, média, interno
('PMO-SIS-2026-0014','CONVENIOS — Gestão de Convênios Federais',
 'Acompanhamento e prestação de contas de convênios com governo federal e estadual',
 'Garantir o cumprimento das obrigações dos convênios e evitar inadimplência',
 'web','desenvolvimento','media', 10,'SEMEG — Convênios','Pedro Costa','Lucia Oliveira','SEMEG — Desenvolvimento Interno',
 '["Vue.js","Node.js","MySQL"]','MySQL',
 NULL,NULL,
 NULL,'Demanda urgente da CGM. Prazo para entrar em produção: jul/2026.',
 'interno',NULL,NULL,NULL,NULL,
 'nuvem','0.4.0','intranet',1),

-- 15. Vigilância Sanitária — descontinuado, média, licitação
('PMO-SIS-2026-0015','VISANET — Vigilância Sanitária',
 'Controle de inspeções e licenças sanitárias de estabelecimentos',
 'Registrar inspeções, notificações e emitir alvarás sanitários',
 'web','descontinuado','media', 18,'Vigilância Sanitária','Diego Rocha','Sandra Barros','SaúdeGov Sistemas',
 '["PHP","MySQL"]','MySQL',
 NULL,NULL,
 '2016-05-20','Descontinuado em 2025. Funcionalidades migradas para o módulo de vigilância do SaúdeDigital.',
 'licitacao','Contrato 009/2016','2016-05-01','2025-04-30',38000.00,
 'servidor_proprio','3.0.0','intranet',1);
