import supabaseServer from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "../../components/LogoutButton";

export default async function AccountDashboard() {

    // variable to be determined by api call
    // deconstruct data to access user
    const { data: {user}, error } = await supabaseServer.auth.getUser();

    if (error) {
        console.error("Failed to get user:", error);
        return;
    }

    // No authenticated user
    if (!user) {
        console.log("user not authenticated, no access");
        redirect("/login");
    }

    return (
        <div>
            <h1>Welcome</h1>

            <p>Logged in as: {user.email}</p>

            <LogoutButton></LogoutButton>
        </div>
    );
}

/*

NEXT SESSION TODOS:

DATABASE
8) Connect Next.js → Supabase
   - Finish profile creation/retrieval

FEATURES
9) Build core "social" functionality
   - Implement features one at a time
   - Handle basic validation + errors

QUALITY
10) Pre-PR check
   - Typecheck / lint / test / build
   - Clean up obvious issues

11) CI/CD
   - Set up basic CI
   - Deploy and verify production

LATER
12) Revisit architecture/ORM only if needed

*/