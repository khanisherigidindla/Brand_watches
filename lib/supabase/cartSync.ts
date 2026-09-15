import { CartItem } from "../types/watch";
import { supabase, isSupabaseConfigured } from "./client";

/**
 * Loads saved cart items for a specific user from Supabase DB or per-user local storage.
 */
export async function loadCartForUser(userEmail: string): Promise<CartItem[]> {
  if (!userEmail) return [];

  const localKey = `aura_user_cart_${userEmail.trim().toLowerCase()}`;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("user_carts")
        .select("items")
        .eq("user_email", userEmail.trim().toLowerCase())
        .single();

      if (!error && data?.items) {
        return data.items as CartItem[];
      }
    } catch (err) {
      console.warn("Supabase cart load fallback to local store:", err);
    }
  }

  // Fallback / local user store
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(localKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  return [];
}

/**
 * Saves cart items for a specific user to Supabase DB and per-user local storage.
 */
export async function saveCartForUser(userEmail: string, items: CartItem[]): Promise<void> {
  if (!userEmail) return;

  const localKey = `aura_user_cart_${userEmail.trim().toLowerCase()}`;

  // Save to per-user local storage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(localKey, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save local user cart", e);
    }
  }

  // Save to Supabase DB if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("user_carts").upsert(
        {
          user_email: userEmail.trim().toLowerCase(),
          items: items,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_email" }
      );
    } catch (err) {
      console.warn("Supabase cart upsert error:", err);
    }
  }
}
