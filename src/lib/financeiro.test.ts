import { describe, it, expect } from "vitest";
import {
  reaisParaCentavos,
  formatarCentavos,
  percentualDeCentavos,
  calcularLiquidoTributavel,
  calcularEsperadoParaDeposito,
  calcularTotalDepositado,
  calcularDivergencia,
  classificarConciliacao,
  taxaAdminEsperada,
  compararTaxaAdmin,
  calcularRepasse,
  avaliarCompetencia,
} from "./financeiro";

const R = reaisParaCentavos; // atalho para deixar os testes legíveis

describe("reaisParaCentavos", () => {
  it("converte strings decimais de forma exata", () => {
    expect(R("2000.00")).toBe(200000);
    expect(R("1835.50")).toBe(183550);
    expect(R("0.01")).toBe(1);
    expect(R("160")).toBe(16000);
    expect(R("-200.00")).toBe(-20000);
  });

  it("aceita números e vírgula como separador decimal", () => {
    expect(R(2000)).toBe(200000);
    expect(R("1985,00")).toBe(198500);
  });
});

describe("formatarCentavos", () => {
  it("formata em reais", () => {
    expect(formatarCentavos(198500)).toBe("R$ 1.985,00");
    expect(formatarCentavos(45)).toBe("R$ 0,45");
  });
});

describe("percentualDeCentavos (arredondamento meio para cima)", () => {
  it("calcula percentuais exatos", () => {
    expect(percentualDeCentavos(R("2000.00"), "8.00")).toBe(R("160.00"));
    expect(percentualDeCentavos(R("1835.00"), 27)).toBe(R("495.45"));
  });

  it("arredonda meio para cima", () => {
    // 50% de R$ 0,01 = R$ 0,005 -> arredonda para R$ 0,01
    expect(percentualDeCentavos(R("0.01"), "50.00")).toBe(1);
  });
});

describe("líquido tributável e esperado para depósito", () => {
  const componentes = {
    brutoDevido: R("2000.00"),
    taxaAdminCobrada: R("160.00"),
    taxaBancaria: R("5.00"),
    ressarcimentoIptu: R("150.00"),
  };

  it("líquido = bruto − adm − banco − extra − fundo", () => {
    expect(calcularLiquidoTributavel(componentes)).toBe(R("1835.00"));
  });

  it("esperado = líquido + ressarcimento de IPTU", () => {
    expect(calcularEsperadoParaDeposito(componentes)).toBe(R("1985.00"));
  });
});

describe("total depositado (movimentos com sinais)", () => {
  it("soma depósito único", () => {
    expect(
      calcularTotalDepositado([
        { tipo: "deposito", valorCentavos: R("1985.00") },
      ]),
    ).toBe(R("1985.00"));
  });

  it("soma dois depósitos parciais", () => {
    expect(
      calcularTotalDepositado([
        { tipo: "deposito", valorCentavos: R("1000.00") },
        { tipo: "deposito", valorCentavos: R("985.00") },
      ]),
    ).toBe(R("1985.00"));
  });

  it("subtrai estornos e devoluções", () => {
    expect(
      calcularTotalDepositado([
        { tipo: "deposito", valorCentavos: R("1985.00") },
        { tipo: "estorno", valorCentavos: R("200.00") },
      ]),
    ).toBe(R("1785.00"));
  });
});

describe("divergência, tolerância e situações", () => {
  const esperado = R("1985.00");

  it("dentro da tolerância de R$ 0,01 → conciliado", () => {
    expect(
      classificarConciliacao({
        esperadoCentavos: esperado,
        totalDepositadoCentavos: esperado + 1,
      }).situacao,
    ).toBe("conciliado");
    expect(
      classificarConciliacao({
        esperadoCentavos: esperado,
        totalDepositadoCentavos: esperado - 1,
      }).situacao,
    ).toBe("conciliado");
  });

  it("acima da tolerância → recebido a maior / a menor", () => {
    expect(
      classificarConciliacao({
        esperadoCentavos: esperado,
        totalDepositadoCentavos: esperado + 2,
      }).situacao,
    ).toBe("recebido_a_maior");
    expect(
      classificarConciliacao({
        esperadoCentavos: esperado,
        totalDepositadoCentavos: esperado - 2,
      }).situacao,
    ).toBe("recebido_a_menor");
  });

  it("total abaixo do esperado com competência em aberto → parcial", () => {
    expect(
      classificarConciliacao({
        esperadoCentavos: esperado,
        totalDepositadoCentavos: R("1000.00"),
        emAberto: true,
      }).situacao,
    ).toBe("parcial");
  });

  it("sem depósito → sem_deposito", () => {
    expect(
      classificarConciliacao({
        esperadoCentavos: esperado,
        totalDepositadoCentavos: 0,
      }).situacao,
    ).toBe("sem_deposito");
  });

  it("calcularDivergencia = total − esperado", () => {
    expect(calcularDivergencia(R("1785.00"), esperado)).toBe(R("-200.00"));
  });
});

describe("taxa de administração esperada × cobrada", () => {
  it("esperada = bruto × percentual", () => {
    expect(taxaAdminEsperada(R("2000.00"), "8.00")).toBe(R("160.00"));
  });

  it("sinaliza divergência entre esperada e cobrada", () => {
    expect(
      compararTaxaAdmin({
        esperadaCentavos: R("160.00"),
        cobradaCentavos: R("160.00"),
      }).divergente,
    ).toBe(false);
    const r = compararTaxaAdmin({
      esperadaCentavos: R("160.00"),
      cobradaCentavos: R("165.00"),
    });
    expect(r.divergente).toBe(true);
    expect(r.diferencaCentavos).toBe(R("5.00"));
  });
});

describe("repasse (27%)", () => {
  it("repasse da Sala da Contorno = líquido realizado × 27%", () => {
    expect(calcularRepasse(R("1835.00"))).toBe(R("495.45"));
  });
});

describe("avaliarCompetencia — exemplos do charter", () => {
  const componentes = {
    brutoDevido: R("2000.00"),
    taxaAdminCobrada: R("160.00"),
    taxaBancaria: R("5.00"),
    ressarcimentoIptu: R("150.00"),
  };

  it("conciliado limpo: depósito único de R$ 1.985,00", () => {
    const r = avaliarCompetencia(componentes, [
      { tipo: "deposito", valorCentavos: R("1985.00") },
    ]);
    expect(r.liquidoTributavel).toBe(R("1835.00"));
    expect(r.esperadoParaDeposito).toBe(R("1985.00"));
    expect(r.totalDepositado).toBe(R("1985.00"));
    expect(r.divergencia).toBe(0);
    expect(r.situacao).toBe("conciliado");
  });

  it("parcial: primeiro depósito de R$ 1.000,00 (em aberto)", () => {
    const r = avaliarCompetencia(
      componentes,
      [{ tipo: "deposito", valorCentavos: R("1000.00") }],
      { emAberto: true },
    );
    expect(r.totalDepositado).toBe(R("1000.00"));
    expect(r.divergencia).toBe(R("-985.00"));
    expect(r.situacao).toBe("parcial");
  });

  it("estorno recebido a menor: depósito 1.985 e estorno 200", () => {
    const r = avaliarCompetencia(componentes, [
      { tipo: "deposito", valorCentavos: R("1985.00") },
      { tipo: "estorno", valorCentavos: R("200.00") },
    ]);
    expect(r.totalDepositado).toBe(R("1785.00"));
    expect(r.divergencia).toBe(R("-200.00"));
    expect(r.situacao).toBe("recebido_a_menor");
  });
});
