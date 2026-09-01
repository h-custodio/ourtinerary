"use client";

import { useState } from "react"
import supabase from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { Plan } from "@/types/plan"
import { PlanForm } from "@/components/plan/PlanForm";

export default async function AccountDashboard() {
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    // verify that user is authenticated
    const { data: {user}, error } = await supabase.auth.getUser();

    if (error) {
        console.error("Failed to get user:", error);
        return;
    }

    // No authenticated user
    if (!user) {
        console.log("user not authenticated, no access");
        redirect("/login");
    }

    return (
        <div>
            <h1>Welcome</h1>
            <PlanForm></PlanForm>
        </div>
    );
}

