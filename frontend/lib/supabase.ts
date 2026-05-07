import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const ready = url && key && key !== "YOUR_ANON_KEY_HERE";

if (!ready) console.warn("[SignSafe] Supabase not configured — auth disabled");

export const supabase = ready ? createClient(url!, key!) : null;
export const isSupabaseReady = !!ready;
