CREATE TYPE "fact_zone" AS ENUM('green', 'yellow', 'red', 'neutral');--> statement-breakpoint
CREATE TABLE "applied_ruleset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"shared_settings_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applied_ruleset_geo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"applied_ruleset_id" uuid NOT NULL,
	"geo" text NOT NULL,
	"preset_version_id" uuid
);
--> statement-breakpoint
CREATE TABLE "snapshot" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"created_by_user_id" uuid NOT NULL,
	"team_id" uuid,
	"applied_ruleset_id" uuid NOT NULL,
	"report_date" date NOT NULL,
	"taken_at" timestamp with time zone DEFAULT now() NOT NULL,
	"meta" jsonb
);
--> statement-breakpoint
CREATE TABLE "snapshot_fact" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"snapshot_id" uuid NOT NULL,
	"campaign" text NOT NULL,
	"creative" text NOT NULL,
	"report_date" date NOT NULL,
	"geo" text NOT NULL,
	"account" text NOT NULL,
	"offer" text NOT NULL,
	"os" text,
	"spend" double precision NOT NULL,
	"spend_plus" double precision NOT NULL,
	"revenue" double precision NOT NULL,
	"link_clicks" integer NOT NULL,
	"installs" integer NOT NULL,
	"regs" integer NOT NULL,
	"sales" integer NOT NULL,
	"verdict" "fact_zone" NOT NULL,
	"zone" "fact_zone" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applied_ruleset" ADD CONSTRAINT "applied_ruleset_Pgm1WgVSxLXc_fkey" FOREIGN KEY ("shared_settings_version_id") REFERENCES "shared_settings_version"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "applied_ruleset_geo" ADD CONSTRAINT "applied_ruleset_geo_applied_ruleset_id_applied_ruleset_id_fkey" FOREIGN KEY ("applied_ruleset_id") REFERENCES "applied_ruleset"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "applied_ruleset_geo" ADD CONSTRAINT "applied_ruleset_geo_preset_version_id_preset_version_id_fkey" FOREIGN KEY ("preset_version_id") REFERENCES "preset_version"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "snapshot" ADD CONSTRAINT "snapshot_created_by_user_id_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "snapshot" ADD CONSTRAINT "snapshot_team_id_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "snapshot" ADD CONSTRAINT "snapshot_applied_ruleset_id_applied_ruleset_id_fkey" FOREIGN KEY ("applied_ruleset_id") REFERENCES "applied_ruleset"("id");--> statement-breakpoint
ALTER TABLE "snapshot_fact" ADD CONSTRAINT "snapshot_fact_snapshot_id_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "snapshot"("id") ON DELETE CASCADE;