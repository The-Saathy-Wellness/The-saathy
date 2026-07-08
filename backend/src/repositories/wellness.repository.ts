import { getSupabase } from "../config/supabase";
import { inMemoryStore, JournalRecord, PulseRecord } from "./inMemoryStore";

export class WellnessRepository {
  async createJournal(entry: Omit<JournalRecord, "id" | "createdAt">) {
    const supabase = getSupabase();
    if (!supabase) return inMemoryStore.addJournal(entry);

    const { data, error } = await supabase.from("journals").insert(entry).select("*").single();
    if (error) throw error;
    return data as JournalRecord;
  }

  async listJournals(userId: string) {
    const supabase = getSupabase();
    if (!supabase) return inMemoryStore.listJournals(userId);

    const { data, error } = await supabase.from("journals").select("*").eq("userId", userId);
    if (error) throw error;
    return data as JournalRecord[];
  }

  async createPulse(entry: Omit<PulseRecord, "id" | "createdAt">) {
    const supabase = getSupabase();
    if (!supabase) return inMemoryStore.addPulse(entry);

    const { data, error } = await supabase.from("daily_pulses").insert(entry).select("*").single();
    if (error) throw error;
    return data as PulseRecord;
  }

  async listPulses(userId: string) {
    const supabase = getSupabase();
    if (!supabase) return inMemoryStore.listPulses(userId);

    const { data, error } = await supabase.from("daily_pulses").select("*").eq("userId", userId);
    if (error) throw error;
    return data as PulseRecord[];
  }
}
