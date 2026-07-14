# ROADMAP — Controle de Aluguéis

> Memória viva do projeto. No início de cada sessão (`/inicie`), releia este arquivo, o `CLAUDE.md` e o log do git para recuperar o estado. Atualize-o no encerramento (`/encerre`).

## Situação atual (2026-07-14)

- **Estágio:** Fase 1 em andamento. **Etapas 1–4 concluídas** (Fundação; Banco/cadastros; Contratos/competências; **Núcleo financeiro**).
- **Feito na Etapa 4:** núcleo financeiro em `src/lib/financeiro.ts` (funções puras) — líquido tributável, esperado para depósito, total depositado, divergência com tolerância de R$ 0,01, situações de conciliação, taxa esperada × cobrada e repasse de 27%. Dinheiro em centavos inteiros. 21 testes unitários (incluindo os exemplos do charter).
- **Feito nas Etapas 1–3:** Next.js 16 + TS + Tailwind (modo claro, pt-BR); zod; Drizzle ORM + PGlite; cadastros, contratos, histórico e competências (geração idempotente + fotografia); ESLint + Prettier; documentação.
- **Verificações (todas verdes):** `typecheck`, `lint`, **42 testes** (27 unitários + 15 de banco), 1 teste e2e, `build`.
- **Integração contínua:** GitHub Actions (`.github/workflows/ci.yml`) roda tudo na nuvem a cada push/PR — sem instalação local.

## Próximo passo proposto

**Etapa 5 — Movimentos e componentes do demonstrativo (persistência):** tabelas `bank_movements` e `statement_components` (e o catálogo `financial_component_types`), conectando o núcleo financeiro a dados reais — avaliar uma competência a partir do que está gravado, com testes de integração. **Aguardar aprovação antes de iniciar.**

## Fases (resumo)

- **Fase 1 — Núcleo financeiro utilizável:** [Fundação ✓] · autenticação sem senha e permissões; imobiliárias/imóveis/contratos; competências idempotentes; demonstrativos/depósitos; conciliação e divergências; atrasos; taxa de administração esperada × cobrada; movimentos/parciais; Carnê-Leão (processo); repasse 27%; dashboard; central de pendências; consulta histórica; auditoria; arquivamento.
- **Fase 2 — Operação, relatórios e produção:** anexos; observações; conciliação guiada; fechamento/reabertura; gráficos; cobrança assistida (sem OAuth); relatórios/exportações (incl. anual de IR); backup; acessibilidade; testes completos; segurança; desempenho; deploy; documentação final.

## Decisões e pendências

- Decisões técnicas registradas em `docs/DECISIONS.md`.
- Provedor de nuvem (Supabase × Neon; Vercel × Cloudflare Pages) será decidido só no deploy, revalidando limites/custos.
- `npm audit`: 2 avisos "moderate" (postcss transitivo do Next 16), sem correção segura; baixo risco prático.
- Se ainda existir no GitHub, a branch remota obsoleta `claude/claude-md-setup-mo2w6a` pode ser apagada pelo site (a exclusão via git foi bloqueada por 403 neste ambiente); a branch local já foi removida.
