CREATE TYPE "offer_currency" AS ENUM('USD', 'EUR');--> statement-breakpoint
CREATE TYPE "offer_fx_status" AS ENUM('fixed', 'pending');--> statement-breakpoint
CREATE TABLE "fx_rate" (
	"day" date,
	"base" text,
	"quote" text,
	"rate" double precision NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fx_rate_pkey" PRIMARY KEY("day","base","quote")
);
--> statement-breakpoint
CREATE TABLE "offer_card" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"offer_id" text NOT NULL,
	"raw_string" text NOT NULL,
	"payout_original" double precision NOT NULL,
	"payout_currency" "offer_currency" NOT NULL,
	"fx_status" "offer_fx_status" DEFAULT 'fixed'::"offer_fx_status" NOT NULL,
	"fx_rate" double precision,
	"fx_fetched_at" timestamp with time zone,
	"payout_usd" double precision,
	"assigned_team_text" text NOT NULL,
	"assigned_recipient_text" text NOT NULL,
	"team_id" uuid,
	"buyer_user_id" uuid,
	"is_assignment_unresolved" boolean DEFAULT false NOT NULL,
	"created_by_user_id" uuid NOT NULL,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "offer_card_live_offer_id_key" ON "offer_card" ("offer_id") WHERE "archived_at" is null;--> statement-breakpoint
ALTER TABLE "offer_card" ADD CONSTRAINT "offer_card_team_id_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "offer_card" ADD CONSTRAINT "offer_card_buyer_user_id_user_id_fkey" FOREIGN KEY ("buyer_user_id") REFERENCES "user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "offer_card" ADD CONSTRAINT "offer_card_created_by_user_id_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE CASCADE;