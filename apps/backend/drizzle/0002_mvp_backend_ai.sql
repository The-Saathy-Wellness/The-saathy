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

CREATE INDEX IF NOT EXISTS "ai_chat_messages_session_created_idx"
  ON "ai_chat_messages" ("session_id", "created_at");

CREATE INDEX IF NOT EXISTS "saathy_memory_user_active_created_idx"
  ON "saathy_memory" ("user_id", "is_active", "created_at");
