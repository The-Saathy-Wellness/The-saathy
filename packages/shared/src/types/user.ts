export interface UserProfile {
  id: string;
  nickname: string;
  phoneHash?: string | null;
  emailHash?: string | null;
  age: number;
  language: string;
  city?: string | null;
  gender?: string | null;
  isAnonymous?: boolean;
  reasonForJoining?: string | null;
  supportStyle?: 'listening' | 'advice' | 'mixed' | null;
  vulnerabilityLevel?: number;
  riskLevel?: string;
  planId?: string | null;
  listenerPreferenceId?: string | null;
  showingUpStreak?: number;
  trustScore?: number;
  isActive?: boolean;
  createdAt?: string;
  deletedAt?: string | null;
}

export type ConsentStatus = 'granted' | 'revoked' | 'paused';

export interface ConsentLedgerEntry {
  id: string;
  userId: string;
  consentType: 'memory_storage' | 'session_summary' | 'voice_to_text' | 'listener_context_share' | 'crisis_review' | 'notifications' | 'ai_training';
  status: ConsentStatus;
  source: 'signup' | 'settings' | 'session_prompt';
  ipHash?: string | null;
  createdAt: string;
}

export interface SaathyMemory {
  id: string;
  userId: string;
  memoryType: 'current_concern' | 'emotional_pattern' | 'support_preference' | 'boundary' | 'follow_up';
  contentEnc: string;
  generatedBy?: 'ai' | 'listener' | 'user' | null;
  sessionId?: string | null;
  isActive?: boolean;
  createdAt: string;
  deletedAt?: string | null;
}

export interface DailyPulseEntry {
  id: string;
  userId: string;
  moodScore: number;
  lonelinessScore: number;
  energyLevel: number;
  oneWord?: string | null;
  noteEnc?: string | null;
  tinyAction?: string | null;
  recordedAt: string;
}

export interface SyncProfilePayload {
  nickname: string;
  email: string;
  phone?: string;
  age: number;
  language: string;
  city?: string;
  gender?: string;
  reasonForJoining?: string;
  supportStyle?: 'listening' | 'advice' | 'mixed';
  consents?: {
    memory_storage?: ConsentStatus;
    session_summary?: ConsentStatus;
    voice_to_text?: ConsentStatus;
    listener_context_share?: ConsentStatus;
    crisis_review?: ConsentStatus;
    notifications?: ConsentStatus;
    ai_training?: ConsentStatus;
  };
}
