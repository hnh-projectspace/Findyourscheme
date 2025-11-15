import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage,         // 🔥 Force stable storage
      storageKey: "fms-auth",        // 🔥 Unique storage key (avoid conflict)
    }
  }
);

export default supabase;
