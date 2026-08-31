"use client";

import { useCallback, useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";
import {  Activity, ActivityInsert, ActivityUpdate } from "@/types/activity";
import  getCurrentPlanMember  from "@/utils/currentUserUtils";

export default function useActivity(planId: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);     // loading state to keep page from being empty
  const [error, setError] = useState<string | null>(null);

  // useCallback keeps same function reference in between renders
  const fetchActivities = useCallback(async () => {
    setLoading(true); // resets to default on refetch
    setError(null);   // resets to default on refetch

    const { data, error: activityError } = await supabase
      .from("activity")
      .select("*")
      .eq("plan_id", planId);

    if (activityError) {
      console.error(activityError);
      setError(activityError.message);
      setLoading(false);
      return;
    }

    setActivities(data);
    setLoading(false);
  }, [planId]);

  // runs fetchActivities() after render
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]); // runs this effect when fetchActivities changes

  const createActivity = async (activityData: ActivityInsert) => {
    const result = await getCurrentPlanMember(planId);

    if (!result) { 
      setError("You must be signed in and a member of this plan");
      return;
    }
    
    // clearance levels 0 and 1 can add activities
    // RLS independently enforces this rule at the database level
    if (result.clearance > 1) {
      setError("You do not have permission to add activities to this plan");
      return;
    }

    const { data, error: activityError } = await supabase
      .from("activity")
      .insert({
        ...activityData,
        plan_id: planId,
      }) 

    if (activityError) {
      console.error("failed to insert activity: ", activityError);
      setError(activityError.message);
      return;
    }

    await fetchActivities();

    return data;
  };

  const deleteActivity = async (idToRemove: string) => {
    const result = await getCurrentPlanMember(planId);

    if (!result) { 
      setError("You must be signed in and a member of this plan");
      return;
    }
    
    // clearance levels 0 and 1 can remove activities
    // RLS independently enforces this rule at the database level
    if (result.clearance > 1) {
      setError("You do not have permission to remove activities from this plan");
      return;
    }
  
    const { data, error: activityError } = await supabase
      .from("activity")
      .delete()
      .eq("activity_id", idToRemove)
      .eq("plan_id", planId);

    if (activityError) {
      console.error("failed to delete: ", activityError);
      setError(activityError.message);
      return;
    }

    await fetchActivities();

    return data;
  };

  const updateActivity = async (idToUpdate: string, newActivityData: ActivityUpdate) => {
    const result = await getCurrentPlanMember(planId);

    if (!result) { 
      setError("You must be signed in and a member of this plan");
      return;
    }
    
    // clearance levels 0 and 1 can modify activities
    // RLS independently enforces this rule at the database level
    if (result.clearance > 1) {
      setError("You do not have permission to edit activities from this plan");
      return;
    }

    // updates an activity row in the db given an id and new input
    const { data, error: activityError } = await supabase
      .from("activity")
      .update(newActivityData)
      .eq("activity_id", idToUpdate)
      .eq("plan_id", planId);

    if (activityError) {
      console.error("failed to update: ", error);
      setError(activityError.message);
      return;
    }

    await fetchActivities();

    return data;
  };

  return {
    activities,
    loading,
    error,
    createActivity,
    updateActivity,
    deleteActivity,
    refetch: fetchActivities,
  };
}
