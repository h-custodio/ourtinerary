"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Friend } from "@/types/friend";
import { useFriends } from "@/hooks/useFriends";

import { FRIEND_TYPES, FriendType } from "@/types/friend";

import { fetchFriendProfiles } from "@/utils/friendUtils";

import type { User } from "@supabase/supabase-js";

interface FriendDashboardProps {
  user: User | null;
}

const FriendDisplay = ({ user }: FriendDashboardProps) => {
  const {
    error: friendError,
    loading,
    refetch,
    addFriend,
    updateFriend,
    deleteFriend,
  } = useFriends();

  // Friend variables
  const [friends, setFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]);
  const [friendId, setFriendId] = useState<string>("");
  const [friendType, setFriendType] = useState<FriendType>(
    FRIEND_TYPES.FRIENDS,
  );

  // Error string variable for friendId form
  const [formError, setFormError] = useState<string | null>(null);

  const showError = (message: string) => {
    setFormError(message);

    setTimeout(() => {
      setFormError(null);
    }, 2500);
  };

  const handleAdd = async (friendId: string) => {
    if (!friendId.trim()) {
      showError("Please enter a friend ID.");
      return;
    }

    try {
      await addFriend(friendId);
    } catch {
      console.error("Error adding friend:", friendError);
      showError("Failed to add friend");
    }
  };

  const handleUpdate = async (friendId: string) => {
    try {
      await updateFriend(friendId);
    } catch {
      console.error("Error adding friend:", friendError);
      showError("Failed to add friend");
    }
  };

  const handleDelete = async (friendId: string) => {
    try {
      await deleteFriend(friendId);
    } catch {
      console.error("Error adding friend:", friendError);
      showError("Failed to add friend");
    }
  };

  useEffect(() => {
    async function fetchTargetProfiles() {
      const profiles = await fetchFriendProfiles({
        friends,
        user,
        friendType,
      });
      setFilteredFriends(profiles);
    }

    fetchTargetProfiles();
  }, [friends, user, friendType]);

  return (
    <div className="flex-1 px-8 py-12 max-w-2xl mx-auto w-full text-foreground">
      {formError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] rounded-md bg-red-500 px-4 py-3 text-sm text-white shadow-lg">
          {formError}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black">Friends</h1>
        <Dialog>
          <DialogTrigger render={<Button size="lg">Add Friend</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter your Friend's ID</DialogTitle>
            </DialogHeader>
            <Field>
              <Label htmlFor="friendId">Name</Label>
              <Input
                id="friendId"
                name="friendId"
                value={friendId}
                onChange={(e) => setFriendId(e.target.value)}
                placeholder="john123"
              />
            </Field>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button onClick={() => handleAdd(friendId)}>
                Send Friend Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-start my-8">
        <Button
          size="lg"
          variant={
            friendType === FRIEND_TYPES.FRIENDS ? "default" : "secondary"
          }
          onClick={() => setFriendType(FRIEND_TYPES.FRIENDS)}
        >
          Friends
        </Button>
        <Button
          size="lg"
          variant={
            friendType === FRIEND_TYPES.REQUESTS ? "default" : "secondary"
          }
          onClick={() => setFriendType(FRIEND_TYPES.REQUESTS)}
        >
          Requests
        </Button>
        <Button
          size="lg"
          variant={friendType === FRIEND_TYPES.SENT ? "default" : "secondary"}
          onClick={() => setFriendType(FRIEND_TYPES.SENT)}
        >
          Sent
        </Button>
      </div>

      <div>
        {filteredFriends.length === 0 ? (
          <p className="text-muted-foreground">No Friends Found</p>
        ) : (
          filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex justify-between items-center border rounded-xl border-border bg-card p-3 mb-3 text-card-foreground shadow-sm"
            >
              {/* Should be friend.display_name */}
              <p className="pb-0 mb-0 font-bold">{friend.id}</p>

              <div className="flex items-center gap-2">
                {friendType === FRIEND_TYPES.FRIENDS && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(friend.id)}
                    className="rounded-full"
                  >
                    Remove
                  </Button>
                )}

                {friendType === FRIEND_TYPES.REQUESTS && (
                  <>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleUpdate(friend.id)}
                      className="rounded-full"
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(friend.id)}
                      className="rounded-full"
                    >
                      Decline
                    </Button>
                  </>
                )}

                {friendType === FRIEND_TYPES.SENT && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(friend.id)}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendDisplay;
