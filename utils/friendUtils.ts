"use client";

import { useState } from "react";

import { Friend, FRIEND_TYPES, FriendType } from "@/types/friend";
import type { User } from "@supabase/supabase-js";

import supabase from "@/lib/supabase/client";

interface loadFriendProfilesProps {
  friends: Friend[];
  user: User | null;
  FriendType: FriendType;
}

export async function loadFriendProfiles({
  friends,
  user,
  FriendType,
}: loadFriendProfilesProps) {
  const [targetIds, setTargetIds] = useState<string[]>([]);

  // 1. Extract the target IDs (e.g., friend_id)
  if (FriendType === FRIEND_TYPES.FRIENDS) {
    setTargetIds(
      friends
        .filter((friend) => friend.accepted === true)
        .map((friend) => friend.friend_id),
    );
  } else if (FriendType === FRIEND_TYPES.REQUESTS) {
    setTargetIds(
      friends
        .filter(
          (friend) =>
            friend.accepted === false && user?.id === friend.friend_id,
        )
        .map((friend) => friend.friend_id),
    );
  } else {
    setTargetIds(
      friends
        .filter(
          (friend) => friend.accepted === false && user?.id === friend.user_id,
        )
        .map((friend) => friend.friend_id),
    );
  }

  if (targetIds.length === 0) {
    return [];
  }

  // 2. Fetch all matching profiles in a single network request
  const { data: friendProfiles, error } = await supabase
    .from("profiles")
    .select("*")
    .in("id", targetIds);

  if (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }

  return friendProfiles as User[];
}
