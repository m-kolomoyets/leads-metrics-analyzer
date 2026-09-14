-- Unique nickname (offers-and-home/02). The handle becomes the key Assignment resolves a buyer by, so
-- two people can no longer share one. Comparison is case-insensitive and trimmed (mirrors
-- `normalizeNickname`), hence the index on lower(nickname). Existing duplicates are disambiguated
-- first, deterministically: the oldest row (created_at, then id) keeps its handle, every later one
-- gets a numeric suffix (`anna` → `anna-2`, `anna-3`). The loop re-runs in case a suffixed handle
-- collides with a pre-existing one (`anna-2` already taken → that pair is suffixed again).
UPDATE "user" SET "nickname" = btrim("nickname") WHERE "nickname" <> btrim("nickname");--> statement-breakpoint
UPDATE "user" SET "nickname" = 'user' WHERE "nickname" = '';--> statement-breakpoint
DO $$
BEGIN
    LOOP
        WITH ranked AS (
            SELECT "id", "nickname",
                   row_number() OVER (PARTITION BY lower("nickname") ORDER BY "created_at", "id") AS rn
            FROM "user"
        )
        UPDATE "user" AS u
        SET "nickname" = r."nickname" || '-' || r.rn
        FROM ranked AS r
        WHERE u."id" = r."id" AND r.rn > 1;

        EXIT WHEN NOT FOUND;
    END LOOP;
END $$;--> statement-breakpoint
CREATE UNIQUE INDEX "user_nickname_lower_key" ON "user" (lower("nickname"));
