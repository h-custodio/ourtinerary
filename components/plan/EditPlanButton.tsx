"use client";
import { useState, useEffect, SubmitEvent, KeyboardEvent } from "react";
import { PlanData } from "@/component_types/plan";
import { formatDateToInput, parseInputToDate } from "@/utils/dateUtils";
import usePlan from "@/components/plan/usePlan";

interface EditPlanProps {
  onClick: () => void;
}

interface EditPlanModalProps {
  id: string;
  prevPlanData: PlanData;
  isOpen: Boolean;
  onClose: () => void;
}

export const EditPlanButton = ({ onClick }: EditPlanProps) => {
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

const EditPlanModal = ({
  id,
  prevPlanData,
  isOpen,
  onClose,
}: EditPlanModalProps) => {
  if (!isOpen) return null;

  const { loading, error, updatePlan } = usePlan();

  const [title, setTitle] = useState(prevPlanData.title);
  const [prevDescription, setPrevDescription] = useState(
    prevPlanData.description,
  );
  const [descriptionInput, setDescriptionInput] = useState("");
  const [date, setDate] = useState(formatDateToInput(prevPlanData.date));

  useEffect(() => {
    setTitle(prevPlanData.title);
    setPrevDescription(prevPlanData.description);
    if (prevPlanData.date) {
      setDate(formatDateToInput(prevPlanData.date));
    }
  }, [prevPlanData]);

  const submitInputs = (e: SubmitEvent) => {
    // Prevents default submit behaviour
    e.preventDefault();

    // Sets a default value if no Title or Description is inputted
    const finalTitle = title.trim() === "" ? prevPlanData.title : title;
    const finalDescription =
      descriptionInput.trim() === "" ? prevDescription : descriptionInput;

    updatePlan(id, {
      title: finalTitle,
      description: finalDescription,
      date: parseInputToDate(date),
    });

    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        const index = Array.from(form.elements).indexOf(e.currentTarget);
        const nextElement = form.elements[index + 1] as HTMLElement;
        if (nextElement) {
          nextElement.focus();
        }
      }
    }
  };

  return (
    <article
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Plan</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <form onSubmit={submitInputs}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Plan title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Plan description"
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => {
                    const input = e.target.value;
                    setDate(
                      input !== ""
                        ? input
                        : formatDateToInput(prevPlanData.date),
                    );
                  }}
                  onKeyDown={handleKeyDown}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </article>
  );
};

export default EditPlanModal;
