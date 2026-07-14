# DECISÕES TÉCNICAS — Controle de Aluguéis

Registro enxuto de decisões (estilo ADR): contexto curto + escolha + motivo. Decisões podem ser revistas; quando forem, registre a mudança aqui.

## 2026-07-14 — Etapa 1 (Fundação)

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript. Motivo: exigência do charter; renderização no servidor facilita proteger perfis (admin/leitor) e segredos no servidor. *Observação:* o `create-next-app` instalou o Next 16 (mais novo que material de treino comum); convenções seguem os arquivos gerados e `node_modules/next/dist/docs/`.
- **Estilos:** Tailwind CSS v4. **Apenas modo claro** (removido o dark-mode automático), conforme a especificação de interface clara/corporativa.
- **Fontes:** pilha de fontes do sistema (sem `next/font`/Google Fonts). Motivo: portabilidade e menos dependência de rede no build.
- **Localidade:** `lang="pt-BR"`; reais via `Intl.NumberFormat('pt-BR')`.
- **Validação de ambiente:** `zod` em `src/lib/env.ts`, com `parseEnv` testável, falha cedo e mensagem clara. `.env.example` versionado; `.env` no `.gitignore`.
- **Testes:** Vitest (unitários de funções puras) + Playwright (e2e, Chromium). Motivo: unitários são prioridade — é onde moram os bugs financeiros.
- **Dinheiro:** `formatarReais` cuida apenas de EXIBIÇÃO. A **aritmética decimal segura** será decidida na etapa do núcleo financeiro; nunca ponto flutuante.
- **ORM/banco (planejado):** Drizzle sobre PostgreSQL padrão; banco local em dev/teste. Ainda não implementado.
- **Provedor de nuvem (adiado):** Supabase × Neon e Vercel × Cloudflare Pages ficam para a etapa de deploy, revalidando limites/custos na data. A Fase 1 roda 100% local.
- **Qualidade de código:** ESLint (config do Next) + Prettier.

## Pendências conhecidas
- 2 avisos "moderate" do `npm audit` vindos do `postcss` transitivo dentro do Next 16; a correção sugerida rebaixaria o Next (inviável). Baixo risco prático; reavaliar quando o Next atualizar o postcss.
