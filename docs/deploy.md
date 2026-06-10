# GSIS — Guia de Deploy

> Deploy completo será documentado na Etapa 2

## Etapa 1 — Frontend estático

Abrir diretamente no navegador: `frontend/public/login.html`

Ou usar o Live Server do VSCode para desenvolvimento local.

## Etapa 2 — Com backend (planejado)

```bash
# 1. Clonar o repositório
git clone https://gitlab.semeg.oriximina.pa.gov.br/sistemas/gsis.git
cd GSIS

# 2. Instalar dependências do backend
cd backend && npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com as configurações do servidor

# 4. Executar migrations do banco
mysql -u root -p gsis_db < ../database/schema.sql
mysql -u root -p gsis_db < ../database/seeds.sql

# 5. Iniciar o servidor
npm start
```

## Ambiente de produção (planejado)

- Linux Ubuntu 22.04 LTS
- Nginx como proxy reverso
- PM2 para gerenciamento do processo Node.js
- MySQL 8.0 no servidor local ou RDS
- Certificado SSL via Let's Encrypt

