# ROADMAP — Controle de Aluguéis

> Memória viva do projeto. No início de cada sessão (`/inicie`), releia este arquivo, o `CLAUDE.md` e o log do git para recuperar o estado. Atualize-o no encerramento (`/encerre`).

## Situação atual (2026-07-14)

- **Estágio:** Fase 1 em andamento. **Etapas 1 (Fundação) e 2 (Banco — cadastros): concluídas.**
- **Feito na Etapa 2:** Drizzle ORM + PGlite (PostgreSQL embutido, sem instalação); tabelas `real_estate_agencies` e `properties` com migração (`drizzle/`) e testes de integração; script `db:generate`.
- **Feito na Etapa 1:** esqueleto Next.js 16 + TypeScript + Tailwind v4 (modo claro, pt-BR); validação de variáveis com zod; utilitário de reais; ESLint + Prettier; documentação inicial.
- **Verificações (todas verdes):** `typecheck`, `lint`, **11 testes** (6 unitários + 5 de banco), 1 teste e2e, `build`.
- **Integração contínua:** GitHub Actions (`.github/workflows/ci.yml`) roda tudo na nuvem a cada push/PR — sem instalação local.

## Próximo passo proposto

**Etapa 3 — Contratos, histórico de imobiliária e competências:** tabelas `rental_contracts`, `property_agency_history` e `monthly_rent_periods` (com `UNIQUE(imóvel, competência)` para geração idempotente); testes de integração. Em seguida, o núcleo financeiro (fórmulas de conciliação) com testes unitários. **Aguardar aprovação antes de iniciar.**

## Fases (resumo)

- **Fase 1 — Núcleo financeiro utilizável:** [Fundação ✓] · autenticação sem senha e permissões; imobiliárias/imóveis/contratos; competências idempotentes; demonstrativos/depósitos; conciliação e divergências; atrasos; taxa de administração esperada × cobrada; movimentos/parciais; Carnê-Leão (processo); repasse 27%; dashboard; central de pendências; consulta histórica; auditoria; arquivamento.
- **Fase 2 — Operação, relatórios e produção:** anexos; observações; conciliação guiada; fechamento/reabertura; gráficos; cobrança assistida (sem OAuth); relatórios/exportações (incl. anual de IR); backup; acessibilidade; testes completos; segurança; desempenho; deploy; documentação final.

## Decisões e pendências

- Decisões técnicas registradas em `docs/DECISIONS.md`.
- Provedor de nuvem (Supabase × Neon; Vercel × Cloudflare Pages) será decidido só no deploy, revalidando limites/custos.
- `npm audit`: 2 avisos "moderate" (postcss transitivo do Next 16), sem correção segura; baixo risco prático.
- Se ainda existir no GitHub, a branch remota obsoleta `claude/claude-md-setup-mo2w6a` pode ser apagada pelo site (a exclusão via git foi bloqueada por 403 neste ambiente); a branch local já foi removida.
