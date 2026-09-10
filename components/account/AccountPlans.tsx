"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import usePlans from "@/hooks/usePlans";

export default function AccountPlans() {
  const { plans, loading, error } = usePlans();

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-border bg-card">
        <p className="text-sm text-gray-500">Loading plans...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-red-300 flex items-center justify-center py-10">
        <p className="text-sm text-red-500">Failed to load plans.</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-border bg-card">
        <p className="text-2xl font-bold mb-1">No plans yet</p>
        <p className="text-lg text-muted-foreground mb-4">
          Start organizing your next trip with friends!
        </p>
        <Link href="/plans/new" className={buttonVariants({ size: "lg" })}>
          Create your first plan
        </Link>
      </div>
    );
  }

  return (
    <div className="max-h-[700px] overflow-y-auto pr-1">
      {plans.map((plan) => (
        <Link key={plan.plan_id} href={`/plans/${plan.plan_id}`}>
          <div className="flex justify-between border rounded-xl border-border bg-card p-4 mb-2">
            <div>
              <p className="text-xl font-bold">{plan.title}</p>
              <p className="text-lg text-muted-foreground">{plan.date}</p>
            </div>
            <div className="flex items-center">
              <ChevronRight size={20} className="text-muted-foreground" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
