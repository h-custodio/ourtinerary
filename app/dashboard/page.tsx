"use client";

import { useState } from "react"
import supabase from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { Plan } from "@/types/plan"
import { PlanForm } from "@/components/plan/PlanForm";

export default function AccountDashboard() {
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

    // // verify that user is authenticated
    // const { data: {user}, error } = await supabase.auth.getUser();

    // if (error) {
    //     console.error("Failed to get user:", error);
    //     return;
    // }

    // // No authenticated user
    // if (!user) {
    //     console.log("user not authenticated, no access");
    //     redirect("/login");
    // }

    return (
        <div>
            <h1>Welcome</h1>

            {/* <p>Logged in as: {user.email}</p> */}

            



            <>
            {/* your plans */}

            {/* {plans.map((plan) => (
            <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={() => setEditingPlan(plan)}
            />
            ))}

            <PlanDialog
                plan={editingPlan}
                open={editingPlan !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingPlan(null);
            }}
            /> */}

            <PlanForm />


            <LogoutButton></LogoutButton>
            </>
        </div>
    );
}

