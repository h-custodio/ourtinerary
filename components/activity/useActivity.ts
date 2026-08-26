"use client";

import { useCallback, useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";
import { ActivityData, Activity } from "@/component_types/activity";

export function useActivity(planId: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);     // loading state to keep page from being empty
  const [error, setError] = useState<string | null>(null);

  // useCallback keeps same function reference in between renders
  const fetchActivities = useCallback(async () => {
    setLoading(true); // resets to default on refetch
    setError(null);   // resets to default on refetch

    const { data, error } = await supabase
      .from("activity")
      .select("*")
      .eq("plan_id", planId);

    if (error) {
      console.error(error);
      setError(error.message);
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

  const createActivity = async (activityData: ActivityData) => {
    // insert activityData (from user input) into database
    const { data, error } = await supabase
      .from("activity")
      .insert({
        ...activityData,
        plan_id: planId,
      }) // insert the contents of activityData directly
      .select()   // tells what was inserted
      .single();  // return a row's object rather than array

    if (error) {
      console.error("failed to insert: ", error);
      return;
    }

    console.log("Inserted: ", data);
    setActivities((prev) => [...prev, data]); // updates local state

    // returns newly inserted data
    return data;
  };

  const deleteActivity = async (idToRemove: string) => {
    const { error } = await supabase
      .from("activity")
      .delete()
      .eq("activity_id", idToRemove)
      .eq("plan_id", planId);

    if (error) {
      console.error("failed to delete: ", error);
      return;
    }

    setActivities((prev) =>
      prev.filter((activity) => activity.activity_id !== idToRemove)
    );
  };

  const updateActivity = async (
    idToUpdate: string,
    newActivityData: ActivityData
  ) => {
    // updates an activity row in the db given an id and new input
    const { data, error } = await supabase
      .from("activity")
      .update(newActivityData)
      .eq("activity_id", idToUpdate)
      .eq("plan_id", planId)
      .select()
      .single();

    if (error) {
      console.error("failed to update: ", error);
      return;
    }

    setActivities((prev) =>
      prev.map((activity) =>
        activity.activity_id === idToUpdate ? data : activity
      )
    );

    // returns newly updated data
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
