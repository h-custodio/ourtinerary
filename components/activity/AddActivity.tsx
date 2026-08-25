"use client";

interface AddActivityProps {
  onClick: () => void;
}

const AddActivity = ({ onClick }: AddActivityProps) => {
  return (
    <button type="button" className="btn btn-primary" onClick={onClick}>
      Add Activity
    </button>
  );
};

export default AddActivity;
