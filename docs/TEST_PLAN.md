# PLANO DE TESTES — Controle de Aluguéis

## Ferramentas
- **Vitest** — testes unitários de funções puras (`src/**/*.test.ts`). Prioridade máxima.
- **Playwright** — testes ponta a ponta (`e2e/`), Chromium; sobe o servidor de desenvolvimento automaticamente.

## Como rodar
- `npm run test` — unitários (uma vez); `npm run test:watch` — modo observação.
- `npm run test:e2e` — ponta a ponta.
- `npm run typecheck` — checagem de tipos; `npm run lint` — ESLint.

## Cobertura atual (Fundação)
- **Unitários (6):** `formatarReais` (formatação em reais, 3 casos); `parseEnv` (validação de variáveis, 3 casos).
- **E2E (1):** smoke — a página inicial carrega e exibe "Controle de Aluguéis".

## Planejado (etapas seguintes — prioridade nos unitários do financeiro)
Líquido tributável; esperado para depósito; movimentos; divergência e tolerância R$ 0,01; parcial; estorno; taxa de administração; repasse 27%; dias de atraso; vencimento ajustado; competência × recebimento; Carnê-Leão por mês de recebimento; geração idempotente; duplicidade de cobrança; fechamento mensal. **Integração:** permissões, bloqueio do leitor, geração mensal, conciliação, auditoria. **E2E:** login por link mágico, cadastros, gerar competência, registrar demonstrativo/depósito, divergência, e demais fluxos.

## Testes manuais
Além dos automáticos: conferência visual em desktop, tablet e celular, no Google Chrome.
