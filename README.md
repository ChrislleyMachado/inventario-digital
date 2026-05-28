# SIGSIS — Sistema de Gestão de Sistemas Municipais

Sistema web administrativo para inventariar, organizar e controlar os sistemas utilizados pela rede municipal de Oriximiná (PA).

## Objetivo

Centralizar o controle de todos os sistemas de informação da prefeitura, reunindo código interno, documentação, código-fonte, responsáveis, versões e situação atual de cada sistema em um único ambiente.

## Stack tecnológica

| Camada    | Etapa 1 (atual) | Etapa 2 (planejado) |
|-----------|-----------------|----------------------|
| Frontend  | HTML5, CSS3, JS puro | Mesmo (sem framework) |
| Backend   | Estrutura inicial | Node.js + Express    |
| Banco     | —               | MySQL 8.0            |
| Auth      | Simulada        | JWT (jsonwebtoken)   |
| Upload    | Simulado        | Multer               |

## Como rodar com Docker (recomendado)

### 1. Copiar o arquivo de variáveis de ambiente

```bash
# Linux / macOS
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

### 2. Subir o ambiente de desenvolvimento

```bash
docker compose -f docker-compose.dev.yml up --build
```

### 3. Acessar

| Serviço  | URL                                    |
|----------|----------------------------------------|
| Frontend | http://localhost:5500/login.html       |
| Backend  | http://localhost:3001/api/health       |
| MySQL    | localhost:3306                         |

**Alterações em HTML, CSS e JS** no VS Code são refletidas automaticamente no navegador (live-server com bind mount).

**Alterações no backend** reiniciam o servidor automaticamente via nodemon.

### Parar o ambiente

```bash
docker compose -f docker-compose.dev.yml down
```

Para remover também o volume do MySQL:

```bash
docker compose -f docker-compose.dev.yml down -v
```

---

## Como abrir — Sem Docker (Etapa 1)

Abra diretamente no navegador:

```
SIGSIS/frontend/public/login.html
```

Ou use a extensão **Live Server** do VS Code (porta 5500 já configurada em `.vscode/settings.json`).

**Credenciais de acesso (simuladas):**
- E-mail: qualquer e-mail válido
- Senha: qualquer senha

## Estrutura de pastas

```
SIGSIS/
├── frontend/public/       ← Telas HTML/CSS/JS (foco da Etapa 1)
│   ├── css/               ← Estilos (global, login, dashboard, sistemas, componentes)
│   ├── js/                ← Scripts (main, auth, dashboard, sistemas, utils)
│   ├── assets/            ← Imagens, ícones, logos
│   ├── login.html
│   ├── dashboard.html
│   ├── sistemas.html
│   ├── novo-sistema.html
│   ├── detalhes-sistema.html
│   ├── usuarios.html
│   └── configuracoes.html
├── backend/               ← Node.js/Express (estrutura Etapa 2)
├── database/              ← SQL (modelagem Etapa 2)
├── docs/                  ← Documentação técnica
└── README.md
```

## O que foi implementado na Etapa 1

- [x] Estrutura completa de pastas do projeto
- [x] Sistema de design com CSS variables (cores, sombras, espaçamentos)
- [x] Sidebar responsiva com navegação funcional
- [x] Tela de login visual com padrão institucional
- [x] Dashboard com 6 cards de indicadores e animação de contagem
- [x] Listagem de sistemas com busca e filtros por status/secretaria/criticidade
- [x] Formulário de cadastro de novo sistema (multisseção)
- [x] Tela de detalhes com abas JavaScript funcionais (6 seções)
- [x] Tela de usuários com listagem simulada e filtros
- [x] Tela de configurações com todos os parâmetros visuais
- [x] Preview do padrão de código interno (PMO-SIS-AAAA-NNNN)
- [x] Responsividade para mobile/tablet
- [x] Dados simulados realistas de 8 sistemas municipais
- [x] Funções utilitárias (formatação, badges, toast, debounce)
- [x] Estrutura de backend Node.js/Express preparada

## O que será implementado nas próximas etapas

### Etapa 2 — Backend e Banco de Dados
- [ ] API REST completa com Node.js + Express
- [ ] Banco de dados MySQL com modelagem completa
- [ ] Autenticação real com JWT
- [ ] CRUD completo de sistemas
- [ ] Upload e gestão de documentos
- [ ] Histórico de auditoria

### Etapa 3 — Funcionalidades Avançadas
- [ ] Notificações por e-mail
- [ ] Relatórios em PDF
- [ ] Dashboard com gráficos reais
- [ ] Exportação de inventário
- [ ] Deploy em servidor Linux + Nginx

## Desenvolvido por

**SEMEG — Secretaria de Eficiência Governamental**  
Prefeitura Municipal de Oriximiná — Pará  
© 2026
