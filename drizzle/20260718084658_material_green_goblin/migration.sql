CREATE TABLE "preset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"team_id" uuid,
	"owner_user_id" uuid NOT NULL,
	"geo" text NOT NULL,
	"name" text NOT NULL,
	"active_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "preset_version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"preset_id" uuid NOT NULL,
	"thresholds" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"team_id" uuid NOT NULL UNIQUE,
	"active_version_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_settings_version" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"shared_settings_id" uuid NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "preset" ADD CONSTRAINT "preset_team_id_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "preset" ADD CONSTRAINT "preset_owner_user_id_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "preset" ADD CONSTRAINT "preset_active_version_id_preset_version_id_fkey" FOREIGN KEY ("active_version_id") REFERENCES "preset_version"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "preset_version" ADD CONSTRAINT "preset_version_preset_id_preset_id_fkey" FOREIGN KEY ("preset_id") REFERENCES "preset"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "shared_settings" ADD CONSTRAINT "shared_settings_team_id_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "shared_settings" ADD CONSTRAINT "shared_settings_xfNxRHYYvESg_fkey" FOREIGN KEY ("active_version_id") REFERENCES "shared_settings_version"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "shared_settings_version" ADD CONSTRAINT "shared_settings_version_V41fv4xnSMbY_fkey" FOREIGN KEY ("shared_settings_id") REFERENCES "shared_settings"("id") ON DELETE CASCADE;