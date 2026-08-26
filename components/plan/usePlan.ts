
"use client";

import { useCallback, useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";
import { PlanData, Plan } from "@/component_types/plan";

export default function usePlan() {
  const [plan, setPlan] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);     // loading state to keep page from being empty
  const [error, setError] = useState<string | null>(null);

  // useCallback keeps same function reference in between renders
  const fetchPlan = useCallback(async () => {
    setLoading(true); // resets to default on refetch
    setError(null);   // resets to default on refetch

    const { data, error } = await supabase
      .from("plan")
      .select("*");

    if (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setPlan(data);
    setLoading(false);
  }, []);

  // runs fetchPlan() after render
  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]); // runs this effect when fetchPlan changes

  const createPlan = async (planData: PlanData) => {
    // insert planData (from user input) into database
    const { data, error } = await supabase
      .from("plan")
      .insert(planData) // insert the contents of planData directly
      .select()   // tells what was inserted
      .single();  // return a row's object rather than array


    if (error) {
      console.error("failed to insert: ", error);
      return;
    }

    console.log("Inserted: ", data);
    setPlan((prev) => [...prev, data]); // updates local state

    // returns newly inserted data
    return data;
  };

  const deletePlan = async (idToRemove: string) => {
    const { error } = await supabase
      .from("plan")
      .delete()
      .eq("plan_id", idToRemove)

    if (error) {
      console.error("failed to delete: ", error);
      return;
    }
     
    setPlan((prev) =>
      prev.filter((plan) => plan.plan_id !== idToRemove)
    );
  };

  const updatePlan = async (idToUpdate: string, newPlanData: PlanData) => {
  // updates a plan row in the db given an id and new input
    const { data, error } = await supabase
      .from("plan")
      .update(newPlanData)
      .eq("plan_id", idToUpdate)
      .select()
      .single(); 

    if (error) {
      console.error("failed to update: ", error);
      return
    }

    setPlan((prev) =>
      prev.map((plan) =>
        plan.plan_id === idToUpdate? data : plan
      )
    );

    // returns newly updated data
    return data;
  };

  return {
    plan,
    loading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
    refetch: fetchPlan,
  };
}