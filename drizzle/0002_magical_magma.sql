CREATE TABLE "bank_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monthly_rent_period_id" uuid NOT NULL,
	"tipo" text NOT NULL,
	"value" numeric(12, 2) NOT NULL,
	"movement_date" date,
	"description" text,
	"proof_url" text,
	"origin" text DEFAULT 'manual' NOT NULL,
	"created_by" uuid,
	"notes" text,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bank_movements_tipo_check" CHECK ("bank_movements"."tipo" in ('deposito', 'complemento', 'estorno', 'devolucao', 'compensacao', 'ajuste')),
	CONSTRAINT "bank_movements_value_sign_check" CHECK ("bank_movements"."tipo" in ('compensacao', 'ajuste') or "bank_movements"."value" >= 0)
);
--> statement-breakpoint
CREATE TABLE "statement_components" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"monthly_rent_period_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"value" numeric(12, 2) NOT NULL,
	"description" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "statement_components_kind_check" CHECK ("statement_components"."kind" in ('bruto_devido', 'ressarcimento_iptu', 'taxa_admin', 'taxa_bancaria', 'taxa_extra', 'fundo_reserva', 'multa', 'juros', 'desconto', 'retencao', 'outro_acrescimo', 'outro_desconto', 'informativo')),
	CONSTRAINT "statement_components_value_check" CHECK ("statement_components"."value" >= 0)
);
--> statement-breakpoint
ALTER TABLE "bank_movements" ADD CONSTRAINT "bank_movements_monthly_rent_period_id_monthly_rent_periods_id_fk" FOREIGN KEY ("monthly_rent_period_id") REFERENCES "public"."monthly_rent_periods"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "statement_components" ADD CONSTRAINT "statement_components_monthly_rent_period_id_monthly_rent_periods_id_fk" FOREIGN KEY ("monthly_rent_period_id") REFERENCES "public"."monthly_rent_periods"("id") ON DELETE restrict ON UPDATE no action;