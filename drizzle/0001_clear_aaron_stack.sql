CREATE TYPE "public"."integration_provider" AS ENUM('google_analytics', 'google_ads', 'meta_ads', 'tiktok_ads', 'shopify');--> statement-breakpoint
CREATE TYPE "public"."integration_status" AS ENUM('connected', 'needs_reauth', 'error');--> statement-breakpoint
CREATE TABLE "user_integrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider" "integration_provider" NOT NULL,
	"status" "integration_status" DEFAULT 'connected' NOT NULL,
	"provider_account_id" text,
	"account_name" text,
	"access_token" text,
	"refresh_token" text,
	"token_type" text,
	"scope" text,
	"expires_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"last_error" text,
	"connected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD COLUMN IF NOT EXISTS "title" text;--> statement-breakpoint
ALTER TABLE "user_integrations" ADD CONSTRAINT "user_integrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_integrations_user_provider_unique" ON "user_integrations" USING btree ("user_id","provider");--> statement-breakpoint
CREATE INDEX "user_integrations_user_provider_idx" ON "user_integrations" USING btree ("user_id","provider");
