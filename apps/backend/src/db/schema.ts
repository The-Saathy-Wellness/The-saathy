import {
  pgTable,
  uuid,
  varchar,
  smallint,
  boolean,
  timestamp,
  text,
  integer,
  numeric,
  jsonb,
  date,
  bigserial,
  pgView,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// 1. Table: listeners (Declared first so users table can reference it)
export const listeners = pgTable("listeners", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayName: varchar("display_name", { length: 80 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(), // 'listener' | 'anchor' | 'expert' | 'moderator'
  verified: boolean("verified").default(false),
  languages: text("languages").array(),
  specialisations: text("specialisations").array(),
  availability: jsonb("availability"), // e.g. { 'mon': ['09:00-13:00'], ... }
  ratingAvg: numeric("rating_avg", { precision: 3, scale: 2 }),
  sessionCount: integer("session_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 2. Table: users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  nickname: varchar("nickname", { length: 60 }).notNull(),
  phoneHash: varchar("phone_hash", { length: 128 }).unique(), // SHA-256 of E.164 phone
  emailHash: varchar("email_hash", { length: 128 }).unique(), // SHA-256 of normalised email
  age: smallint("age").notNull(),
  language: varchar("language", { length: 10 }).notNull(), // BCP-47 e.g. 'hi', 'mr', 'en'
  city: varchar("city", { length: 80 }),
  gender: varchar("gender", { length: 20 }),
  isAnonymous: boolean("is_anonymous").default(false),
  reasonForJoining: text("reason_for_joining"),
  supportStyle: varchar("support_style", { length: 30 }), // 'listening' | 'advice' | 'mixed'
  vulnerabilityLevel: smallint("vulnerability_level").default(1), // 1 (low) – 5 (high)
  riskLevel: varchar("risk_level", { length: 20 }).default("standard"),
  planId: uuid("plan_id"), // Will reference subscriptions.id below
  showingUpStreak: integer("showing_up_streak").default(0),
  trustScore: smallint("trust_score").default(0),
  tokenVersion: integer("token_version").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }), // soft delete
});

// 3. Table: consent_ledger
export const consentLedger = pgTable("consent_ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  consentType: varchar("consent_type", { length: 60 }).notNull(),
  // 'memory_storage' | 'session_summary' | 'voice_to_text' | 'listener_context_share' | 'crisis_review' | 'notifications' | 'ai_training'
  status: varchar("status", { length: 10 }).notNull(), // 'granted' | 'revoked' | 'paused'
  source: varchar("source", { length: 20 }).notNull(), // 'signup' | 'settings' | 'session_prompt'
  ipHash: varchar("ip_hash", { length: 128 }), // hashed client IP for legal evidence
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 4. View: current_consent
export const currentConsent = pgView("current_consent", {
  id: uuid("id"),
  userId: uuid("user_id"),
  consentType: varchar("consent_type", { length: 60 }),
  status: varchar("status", { length: 10 }),
  source: varchar("source", { length: 20 }),
  ipHash: varchar("ip_hash", { length: 128 }),
  createdAt: timestamp("created_at", { withTimezone: true }),
}).as(sql`
  SELECT DISTINCT ON (user_id, consent_type) id, user_id, consent_type, status, source, ip_hash, created_at
  FROM consent_ledger
  ORDER BY user_id, consent_type, created_at DESC
`);

// 5. Table: sessions
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  listenerId: uuid("listener_id").references(() => listeners.id),
  sessionType: varchar("session_type", { length: 20 }).notNull(),
  // 'ai_chat' | 'ai_voice' | 'listener_chat' | 'listener_audio' | 'listener_video' | 'expert'
  status: varchar("status", { length: 20 }).default("active"), // 'active' | 'ended' | 'escalated' | 'abandoned'
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  durationSecs: integer("duration_secs"),
  summaryEnc: text("summary_enc"), // AI-generated, gated by consent, encrypted at rest
  crisisFlag: boolean("crisis_flag").default(false),
  billingUnits: integer("billing_units").default(0),
});

// 6. Table: saathy_memory
export const saathyMemory = pgTable("saathy_memory", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  memoryType: varchar("memory_type", { length: 30 }).notNull(),
  // 'current_concern' | 'emotional_pattern' | 'support_preference' | 'boundary' | 'follow_up'
  contentEnc: text("content_enc").notNull(), // AES-256 encrypted summary
  generatedBy: varchar("generated_by", { length: 20 }), // 'ai' | 'listener' | 'user'
  sessionId: uuid("session_id").references(() => sessions.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

// 7. Table: journal_entries
export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  contentEnc: text("content_enc").notNull(), // AES-256 encrypted
  moodTags: text("mood_tags").array(), // ['anxious','hopeful','tired']
  isVoice: boolean("is_voice").default(false),
  voiceUrl: text("voice_url"), // encrypted S3 key
  aiReflection: text("ai_reflection"), // AI reflection text paragraph
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

// 8. Table: daily_pulse
export const dailyPulse = pgTable("daily_pulse", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moodScore: smallint("mood_score").notNull(), // 1 - 10
  lonelinessScore: smallint("loneliness_score").notNull(), // 1 - 10
  energyLevel: smallint("energy_level").notNull(), // 1 - 5
  oneWord: varchar("one_word", { length: 40 }),
  noteEnc: text("note_enc"), // optional note, encrypted
  tinyAction: text("tiny_action"), // AI-generated daily action recommendation
  recordedAt: timestamp("recorded_at", { withTimezone: true }).defaultNow(),
});

// 9. Table: circles
export const circles = pgTable("circles", {
  id: uuid("id").primaryKey().defaultRandom(),
  circleType: varchar("circle_type", { length: 60 }).notNull(), // e.g. 'after_work', 'women_safe'
  hostId: uuid("host_id").references(() => listeners.id),
  language: varchar("language", { length: 10 }),
  cycleStart: date("cycle_start").notNull(),
  cycleEnd: date("cycle_end").notNull(),
  maxMembers: smallint("max_members").default(5),
  healthScore: smallint("health_score").default(100),
});

// 10. Table: circle_members
export const circleMembers = pgTable("circle_members", {
  circleId: uuid("circle_id").notNull().references(() => circles.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  isActive: boolean("is_active").default(true),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.circleId, table.userId] }),
  };
});

// 11. Table: crisis_flags
export const crisisFlags = pgTable("crisis_flags", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sessionId: uuid("session_id").references(() => sessions.id),
  flagType: varchar("flag_type", { length: 40 }).notNull(),
  // 'self_harm' | 'abuse' | 'suicide_intent' | 'panic' | 'harassment' | 'senior_manipulation'
  triggerText: text("trigger_text"), // redacted text excerpt
  reviewedBy: uuid("reviewed_by").references(() => listeners.id),
  resolution: varchar("resolution", { length: 30 }), // 'escalated' | 'helpline_shown' | 'resolved'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 12. Table: subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planName: varchar("plan_name", { length: 40 }).notNull(),
  // 'free' | 'basic' | 'listener_pack' | 'weekly' | 'circle' | 'premium' | 'expert' | 'senior'
  status: varchar("status", { length: 20 }).default("active"),
  minutesRemaining: integer("minutes_remaining"),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow(),
  renewsAt: timestamp("renews_at", { withTimezone: true }),
  razorpayId: varchar("razorpay_id", { length: 80 }),
});

// 13. Table: audit_logs
export const auditLogs = pgTable("audit_logs", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  actorId: uuid("actor_id"),
  actorRole: varchar("actor_role", { length: 30 }), // 'listener' | 'moderator' | 'admin' | 'system'
  action: varchar("action", { length: 60 }).notNull(),
  targetTable: varchar("target_table", { length: 60 }),
  targetId: uuid("target_id"),
  ipHash: varchar("ip_hash", { length: 128 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 14. Table: guest_sessions — tracks guest device fingerprints for emotional continuity
export const guestSessions = pgTable("guest_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  guestSessionId: varchar("guest_session_id", { length: 255 }),
  deviceHint: text("device_hint"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  mergedAt: timestamp("merged_at", { withTimezone: true }),
  mergedToUserId: uuid("merged_to_user_id"), // References auth.users (Supabase)
  isActive: boolean("is_active").default(true),
  isEphemeral: boolean("is_ephemeral").default(false),
  deviceFingerprint: varchar("device_fingerprint", { length: 128 }),
  warnedAt: timestamp("warned_at", { withTimezone: true }),
  warningDismissed: boolean("warning_dismissed").default(false),
});

// 15. Table: continuity_events — logs warning triggers, dismissals, and restore actions
export const continuityEvents = pgTable("continuity_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  guestSessionId: varchar("guest_session_id", { length: 255 }),
  userId: uuid("user_id"), // References auth.users (Supabase)
  eventType: varchar("event_type", { length: 50 }).notNull(),
  // 'incognito_warning' | 'clear_warning' | 'cross_device_warning' | 'restore_session' | 'dismiss_warning'
  confidence: varchar("confidence", { length: 50 }),
  signals: text("signals").array(),
  deviceHint: text("device_hint"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});


