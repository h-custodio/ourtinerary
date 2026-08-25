"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Plan from "@/components/Plan";
import CreatePlan from "@/components/plan/CreatePlan";
import AddPlanModal from "@/components/plan/AddPlanModal";
import EditPlanModal from "@/components/plan/EditPlanModal";
import { PlanData } from "@/component_types/plan";

interface PlanFullData {
  id: string;
  planData: PlanData;
}

type PlanMap = Record<string, PlanFullData>;

export default function Home() {
  const [planList, setPlanList] = useState<PlanMap>({});
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [prevPlan, setPrevPlan] = useState<PlanFullData>({
    id: "",
    planData: { title: "", description: "", date: new Date() },
  });

  // Adds a Plan
  const addPlan = (planData: PlanData) => {
    const id = crypto.randomUUID();
    const newPlan: PlanFullData = {
      id,
      planData,
    };

    setPlanList((prevPlan) => ({ ...prevPlan, [id]: newPlan }));
  };

  // Removes a Plan given an id
  const removePlan = (idToRemove: string) => {
    setPlanList((prevPlan) => {
      const copy = { ...prevPlan };
      delete copy[idToRemove];
      return copy;
    });
  };

  const updatePlan = (idToUpdate: string, newPlanData: PlanData) => {
    setPlanList((prevPlan) => ({
      ...prevPlan,
      [idToUpdate]: {
        ...prevPlan[idToUpdate],
        planData: newPlanData,
      },
    }));
  };

  return (
    <article style={{ width: "fit-content" }}>
      {isAddPlanOpen === true && (
        <div>
          <AddPlanModal
            isOpen={isAddPlanOpen}
            onClose={() => setIsAddPlanOpen(false)}
            onSubmitInputs={addPlan}
          />
        </div>
      )}
      {isEditPlanOpen === true && (
        <div>
          <EditPlanModal
            id={prevPlan.id}
            prevPlanData={prevPlan.planData}
            isOpen={isEditPlanOpen}
            onClose={() => setIsEditPlanOpen(false)}
            onSubmitInputs={updatePlan}
          />
        </div>
      )}
      <div className="d-flex flex-wrap gap-3 mb-2">
        {Object.values(planList).length === 0 && <h4>No Plans Created</h4>}
        {Object.values(planList).map((plan) => (
          <div key={plan.id}>
            <Plan
              plan={plan.planData}
              onClose={() => removePlan(plan.id)}
              openEdit={() => {
                setPrevPlan(plan);
                setIsEditPlanOpen(true);
              }}
            />
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-start">
        <CreatePlan onClick={() => setIsAddPlanOpen(true)} />
      </div>
    </article>
  );
}
