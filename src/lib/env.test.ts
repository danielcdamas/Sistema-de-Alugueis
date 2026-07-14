import { describe, it, expect } from "vitest";
import { parseEnv } from "./env";

describe("parseEnv", () => {
  it("aceita NODE_ENV válido", () => {
    expect(parseEnv({ NODE_ENV: "production" }).NODE_ENV).toBe("production");
  });

  it("usa 'development' como padrão quando NODE_ENV está ausente", () => {
    expect(parseEnv({}).NODE_ENV).toBe("development");
  });

  it("rejeita NODE_ENV inválido com mensagem clara", () => {
    expect(() => parseEnv({ NODE_ENV: "prod" })).toThrowError(
      /Variáveis de ambiente inválidas ou ausentes/,
    );
  });
});
