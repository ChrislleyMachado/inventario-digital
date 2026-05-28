# SIGSIS — Regras de Negócio

> Documento a ser detalhado na Etapa 2

## Código Interno

- Formato: `PMO-SIS-AAAA-NNNN`
- Gerado automaticamente pelo sistema
- Único e imutável após criação
- AAAA = ano de cadastro, NNNN = sequencial com 4 dígitos

## Usuários e Permissões

| Perfil         | Ver | Cadastrar | Editar | Excluir | Admin |
|----------------|-----|-----------|--------|---------|-------|
| Administrador  | ✓   | ✓         | ✓      | ✓       | ✓     |
| Técnico de TI  | ✓   | ✓         | ✓      | ✗       | ✗     |
| Consulta       | ✓   | ✗         | ✗      | ✗       | ✗     |

## Status dos Sistemas

- Um sistema só pode ter um status por vez
- A alteração de status deve ser registrada no histórico
- Sistemas "Críticos" nunca podem ser excluídos, apenas descontinuados

## Documentos

- Documentos vinculados a um sistema não podem ser excluídos sem confirmação
- Cada documento deve ter tipo, data e responsável pelo upload
- Versões antigas de documentos são mantidas para rastreabilidade

## Criticidade

- A criticidade define a prioridade de atendimento em incidentes
- Sistemas "Crítica" requerem aprovação de 2 administradores para descontinuação
