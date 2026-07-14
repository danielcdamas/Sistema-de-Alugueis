# PLANO DE TESTES — Controle de Aluguéis

## Ferramentas
- **Vitest** — testes unitários de funções puras (`src/**/*.test.ts`). Prioridade máxima.
- **Playwright** — testes ponta a ponta (`e2e/`), Chromium; sobe o servidor de desenvolvimento automaticamente.

## Como rodar
- `npm run test` — unitários (uma vez); `npm run test:watch` — modo observação.
- `npm run test:e2e` — ponta a ponta.
- `npm run typecheck` — checagem de tipos; `npm run lint` — ESLint.

## Integração contínua (nuvem)

O **GitHub Actions** (`.github/workflows/ci.yml`) roda automaticamente, a cada push na `main` e em cada pull request: `typecheck`, `lint`, testes unitários, `build` e o teste e2e (o Chromium é instalado no próprio runner). Tudo na nuvem do GitHub, sem necessidade de instalar nada localmente.

## Cobertura atual
- **Unitários (6):** `formatarReais` (3 casos); `parseEnv` (3 casos).
- **Integração de banco (15):** cadastros — imobiliárias/imóveis, unicidade, FK, arquivamento (5); contratos e histórico — CHECKs (dia, regra), FK, decimal preservado (5); competências — geração idempotente, fotografia por competência, UNIQUE, CHECK de mês (5).
- **E2E (1):** smoke — a página inicial carrega e exibe "Controle de Aluguéis".
- **Total:** 21 testes no Vitest + 1 e2e no Playwright.

## Planejado (etapas seguintes — prioridade nos unitários do financeiro)
Líquido tributável; esperado para depósito; movimentos; divergência e tolerância R$ 0,01; parcial; estorno; taxa de administração; repasse 27%; dias de atraso; vencimento ajustado; competência × recebimento; Carnê-Leão por mês de recebimento; geração idempotente; duplicidade de cobrança; fechamento mensal. **Integração:** permissões, bloqueio do leitor, geração mensal, conciliação, auditoria. **E2E:** login por link mágico, cadastros, gerar competência, registrar demonstrativo/depósito, divergência, e demais fluxos.

## Testes manuais
Além dos automáticos: conferência visual em desktop, tablet e celular, no Google Chrome.
