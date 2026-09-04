"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

import supabase from "@/lib/supabase/client"; // global variable from lib/supabase/client.ts

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    // lets React handle submission
    // normal browser behaviour is to reload page
    e.preventDefault();

    setMessage("Logging in...");

    // // uses Supabase API on the initialized client to log in
    // const { data, error } = await supabase.auth.signInWithPassword({
    //     email,
    //     password
    // });

    // // login handling validation
    // if (error) {
    //     setMessage(error.message);
    //     console.log("error with logging in: ", error.message)
    //     return;
    // }

    // setMessage("Successfully logged in!");
    // console.log("logged in: ", data.user);
  }

  return (
    <div className="flex-1 max-w-[20%] my-30 mx-auto rounded-2xl border border-border bg-card p-4 shadow-2xl overflow-hidden">
      <h1 className="mb-4">Login</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required // browser validates for empty input
          />
        </div>

        <div className="mb-2">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required // browser validates for empty input
          />
        </div>

        <p>{message}</p>
        <div className="flex justify-center mb-2">
          <Button type="submit">Log In</Button>
        </div>

        <div className="flex justify-center">
          <p className="inline-flex items-center gap-1 text-muted-foreground">
            Don't have an account?
            <Link
              href="/auth/signup"
              className={`${buttonVariants({ size: "default", variant: "link" })} !text-accent !p-0`}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
