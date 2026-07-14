/**
 * Formatação de valores monetários em reais (pt-BR), com duas casas decimais.
 *
 * IMPORTANTE: esta função é apenas para EXIBIÇÃO. A aritmética financeira usará
 * um tipo decimal seguro (definido na etapa do núcleo financeiro), nunca ponto
 * flutuante comum.
 */
const formatadorReais = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatarReais(valor: number): string {
  // Normaliza espaços não separáveis (NBSP/narrow NBSP) para espaço comum,
  // deixando a saída estável entre versões do ICU.
  return formatadorReais.format(valor).replace(/[  ]/g, " ");
}
