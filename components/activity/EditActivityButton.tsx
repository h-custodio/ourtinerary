"use client";

import { useState, useEffect, SubmitEvent, KeyboardEvent } from "react";
import { ActivityData } from "@/component_types/activity";
import { Address } from "@/component_types/address";
import { parseAddress } from "@/utils/addressUtils";

interface AddActivityModalProps {
  id: string;
  prevActivityData: ActivityData;
  isOpen: Boolean;
  onClose: () => void;
  onSubmitInputs: (id: string, inputs: ActivityData) => void;
}

interface EditActivityProps {
  onClick: () => void;
}

export const EditActivityButton = ({ onClick }: EditActivityProps) => {
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

const AddActivityModal = ({
  id,
  prevActivityData,
  isOpen,
  onClose,
  onSubmitInputs,
}: AddActivityModalProps) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(prevActivityData.title);
  const [prevDescription, setPrevDescription] = useState(
    prevActivityData.description,
  );
  const [descriptionInput, setDescriptionInput] = useState(
    prevDescription === null ? "No Description" : prevDescription,
  );
  const [startTime, setStartTime] = useState(prevActivityData.startTime);
  const [endTime, setEndTime] = useState(prevActivityData.endTime);
  const [address, setAddress] = useState(
    prevActivityData.address === null
      ? "No Address"
      : Object.values(prevActivityData.address).join(", "),
  );
  const [addressInput, setAddressInput] = useState(address);

  useEffect(() => {
    setTitle(prevActivityData.title);
    setPrevDescription(prevActivityData.description);
    setStartTime(prevActivityData.startTime);
    setEndTime(prevActivityData.endTime);
    setAddressInput(address);
  }, [prevActivityData]);

  const submitInputs = (e: SubmitEvent) => {
    // Prevents default submit behaviour
    e.preventDefault();

    // Sets a default value if no Title or Description is inputted
    const finalTitle = title.trim() === "" ? prevActivityData.title : title;
    const finalDescription =
      descriptionInput.trim() === ""
        ? prevActivityData.description
        : descriptionInput;
    const finalStartTime =
      startTime.trim() === "" ? prevActivityData.startTime : startTime;
    const finalEndTime =
      endTime.trim() === "" ? prevActivityData.endTime : endTime;
    const finalAddress: Address | null =
      addressInput.trim() === "" || addressInput === "No Address"
        ? null
        : parseAddress(addressInput);

    onSubmitInputs(id, {
      title: finalTitle,
      description: finalDescription,
      startTime: finalStartTime,
      endTime: finalEndTime,
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
            <h5 className="modal-title">Edit Activity</h5>
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
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
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
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
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

export default AddActivityModal;
