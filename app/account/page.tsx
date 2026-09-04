"use client";

import supabase from "@/lib/supabase/client";
import { redirect } from "next/navigation";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import { Plan } from "@/types/plan";
import { PlanForm } from "@/components/plan/PlanForm";

export default function AccountDashboard() {
  //   const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const username = "ourtinterary";
  const joinDate = "January 1, 1970";
  const friendCount = 5;
  const planCount = 12;
  const plans = [
    { title: "Rock Climbing", date: "September 9th, 2026" },
    { title: "Go-kart racing", date: "September 22nd, 2026" },
    { title: "Intermediate Hiking", date: "October 23rd, 2026" },
    { title: "Chuck E. Cheese Raid", date: "December 25th, 2026" },
    { title: "Scientology Raid", date: "January 1st, 2027" },
    { title: "Evil Hackathon", date: "Febuary 14th, 2027" },
    { title: "Alberta Roadtrip", date: "March 24th, 2027" },
    { title: "Free Money Giveaway", date: "April 1st, 2027" },
  ];

  //   // verify that user is authenticated
  //   const {
  //     data: { user },
  //     error,
  //   } = await supabase.auth.getUser();

  //   if (error) {
  //     console.error("Failed to get user:", error);
  //     return;
  //   }

  //   // No authenticated user
  //   if (!user) {
  //     console.log("user not authenticated, no access");
  //     redirect("/login");
  //   }

  return (
    <div className="flex-1 px-8 py-12 max-w-4xl mx-auto w-full">
      <div className="flex justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold">{username}</h1>
          <p className="text-lg">
            <span className="font-bold">Joined:</span> {joinDate}
          </p>
        </div>

        {/* <div className="flex gap-2"> */}
        <div className="flex-1 max-w-[30%] border rounded-xl border-border bg-card text-center p-2">
          <h1 className="text-3xl font-bold">{planCount}</h1>
          <p className="text-xl">Total Plans</p>
        </div>
        {/* </div> */}
      </div>

      <div className="flex justify-between mb-3">
        <h2 className="text-2xl font-bold">Upcoming Plans</h2>
        <Link
          href="/plan-page"
          className={buttonVariants({ size: "lg", variant: "default" })}
        >
          Create Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-border bg-card">
          <p className="text-2xl font-bold mb-1">No plans yet</p>
          <p className="text-lg text-muted-foreground mb-4">
            Start organizing your next trip with friends!
          </p>
          <Link href="/plan-page" className={buttonVariants({ size: "lg" })}>
            Create your first plan
          </Link>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto pr-1">
          {/* index should be plan.id */}
          {plans.map((plan, index) => (
            <Link key={index} href="/plan-page">
              <div className="flex justify-between border rounded-xl border-border bg-card p-4 mb-2">
                <div>
                  <p className="text-xl font-bold">{plan.title}</p>
                  <p className="text-lg">{plan.date}</p>
                </div>
                <div className="flex items-center">
                  <ChevronRight size={20} style={{ color: "#7A6A52" }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
