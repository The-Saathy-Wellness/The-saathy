CREATE TABLE "audit_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"actor_id" uuid,
	"actor_role" varchar(30),
	"action" varchar(60) NOT NULL,
	"target_table" varchar(60),
	"target_id" uuid,
	"ip_hash" varchar(128),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "circle_members" (
	"circle_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now(),
	"is_active" boolean DEFAULT true,
	CONSTRAINT "circle_members_circle_id_user_id_pk" PRIMARY KEY("circle_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "circles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"circle_type" varchar(60) NOT NULL,
	"host_id" uuid,
	"language" varchar(10),
	"cycle_start" date NOT NULL,
	"cycle_end" date NOT NULL,
	"max_members" smallint DEFAULT 5,
	"health_score" smallint DEFAULT 100
);
--> statement-breakpoint
CREATE TABLE "consent_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"consent_type" varchar(60) NOT NULL,
	"status" varchar(10) NOT NULL,
	"source" varchar(20) NOT NULL,
	"ip_hash" varchar(128),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "continuity_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"device_fingerprint" varchar(128),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "crisis_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_id" uuid,
	"flag_type" varchar(40) NOT NULL,
	"trigger_text" text,
	"reviewed_by" uuid,
	"resolution" varchar(30),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "daily_pulse" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"mood_score" smallint NOT NULL,
	"loneliness_score" smallint NOT NULL,
	"energy_level" smallint NOT NULL,
	"one_word" varchar(40),
	"note_enc" text,
	"tiny_action" text,
	"recorded_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "guest_sessions" (
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
--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"content_enc" text NOT NULL,
	"mood_tags" text[],
	"is_voice" boolean DEFAULT false,
	"voice_url" text,
	"ai_reflection" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "listeners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" varchar(80) NOT NULL,
	"role" varchar(20) NOT NULL,
	"verified" boolean DEFAULT false,
	"languages" text[],
	"specialisations" text[],
	"availability" jsonb,
	"rating_avg" numeric(3, 2),
	"session_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saathy_memory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"memory_type" varchar(30) NOT NULL,
	"content_enc" text NOT NULL,
	"generated_by" varchar(20),
	"session_id" uuid,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"listener_id" uuid,
	"session_type" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'active',
	"started_at" timestamp with time zone DEFAULT now(),
	"ended_at" timestamp with time zone,
	"duration_secs" integer,
	"summary_enc" text,
	"crisis_flag" boolean DEFAULT false,
	"billing_units" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_name" varchar(40) NOT NULL,
	"status" varchar(20) DEFAULT 'active',
	"minutes_remaining" integer,
	"started_at" timestamp with time zone DEFAULT now(),
	"renews_at" timestamp with time zone,
	"razorpay_id" varchar(80)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nickname" varchar(60) NOT NULL,
	"phone_hash" varchar(128),
	"email_hash" varchar(128),
	"age" smallint NOT NULL,
	"language" varchar(10) NOT NULL,
	"city" varchar(80),
	"gender" varchar(20),
	"is_anonymous" boolean DEFAULT false,
	"reason_for_joining" text,
	"support_style" varchar(30),
	"vulnerability_level" smallint DEFAULT 1,
	"risk_level" varchar(20) DEFAULT 'standard',
	"plan_id" uuid,
	"listener_preference" uuid,
	"showing_up_streak" integer DEFAULT 0,
	"trust_score" smallint DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_phone_hash_unique" UNIQUE("phone_hash"),
	CONSTRAINT "users_email_hash_unique" UNIQUE("email_hash")
);
--> statement-breakpoint
ALTER TABLE "circle_members" ADD CONSTRAINT "circle_members_circle_id_circles_id_fk" FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "circle_members" ADD CONSTRAINT "circle_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "circles" ADD CONSTRAINT "circles_host_id_listeners_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."listeners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consent_ledger" ADD CONSTRAINT "consent_ledger_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "continuity_events" ADD CONSTRAINT "continuity_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crisis_flags" ADD CONSTRAINT "crisis_flags_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crisis_flags" ADD CONSTRAINT "crisis_flags_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crisis_flags" ADD CONSTRAINT "crisis_flags_reviewed_by_listeners_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."listeners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_pulse" ADD CONSTRAINT "daily_pulse_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guest_sessions" ADD CONSTRAINT "guest_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saathy_memory" ADD CONSTRAINT "saathy_memory_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saathy_memory" ADD CONSTRAINT "saathy_memory_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_listener_id_listeners_id_fk" FOREIGN KEY ("listener_id") REFERENCES "public"."listeners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_listener_preference_listeners_id_fk" FOREIGN KEY ("listener_preference") REFERENCES "public"."listeners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "public"."current_consent" AS (
  SELECT DISTINCT ON (user_id, consent_type) id, user_id, consent_type, status, source, ip_hash, created_at
  FROM consent_ledger
  ORDER BY user_id, consent_type, created_at DESC
);