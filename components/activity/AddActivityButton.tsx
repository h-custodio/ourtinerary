"use client";

import { useState, SubmitEvent, KeyboardEvent } from "react";
import { ActivityData } from "@/component_types/activity";
import { Address } from "@/component_types/address";
import { parseAddress } from "@/utils/addressUtils";
import { useActivity } from "@/components/activity/useActivity";

interface AddActivityModalProps {
  isOpen: Boolean;
  onClose: () => void;
}

interface AddActivityProps {
  onClick: () => void;
}

export const AddActivityButton = ({ onClick }: AddActivityProps) => {
  return (
    <button type="button" className="btn btn-primary" onClick={onClick}>
      Add Activity
    </button>
  );
};

const AddActivityModal = ({ isOpen, onClose }: AddActivityModalProps) => {
  if (!isOpen) return null;

  const { activities, loading, error, createActivity } = useActivity(
    planToPass.plan_id,
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("12:00");
  const [address, setAddress] = useState("");

  const submitInputs = (e: SubmitEvent) => {
    // Prevents default submit behaviour of browser
    e.preventDefault();

    if (address.trim() === "") {
      return;
    }

    // Sets a default value if no Title or Description is inputted
    const finalTitle: string = title.trim() === "" ? "New Activity" : title;
    const finalDescription: string =
      description.trim() === "" ? "No Description" : description;
    const finalAddress: Address = parseAddress(address);

    createActivity({
      title: finalTitle,
      description: finalDescription,
      startTime,
      endTime,
      address: finalAddress,
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
            <h5 className="modal-title">Add an Activity</h5>
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
                <label className="form-label">Activity Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="New Activity"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Activity Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Activity Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="flex-fill">
                    <label className="form-label mb-1">Start Time</label>
                    <input
                      type="time"
                      className="form-control form-control-sm"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                    />
                  </div>

                  <span className="align-self-end mb-1 fs-5">—</span>

                  <div className="flex-fill">
                    <label className="form-label mb-1">End Time</label>
                    <input
                      type="time"
                      className="form-control form-control-sm"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      onKeyDown={handleKeyDown}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="123 Main ST, Montreal, QC, H3Z 2Y7, Canada"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                Add Activity
              </button>
            </div>
          </form>
        </div>
      </div>
    </article>
  );
};

export default AddActivityModal;
