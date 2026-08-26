import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// create/return Supabase client for code to communicate with
export function createClient(): SupabaseClient {
  // client is aware of the project's database
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

const supabase: SupabaseClient = createClient();


export default supabase;