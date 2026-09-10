"use client";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";

import Link from "next/link";
import { useRouter } from "next/navigation";

import supabase from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: user, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Failed to get user:", userError);
        return;
      }

      if (user) {
        router.push("/account");
      }
    }

    checkUser();
  }, [router]);

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> {
    // lets React handle submission
    // normal browser behaviour is to reload page
    e.preventDefault();

    setMessage("Logging in...");

    // // uses Supabase API on the initialized client to log in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // // login handling validation
    if (error) {
      setMessage(error.message);
      console.log("error with logging in: ", error.message);
      return;
    }

    setMessage("Successfully logged in!");
    console.log("logged in: ", data.user);
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md my-12 mx-auto p-4 overflow-hidden">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">Welcome back!</h1>
        <p className="text-lg text-muted-foreground">
          Sign in to your account.
        </p>
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
          <p className="text-sm text-center text-bg-red-500">{message}</p>
        )}

        <Button type="submit" className="w-full py-4 text-lg font-bold">
          Log in
        </Button>

        <div className="flex justify-center text-sm">
          <p className="inline-flex items-center gap-1 text-muted-foreground">
            Already have an account?
            <Link
              href="/auth/signup"
              className={`${buttonVariants({ variant: "link" })} !text-accent !p-0`}
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
