"use client";

import { useState } from "react";
import Plan from "@/components/plan/PlanComponent";
import AddPlanModal, { AddPlanButton } from "@/components/plan/AddPlanButton";
import EditPlanModal from "@/components/plan/EditPlanButton";

// ============================================================
// NOTICE FOR DB UPDATES
// NOTICE FOR DB UPDATES

// supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > database.types.ts
// add clearance and authorization
// add more validation!!!! (Zod?)

// NOTICE FOR DB UPDATES
// NOTICE FOR DB UPDATES
// ============================================================

export default function Home() {
  const {
    plans,
    loading,
    error,
    createPlan,
    updatePlan,
    deletePlan,
  } = usePlan();

  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [selectedPlanID, setselectedPlanID] = useState<string | null>(null);

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
            id={selectedPlan.id}
            selectedPlanData={selectedPlan.planData}
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
              onClose={() => deletePlan(plan.id)}
              openEdit={() => {
                setselectedPlanID(plan.id);
                setIsEditPlanOpen(true);
              }}
            />
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-start">
        <AddPlanButton onClick={() => setIsAddPlanOpen(true)} />
      </div>
    </article>
  );
}
