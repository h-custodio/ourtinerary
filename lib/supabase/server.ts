import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

export async function createClient() {
    // access to the cookies belonging to the current request
    const cookieStore = await cookies();

    return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
        cookies: {
            getAll() {
                // get all cookies
                return cookieStore.getAll(); 
            },

            // the cookies that are to be modified 
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                } catch {
                    // Server Component can't set cookies.
                }
            }
        }
    });
}

const supabaseServer = await createClient();

export default supabaseServer;