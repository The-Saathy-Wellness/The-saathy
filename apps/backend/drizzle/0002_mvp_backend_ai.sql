-- Migration: MVP backend and AI runtime support
-- Aligns guest continuity tables with current route contracts and adds encrypted AI chat messages.

ALTER TABLE "guest_sessions" ADD COLUMN IF NOT EXISTS "guest_session_id" varchar(255);
ALTER TABLE "guest_sessions" ADD COLUMN IF NOT EXISTS "device_hint" text;
ALTER TABLE "guest_sessions" ADD COLUMN IF NOT EXISTS "merged_at" timestamp with time zone;
ALTER TABLE "guest_sessions" ADD COLUMN IF NOT EXISTS "merged_to_user_id" uuid;
ALTER TABLE "guest_sessions" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;

ALTER TABLE "guest_sessions" ALTER COLUMN "user_id" DROP NOT NULL;

ALTER TABLE "continuity_events" ADD COLUMN IF NOT EXISTS "guest_session_id" varchar(255);
ALTER TABLE "continuity_events" ADD COLUMN IF NOT EXISTS "confidence" varchar(50);
ALTER TABLE "continuity_events" ADD COLUMN IF NOT EXISTS "signals" text[];
ALTER TABLE "continuity_events" ADD COLUMN IF NOT EXISTS "device_hint" text;

ALTER TABLE "continuity_events" ALTER COLUMN "user_id" DROP NOT NULL;

CREATE TABLE IF NOT EXISTS "ai_chat_messages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "session_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "role" varchar(20) NOT NULL,
  "content_enc" text NOT NULL,
  "risk_level" varchar(20) DEFAULT 'standard',
  "created_at" timestamp with time zone DEFAULT now()
);

ALTER TABLE "ai_chat_messages" ADD CONSTRAINT "ai_chat_messages_session_id_sessions_id_fk"
  FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "ai_chat_messages" ADD CONSTRAINT "ai_chat_messages_user_id_users_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

