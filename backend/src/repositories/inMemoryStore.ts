import { v4 as uuid } from "uuid";
import { Memory } from "../types";

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  ageRange?: string;
  location?: string;
  language?: string;
  moods?: string[];
  role: "user" | "listener" | "admin";
  createdAt: string;
};

export type JournalRecord = {
  id: string;
  userId: string;
  content: string;
  mood?: string;
  insights: string[];
  createdAt: string;
};

export type PulseRecord = {
  id: string;
  userId: string;
  mood: number;
  energy: number;
  stress: number;
  loneliness: number;
  note?: string;
  createdAt: string;
};

export type ListenerRecord = {
  id: string;
  name: string;
  languages: string[];
  specialties: string[];
  available: boolean;
};

const users = new Map<string, UserRecord>();
const usersByEmail = new Map<string, string>();
const memories: Memory[] = [];
const journals: JournalRecord[] = [];
const pulses: PulseRecord[] = [];
const listeners: ListenerRecord[] = [
  {
    id: "listener-1",
    name: "Saathy Listener",
    languages: ["English", "Tamil", "Hindi"],
    specialties: ["loneliness", "stress", "general"],
    available: true,
  },
];

export const inMemoryStore = {
  createUser(user: Omit<UserRecord, "id" | "createdAt" | "role"> & { role?: UserRecord["role"] }) {
    const record: UserRecord = {
      ...user,
      id: uuid(),
      role: user.role ?? "user",
      createdAt: new Date().toISOString(),
    };
    users.set(record.id, record);
    usersByEmail.set(record.email.toLowerCase(), record.id);
    return record;
  },
  findUserByEmail(email: string) {
    const id = usersByEmail.get(email.toLowerCase());
    return id ? users.get(id) ?? null : null;
  },
  findUserById(id: string) {
    return users.get(id) ?? null;
  },
  updateUser(id: string, patch: Partial<UserRecord>) {
    const existing = users.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    users.set(id, updated);
    return updated;
  },
  addMemory(memory: Omit<Memory, "id" | "createdAt">) {
    const record: Memory = { ...memory, id: uuid(), createdAt: new Date().toISOString() };
    memories.push(record);
    return record;
  },
  listMemories(userId: string, limit = 10) {
    return memories
      .filter((memory) => memory.userId === userId)
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);
  },
  addJournal(entry: Omit<JournalRecord, "id" | "createdAt">) {
    const record: JournalRecord = { ...entry, id: uuid(), createdAt: new Date().toISOString() };
    journals.push(record);
    return record;
  },
  listJournals(userId: string) {
    return journals.filter((entry) => entry.userId === userId);
  },
  addPulse(entry: Omit<PulseRecord, "id" | "createdAt">) {
    const record: PulseRecord = { ...entry, id: uuid(), createdAt: new Date().toISOString() };
    pulses.push(record);
    return record;
  },
  listPulses(userId: string) {
    return pulses.filter((entry) => entry.userId === userId);
  },
  listListeners() {
    return listeners;
  },
};
