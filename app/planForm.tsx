"use client";

import { useState } from "react";
import Plan from "@/components/plan/PlanComponent";
import AddPlanModal, { AddPlanButton } from "@/components/plan/AddPlanButton";
import usePlan from "@/components/plan/usePlan";
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
  const { plans, loading, error, deletePlan } = usePlan();

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
          />
        </div>
      )}
      {isEditPlanOpen === true && (
        <div>
          <EditPlanModal
            // ==============
            // ID NEEDED HERE
            // ==============
            id={selectedPlanID.id}
            selectedPlanData={plans[selectedPlanID].planData}
            isOpen={isEditPlanOpen}
            onClose={() => setIsEditPlanOpen(false)}
          />
        </div>
      )}
      <div className="d-flex flex-wrap gap-3 mb-2">
        {plans.length === 0 && <p className="mb-2">No Plans Found</p>}
        {plans.map((plan) => (
          // ==============
          // ID NEEDED HERE
          // ==============
          <div key={plan.id}>
            <Plan
              planToPass={{ ...plan, date: new Date(plan.date) }}
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
