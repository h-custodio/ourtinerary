"use client";

import { useCallback, useEffect, useState } from "react";
import { Friend } from "@/types/friend";
import supabase from "@/lib/supabase/client";

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFriends = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: friends, error: friendError } = await supabase
      .from("friend")
      .select("*");

    if (friendError) {
      console.error(friendError);
      setError(friendError.message);
      setLoading(false);
      return;
    }

    setFriends(friends);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const addFriend = async (friendId: string) => {
    // Retrieve the sender's ID and throw error if not found
    const { data: sender, error: senderError } = await supabase.auth.getUser();

    if (senderError || !sender) {
      const errorMessage = senderError?.message ?? "User is not authenticated";
      console.error(errorMessage);
      setError(errorMessage);
      return;
    }

    // Retrieve the receiver's ID and throw error if not found
    const { data: receiver, error: receiverError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", friendId)
      .single();

    if (receiverError || !receiver) {
      const errorMessage = receiverError?.message ?? "User not found";
      console.error(errorMessage);
      setError(errorMessage);
      return;
    }

    const { data: friend, error: friendError } = await supabase
      .from("friend")
      .insert({
        user_id: sender.user.id,
        friend_id: receiver.id,
        accepted: false,
      });

    if (friendError) {
      console.error("Failed to add friend: ", friendError);
      setError(friendError.message);
      return;
    }

    await fetchFriends();

    return friend;
  };

  const deleteFriend = async (friendId: string) => {
    // Retrieve the sender's ID and throw error if not found
    const { data: sender, error: senderError } = await supabase.auth.getUser();

    if (senderError || !sender) {
      const errorMessage = senderError?.message ?? "User is not authenticated";
      console.error(errorMessage);
      setError(errorMessage);
      return;
    }

    // Retrieve the receiver's ID and throw error if not found
    const { data: receiver, error: receiverError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", friendId)
      .single();

    if (receiverError || !receiver) {
      const errorMessage = receiverError?.message ?? "User not found";
      console.error(errorMessage);
      setError(errorMessage);
      return;
    }

    const { data: friend, error: friendError } = await supabase
      .from("friend")
      .delete()
      .eq("user_id", sender.user.id)
      .eq("friend_id", receiver.id);

    if (friendError) {
      console.error("Failed to add friend: ", friendError);
      setError(friendError.message);
      return;
    }

    await fetchFriends();

    return friend;
  };

  const updateFriend = async (friendId: string) => {
    // Retrieve the sender's ID and throw error if not found
    const { data: sender, error: senderError } = await supabase.auth.getUser();

    if (senderError || !sender) {
      const errorMessage = senderError?.message ?? "User is not authenticated";
      console.error(errorMessage);
      setError(errorMessage);
      return;
    }

    // Retrieve the receiver's ID and throw error if not found
    const { data: receiver, error: receiverError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", friendId)
      .single();

    if (receiverError || !receiver) {
      const errorMessage = receiverError?.message ?? "User not found";
      console.error(errorMessage);
      setError(errorMessage);
      return;
    }

    const { data: friend, error: friendError } = await supabase
      .from("friend")
      .update({ accepted: true })
      .eq("user_id", sender.user.id)
      .eq("friend_id", receiver.id);

    if (friendError) {
      console.error("Failed to accept friend request: ", friendError);
      setError(friendError.message);
      return;
    }

    await fetchFriends();

    return friend;
  };

  return {
    friends,
    loading,
    error,
    addFriend,
    updateFriend,
    deleteFriend,
    refetch: fetchFriends,
  };
}
