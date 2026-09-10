"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

import supabase from "@/lib/supabase/client"; // global variable from lib/supabase/client.ts

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    // lets React handle submission
    // normal browser behaviour is to reload page
    e.preventDefault();

    setMessage("Signing up...");

    // uses Supabase API on the initialized client to log in
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {display_name: displayName }
      }
    });

    // // signup handling validation
    if (error) {
      setMessage(error.message);
      console.log("error with signing up: ", error.message);
      return;
    }

    setMessage("Account created! Please log in.");
    console.log("Account created:", data.user);
  }

  return (
    <div className="w-full max-w-md my-12 mx-auto p-4 overflow-hidden">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">Join Ourtinerary!</h1>
        <p className="text-lg text-muted-foreground">Create a free account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="mb-1 text-muted-foreground block">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="py-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="displayName" className="mb-1 text-muted-foreground block">
            Display Name
          </Label>
          <Input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="username"
            className="py-2"
            required
          />
        </div>

        <div>
          <Label
            htmlFor="password"
            className="mb-1 text-muted-foreground block"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="py-2"
            required
          />
        </div>

        {message && (
          <p className="text-sm text-center text-red-500">{message}</p>
        )}

        <Button type="submit" className="w-full py-4 text-lg font-bold">
          Sign up
        </Button>

        <div className="flex justify-center text-sm">
          <p className="inline-flex items-center gap-1 text-muted-foreground">
            Already have an account?
            <Link
              href="/auth/login"
              className={`${buttonVariants({ variant: "link" })} !text-accent !p-0`}
            >
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
