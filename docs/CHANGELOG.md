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
- **Etapa 3 — Contratos, histórico e competências.** Novas tabelas `rental_contracts`, `property_agency_history` e `monthly_rent_periods` (competência com `UNIQUE(imóvel, ano, mês)`, CHECKs de dia/mês/regra/taxa e *fotografia* das regras do contrato). Função de geração idempotente de competências (`src/db/periods.ts`) e utilitário de testes (`src/db/test-utils.ts`); +10 testes de integração (contratos e competências), totalizando 21 no Vitest.
- **Etapa 4 — Núcleo financeiro (cálculos).** `src/lib/financeiro.ts` (funções puras): líquido tributável, esperado para depósito, total depositado, divergência com tolerância de R$ 0,01, situações de conciliação (conciliado/parcial/a maior/a menor), taxa esperada × cobrada e repasse de 27%. Dinheiro em **centavos inteiros** com arredondamento meio para cima. +21 testes unitários (incluindo os exemplos do charter), totalizando 42 no Vitest.
- **Etapa 5 — Persistência de movimentos e componentes.** Tabelas `bank_movements` e `statement_components` (CHECKs de tipo/kind e de sinal do valor). Ponte banco → cálculo em `src/db/conciliacao.ts` (`avaliarCompetenciaPersistida`), que avalia uma competência a partir dos dados gravados. +6 testes de integração, totalizando 48 no Vitest. (Catálogo `financial_component_types` adiado.)

## 2026-07-13

- Adicionado `CLAUDE.md`: charter operativo do projeto (versão enxuta v03), definindo papel, missão, invariantes, fases, modelo financeiro, modelo de dados, plano de testes, critérios de aceite e o bloco `<comandos>` com os atalhos `/inicie` e `/encerre`.
- Criados os documentos iniciais `docs/ROADMAP.md` e `docs/CHANGELOG.md`, que passam a servir de memória do projeto entre sessões.
