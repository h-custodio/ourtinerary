import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export function PlanForm() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Plan Workspace</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3">
            <Label htmlFor="plan-title">Plan Title</Label>

            <Input
              id="plan-title"
              placeholder="e.g. Summer Vacation"
              className="h-9 border border-input"
            />
          </div>

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

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center"
                    aria-label="Select date"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="plan-description">Plan Description</Label>

            <Textarea
              id="plan-description"
              placeholder="Describe your plan..."
              className="min-h-24 resize-none"
            />
          </div>
        </CardContent>

        <CardFooter className="flex gap-4">
          <Button className="border">Add Activity</Button>
          <Button className="border">Save Plan</Button>
          <Button className="border">Delete Plan</Button>
        </CardFooter>
      </Card>
    </div>
  );
}