import { PlanForm } from "@/components/plan/PlanForm";
import { redirect } from "next/navigation";
import supabaseServer from "@/lib/supabase/server";

export default async function PlanPage() {
    // verify that user is authenticated
    const { data: {user}, error } = await supabaseServer.auth.getUser();


    if (error) {
        console.error("Failed to get user:", error);
        return;
    }

    // No authenticated user
    if (!user) {
        console.log("user not authenticated, no access");
        redirect("auth/login");
    }


  return (
    <div>
      <PlanForm />
    </div>
  );
}