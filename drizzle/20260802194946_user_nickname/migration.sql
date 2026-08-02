-- Nickname on user (#52). Three steps so the NOT NULL lands on a table that already has rows:
-- add nullable, backfill once from the email local-part (mirrors `deriveNicknameFromEmail`), enforce.
ALTER TABLE "user" ADD COLUMN "nickname" text;--> statement-breakpoint
UPDATE "user" SET "nickname" = nullif(split_part("email", '@', 1), '') WHERE "nickname" IS NULL;--> statement-breakpoint
UPDATE "user" SET "nickname" = 'user' WHERE "nickname" IS NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "nickname" SET NOT NULL;
