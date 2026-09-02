import { useState } from "react";
import useActivity from "@/hooks/useActivities";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ActivityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ActivityDialog({
  open,
  onOpenChange,
}: ActivityDialogProps) {
  // const { error, loading, fetchActivity, createActivity, updateActivity, deleteActivity } = useActivity(
  //   plan.id,
  // );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [address, setAddress] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);

  const handleError = (message: string) => {
    setFormError(message);
    setIsErrorOpen(true);
  };

  const handleCloseError = () => {
    setFormError(null);
    setIsErrorOpen(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      handleError("Please Enter an Activity Title");
      return;
    }

    if (!description.trim()) {
      handleError("Please Enter an Activity Description");
      return;
    }

    if (!startTime.trim()) {
      handleError("Please Enter an Activity Start Time");
      return;
    }

    if (!endTime.trim()) {
      handleError("Please Enter an Activity End Time");
      return;
    }

    if (!address.trim()) {
      handleError("Please Enter an Activity Address");
      return;
    }

    const activityData = {
      title,
      description,
      startTime,
      endTime,
      address,
    };

    // if (activity) {
    //   // await updateActivity(activity.id, activityData)
    // } else {
    //   // await createActivity(activityData)
    // }
  };

  const handleDelete = async () => {
    // if (!activity) {
    //   setFormError("Plan must be created first to be deleted");
    return;
    // }

    // await deleteActivity(activity.id);
    // router.push("/dashboard"); // return to user dashboard
  };

  return (
    <div>
      {/* Hopefully this error alert works, smile :) */}
      <AlertDialog
        open={isErrorOpen}
        onOpenChange={(open) => !open && handleCloseError}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error Encountered</AlertDialogTitle>
            <AlertDialogDescription>{formError}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                handleCloseError();
              }}
            >
              Acknowledge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Activity Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <Label htmlFor="title" className="mb-1">
                Activity Title
              </Label>
              <Input
                id="title"
                value={title}
                placeholder="New Activity"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <Label htmlFor="description" className="mb-1">
                Activity Description
              </Label>
              <Input
                id="description"
                value={description}
                placeholder="Activity Description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    value={startTime}
                    type="time"
                    className="h-9 text-sm"
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <span className="pb-1 text-lg font-medium text-muted-foreground">
                  —
                </span>

                <div className="flex-1 space-y-1">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    value={endTime}
                    type="time"
                    className="h-9 text-sm"
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <Label htmlFor="address" className="mb-1">
                Activity Address
              </Label>
              <Input
                id="address"
                value={address}
                placeholder="123 Main ST, Montreal, QC, H3Z 2Y7, Canada"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <Button variant="secondary">Cancel</Button>
                <Button type="submit">Submit</Button>
              </div>

              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
