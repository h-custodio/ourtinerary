"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

import supabase from "@/lib/supabase/client"; // global variable from lib/supabase/client.ts

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    // lets React handle submission
    // normal browser behaviour is to reload page
    e.preventDefault();

    setMessage("Signing up...");

    // uses Supabase API on the initialized client to log in
    // const { data, error } = await supabase.auth.signUp({
    //     email,
    //     password
    // });

    // // signup handling validation
    // if (error) {
    //     setMessage(error.message);
    //     console.log("error with signing up: ", error.message );
    //     return;
    // }

    // setMessage("Account created! Check your email to confirm your account.");
    // console.log("Account created:", data.user);
  }

  return (
    <div className="flex-1 max-w-[20%] my-30 mx-auto rounded-2xl border border-border bg-card p-4 shadow-2xl overflow-hidden">
      <h1 className="mb-4">Sign up your account!</h1>

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
          <Button type="submit">Sign up</Button>
        </div>

        <div className="flex justify-center">
          <p className="inline-flex items-center gap-1 text-muted-foreground">
            Already have an account?
            <Link
              href="/auth/login"
              className={`${buttonVariants({ size: "default", variant: "link" })} !text-accent !p-0`}
            >
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
