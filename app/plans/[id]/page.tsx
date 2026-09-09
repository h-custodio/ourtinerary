import { PlanForm }  from "@/components/plan/PlanForm";
import  createClient  from "@/lib/supabase/server"; // Update to match your Supabase server client path
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPlanPage({ params }: PageProps) {
  const { id } = await params; // Await params (required in Next.js 15+)
  const supabaseServer = await createClient();

  // Fetch the plan matching this ID from your Supabase database
  const { data: plan, error } = await supabaseServer
    .from("plan")
    .select("*")
    .eq("plan_id", id)
    .single();

  // If the ID doesn't exist in Supabase, show a 404 page
  if (error || !plan) {
    notFound();
  }

  return (
    <div className="flex-1 px-8 pb-12 pt-25 max-w-5xl mx-auto w-full text-center">
      <h1 className="text-2xl font-bold mb-6">Edit Plan</h1>
      <PlanForm plan={plan} />
    </div>
  );
}