"use client";

import { useState } from "react";

import { useFriends } from "@/hooks/useFriends";
import { Friend } from "@/types/friend";

import FriendButtons from "./FriendButtons";

import { FRIEND_TYPES, FriendType } from "@/types/friend";

import { loadFriendProfiles } from "@/utils/friendUtils";

import type { User } from "@supabase/supabase-js";
import supabase from "@/lib/supabase/client";

interface FriendDisplayProps {
  FriendType: FriendType;
  user: User | null;
}

export default async function FriendDisplay({
  FriendType,
  user,
}: FriendDisplayProps) {
  // const { error, loading, refetch, updateFriend, deleteFriend } = useFriends();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]);
  const [targetIds, setTargetIds] = useState<string[]>([]);

  setFilteredFriends(await loadFriendProfiles({ friends, user, FriendType }));

  return (
    <div>
      {filteredFriends.map((friend) => (
        <div
          key={friend.id}
          className="flex justify-between border rounded-xl border-[rgba(26,21,16,0.12)] bg-[rgb(225,214,189)] p-2 mb-3"
        >
          {/*Should be friend.display_name (Will do that after profile gets done)*/}
          <p className="pb-0 mb-0 font-bold">{friend.id}</p>

          <div className="flex items-center gap-2">
            <FriendButtons FriendType={FriendType} friendId={friend.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
