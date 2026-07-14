import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Esquema do banco (PostgreSQL). Convenções: chave primária `uuid`; timestamps
 * `created_at`/`updated_at`; **arquivamento lógico** via `archived_at` (nunca
 * DELETE em dado de negócio); valores monetários entrarão como `numeric` nas
 * tabelas financeiras (etapas seguintes).
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
   * Imobiliária atual. O histórico de trocas ficará em uma tabela própria
   * (etapa seguinte). Restrição de exclusão: uma imobiliária com imóveis
   * vinculados não pode ser removida (usamos arquivamento lógico).
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
