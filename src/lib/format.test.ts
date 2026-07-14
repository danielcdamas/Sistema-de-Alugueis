import { describe, it, expect } from "vitest";
import { formatarReais } from "./format";

describe("formatarReais", () => {
  it("formata inteiros com duas casas", () => {
    expect(formatarReais(1985)).toBe("R$ 1.985,00");
  });

  it("formata valores com centavos", () => {
    expect(formatarReais(1835.5)).toBe("R$ 1.835,50");
  });

  it("formata zero", () => {
    expect(formatarReais(0)).toBe("R$ 0,00");
  });
});
