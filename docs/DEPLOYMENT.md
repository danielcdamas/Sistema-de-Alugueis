# IMPLANTAÇÃO E EXECUÇÃO — Controle de Aluguéis

> Estado: desenvolvimento local apenas. O deploy em nuvem é etapa posterior e será documentado aqui com fonte/data dos limites na ocasião.

## Requisitos
- Node.js 22+ e npm.

## Rodar localmente
1. Instalar dependências: `npm install`.
2. Copiar variáveis: `cp .env.example .env` (ajuste se necessário).
3. Desenvolvimento: `npm run dev` → http://localhost:3000
4. Build de produção: `npm run build` e depois `npm start`.

## Variáveis de ambiente
Validadas em `src/lib/env.ts` (zod) e documentadas em `.env.example`. Hoje: `NODE_ENV`. Banco e autenticação serão adicionados nas etapas correspondentes. **Segredos nunca são versionados** (`.env` está no `.gitignore`; apenas `.env.example`, sem segredos, é versionado).

## Scripts disponíveis
`dev`, `build`, `start`, `lint`, `lint:fix`, `typecheck`, `test`, `test:watch`, `test:e2e`, `db:generate`, `format`, `format:check`.

## Banco de dados
- Em desenvolvimento e testes, usa-se **PGlite** (PostgreSQL embutido, em processo — sem servidor nem instalação). Os testes de integração sobem um banco em memória, aplicam as migrações e rodam.
- O schema fica em `src/db/schema.ts`; as migrações SQL, em `drizzle/` (geradas por `npm run db:generate`).
- Em produção, o mesmo schema/migração valem para um PostgreSQL gerenciado (Neon/Supabase/Vercel), trocando apenas o driver — decisão da etapa de deploy.

## Backup (planejado — Fase 2)
Exportação completa dos dados de negócio + auditoria + configurações não secretas, **excluindo obrigatoriamente todos os segredos**. O procedimento de backup/restauração e o teste com dados fictícios serão descritos aqui na Fase 2.

## Portabilidade
Aplicação, banco e armazenamento separados; configuração por variáveis de ambiente; PostgreSQL padrão. Provedores (Vercel × Cloudflare Pages; Supabase × Neon) serão decididos no deploy, e a migração documentada aqui.
