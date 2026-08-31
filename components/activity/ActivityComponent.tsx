import { ActivityData } from "@/types/activity";
import { EditActivityButton } from "./EditActivityButton";

interface ActivityProps {
  activityToPass: ActivityData;
  openEdit: () => void;
}

const ActivityComponent = ({ activityToPass, openEdit }: ActivityProps) => {
  const { loading, error, deleteActivity } = useActivity(planToPass.plan_id);
  // ==============
  // ID NEEDED HERE
  // ==============

  return (
    <div className="d-inline-block border position-relative p-3">
      <div className="position-absolute top-0 end-8 m-2">
        <EditActivityButton onClick={openEdit} />
      </div>
      <button
        type="button"
        className="btn-close position-absolute top-0 end-0 m-2"
        aria-label="Remove Activity"
        onClick={() => deleteActivity()}
      />
      <h4 className="mb-2 me-4">{activityToPass.title}</h4>
      <p className="mb-2">{activityToPass.description}</p>
      <p className="mb-2">
        {activityToPass.startTime + " — " + activityToPass.endTime}
      </p>
      <p className="m-0">
        {activityToPass.address === null && "No Address"}
        {activityToPass.address !== null &&
          activityToPass.address.street +
            ", " +
            activityToPass.address.city +
            ", " +
            activityToPass.address.province +
            ", " +
            activityToPass.address.zipCode +
            ", " +
            activityToPass.address.country}
      </p>
    </div>
  );
};

export default ActivityComponent;
