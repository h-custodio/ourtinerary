"use client";

import supabase from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    // a react hook
    const router = useRouter();

    async function handleLogout(): Promise<void> {
        const { error } = await supabase.auth.signOut();    
    
        if (error) {
            console.log("Logout error: ", error);
        }

        console.log("routing back to login");
        router.push("/login"); 
    }

    return (
        <button onClick={handleLogout}>
            Log out
        </button>
    );
}