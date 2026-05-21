import { createClient } from "@supabase/supabase-js";

const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || key === "YOUR_ANON_KEY_HERE") {
    console.error("Supabase environment variables are missing or invalid.");
    return null;
  }

  return createClient(url, key);
};

export const supabase = getSupabaseClient();
export const isSupabaseReady = !!supabase;
