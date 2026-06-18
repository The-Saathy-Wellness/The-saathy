-- Migration: Add guest_sessions and continuity_events tables
-- These tables support anonymous guest session continuity via device fingerprinting

CREATE TABLE IF NOT EXISTS "guest_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "device_fingerprint" varchar(128),
  "is_ephemeral" boolean DEFAULT false,
  "warned_at" timestamp with time zone,
  "warning_dismissed" boolean DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "guest_sessions_device_fingerprint_unique" UNIQUE("device_fingerprint")
);

ALTER TABLE "guest_sessions" ADD CONSTRAINT "guest_sessions_user_id_users_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;

CREATE TABLE IF NOT EXISTS "continuity_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "event_type" varchar(50) NOT NULL,
  "device_fingerprint" varchar(128),
  "metadata" jsonb,
  "created_at" timestamp with time zone DEFAULT now()
);

ALTER TABLE "continuity_events" ADD CONSTRAINT "continuity_events_user_id_users_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
