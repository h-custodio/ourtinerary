"use client";

import { useState } from "react";
import supabase from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

import { Plan } from "@/types/plan";
import { PlanForm } from "@/components/plan/PlanForm";

export default function AccountDashboard() {
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const username = "ourtinterary";
  const joinDate = "January 1, 1970";
  const friendCount = 5;
  const planCount = 12;
  const plans = [
    { title: "Rock Climbing", date: "September 9th, 2026" },
    { title: "Go-kart racing", date: "September 22nd, 2026" },
    { title: "Intermediate Hiking", date: "October 23rd, 2026" },
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
    <div className="flex-1 px-8 py-12 max-w-2xl mx-auto w-full">
      <div className="flex justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold">{username}</h1>
          <p>
            <span className="font-bold">Joined:</span> {joinDate}
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="flex justify-between w-full gap-4 mb-10">
        <div className="flex-1 border rounded-xl border-[rgba(26,21,16,0.12)] bg-[rgb(225,214,189)] text-center p-2">
          <h1 className="text-2xl font-bold">{friendCount}</h1>
          <p className="text-lg">Friends</p>
        </div>
        <div className="flex-1 border rounded-xl border-[rgba(26,21,16,0.12)] bg-[rgb(225,214,189)] text-center p-2">
          <h1 className="text-2xl font-bold">{planCount}</h1>
          <p className="text-lg">Plans</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg mb-3">Upcoming Plans</h2>
        {plans.map((plan, index) => (
          <div
            key={index}
            className="border rounded-xl border-[rgba(26,21,16,0.12)] bg-[rgb(225,214,189)] p-2 mb-3"
          >
            <p className="pb-0 mb-0">{plan.title}</p>
            <p className="pt-0 mt-0">{plan.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
