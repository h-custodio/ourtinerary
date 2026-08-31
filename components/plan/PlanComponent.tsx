"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

import supabase from "@/lib/supabase/client";
import { ActivityData } from "@/component_types/activity";
import { PlanData } from "@/component_types/plan";
import { useActivity } from "@/hooks/useActivities";
import { parseAddress } from "@/utils/addressUtils";

import Activity from "../activity/ActivityComponent";
import AddActivity from "../activity/AddActivityButton";
import EditActivityModal from "../activity/EditActivityButton";
import EditPlan from "./EditPlanButton";

interface PlanProps {
  planToPass: PlanData;
  openEdit: () => void;
}

// TODO: find a way to get the current plan's ID since usePlan has only an array

const PlanComponent = ({ planToPass, openEdit }: PlanProps) => {
  const { activities, loading, error, updateActivity } = useActivity(.plan_id);


  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isEditActivityOpen, setIsEditActivityOpen] = useState(false);
  const [prevActivity, setPrevActivity] = useState<ActivityData>({
    // ==============
    // ID NEEDED HERE
    // ==============
    activity_id: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      address: {
        street: "",
        city: "",
        province: "",
        zipCode: "",
        country: "",
      },
    },
  });

  async function getUserID() {

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

    return user.id;
  }

  return (
    <article>
      {isAddActivityOpen === true && (
        <div>
          <AddActivityModal
            isOpen={isAddActivityOpen}
            onClose={() => setIsAddActivityOpen(false)}
          />
        </div>
      )}
      {isEditActivityOpen === true && (
        <div>
          <EditActivityModal
            // ==============
            // ID NEEDED HERE
            // ==============
            id={prevActivity.id}
            prevActivityData={prevActivity}
            isOpen={isEditActivityOpen}
            onClose={() => setIsEditActivityOpen(false)}
            onSubmitInputs={updateActivity(prevActivity.id)}
          />
        </div>
      )}
      <div className="d-inline-block border p-3 position-relative">
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-2"
          aria-label="Remove Plan"
          // ==============
          // ID NEEDED HERE
          // ==============
          onClick={deletePlan(plan_id)} // MOVE THIS OUTSIDE WITH PLANFORM
        />
        <h4 className="m-0">{planToPass.title}</h4>
        <p className="mb-2 m-0">
          {planToPass.date.getMonth() +
            1 +
            "/" +
            planToPass.date.getDate() +
            "/" +
            planToPass.date.getFullYear()}
        </p>
        <p className="mb-2">{planToPass.description}</p>
        {activities.length === 0 && <p className="mb-2">No Activities Added</p>}
        <div className="d-inline-block">
          <div className="d-flex flex-wrap gap-3 mb-2">
            {activities.map((activity) => (
              // ==============
              // ID NEEDED HERE
              // ==============
              <div key={activity.id}>
                <Activity
                  activityToPass={{
                    ...activity,
                    startTime: activity.start_time,
                    endTime: activity.end_time,
                    address: parseAddress(activity.location),
                  }}
                  openEdit={() => {
                    setPrevActivity(activity);
                    setIsEditActivityOpen(true);
                  }}
                />
              </div>
            ))}
          </div>
          <div className="d-flex gap-1 justify-content-start">
            <AddActivity onClick={() => setIsAddActivityOpen(true)} />
            <EditPlan onClick={openEdit} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default PlanComponent;
