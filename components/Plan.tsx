"use client";
import { useState } from "react";

import Activity from "./Activity";
import AddActivity from "./activity/AddActivity";
import EditPlan from "./plan/EditPlan";
import AddActivityModal from "./activity/AddActivityModal";
import EditActivityModal from "./activity/EditActivityModal";
import { ActivityData } from "@/component_types/activity";
import { PlanData } from "@/component_types/plan";

interface PlanProps {
  plan: PlanData;
  onClose: () => void;
  openEdit: () => void;
}

interface ActivityFullData {
  id: string;
  activityData: ActivityData;
}

type ActivityMap = Record<string, ActivityFullData>;

const Plan = ({ plan, onClose, openEdit }: PlanProps) => {
  const [activityList, setActivityList] = useState<ActivityMap>({});
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isEditActivityOpen, setIsEditActivityOpen] = useState(false);
  const [prevActivity, setPrevActivity] = useState<ActivityFullData>({
    id: "",
    activityData: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      address: { street: "", city: "", province: "", zipCode: "", country: "" },
    },
  });

  // Adds an Activity
  const addActivity = (activityData: ActivityData) => {
    const id = crypto.randomUUID();
    const newActivity: ActivityFullData = {
      id,
      activityData,
    };

    setActivityList((prevActivity) => ({
      ...prevActivity,
      [id]: newActivity,
    }));
  };

  // Removes an Activity given an id
  const removeActivity = (idToRemove: string) => {
    setActivityList((prevActivity) => {
      const copy = { ...prevActivity };
      delete copy[idToRemove];
      return copy;
    });
  };

  const updateActivity = (
    idToUpdate: string,
    newActivityData: ActivityData,
  ) => {
    setActivityList((prevActivity) => ({
      ...prevActivity,
      [idToUpdate]: {
        ...prevActivity[idToUpdate],
        activityData: newActivityData,
      },
    }));
  };

  return (
    <article>
      {isAddActivityOpen === true && (
        <div>
          <AddActivityModal
            isOpen={isAddActivityOpen}
            onClose={() => setIsAddActivityOpen(false)}
            onSubmitInputs={addActivity}
          />
        </div>
      )}
      {isEditActivityOpen === true && (
        <div>
          <EditActivityModal
            id={prevActivity.id}
            prevActivityData={prevActivity.activityData}
            isOpen={isEditActivityOpen}
            onClose={() => setIsEditActivityOpen(false)}
            onSubmitInputs={updateActivity}
          />
        </div>
      )}
      <div className="d-inline-block border p-3 position-relative">
        <button
          type="button"
          className="btn-close position-absolute top-0 end-0 m-2"
          aria-label="Remove Plan"
          onClick={() => onClose()}
        />
        <h4 className="m-0">{plan.title}</h4>
        <p className="mb-2 m-0">
          {plan.date.getMonth() +
            1 +
            "/" +
            plan.date.getDate() +
            "/" +
            plan.date.getFullYear()}
        </p>
        <p className="mb-2">{plan.description}</p>
        {Object.keys(activityList).length === 0 && (
          <p className="mb-2">No Activities Added</p>
        )}
        <div className="d-inline-block">
          <div className="d-flex flex-wrap gap-3 mb-2">
            {Object.values(activityList).map((activity) => (
              <div key={activity.id}>
                <Activity
                  activity={activity.activityData}
                  onClose={() => removeActivity(activity.id)}
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

export default Plan;
