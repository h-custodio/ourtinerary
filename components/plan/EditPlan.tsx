"use client";

interface EditPlanProps {
  onClick: () => void;
}

const EditPlan = ({ onClick }: EditPlanProps) => {
  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      onClick={onClick}
    >
      Edit Plan
    </button>
  );
};

export default EditPlan;
