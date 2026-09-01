import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ActivityForm = () => {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="secondary">Add Activity</Button>}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Activity Details</DialogTitle>
        </DialogHeader>
        <form>
          <div className="mb-3">
            <Label htmlFor="title" className="mb-1">
              Activity Title
            </Label>
            <Input placeholder="New Activity" id="title" />
          </div>

          <div className="mb-3">
            <Label htmlFor="description" className="mb-1">
              Activity Description
            </Label>
            <Input placeholder="Activity Description" id="description" />
          </div>

          <div className="mb-3">
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="start-time">Start Time</Label>
                <Input id="start-time" type="time" className="h-9 text-sm" />
              </div>

              <span className="pb-1 text-lg font-medium text-muted-foreground">
                —
              </span>

              <div className="flex-1 space-y-1">
                <Label htmlFor="end-time">End Time</Label>
                <Input id="end-time" type="time" className="h-9 text-sm" />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <Label htmlFor="address" className="mb-1">
              Activity Address
            </Label>
            <Input
              placeholder="123 Main ST, Montreal, QC, H3Z 2Y7, Canada"
              id="address"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Button variant="secondary">Cancel</Button>
              <Button type="submit">Submit</Button>
            </div>

            <Button variant="destructive">Delete</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
