# ROADMAP — Controle de Aluguéis

> Memória viva do projeto. No início de cada sessão (`/inicie`), releia este arquivo, o `CLAUDE.md` e o log do git para recuperar o estado. Atualize-o no encerramento (`/encerre`).

## Situação atual (2026-07-14)

- **Estágio:** Fase 1 em andamento. **Etapas 1–5 concluídas** (Fundação; Banco/cadastros; Contratos/competências; Núcleo financeiro; **Persistência de movimentos/componentes + conciliação sobre dados reais**).
- **Feito na Etapa 5:** tabelas `bank_movements` e `statement_components` (com CHECKs); ponte `avaliarCompetenciaPersistida` (`src/db/conciliacao.ts`) que avalia uma competência a partir do que está gravado; testes de integração conectando banco ↔ núcleo financeiro.
- **Feito nas Etapas 1–4:** Next.js 16 + TS + Tailwind (modo claro, pt-BR); zod; Drizzle + PGlite; cadastros, contratos e competências; núcleo financeiro (funções puras); ESLint + Prettier; documentação.
- **Verificações (todas verdes):** `typecheck`, `lint`, **48 testes** (27 unitários + 21 de banco), 1 teste e2e, `build`.
- **Integração contínua:** GitHub Actions (`.github/workflows/ci.yml`) roda tudo na nuvem a cada push/PR — sem instalação local.

## Próximo passo proposto

**Etapa 6 — Autenticação sem senha e perfis (admin/leitor):** login por link mágico/código, com perfil verificado no servidor/banco e controle de acesso. Em desenvolvimento, o link será exibido no console do servidor (sem provedor de e-mail — este fica para o deploy). Decisão a combinar antes de codar: abordagem de autenticação (implementação própria portável × Auth.js). **Aguardar aprovação antes de iniciar.**

## Fases (resumo)

- **Fase 1 — Núcleo financeiro utilizável:** [Fundação ✓] · autenticação sem senha e permissões; imobiliárias/imóveis/contratos; competências idempotentes; demonstrativos/depósitos; conciliação e divergências; atrasos; taxa de administração esperada × cobrada; movimentos/parciais; Carnê-Leão (processo); repasse 27%; dashboard; central de pendências; consulta histórica; auditoria; arquivamento.
- **Fase 2 — Operação, relatórios e produção:** anexos; observações; conciliação guiada; fechamento/reabertura; gráficos; cobrança assistida (sem OAuth); relatórios/exportações (incl. anual de IR); backup; acessibilidade; testes completos; segurança; desempenho; deploy; documentação final.

## Decisões e pendências

- Decisões técnicas registradas em `docs/DECISIONS.md`.
- Provedor de nuvem (Supabase × Neon; Vercel × Cloudflare Pages) será decidido só no deploy, revalidando limites/custos.
- `npm audit`: 2 avisos "moderate" (postcss transitivo do Next 16), sem correção segura; baixo risco prático.
- Se ainda existir no GitHub, a branch remota obsoleta `claude/claude-md-setup-mo2w6a` pode ser apagada pelo site (a exclusão via git foi bloqueada por 403 neste ambiente); a branch local já foi removida.
