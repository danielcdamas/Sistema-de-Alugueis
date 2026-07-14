CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"internal_code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"state" text,
	"city" text,
	"current_agency_id" uuid,
	"notes" text,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_internal_code_unique" UNIQUE("internal_code")
);
--> statement-breakpoint
CREATE TABLE "real_estate_agencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"internal_code" text NOT NULL,
	"name" text NOT NULL,
	"display_name" text,
	"primary_email" text,
	"additional_emails" text[],
	"phone" text,
	"contact_person" text,
	"notes" text,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "real_estate_agencies_internal_code_unique" UNIQUE("internal_code")
);
--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_current_agency_id_real_estate_agencies_id_fk" FOREIGN KEY ("current_agency_id") REFERENCES "public"."real_estate_agencies"("id") ON DELETE restrict ON UPDATE no action;