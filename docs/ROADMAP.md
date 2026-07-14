# ROADMAP — Controle de Aluguéis

> Memória viva do projeto. No início de cada sessão (`/inicie`), releia este arquivo, o `CLAUDE.md` e o log do git para recuperar o estado. Atualize-o no encerramento (`/encerre`).

## Situação atual (2026-07-14)

- **Estágio:** Fase 1 em andamento. **Etapas 1 (Fundação), 2 (Banco — cadastros) e 3 (Contratos e competências): concluídas.**
- **Feito na Etapa 3:** tabelas `rental_contracts`, `property_agency_history` e `monthly_rent_periods` (competência com `UNIQUE(imóvel, ano, mês)` e *fotografia* das regras do contrato); função de **geração idempotente** de competências (`ensureMonthlyPeriod`); testes de integração.
- **Feito nas Etapas 1–2:** esqueleto Next.js 16 + TS + Tailwind (modo claro, pt-BR); zod; utilitário de reais; Drizzle ORM + PGlite; cadastros (`real_estate_agencies`, `properties`); ESLint + Prettier; documentação.
- **Verificações (todas verdes):** `typecheck`, `lint`, **21 testes** (6 unitários + 15 de banco), 1 teste e2e, `build`.
- **Integração contínua:** GitHub Actions (`.github/workflows/ci.yml`) roda tudo na nuvem a cada push/PR — sem instalação local.

## Próximo passo proposto

**Etapa 4 — Núcleo financeiro (cálculos):** implementar, como funções puras com testes unitários (prioridade máxima), as fórmulas do `docs/BUSINESS_RULES.md` — líquido tributável, valor esperado para depósito, total depositado, divergência com tolerância de R$ 0,01, situações (conciliado/parcial/a menor/a maior), taxa esperada × cobrada e o repasse de 27%. Sem banco nesta etapa: entradas → resultados calculados. **Aguardar aprovação antes de iniciar.**

## Fases (resumo)

- **Fase 1 — Núcleo financeiro utilizável:** [Fundação ✓] · autenticação sem senha e permissões; imobiliárias/imóveis/contratos; competências idempotentes; demonstrativos/depósitos; conciliação e divergências; atrasos; taxa de administração esperada × cobrada; movimentos/parciais; Carnê-Leão (processo); repasse 27%; dashboard; central de pendências; consulta histórica; auditoria; arquivamento.
- **Fase 2 — Operação, relatórios e produção:** anexos; observações; conciliação guiada; fechamento/reabertura; gráficos; cobrança assistida (sem OAuth); relatórios/exportações (incl. anual de IR); backup; acessibilidade; testes completos; segurança; desempenho; deploy; documentação final.

## Decisões e pendências

- Decisões técnicas registradas em `docs/DECISIONS.md`.
- Provedor de nuvem (Supabase × Neon; Vercel × Cloudflare Pages) será decidido só no deploy, revalidando limites/custos.
- `npm audit`: 2 avisos "moderate" (postcss transitivo do Next 16), sem correção segura; baixo risco prático.
- Se ainda existir no GitHub, a branch remota obsoleta `claude/claude-md-setup-mo2w6a` pode ser apagada pelo site (a exclusão via git foi bloqueada por 403 neste ambiente); a branch local já foi removida.
