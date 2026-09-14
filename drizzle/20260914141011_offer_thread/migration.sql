CREATE TYPE "offer_thread_entry_kind" AS ENUM('comment', 'deadline_changed', 'assignment_changed');--> statement-breakpoint
CREATE TABLE "offer_card_seen" (
	"user_id" uuid,
	"offer_card_id" uuid,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "offer_card_seen_pkey" PRIMARY KEY("user_id","offer_card_id")
);
--> statement-breakpoint
CREATE TABLE "offer_thread_entry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"offer_card_id" uuid NOT NULL,
	"author_user_id" uuid,
	"kind" "offer_thread_entry_kind" NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"edited_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "offer_thread_entry_card_idx" ON "offer_thread_entry" ("offer_card_id","created_at");--> statement-breakpoint
ALTER TABLE "offer_card_seen" ADD CONSTRAINT "offer_card_seen_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "offer_card_seen" ADD CONSTRAINT "offer_card_seen_offer_card_id_offer_card_id_fkey" FOREIGN KEY ("offer_card_id") REFERENCES "offer_card"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "offer_thread_entry" ADD CONSTRAINT "offer_thread_entry_offer_card_id_offer_card_id_fkey" FOREIGN KEY ("offer_card_id") REFERENCES "offer_card"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "offer_thread_entry" ADD CONSTRAINT "offer_thread_entry_author_user_id_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "user"("id") ON DELETE SET NULL;