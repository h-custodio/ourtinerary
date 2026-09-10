import createClient from "@/lib/supabase/server";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

import TotalPlans from "./TotalPlans";

export default async function AccountHeader() {
  const supabaseServer = await createClient();

  const {
    data: { user },
    error,
  } = await supabaseServer.auth.getUser();

  if (error) {
    console.error("Failed to get user:", error);
    return;
  }

  return (
    <>
      <div className="flex justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold">
            {user?.user_metadata?.display_name || user?.email}
          </h1>
          <p className="text-lg">
            <span className="font-bold">Joined: </span>
            {user?.created_at.substring(0, 10)}
          </p>
        </div>

        <TotalPlans />
      </div>

      <div className="flex justify-between mb-3">
        <h2 className="text-2xl font-bold text-accent">— Upcoming Plans</h2>
        <Link
          href="/plans/new"
          className={buttonVariants({ size: "lg", variant: "default" })}
        >
          Create Plan
        </Link>
      </div>
    </>
  );
}
