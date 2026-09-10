"use client";

import { useCallback, useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";
import { Plan, PlanInsert, PlanUpdate } from "@/types/plan";
import  getCurrentPlanMember  from "@/utils/currentUserUtils";

// Supabase handles knowing who the current user is if they are authenticated
export default function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true); // loading state to keep page from being empty
  const [error, setError] = useState<string | null>(null);

  // retrieve all membership rows belonging to this plan
  // RLS determines which rows the authenticated user is allowed to see
  // useCallback keeps same function reference in between renders
  const fetchPlans = useCallback(async () => { 
    setLoading(true); // resets to default on refetch
    setError(null); // resets to default on refetch

    // RLS restricts this query to plans the current authenticated user has access to
    const { data, error: fetchError } = await supabase
      .from("plan")
      // RLS removes rows so this is select * of this current authenticated user
      .select("*") 

    if (fetchError) {
      console.error(fetchError);
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setPlans(data);
    setLoading(false);
  }, []);

  // runs fetchPlans() after render
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]); // runs this effect when fetchPlans changes

  const createPlan = async (planData: PlanInsert) => {
    // get authenticated user id
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      const errorMessage = userError?.message ?? "User is not authenticated";
      console.error(errorMessage);
      setError(errorMessage);
      return;
    }

    // Create plan + initial plan_member through the database function
    const { data: planId, error: planError } = await supabase.rpc(
      "create_plan",
      {
        plan_title: planData.title,
        plan_date: planData.date,
        plan_description: planData.description,
      }
    );

    if (planError || !planId) {
      const errorMessage = planError?.message ?? "Failed to create plan";
      console.error(errorMessage);
      setError(errorMessage);
      return;
    }

      // RPC gave us the ID, so retrieve the actual plan
    const { data: createdPlan, error: fetchError } = await supabase
      .from("plan")
      .select("*")
      .eq("plan_id", planId)
      .single();

    if (fetchError || !createdPlan) {
      const errorMessage =
        fetchError?.message ?? "Failed to retrieve created plan";

      console.error(errorMessage);
      setError(errorMessage);
      return;
    }

    await fetchPlans(); 
    
    return createdPlan;
  };

  const deletePlan = async (idToRemove: string) => {
    // client-side permission check.
    // RLS independently enforces that only the host can delete.
    const result = await getCurrentPlanMember(idToRemove);

    if (!result) {
      setError("You must be signed in and a member of this plan");
      return;
    }

    // clearance 0 = host.
    if (result.clearance !== 0) {
      setError("Only the host can delete this plan");
      return;
    }

    const { data, error: planError } = await supabase
      .from("plan")
      .delete()
      .eq("plan_id", idToRemove);

    if (planError) {
      console.error(planError);
      setError(planError.message);
      return;
    }

    await fetchPlans(); 

    return data;
  };

  const updatePlan = async (idToUpdate: string, newPlanData: PlanUpdate) => {
    // client-side permission check.
    // clearance levels 0 and 1 can edit plan details.
    // RLS independently enforces this rule.
    const result = await getCurrentPlanMember(idToUpdate);

    if (!result) {
        setError("You must be signed in and a member of this plan");
        return;
    }

    if (result.clearance > 1) {
        setError("You do not have permission to edit this plan");
        return;
    }

    // updates a plan row in the db given an id and new input
    const { data, error: planError } = await supabase
      .from("plan")
      .update(newPlanData)
      .eq("plan_id", idToUpdate);

    if (planError) {
      console.error(planError);
      setError(planError.message);
      return;
    }

   await fetchPlans();
   
   return data;
  };

  return {
    plans,
    loading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    refetch: fetchPlans,
  };
}
