"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

import { format, startOfToday, addYears } from "date-fns";

import ActivityDialog from "@/components/activity/ActivityDialog"
import usePlans from "@/hooks/usePlans";
import { Plan } from "@/types/plan";
import { Activity } from "@/types/activity";

// an optional parameter to be passed
// used if a pre-existing plan is passed to be edited
type PlanFormProps = {
  plan?: Plan;
};

export function PlanForm({ plan }: PlanFormProps) {
  // dialog/popup state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>();
  // custom plan hook
  const { createPlan, updatePlan, deletePlan, error: planError } = usePlans();
  // user input state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [description, setDescription] = useState("");
  // error states
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();

  // repopulate the inputs with existing plan's input
  // if it is being edited
  useEffect(() => {
    if (plan) {
      setTitle(plan.title);
      setDate(new Date(plan.date));
      setDescription(plan.description);
    } else {
      setTitle("");
      setDate(undefined);
      setDescription("");
    }
  }, [plan]);

  // error notification banner
  const showError = (message: string) => {
    setFormError(message);

    setTimeout(() => {
      setFormError(null);
    }, 2000);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showError("Please enter a plan title");
      return;
    }

    if (!date) {
      showError("Please select a plan date");
      return;
    }

    if (!description.trim()) {
      showError("Please enter a plan description");
      return;
    }

    const planData = {
      title: title.trim(),
      date: date.toISOString(),
      description: description.trim(),
    };

    // if plan exists and is being updated
    if (plan) {
      await updatePlan(plan.plan_id, planData);
    } else { // if this is a new plan being created
      await createPlan(planData);
    }
  };

  const handleDelete = async () => {
    if (!plan) {
      showError("Plan must be created first to be deleted");
      return;
    }

    await deletePlan(plan.plan_id);
    router.push("/dashboard"); // return to user dashboard
  };

  return (
    <div>
      {formError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-md bg-red-500 px-4 py-3 text-sm text-white shadow-lg">
          {formError}
      </div>
      )}

      <Card>
        
          <CardHeader>
            <CardTitle>Plan Workspace</CardTitle>
          </CardHeader>

          {/*plan title input*/}
          <CardContent>
            <div className="flex items-center gap-3">
              <Label htmlFor="plan-title">Plan Title</Label>

              <Input
                id="plan-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Vacation"
                className="h-9 border border-input w-[440px]"
                required
              />
            </div>

            {/*calendary input*/}
            <div className="flex items-center gap-3">
              <Label htmlFor="plan-date">Plan Date</Label>

              <div className="relative w-[220px]">
                <Input
                  id="plan-date"
                  value={date ? format(date, "PPP") : ""}
                  placeholder="Select a date"
                  readOnly
                  className="h-9 pr-10 border border-input"
                />

                {/*Calendar menu*/}
                <Popover>
                  <PopoverTrigger
                    render={
                      <button
                        type="button"
                        className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center"
                        aria-label="Select date"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </button>
                    }
                  />

                  {/*calendar icom*/}
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={{ before: startOfToday() }}
                      captionLayout="dropdown"
                      startMonth={startOfToday()}
                      endMonth={addYears(startOfToday(), 20)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/*plan description*/}
            <div className="space-y-2">
              <Label htmlFor="plan-description">Plan Description</Label>

              <Textarea
                id="plan-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your plan..."
                className="min-h-24 resize-none"
                required
              />
            </div>

          </CardContent>
          
          {/*buttons*/}
          <CardFooter className="flex gap-4">
            <Button onClick={() => {
              setDialogOpen(true);
              setSelectedActivity(undefined);
              }} className="border">
                Add Activity
            </Button>

            <Button className="border" onClick={handleSave}>Save Plan</Button>

            <Button className="border" onClick={handleDelete}>Delete Plan</Button>
          </CardFooter>

          {/*activity popup*/}
        {plan && <ActivityDialog
          plan={plan}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          activity={selectedActivity} 
        />
        }

      </Card>
    </div>
  );
}