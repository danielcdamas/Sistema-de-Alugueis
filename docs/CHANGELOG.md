# CHANGELOG — Controle de Aluguéis

Registro das mudanças do projeto. Datas no fuso America/Sao_Paulo (formato AAAA-MM-DD).

## 2026-07-14

- **Etapa 1 — Fundação do projeto.** Criado o esqueleto da aplicação:
  - Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4, em **modo claro** e `pt-BR`.
  - Validação de variáveis de ambiente com `zod` (`src/lib/env.ts`) + `.env.example`.
  - Utilitário de formatação em reais (`src/lib/format.ts`).
  - Ferramentas de teste: **Vitest** (6 testes unitários) e **Playwright** (1 teste e2e), todos passando; `typecheck`, `lint` e `build` verdes.
  - ESLint (config do Next) + Prettier; `.gitignore` ajustado para versionar `.env.example` e ignorar artefatos do Playwright.
- Adicionada a documentação inicial em `docs/`: `PRODUCT_SPEC.md`, `BUSINESS_RULES.md`, `DATA_MODEL.md`, `DECISIONS.md`, `TEST_PLAN.md`, `DEPLOYMENT.md`, `USER_MANUAL.md`.
- Adicionada **integração contínua (GitHub Actions)** em `.github/workflows/ci.yml`: a cada push na `main` e em cada pull request, roda na nuvem `typecheck`, `lint`, testes unitários, `build` e o teste e2e — sem necessidade de instalar nada localmente.
- **Etapa 2 — Banco de dados (cadastros).** Adicionados **Drizzle ORM** + **PGlite** (PostgreSQL embutido, sem instalação): schema em `src/db/schema.ts` com as tabelas `real_estate_agencies` e `properties` (arquivamento lógico, FK `ON DELETE restrict`), migração em `drizzle/`, cliente de teste em `src/db/client.ts` e 5 testes de integração. Novo script `db:generate`.

## 2026-07-13

- Adicionado `CLAUDE.md`: charter operativo do projeto (versão enxuta v03), definindo papel, missão, invariantes, fases, modelo financeiro, modelo de dados, plano de testes, critérios de aceite e o bloco `<comandos>` com os atalhos `/inicie` e `/encerre`.
- Criados os documentos iniciais `docs/ROADMAP.md` e `docs/CHANGELOG.md`, que passam a servir de memória do projeto entre sessões.
