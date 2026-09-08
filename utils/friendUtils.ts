import supabase from "@/lib/supabase/client";
import { FRIEND_TYPES, FriendType, Friend } from "@/types/friend";
import type { User } from "@supabase/supabase-js";

interface LoadFriendProfilesProps {
  friends: Friend[];
  user: User | null;
  friendType: FriendType;
}

/*
 * Filters friendship records based on active category and queries Supabase
 * to retrieve corresponding user profiles.
 */
export async function fetchFriendProfiles({
  friends,
  user,
  friendType,
}: LoadFriendProfilesProps): Promise<User[]> {
  let targetIds: string[] = [];

  // Filter relationship records depending on tab view
  if (friendType === FRIEND_TYPES.FRIENDS) {
    // Accepted friendships: extract friend_id
    targetIds = friends
      .filter((friend) => friend.accepted === true)
      .map((friend) => friend.friend_id);
  } else if (friendType === FRIEND_TYPES.REQUESTS) {
    // Pending incoming requests: target user is receiver, map user_id (sender)
    targetIds = friends
      .filter(
        (friend) => friend.accepted === false && user?.id === friend.friend_id,
      )
      .map((friend) => friend.user_id);
  } else {
    // Pending outgoing requests: current user is sender, map friend_id (receiver)
    targetIds = friends
      .filter(
        (friend) => friend.accepted === false && user?.id === friend.user_id,
      )
      .map((friend) => friend.friend_id);
  }

  // Early exit if no matching IDs are found
  if (targetIds.length === 0) {
    return [];
  }

  // Batch query user profiles matching extracted target IDs
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
