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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { CalendarIcon } from "lucide-react";
import { format, startOfToday, addYears } from "date-fns";

import ActivityDialog from "@/components/activity/ActivityDialog"
import usePlans from "@/hooks/usePlans";
import { Plan } from "@/types/plan";
import { Activity } from "@/types/activity";
import { ActivityList } from "../activity/ActivityList";

// an optional parameter to be passed
// used if a pre-existing plan is passed to be edited
type PlanFormProps = {
  plan?: Plan;
};

export function PlanForm({ plan }: PlanFormProps) {
  // dialog/popup state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>();
  // plan 
  const { createPlan, updatePlan, deletePlan, error: planError } = usePlans();
  const [currentPlan, setCurrentPlan] = useState<Plan | undefined>(plan);
  // user input state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [description, setDescription] = useState("");
  // error states
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
  console.log("PlanForm mounted");
  
  return () => {
    console.log("PlanForm UNMOUNTED");
  };
  }, []);

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
    }, 2500);
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

    try {
      // if plan exists and is being updated
      if (currentPlan) {
        await updatePlan(currentPlan.plan_id, planData);
      } else { 
        // if this is a new plan being created
        const createdPlan = await createPlan(planData);

        if (!createdPlan) {
          return;
        }

        // we have a plan to work with to add activities to
        router.push(`/plans/${createdPlan.plan_id}`);
        console.log("Plan created");
      }
    } catch {
      console.error("Error saving plan:", planError);
      showError("Failed to save plan");
    }
  };

  const handleDelete = async () => {
    if (!currentPlan) {
      showError("Plan must be created first to be deleted");
      return;
    }

    await deletePlan(currentPlan.plan_id);
    router.push("/account"); // return to user account page
  };


  const handleActivityClick = (activity: Activity) => {
  setSelectedActivity(activity);
  setDialogOpen(true);
};


  return (
    <div>
      {formError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] rounded-md bg-red-500 px-4 py-3 text-sm text-white shadow-lg">
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

                  {/*calendar icon*/}
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
              if (!currentPlan) {
                showError("Please save the plan before adding activities");
                return;
              }

              setDialogOpen(true);
              setSelectedActivity(undefined);
              }} className="border">
                Add Activity
            </Button>

            <Button className="border" onClick={handleSave}>
              {currentPlan ? "Save Changes" : "Save Plan"}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger render={<Button className="border" />}>
                Delete Plan
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this plan and its activities.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>

          {/*activity popup*/}
          {currentPlan  && <ActivityDialog
            plan={currentPlan }
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            activity={selectedActivity} 
          />
          }
        
        {/*activity list*/}
        {currentPlan && <ActivityList
          plan={currentPlan}
          onActivityClick={handleActivityClick}
        />
        }

      </Card>
    </div>
  );
}



