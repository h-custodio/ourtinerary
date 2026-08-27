"use client";

import { useState } from "react";

import Activity from "../activity/ActivityComponent";
import AddActivity from "../activity/AddActivityButton";
import EditPlan from "./EditPlanButton";
import AddActivityModal from "../activity/AddActivityButton";
import EditActivityModal from "../activity/EditActivityButton";
import { ActivityData } from "@/component_types/activity";
import { PlanData } from "@/component_types/plan";
import { useActivity } from "@/components/activity/useActivity";
import { parseAddress } from "@/utils/addressUtils";
import usePlan from "@/components/plan/usePlan";

interface PlanProps {
  planToPass: PlanData;
  openEdit: () => void;
}

const PlanComponent = ({ planToPass, openEdit }: PlanProps) => {
  const { activities, loading, error, updateActivity } = useActivity(
    planToPass.plan_id,
  );

  const { planLoad, planErr, deletePlan } = usePlan();

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
          onClick={deletePlan(plan_id)}
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
