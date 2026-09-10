"use client";

import usePlans from "@/hooks/usePlans";

const TotalPlans = () => {
  const { plans, loading, error: planError } = usePlans();

  // Loading
  if (loading) {
    return (
      <div className="flex max-w-[30%] border rounded-xl border-border bg-card text-center items-center p-2">
        <p className="text-xl">Loading total plans count...</p>
      </div>
    );
  }

  // Error
  if (planError) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-red-300 flex items-center justify-center py-10">
        <p className="text-sm text-red-500">Failed to load total plan count.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-[30%] border rounded-xl border-border bg-card text-center p-2">
      <h1 className="text-3xl font-bold">{plans.length}</h1>
      <p className="text-xl">Total Plans</p>
    </div>
  );
};

export default TotalPlans;
