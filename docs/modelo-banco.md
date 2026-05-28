# SIGSIS — Modelo do Banco de Dados

> Modelagem completa será desenvolvida na Etapa 2

## Entidades principais

- **sistemas** — registro central de cada sistema municipal
- **usuarios** — usuários com acesso ao SIGSIS
- **documentos** — arquivos vinculados a cada sistema
- **versoes** — histórico de versões de cada sistema
- **responsaveis** — responsáveis técnicos/administrativos
- **historico** — log de auditoria de todas as alterações
- **secretarias** — órgãos e secretarias da prefeitura
- **tipos_documentos** — categorias de documentos aceitos

## Relacionamentos

- Sistema N:1 Secretaria
- Sistema 1:N Documentos
- Sistema 1:N Versões
- Sistema N:M Responsáveis
- Usuário 1:N Sistemas (criados_por)
- Usuário 1:N Histórico

## Notas para Etapa 2

O modelo completo com DDL SQL será gerado no arquivo `schema.sql`
após a validação das regras de negócio com as secretarias envolvidas.
