-- Snapshot completeness (S2a, #53, ADR-0015): the sub-grain inputs a report allocates over, the one
-- figure that can never be derived (Geo Total), and the thresholds a Preset delete used to destroy.
-- `snapshot_fact.attribution` defaults to 'full' so existing rows land on the only class the old
-- write path could grade; the three new tables stay empty for pre-S2a Snapshots by design.
CREATE TYPE "fact_attribution" AS ENUM('full', 'campaign_lost');--> statement-breakpoint
CREATE TYPE "model_dimension" AS ENUM('offer', 'os');--> statement-breakpoint
CREATE TABLE "snapshot_campaign_model" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"snapshot_id" uuid NOT NULL,
	"campaign" text NOT NULL,
	"dimension" "model_dimension" NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"revenue" double precision NOT NULL,
	"link_clicks" integer NOT NULL,
	"installs" integer NOT NULL,
	"regs" integer NOT NULL,
	"sales" integer NOT NULL,
	CONSTRAINT "snapshot_campaign_model_grain_key" UNIQUE("snapshot_id","campaign","dimension","key")
);
--> statement-breakpoint
CREATE TABLE "snapshot_creative" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"snapshot_id" uuid NOT NULL,
	"geo" text NOT NULL,
	"campaign" text NOT NULL,
	"ad_name" text NOT NULL,
	"spend" double precision NOT NULL,
	"impressions" integer NOT NULL,
	CONSTRAINT "snapshot_creative_grain_key" UNIQUE("snapshot_id","geo","campaign","ad_name")
);
--> statement-breakpoint
CREATE TABLE "snapshot_geo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"snapshot_id" uuid NOT NULL,
	"geo" text NOT NULL,
	"spend_plus" double precision NOT NULL,
	"geo_total" double precision NOT NULL,
	"attributed_revenue" double precision NOT NULL,
	"profit" double precision NOT NULL,
	"roi" double precision,
	"cpc" double precision,
	"cpi" double precision,
	"cpr" double precision,
	"cps" double precision,
	"waste" double precision NOT NULL,
	CONSTRAINT "snapshot_geo_snapshot_geo_key" UNIQUE("snapshot_id","geo")
);
--> statement-breakpoint
ALTER TABLE "applied_ruleset" ADD COLUMN "settings" jsonb;--> statement-breakpoint
ALTER TABLE "applied_ruleset_geo" ADD COLUMN "thresholds" jsonb;--> statement-breakpoint
ALTER TABLE "snapshot_fact" ADD COLUMN "attribution" "fact_attribution" DEFAULT 'full'::"fact_attribution" NOT NULL;--> statement-breakpoint
ALTER TABLE "snapshot_campaign_model" ADD CONSTRAINT "snapshot_campaign_model_snapshot_id_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "snapshot"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "snapshot_creative" ADD CONSTRAINT "snapshot_creative_snapshot_id_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "snapshot"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "snapshot_geo" ADD CONSTRAINT "snapshot_geo_snapshot_id_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "snapshot"("id") ON DELETE CASCADE;