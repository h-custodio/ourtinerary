"use client";
import { useState, useEffect, SubmitEvent, KeyboardEvent } from "react";
import { PlanData } from "@/component_types/plan";
import { formatDateToInput, parseInputToDate } from "@/utils/dateUtils";

interface EditPlanModalProps {
  id: string;
  prevPlanData: PlanData;
  isOpen: Boolean;
  onClose: () => void;
  onSubmitInputs: (id: string, inputs: PlanData) => void;
}

const EditPlanModal = ({
  id,
  prevPlanData,
  isOpen,
  onClose,
  onSubmitInputs,
}: EditPlanModalProps) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(prevPlanData.title);
  const [description, setDescription] = useState(prevPlanData.description);
  const [date, setDate] = useState(formatDateToInput(prevPlanData.date));

  useEffect(() => {
    setTitle(prevPlanData.title);
    setDescription(prevPlanData.description);
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
      description.trim() === "" ? prevPlanData.description : description;
    onSubmitInputs(id, {
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
