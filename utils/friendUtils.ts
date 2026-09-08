import supabase from "@/lib/supabase/client";
import { FRIEND_TYPES, FriendType, Friend } from "@/types/friend";
import type { User } from "@supabase/supabase-js";

interface loadFriendProfilesProps {
  friends: Friend[];
  user: User | null;
  friendType: FriendType;
}

export async function fetchFriendProfiles({
  friends,
  user,
  friendType,
}: loadFriendProfilesProps) {
  let targetIds: string[] = [];

  if (friendType === FRIEND_TYPES.FRIENDS) {
    targetIds = friends
      .filter((friend) => friend.accepted === true)
      .map((friend) => friend.friend_id);
  } else if (friendType === FRIEND_TYPES.REQUESTS) {
    targetIds = friends
      .filter(
        (friend) => friend.accepted === false && user?.id === friend.friend_id,
      )
      .map((friend) => friend.user_id);
  } else {
    targetIds = friends
      .filter(
        (friend) => friend.accepted === false && user?.id === friend.user_id,
      )
      .map((friend) => friend.friend_id);
  }

  if (targetIds.length === 0) {
    return [];
  }

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
