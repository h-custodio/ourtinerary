"use client";

interface EditActivityProps {
  onClick: () => void;
}

const EditActivity = ({ onClick }: EditActivityProps) => {
  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={onClick}
      style={
        {
          "--bs-btn-padding-y": ".25rem",
          "--bs-btn-padding-x": ".5rem",
          "--bs-btn-font-size": ".75rem",
        } as React.CSSProperties
      }
    >
      Edit Activity
    </button>
  );
};

export default EditActivity;
