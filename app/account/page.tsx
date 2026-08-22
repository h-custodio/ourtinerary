import supabaseServer from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "../components/LogoutButton";

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

AUTH
5) Test complete auth flow

DATABASE
6) Design the initial DB schema
7) Create tables in Supabase
8) Decide whether we actually need an ORM

FEATURES
9) Build the core "social" functionality
10) Tooling / Pre-PR run check
11) CI / CD / Testing

*/