import { getSupabase } from "../config/supabase";
import { inMemoryStore, UserRecord } from "./inMemoryStore";

export class UserRepository {
  async create(input: Omit<UserRecord, "id" | "createdAt" | "role"> & { role?: UserRecord["role"] }) {
    const supabase = getSupabase();
    if (!supabase) return inMemoryStore.createUser(input);

    const { data, error } = await supabase.from("users").insert(input).select("*").single();
    if (error) throw error;
    return data as UserRecord;
  }

  async findByEmail(email: string) {
    const supabase = getSupabase();
    if (!supabase) return inMemoryStore.findUserByEmail(email);

    const { data, error } = await supabase.from("users").select("*").eq("email", email).maybeSingle();
    if (error) throw error;
    return data as UserRecord | null;
  }

  async findById(id: string) {
    const supabase = getSupabase();
    if (!supabase) return inMemoryStore.findUserById(id);

    const { data, error } = await supabase.from("users").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data as UserRecord | null;
  }

  async update(id: string, patch: Partial<UserRecord>) {
    const supabase = getSupabase();
    if (!supabase) return inMemoryStore.updateUser(id, patch);

    const { data, error } = await supabase.from("users").update(patch).eq("id", id).select("*").single();
    if (error) throw error;
    return data as UserRecord;
  }
}
