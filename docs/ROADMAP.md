# ROADMAP — Controle de Aluguéis

> Memória viva do projeto. No início de cada sessão (`/inicie`), releia este arquivo, o `CLAUDE.md` e o log do git para recuperar o estado. Atualize-o no encerramento (`/encerre`).

## Situação atual (2026-07-14)

- **Estágio:** Fase 1 em andamento. **Etapa 1 — Fundação: concluída e aprovada em planejamento.**
- **Feito:** charter (`CLAUDE.md` v03); esqueleto Next.js 16 + TypeScript + Tailwind v4 (modo claro, pt-BR); validação de variáveis com zod; utilitário de formatação em reais; testes (Vitest + Playwright) passando; ESLint + Prettier; `.env.example`; documentação inicial completa em `docs/`.
- **Verificações (todas verdes):** `typecheck`, `lint`, 6 testes unitários, 1 teste e2e, `build` de produção.

## Próximo passo proposto

**Etapa 2 — Banco de dados e modelo inicial:** configurar PostgreSQL local (Docker) + Drizzle; criar as primeiras migrações do modelo de dados (ver `docs/DATA_MODEL.md`), começando pelas entidades de cadastro e pelas competências; testes de integração. **Aguardar aprovação antes de iniciar.**

## Fases (resumo)

- **Fase 1 — Núcleo financeiro utilizável:** [Fundação ✓] · autenticação sem senha e permissões; imobiliárias/imóveis/contratos; competências idempotentes; demonstrativos/depósitos; conciliação e divergências; atrasos; taxa de administração esperada × cobrada; movimentos/parciais; Carnê-Leão (processo); repasse 27%; dashboard; central de pendências; consulta histórica; auditoria; arquivamento.
- **Fase 2 — Operação, relatórios e produção:** anexos; observações; conciliação guiada; fechamento/reabertura; gráficos; cobrança assistida (sem OAuth); relatórios/exportações (incl. anual de IR); backup; acessibilidade; testes completos; segurança; desempenho; deploy; documentação final.

## Decisões e pendências

- Decisões técnicas registradas em `docs/DECISIONS.md`.
- Provedor de nuvem (Supabase × Neon; Vercel × Cloudflare Pages) será decidido só no deploy, revalidando limites/custos.
- `npm audit`: 2 avisos "moderate" (postcss transitivo do Next 16), sem correção segura; baixo risco prático.
- Se ainda existir no GitHub, a branch remota obsoleta `claude/claude-md-setup-mo2w6a` pode ser apagada pelo site (a exclusão via git foi bloqueada por 403 neste ambiente); a branch local já foi removida.
