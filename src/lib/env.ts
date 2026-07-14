import { z } from "zod";

/**
 * Validação das variáveis de ambiente (apenas servidor).
 *
 * Falha cedo e com mensagem clara se alguma variável estiver ausente ou
 * inválida. Novas variáveis (banco de dados, autenticação, e-mail) serão
 * adicionadas nas etapas correspondentes — nesta fundação o núcleo ainda não
 * exige segredos.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  // Exemplos de variáveis futuras (descomentar na etapa correspondente):
  // DATABASE_URL: z.string().url(),
  // AUTH_SECRET: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Valida um conjunto de variáveis de ambiente. Recebe a origem como parâmetro
 * para ser testável; por padrão usa `process.env`.
 */
export function parseEnv(
  source: Record<string, string | undefined> = process.env,
): Env {
  const resultado = envSchema.safeParse(source);
  if (!resultado.success) {
    const detalhes = resultado.error.issues
      .map((i) => `  - ${i.path.join(".") || "(raiz)"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Variáveis de ambiente inválidas ou ausentes:\n${detalhes}\n` +
        `Confira o arquivo .env.example e o seu .env.`,
    );
  }
  return resultado.data;
}

/** Variáveis de ambiente já validadas, prontas para uso no servidor. */
export const env = parseEnv();
