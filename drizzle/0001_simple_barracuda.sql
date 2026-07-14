CREATE TABLE "monthly_rent_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"contract_id" uuid,
	"agency_id" uuid,
	"competencia_ano" integer NOT NULL,
	"competencia_mes" smallint NOT NULL,
	"expected_gross_rent" numeric(12, 2),
	"admin_fee_percent" numeric(5, 2),
	"due_day" smallint,
	"weekend_holiday_rule" text,
	"status" text DEFAULT 'previsto' NOT NULL,
	"origin" text DEFAULT 'automatica' NOT NULL,
	"created_by" uuid,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "monthly_rent_periods_competencia_unique" UNIQUE("property_id","competencia_ano","competencia_mes"),
	CONSTRAINT "monthly_rent_periods_mes_check" CHECK ("monthly_rent_periods"."competencia_mes" between 1 and 12)
);
--> statement-breakpoint
CREATE TABLE "property_agency_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"agency_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rental_contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"agency_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"contract_value" numeric(12, 2) NOT NULL,
	"due_day" smallint NOT NULL,
	"weekend_holiday_rule" text DEFAULT 'proximo_dia_util' NOT NULL,
	"adjustment_index" text,
	"adjustment_base_date" date,
	"admin_fee_percent" numeric(5, 2) NOT NULL,
	"iptu_config" jsonb,
	"status" text DEFAULT 'ativo' NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rental_contracts_due_day_check" CHECK ("rental_contracts"."due_day" between 1 and 31),
	CONSTRAINT "rental_contracts_weekend_rule_check" CHECK ("rental_contracts"."weekend_holiday_rule" in ('manter', 'antecipar', 'proximo_dia_util')),
	CONSTRAINT "rental_contracts_admin_fee_check" CHECK ("rental_contracts"."admin_fee_percent" >= 0)
);
--> statement-breakpoint
ALTER TABLE "monthly_rent_periods" ADD CONSTRAINT "monthly_rent_periods_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_rent_periods" ADD CONSTRAINT "monthly_rent_periods_contract_id_rental_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."rental_contracts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_rent_periods" ADD CONSTRAINT "monthly_rent_periods_agency_id_real_estate_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."real_estate_agencies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_agency_history" ADD CONSTRAINT "property_agency_history_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_agency_history" ADD CONSTRAINT "property_agency_history_agency_id_real_estate_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."real_estate_agencies"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_contracts" ADD CONSTRAINT "rental_contracts_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_contracts" ADD CONSTRAINT "rental_contracts_agency_id_real_estate_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."real_estate_agencies"("id") ON DELETE restrict ON UPDATE no action;