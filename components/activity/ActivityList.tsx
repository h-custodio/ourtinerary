"use client";

import { CalendarIcon } from "lucide-react";

import { Activity } from "@/types/activity";
import useActivity from "@/hooks/useActivities";
import { Plan } from "@/types/plan";
import { useEffect } from "react";

type ActivityListProps = {
  plan?: Plan;
  activities: Activity[];
  loading: boolean;
  error: string | null;
  onActivityClick: (activity: Activity) => void;
};

export function ActivityList({
  plan,
  activities,
  loading,
  error,
  onActivityClick,
}: ActivityListProps) {
  // Plan hasn't been saved yet
  if (!plan) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-380 flex flex-col items-center justify-center py-10 text-center">
        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center mb-3">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
        </div>

        <p className="text-sm font-medium text-gray-900">No activities yet</p>

        <p className="text-xs mt-1 max-w-[200px] text-gray-500">
          Save the plan to start adding activities.
        </p>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-380 flex items-center justify-center py-10">
        <p className="text-sm text-gray-500">Loading activities...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-red-300 flex items-center justify-center py-10">
        <p className="text-sm text-red-500">Failed to load activities.</p>
      </div>
    );
  }

  // No activities
  if (activities.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-380 flex flex-col items-center justify-center py-10 text-center">
        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center mb-3">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
        </div>

        <p className="text-sm font-medium text-gray-900">No activities yet</p>

        <p className="text-xs mt-1 max-w-[200px] text-gray-500">
          Add the first item to your plan.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden">
      {/* Future timeline header */}
      <div className="border-b bg-muted/30 px-4 py-2">
        <p className="text-lg font-medium">Activities</p>
      </div>

      {/* Scrollable timeline */}
      <div className="max-h-[500px] overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {[...activities]
            .sort((a, b) => a.start_time.localeCompare(b.start_time))
            .map((activity) => (
              <div
                key={activity.activity_id}
                onClick={() => onActivityClick(activity)}
                className="w-full cursor-pointer rounded-xl border bg-background p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-8 gap-y-2">
                  <h3 className="text-base font-semibold text-foreground text-left">
                    {activity.title}
                  </h3>

                  <p className="text-sm font-medium text-foreground text-right whitespace-nowrap">
                    {activity.start_time} — {activity.end_time}
                  </p>

                  <p className="text-sm text-muted-foreground text-left leading-relaxed">
                    {activity.description}
                  </p>

                  <p className="text-sm text-muted-foreground text-right whitespace-nowrap">
                    📍 {activity.location}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
