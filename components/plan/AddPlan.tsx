"use client";

interface AddPlanProps {
  onClick: () => void;
}

const AddPlanButton = ({ onClick }: AddPlanProps) => {
  return (
    <button type="button" className="btn btn-primary" onClick={onClick}>
      Create Plan
    </button>
  );
};

export default AddPlanButton;
