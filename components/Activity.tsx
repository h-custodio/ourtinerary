import { ActivityData } from "@/component_types/activity";
import { Address } from "@/component_types/address";
import EditActivity from "./activity/EditActivity";

interface ActivityProps {
  activity: ActivityData;
  onClose: () => void;
  openEdit: () => void;
}

const Activity = ({ activity, onClose, openEdit }: ActivityProps) => {
  return (
    <div className="d-inline-block border position-relative p-3">
      <div className="position-absolute top-0 end-8 m-2">
        <EditActivity onClick={openEdit} />
      </div>
      <button
        type="button"
        className="btn-close position-absolute top-0 end-0 m-2"
        aria-label="Remove Activity"
        onClick={() => onClose()}
      />
      <h4 className="mb-2 me-4">{activity.title}</h4>
      <p className="mb-2">{activity.description}</p>
      <p className="mb-2">{activity.startTime + " — " + activity.endTime}</p>
      <p className="m-0">
        {activity.address.street +
          ", " +
          activity.address.city +
          ", " +
          activity.address.province +
          ", " +
          activity.address.zipCode +
          ", " +
          activity.address.country}
      </p>
    </div>
  );
};

export default Activity;
