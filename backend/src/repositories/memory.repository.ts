import { getSupabase } from "../config/supabase";
import { Memory } from "../types";
import { inMemoryStore } from "./inMemoryStore";

export class MemoryRepository {
  async create(memory: Omit<Memory, "id" | "createdAt">) {
    const supabase = getSupabase();
    if (!supabase) return inMemoryStore.addMemory(memory);

    const { data, error } = await supabase.from("memories").insert(memory).select("*").single();
    if (error) throw error;
    return data as Memory;
  }

  async listImportant(userId: string, limit = 10) {
    const supabase = getSupabase();
    if (!supabase) return inMemoryStore.listMemories(userId, limit);

    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("userId", userId)
      .order("importance", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as Memory[];
  }
}
