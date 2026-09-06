import { PlanForm } from "@/components/plan/PlanForm";
import { redirect } from "next/navigation";
import createClient from "@/lib/supabase/server";

export default async function PlanPage() {
    const supabaseServer = await createClient();

    const {
        data: { user },
        error,
    } = await supabaseServer.auth.getUser();

    console.log("PLAN PAGE USER:", user);
    console.log("PLAN PAGE ERROR:", error);

    if (error) {
        console.error("Failed to get user:", error);
        return <div>Auth error: {error.message}</div>;
    }

    if (!user) {
        console.log("user not authenticated, no access");
        redirect("/auth/login");
    }

    return (
        <div className="flex-1 px-8 pb-12 pt-25 max-w-5xl mx-auto w-full text-center">
            <PlanForm />
        </div>
    );
}

