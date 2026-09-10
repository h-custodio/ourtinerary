"use client";

import { useCallback, useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";
import { PlanMember, Clearance } from "@/types/planMember";
import  getCurrentPlanMember  from "@/utils/currentUserUtils";

export default function usePlanMembers(planId: string) {
    const [members, setMembers] = useState<PlanMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMembers = useCallback(async () => {
        setLoading(true);
        setError(null); 

        // retrieve all membership rows belonging to this plan
        // RLS determines which rows the authenticated user is allowed to see
        const { data, error: fetchError } = await supabase
            .from("plan_member")
            .select("*")
            .eq("plan_id", planId);

        if (fetchError) {
            console.error(fetchError);
            setError(fetchError.message);
            setLoading(false);
            return;
        }

        setMembers(data);
        setLoading(false);
    }, [planId]);

    // runs fetchMembers() after render
    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]); // runs this effect when fetchMembers changes

    const addMember = async (userId: string) => {
        const result = await getCurrentPlanMember(planId);

        if (!result) { 
            setError("You must be signed in and a member of this plan");
            return;
        }

        const { user, clearance } = result;

        // Clearance level 0 to 2 can add members
        // RLS independently enforces this rule at the database level
        if (clearance > 2) {
            setError("You do not have permission to add members");
            return;
        }

        // You cannot invite yourself to a plan you're already a part of
        if (user.id === userId) {
            console.log("You cannot add yourself to this plan")
            setError("You cannot add yourself to this plan");
            return;
        }

        const { data, error: memberError } = await supabase
            .from("plan_member")
            .insert({
                plan_id: planId,
                user_id: userId,
                clearance: 3 // automatically set all invitees to lowest clearance level, read only
            })

        if (memberError) {
            console.error(memberError);
            setError(memberError.message);
            return;
        }

        await fetchMembers();

        return data;
    }

    const removeMember = async (userId: string) => {
        const result = await getCurrentPlanMember(planId);

        if (!result) { 
            setError("You must be signed in and a member of this plan");
            return;
        }

        const { user, clearance } = result;

        // only host can kick members
        // RLS independently enforces this rule at the database level
        if (clearance !== 0) {
            setError("You do not have permission to remove members.");
            return;
        }

        // don't allow removing yourself as the host (verified above)
        if (user.id === userId) {
            console.log("As host, you cannot remove yourself")
            setError("As host, you cannot remove yourself");
            return;
        }

        const { data, error: memberError } = await supabase
            .from("plan_member")
            .delete()
            .eq("plan_id", planId)
            .eq("user_id", userId);

        if (memberError) {
            console.error(memberError);
            setError(memberError.message);
            return;
        }

        await fetchMembers();

        return data;
    }

    const updateMemberClearance = async (userId: string, newClearance: Clearance) => {
        const result = await getCurrentPlanMember(planId);

        if (!result) { 
            setError("You must be signed in and a member of this plan");
            return;
        }

        const { user, clearance } = result;

        // only host can change other members' clearance
        // RLS independently enforces this rule at the database level
        // clearance level 0 = host
        if (clearance !== 0) {
            setError("You do not have permission to change members' clearance");
            return;
        }

        // host cannot change their own clearance (verified above)
        if (user.id === userId) {
            console.log("You cannot remove yourself as host");
            setError("As host, you cannot change your own clearance");
            return;
        }

        // host cannot set somebody else to have host level permissions
        if (newClearance === 0) {
            console.log("Only one host per plan and cannot be transferred");
            setError("Only one host per plan and cannot be transferred");
            return;
        }

        const { data, error: memberError } = await supabase
            .from("plan_member")
            .update({
                clearance: newClearance
            })
            .eq("plan_id", planId)
            .eq("user_id", userId);

        if (memberError) {
            console.error(memberError);
            setError(memberError.message);
            return;
        }

        await fetchMembers();

        return data;
    }

    return {
        members,
        loading,
        error,
        addMember,
        removeMember,
        updateMemberClearance,
        refetch: fetchMembers,
    };
}