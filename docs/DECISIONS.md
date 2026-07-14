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

## 2026-07-14 — Etapa 2 (Banco de dados)

- **ORM:** Drizzle ORM (`drizzle-orm`) + Drizzle Kit (`drizzle-kit`) para gerar migrações SQL a partir do schema.
- **Banco de dev/teste:** **PGlite** (`@electric-sql/pglite`) — PostgreSQL embutido, em processo, sem servidor nem instalação. Escolhido para atender à restrição de "tudo na nuvem, nada instalado localmente": os testes de banco rodam aqui e no CI apenas com Node. Substitui o "PostgreSQL local via Docker" cogitado no plano inicial.
- **Portabilidade:** o schema é PostgreSQL padrão; produção usará um Postgres gerenciado (Neon/Supabase/Vercel) com as **mesmas migrações**, trocando só o driver.
- **Estratégia de teste de banco:** um PGlite em memória compartilhado por arquivo de teste (o custo de compilação WASM é pago uma vez), com as tabelas limpas entre os testes; tempos-limite do Vitest ampliados (`testTimeout` 20s, `hookTimeout` 30s) por causa da inicialização WASM.
- **Primeiras tabelas:** `real_estate_agencies` e `properties`, com arquivamento lógico e FK `ON DELETE restrict`.

## 2026-07-14 — Etapa 3 (Contratos e competências)

- **Competência** representada por dois inteiros (`competencia_ano` e `competencia_mes`, com CHECK 1..12), não por uma data — reforça que competência é um _mês_, não um instante, e evita ambiguidade de fuso.
- **Idempotência** da geração garantida por `UNIQUE(property_id, ano, mês)` + `onConflictDoNothing` (função `ensureMonthlyPeriod` em `src/db/periods.ts`).
- **Fotografia:** a competência copia as regras do contrato (valor, taxa, dia de vencimento, regra de fim de semana) no momento da geração; mudanças posteriores no contrato não alteram competências já criadas.
- **IPTU:** campo `iptu_config` (`jsonb`) reservado no contrato; a estrutura será definida na etapa de IPTU.

## 2026-07-14 — Etapa 4 (Núcleo financeiro)

- **Dinheiro em centavos inteiros** (`Centavos = number`), nunca ponto flutuante. Somas e subtrações são exatas; as porcentagens (taxa de administração, repasse) usam divisão inteira com arredondamento **meio para cima** (afastando de zero).
- **Funções puras** em `src/lib/financeiro.ts` (sem banco), cobertas por 21 testes que incluem os exemplos do charter.
- **Tolerância de conciliação** padrão = 1 centavo (R$ 0,01), configurável.
- **"Parcial" × "recebido a menor":** ambos têm total abaixo do esperado; a distinção depende de a competência estar "em aberto" (parâmetro `emAberto`) — é decisão de situação, não de aritmética.

## Pendências conhecidas
- 2 avisos "moderate" do `npm audit` vindos do `postcss` transitivo dentro do Next 16; a correção sugerida rebaixaria o Next (inviável). Baixo risco prático; reavaliar quando o Next atualizar o postcss.
