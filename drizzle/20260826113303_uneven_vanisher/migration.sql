-- Replaceable Snapshots (ADR-0018): the correction path for a broken push. The Snapshot row itself
-- stays immutable — a replacement flips these three columns and nothing else, and never deletes,
-- so the superseded row still rebuilds its own report for audit.
-- `status` is NOT NULL DEFAULT 'active', so every existing row reads active with no backfill script.
-- `replaced_by` is a self-FK, `set null` on delete: a Snapshot is never deleted, and if one ever
-- were, losing the pointer must not take the audit trail with it.
CREATE TYPE "snapshot_status" AS ENUM('active', 'replaced');--> statement-breakpoint
ALTER TABLE "snapshot" ADD COLUMN "status" "snapshot_status" DEFAULT 'active'::"snapshot_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "snapshot" ADD COLUMN "replaced_by" uuid;--> statement-breakpoint
ALTER TABLE "snapshot" ADD COLUMN "replaced_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "snapshot" ADD CONSTRAINT "snapshot_replaced_by_snapshot_id_fkey" FOREIGN KEY ("replaced_by") REFERENCES "snapshot"("id") ON DELETE SET NULL;
