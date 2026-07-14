import { formatarReais } from "./format";

/**
 * Núcleo financeiro — funções puras (sem banco, sem efeitos colaterais).
 *
 * Regra de ouro: dinheiro é representado em **centavos inteiros** (`Centavos`),
 * nunca em ponto flutuante. As porcentagens usam arredondamento "meio para
 * cima" (afastando de zero). As fórmulas seguem `docs/BUSINESS_RULES.md`.
 */

/** Valor monetário em centavos inteiros. */
export type Centavos = number;

export type TipoMovimento =
  | "deposito"
  | "complemento"
  | "estorno"
  | "devolucao"
  | "compensacao"
  | "ajuste";

// Sinal de cada tipo no cálculo do total depositado. Para "compensacao" e
// "ajuste", use valor negativo para representar uma redução.
const SINAL_MOVIMENTO: Record<TipoMovimento, 1 | -1> = {
  deposito: 1,
  complemento: 1,
  estorno: -1,
  devolucao: -1,
  compensacao: 1,
  ajuste: 1,
};

export type Movimento = { tipo: TipoMovimento; valorCentavos: Centavos };

export type ComponentesDemonstrativo = {
  brutoDevido: Centavos;
  taxaAdminCobrada?: Centavos;
  taxaBancaria?: Centavos;
  taxaExtra?: Centavos;
  fundoReserva?: Centavos;
  ressarcimentoIptu?: Centavos;
};

export type SituacaoConciliacao =
  | "sem_deposito"
  | "conciliado"
  | "recebido_a_maior"
  | "recebido_a_menor"
  | "parcial";

/**
 * Converte um valor em reais (string "2000.00" / "1.985,00" simples, ou número
 * 2000) para centavos inteiros. Para valores vindos do banco (string decimal),
 * o cálculo é exato.
 */
export function reaisParaCentavos(valor: string | number): Centavos {
  if (typeof valor === "number") {
    return Math.round(valor * 100);
  }
  const texto = valor.trim().replace(",", ".");
  const negativo = texto.startsWith("-");
  const semSinal = negativo ? texto.slice(1) : texto;
  const [inteiro = "0", frac = ""] = semSinal.split(".");
  const centavos = Number(inteiro) * 100 + Number((frac + "00").slice(0, 2));
  return negativo ? -centavos : centavos;
}

/** Formata centavos inteiros como reais (ex.: 198500 → "R$ 1.985,00"). */
export function formatarCentavos(centavos: Centavos): string {
  return formatarReais(centavos / 100);
}

// Divisão inteira com arredondamento "meio para cima" (afastando de zero).
// Requer denominador par (usamos 10000).
function arredondarDivisao(numerador: number, denominador: number): number {
  const sinal = numerador < 0 ? -1 : 1;
  const abs = Math.abs(numerador);
  return sinal * Math.floor((abs + denominador / 2) / denominador);
}

/** Percentual de um valor em centavos (ex.: 8% de 200000 = 16000). */
export function percentualDeCentavos(
  baseCentavos: Centavos,
  percentual: string | number,
): Centavos {
  // "8.00" -> 800 centésimos de por cento; 800 / 10000 = 0,08.
  const centesimosDePorCento = reaisParaCentavos(percentual);
  return arredondarDivisao(baseCentavos * centesimosDePorCento, 10000);
}

/** Aluguel líquido tributável = bruto − adm cobrada − banco − extra − fundo. */
export function calcularLiquidoTributavel(
  c: ComponentesDemonstrativo,
): Centavos {
  return (
    c.brutoDevido -
    (c.taxaAdminCobrada ?? 0) -
    (c.taxaBancaria ?? 0) -
    (c.taxaExtra ?? 0) -
    (c.fundoReserva ?? 0)
  );
}

/** Valor esperado para depósito = líquido tributável + ressarcimento de IPTU. */
export function calcularEsperadoParaDeposito(
  c: ComponentesDemonstrativo,
): Centavos {
  return calcularLiquidoTributavel(c) + (c.ressarcimentoIptu ?? 0);
}

/** Total efetivamente depositado, somando os movimentos com seus sinais. */
export function calcularTotalDepositado(movimentos: Movimento[]): Centavos {
  return movimentos.reduce(
    (soma, m) => soma + SINAL_MOVIMENTO[m.tipo] * m.valorCentavos,
    0,
  );
}

/** Divergência = total depositado − valor esperado para depósito. */
export function calcularDivergencia(
  totalDepositado: Centavos,
  esperadoParaDeposito: Centavos,
): Centavos {
  return totalDepositado - esperadoParaDeposito;
}

/**
 * Classifica a conciliação a partir do esperado e do total depositado.
 *
 * `toleranciaCentavos` padrão = 1 (R$ 0,01). `emAberto` indica que a competência
 * ainda aceita novos depósitos: nesse caso, um total abaixo do esperado é
 * "parcial"; do contrário, é "recebido a menor".
 */
export function classificarConciliacao(params: {
  esperadoCentavos: Centavos;
  totalDepositadoCentavos: Centavos;
  toleranciaCentavos?: Centavos;
  emAberto?: boolean;
}): { divergenciaCentavos: Centavos; situacao: SituacaoConciliacao } {
  const {
    esperadoCentavos,
    totalDepositadoCentavos,
    toleranciaCentavos = 1,
    emAberto = false,
  } = params;
  const divergenciaCentavos = calcularDivergencia(
    totalDepositadoCentavos,
    esperadoCentavos,
  );

  if (totalDepositadoCentavos <= 0) {
    return { divergenciaCentavos, situacao: "sem_deposito" };
  }
  if (Math.abs(divergenciaCentavos) <= toleranciaCentavos) {
    return { divergenciaCentavos, situacao: "conciliado" };
  }
  if (divergenciaCentavos > toleranciaCentavos) {
    return { divergenciaCentavos, situacao: "recebido_a_maior" };
  }
  return {
    divergenciaCentavos,
    situacao: emAberto ? "parcial" : "recebido_a_menor",
  };
}

/** Taxa de administração esperada = bruto devido × percentual. */
export function taxaAdminEsperada(
  brutoDevidoCentavos: Centavos,
  percentual: string | number,
): Centavos {
  return percentualDeCentavos(brutoDevidoCentavos, percentual);
}

/** Compara taxa esperada × cobrada, sinalizando divergência além da tolerância. */
export function compararTaxaAdmin(params: {
  esperadaCentavos: Centavos;
  cobradaCentavos: Centavos;
  toleranciaCentavos?: Centavos;
}): { diferencaCentavos: Centavos; divergente: boolean } {
  const { esperadaCentavos, cobradaCentavos, toleranciaCentavos = 1 } = params;
  const diferencaCentavos = cobradaCentavos - esperadaCentavos;
  return {
    diferencaCentavos,
    divergente: Math.abs(diferencaCentavos) > toleranciaCentavos,
  };
}

/** Repasse (padrão: 27%) sobre o aluguel líquido tributável realizado. */
export function calcularRepasse(
  liquidoTributavelRealizadoCentavos: Centavos,
  percentual: string | number = 27,
): Centavos {
  return percentualDeCentavos(liquidoTributavelRealizadoCentavos, percentual);
}

/** Avalia uma competência: líquido, esperado, total, divergência e situação. */
export function avaliarCompetencia(
  componentes: ComponentesDemonstrativo,
  movimentos: Movimento[],
  opcoes: { toleranciaCentavos?: Centavos; emAberto?: boolean } = {},
) {
  const liquidoTributavel = calcularLiquidoTributavel(componentes);
  const esperadoParaDeposito = calcularEsperadoParaDeposito(componentes);
  const totalDepositado = calcularTotalDepositado(movimentos);
  const { divergenciaCentavos, situacao } = classificarConciliacao({
    esperadoCentavos: esperadoParaDeposito,
    totalDepositadoCentavos: totalDepositado,
    toleranciaCentavos: opcoes.toleranciaCentavos,
    emAberto: opcoes.emAberto,
  });
  return {
    liquidoTributavel,
    esperadoParaDeposito,
    totalDepositado,
    divergencia: divergenciaCentavos,
    situacao,
  };
}
