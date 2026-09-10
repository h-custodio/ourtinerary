import supabase from "@/lib/supabase/client";

export default async function getCurrentPlanMember(planId: string) {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return null;
    }

    const { data: member, error: memberError } = await supabase
        .from("plan_member")
        .select("*")
        .eq("plan_id", planId)
        .eq("user_id", user.id)
        .single();

    if (memberError || !member) {
        return null;
    }

    return { user, clearance: member.clearance };
}
