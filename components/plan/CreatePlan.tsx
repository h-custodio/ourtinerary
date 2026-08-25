"use client";

interface CreatePlanProps {
  onClick: () => void;
}

const CreatePlan = ({ onClick }: CreatePlanProps) => {
  return (
    <button type="button" className="btn btn-primary" onClick={onClick}>
      Create Plan
    </button>
  );
};

export default CreatePlan;
