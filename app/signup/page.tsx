"use client";

import { useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabase/client"; // global variable from lib/supabase/client.ts

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>): Promise<void> {
        // lets React handle submission
        // normal browser behaviour is to reload page
        e.preventDefault();
        
        setMessage("Signing up...");

        // uses Supabase API on the initialized client to log in
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        // signup handling validation
        if (error) {
            setMessage(error.message);
            console.log("error with signing up: ", error.message );
            return;
        }

        setMessage("Account created! Check your email to confirm your account.");
        console.log("Account created:", data.user);
    }

    return (
        <div>
            <h1>Sign up your account!</h1>

            <form onSubmit={handleSubmit}>
                <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required // browser validates for empty input 
                />
                <br></br>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"  
                required // browser validates for empty input           
                />

                <p>{message}</p>
                <button>Sign Up</button>
                <br></br>
                <Link href="/login">Already have an account? Log in</Link>
            </form>
        </div>
    );
}

