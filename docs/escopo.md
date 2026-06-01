# GSIS — Escopo do Sistema

## Definição

**GSIS** é um sistema web administrativo para inventariar e gerenciar os sistemas municipais, reunindo dados técnicos, documentação, repositórios, versões, responsáveis e código interno de registro.

## Objetivo

Centralizar o controle de todos os sistemas de informação utilizados pela rede municipal de Oriximiná, facilitando a gestão, auditoria, manutenção e continuidade tecnológica da prefeitura.

## Problemas que o GSIS resolve

- Falta de inventário centralizado dos sistemas municipais
- Dificuldade de localizar documentação técnica e manuais
- Ausência de rastreamento de versões e responsáveis
- Impossibilidade de saber o status real de cada sistema
- Perda de conhecimento institucional quando servidores saem

## Funcionalidades previstas

### Etapa 1 — Base Visual (concluída)
- Estrutura de páginas HTML/CSS/JS
- Dashboard com indicadores simulados
- Listagem de sistemas com busca e filtros
- Formulário de cadastro de novo sistema
- Tela de detalhes com abas (dados, documentação, repositório, versões, responsáveis, histórico)
- Gerenciamento de usuários (visual)
- Configurações do sistema (visual)

### Etapa 2 — Backend e Banco de Dados
- API REST com Node.js/Express
- Banco MySQL com modelagem completa
- Autenticação JWT com roles (Administrador, Técnico de TI, Consulta)
- CRUD completo de sistemas
- Upload e gestão de documentos
- Histórico de alterações (auditoria)

### Etapa 3 — Funcionalidades Avançadas
- Notificações por e-mail (sistemas sem documentação, sistemas críticos)
- Relatórios em PDF
- Integração com repositórios Git (GitLab/GitHub)
- Dashboard com gráficos reais
- Exportação de inventário (Excel/PDF)

## Público-alvo

- Técnicos de TI da SEMEG
- Administradores de sistemas da prefeitura
- Gestores que precisam de visibilidade sobre os sistemas municipais

## Stack tecnológica

| Camada    | Tecnologia                    |
|-----------|-------------------------------|
| Frontend  | HTML5, CSS3, JavaScript puro  |
| Backend   | Node.js + Express             |
| Banco     | MySQL 8.0                     |
| Auth      | JWT (jsonwebtoken)            |
| Upload    | Multer                        |
| Servidor  | Linux + Nginx (produção)      |

