"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabase/client"; // global variable from lib/supabase/client.ts

export default function loginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>): Promise<void> {
        // lets React handle submission
        // normal browser behaviour is to reload page
        e.preventDefault();
        
        setMessage("Logging in...");

        // uses Supabase API on the initialized client to log in
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        // login handling validation
        if (error) {
            setMessage(error.message);
            console.log("error with logging in")
            return;
        }

        setMessage("Successfully logged in!");
        console.log("email and password submitted, successful login");
    }

    return (
        <div>
            <h1>Login Page</h1>

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
                <button>Log In</button>
                <br></br>
                <Link href="/signup">Sign Up</Link>
            </form>
        </div>
    );
}

