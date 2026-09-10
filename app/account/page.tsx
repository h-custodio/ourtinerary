import createClient from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import AccountHeader from "@/components/account/AccountHeader";
import AccountPlans from "@/components/account/AccountPlans";

export default async function AccountDashboard() {
  // verify that user is authenticated
  const supabaseServer = await createClient();
  const { data: user, error } = await supabaseServer.auth.getUser();

  if (error) {
    console.error("Failed to get user:", error);
    return;
  }

  // No authenticated user
  if (!user) {
    console.log("user not authenticated, no access");
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 px-8 py-12 max-w-4xl mx-auto w-full">
      <AccountHeader />
      <AccountPlans />
    </div>
  );
}
