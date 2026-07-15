import { eq } from "drizzle-orm";
import type { Db } from "./client";
import { bankMovements, statementComponents } from "./schema";
import {
  reaisParaCentavos,
  avaliarCompetencia,
  type Centavos,
  type ComponentesDemonstrativo,
  type Movimento,
  type TipoMovimento,
} from "../lib/financeiro";

// Mapeia o "kind" persistido para o campo correspondente do cálculo base.
// Componentes fora deste mapa (multa, juros, informativos, etc.) ainda não
// entram na fórmula base e serão tratados quando o cálculo os incorporar.
const KIND_PARA_CAMPO: Partial<Record<string, keyof ComponentesDemonstrativo>> =
  {
    bruto_devido: "brutoDevido",
    taxa_admin: "taxaAdminCobrada",
    taxa_bancaria: "taxaBancaria",
    taxa_extra: "taxaExtra",
    fundo_reserva: "fundoReserva",
    ressarcimento_iptu: "ressarcimentoIptu",
  };

/** Carrega e soma (por tipo) os componentes do demonstrativo de uma competência. */
export async function carregarComponentes(
  db: Db,
  periodId: string,
): Promise<ComponentesDemonstrativo> {
  const linhas = await db
    .select()
    .from(statementComponents)
    .where(eq(statementComponents.monthlyRentPeriodId, periodId));

  const componentes: ComponentesDemonstrativo = { brutoDevido: 0 };
  for (const linha of linhas) {
    const campo = KIND_PARA_CAMPO[linha.kind];
    if (!campo) continue;
    const atual: Centavos = componentes[campo] ?? 0;
    componentes[campo] = atual + reaisParaCentavos(linha.value);
  }
  return componentes;
}

/** Carrega os movimentos bancários de uma competência. */
export async function carregarMovimentos(
  db: Db,
  periodId: string,
): Promise<Movimento[]> {
  const linhas = await db
    .select()
    .from(bankMovements)
    .where(eq(bankMovements.monthlyRentPeriodId, periodId));

  return linhas.map((l) => ({
    tipo: l.tipo as TipoMovimento,
    valorCentavos: reaisParaCentavos(l.value),
  }));
}

/** Avalia uma competência a partir dos dados persistidos no banco. */
export async function avaliarCompetenciaPersistida(
  db: Db,
  periodId: string,
  opcoes: { toleranciaCentavos?: Centavos; emAberto?: boolean } = {},
) {
  const componentes = await carregarComponentes(db, periodId);
  const movimentos = await carregarMovimentos(db, periodId);
  return avaliarCompetencia(componentes, movimentos, opcoes);
}
