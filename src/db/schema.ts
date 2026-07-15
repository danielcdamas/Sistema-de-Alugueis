import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  smallint,
  date,
  numeric,
  jsonb,
  check,
  unique,
} from "drizzle-orm/pg-core";

/**
 * Esquema do banco (PostgreSQL). Convenções: chave primária `uuid`; timestamps
 * `created_at`/`updated_at`; **arquivamento lógico** via `archived_at` (nunca
 * DELETE em dado de negócio); valores monetários em `numeric` (o Drizzle os
 * devolve como string, preservando a precisão decimal — nunca ponto flutuante).
 */

/** Imobiliárias. */
export const realEstateAgencies = pgTable("real_estate_agencies", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Identificador interno legível (ex.: "IMOB-001"). */
  internalCode: text("internal_code").notNull().unique(),
  name: text("name").notNull(),
  displayName: text("display_name"),
  primaryEmail: text("primary_email"),
  additionalEmails: text("additional_emails").array(),
  phone: text("phone"),
  contactPerson: text("contact_person"),
  notes: text("notes"),
  /** Arquivamento lógico: nulo = ativa; preenchido = arquivada. */
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Imóveis. */
export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Identificador interno legível (ex.: "IMV-001"). */
  internalCode: text("internal_code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  /** Unidade federativa (UF). */
  state: text("state"),
  city: text("city"),
  /**
   * Imobiliária atual. O histórico de trocas fica em `property_agency_history`.
   * Restrição de exclusão: uma imobiliária com imóveis vinculados não pode ser
   * removida (usamos arquivamento lógico).
   */
  currentAgencyId: uuid("current_agency_id").references(
    () => realEstateAgencies.id,
    { onDelete: "restrict" },
  ),
  notes: text("notes"),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Contratos de locação. */
export const rentalContracts = pgTable(
  "rental_contracts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "restrict" }),
    /** Imobiliária responsável pelo contrato. */
    agencyId: uuid("agency_id")
      .notNull()
      .references(() => realEstateAgencies.id, { onDelete: "restrict" }),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    /** Valor contratual do aluguel (decimal). */
    contractValue: numeric("contract_value", {
      precision: 12,
      scale: 2,
    }).notNull(),
    /** Dia de vencimento (1..31). */
    dueDay: smallint("due_day").notNull(),
    /** Regra p/ fim de semana/feriado: manter | antecipar | proximo_dia_util. */
    weekendHolidayRule: text("weekend_holiday_rule")
      .notNull()
      .default("proximo_dia_util"),
    /** Índice de reajuste (ex.: "IGPM", "IPCA"). */
    adjustmentIndex: text("adjustment_index"),
    adjustmentBaseDate: date("adjustment_base_date"),
    /** Percentual esperado da taxa de administração (ex.: 8.00). */
    adminFeePercent: numeric("admin_fee_percent", {
      precision: 5,
      scale: 2,
    }).notNull(),
    /** Configuração de IPTU — estrutura a definir na etapa de IPTU. */
    iptuConfig: jsonb("iptu_config"),
    status: text("status").notNull().default("ativo"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    check("rental_contracts_due_day_check", sql`${t.dueDay} between 1 and 31`),
    check(
      "rental_contracts_weekend_rule_check",
      sql`${t.weekendHolidayRule} in ('manter', 'antecipar', 'proximo_dia_util')`,
    ),
    check("rental_contracts_admin_fee_check", sql`${t.adminFeePercent} >= 0`),
  ],
);

/** Histórico de imobiliárias por imóvel (preserva os períodos). */
export const propertyAgencyHistory = pgTable("property_agency_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "restrict" }),
  agencyId: uuid("agency_id")
    .notNull()
    .references(() => realEstateAgencies.id, { onDelete: "restrict" }),
  startDate: date("start_date").notNull(),
  /** Nulo = período atual (ainda vigente). */
  endDate: date("end_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Competências mensais (uma por imóvel + mês). Guarda uma FOTOGRAFIA das regras
 * do contrato vigente no momento da geração — mudanças futuras no contrato não
 * alteram competências já criadas. Unicidade por (imóvel, ano, mês) garante a
 * geração idempotente.
 */
export const monthlyRentPeriods = pgTable(
  "monthly_rent_periods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "restrict" }),
    /** Contrato que originou a competência (fonte da fotografia). */
    contractId: uuid("contract_id").references(() => rentalContracts.id, {
      onDelete: "restrict",
    }),
    /** Imobiliária do período (fotografia). */
    agencyId: uuid("agency_id").references(() => realEstateAgencies.id, {
      onDelete: "restrict",
    }),
    /** Competência: ano e mês a que o aluguel pertence (não é a data do depósito). */
    competenciaAno: integer("competencia_ano").notNull(),
    competenciaMes: smallint("competencia_mes").notNull(),
    // --- Fotografia das regras do contrato ---
    expectedGrossRent: numeric("expected_gross_rent", {
      precision: 12,
      scale: 2,
    }),
    adminFeePercent: numeric("admin_fee_percent", { precision: 5, scale: 2 }),
    dueDay: smallint("due_day"),
    weekendHolidayRule: text("weekend_holiday_rule"),
    // --- Situação e origem ---
    status: text("status").notNull().default("previsto"),
    /** Origem: automatica | manual. */
    origin: text("origin").notNull().default("automatica"),
    /** Usuário que gerou (nulo enquanto não há autenticação). */
    createdBy: uuid("created_by"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("monthly_rent_periods_competencia_unique").on(
      t.propertyId,
      t.competenciaAno,
      t.competenciaMes,
    ),
    check(
      "monthly_rent_periods_mes_check",
      sql`${t.competenciaMes} between 1 and 12`,
    ),
  ],
);

/** Movimentos bancários de uma competência (depósito, estorno, etc.). */
export const bankMovements = pgTable(
  "bank_movements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    monthlyRentPeriodId: uuid("monthly_rent_period_id")
      .notNull()
      .references(() => monthlyRentPeriods.id, { onDelete: "restrict" }),
    tipo: text("tipo").notNull(),
    /** Valor do movimento. Magnitude positiva; compensação/ajuste podem ser negativos. */
    value: numeric("value", { precision: 12, scale: 2 }).notNull(),
    movementDate: date("movement_date"),
    description: text("description"),
    proofUrl: text("proof_url"),
    origin: text("origin").notNull().default("manual"),
    createdBy: uuid("created_by"),
    notes: text("notes"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    check(
      "bank_movements_tipo_check",
      sql`${t.tipo} in ('deposito', 'complemento', 'estorno', 'devolucao', 'compensacao', 'ajuste')`,
    ),
    // Tipos de sinal fixo exigem valor não-negativo; compensação/ajuste podem ser negativos.
    check(
      "bank_movements_value_sign_check",
      sql`${t.tipo} in ('compensacao', 'ajuste') or ${t.value} >= 0`,
    ),
  ],
);

/** Componentes do demonstrativo de uma competência (linhas de valores). */
export const statementComponents = pgTable(
  "statement_components",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    monthlyRentPeriodId: uuid("monthly_rent_period_id")
      .notNull()
      .references(() => monthlyRentPeriods.id, { onDelete: "restrict" }),
    /** Tipo do componente (ex.: bruto_devido, taxa_admin, ressarcimento_iptu). */
    kind: text("kind").notNull(),
    value: numeric("value", { precision: 12, scale: 2 }).notNull(),
    description: text("description"),
    createdBy: uuid("created_by"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    check(
      "statement_components_kind_check",
      sql`${t.kind} in ('bruto_devido', 'ressarcimento_iptu', 'taxa_admin', 'taxa_bancaria', 'taxa_extra', 'fundo_reserva', 'multa', 'juros', 'desconto', 'retencao', 'outro_acrescimo', 'outro_desconto', 'informativo')`,
    ),
    check("statement_components_value_check", sql`${t.value} >= 0`),
  ],
);
