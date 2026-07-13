# ROADMAP — Controle de Aluguéis

> Memória viva do projeto. No início de cada sessão (`/inicie`), releia este arquivo, o `CLAUDE.md` e o log do git para recuperar o estado. Atualize-o no encerramento (`/encerre`).

## Situação atual (2026-07-13)

- **Estágio:** fundação/preparação. Ainda **antes** do gate de arquitetura (`<gate_plan_before_code>` do `CLAUDE.md`).
- **Feito até aqui:** charter do projeto definido no `CLAUDE.md` (versão enxuta v03), na branch `main`.
- **Ainda não existe** código de aplicação, dependências, banco, migrações nem os demais documentos de `docs/`.

## Próximo passo (ao retomar)

1. Produzir a resposta de `<first_response>` do `CLAUDE.md` — o plano de arquitetura em 13 pontos (entendimento; decisões; riscos; arquitetura; portabilidade; modelo de dados; regras financeiras; fases; custos; ações automáticas; ações externas; informações indispensáveis; próximo passo).
2. **Parar e aguardar a aprovação explícita da arquitetura** pelo usuário antes de escrever qualquer código.

## Fases (resumo do CLAUDE.md)

- **Fase 1 — Núcleo financeiro utilizável:** autenticação sem senha e permissões; imobiliárias, imóveis e contratos; competências mensais idempotentes; demonstrativos e depósitos independentes; modelo financeiro e conciliação; divergências; atrasos; taxa de administração esperada × cobrada; pagamentos parciais e movimentos; Carnê-Leão (controle de processo); repasse de 27% da Sala da Contorno; dashboard; central de pendências; consulta histórica; auditoria; arquivamento lógico.
- **Fase 2 — Operação, relatórios e produção:** anexos; observações mensais; conciliação guiada; fechamento/reabertura de mês; gráficos; cobrança assistida por Gmail (sem OAuth); relatórios e exportações (incl. anual de IR); backup simplificado; acessibilidade; testes completos; segurança; desempenho; deploy; documentação final.

## Pendências de organização (não bloqueiam o desenvolvimento)

- A branch remota obsoleta `claude/claude-md-setup-mo2w6a` ainda existe no GitHub. A exclusão via `git push` foi bloqueada neste ambiente (HTTP 403); pode ser apagada pelo site do GitHub quando for conveniente. A branch local correspondente já foi removida.
- Os demais documentos de `docs/` (PRODUCT_SPEC, BUSINESS_RULES, DATA_MODEL, DECISIONS, TEST_PLAN, DEPLOYMENT, USER_MANUAL) serão criados conforme as fases avançarem, começando pela aprovação da arquitetura.
