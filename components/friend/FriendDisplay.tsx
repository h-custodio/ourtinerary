"use client";

import { useState, useEffect } from "react";

// UI Components
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

// Types & Custom Hooks
import { Friend, FRIEND_TYPES, FriendType } from "@/types/friend";
import { useFriends } from "@/hooks/useFriends";

// Utility Functions
import { fetchFriendProfiles } from "@/utils/friendUtils";

import type { User } from "@supabase/supabase-js";

interface FriendDashboardProps {
  user: User | null;
}

const FriendDisplay = ({ user }: FriendDashboardProps) => {
  // Extract CRUD methods and status flags from the custom friends hook
  const {
    error: friendError,
    loading,
    refetch,
    addFriend,
    updateFriend,
    deleteFriend,
  } = useFriends();

  // State Management
  const [friends, setFriends] = useState<Friend[]>([]); // Raw friendship relationship data
  const [filteredFriends, setFilteredFriends] = useState<User[]>([]); // Fetched profile objects for display
  const [friendId, setFriendId] = useState<string>(""); // Form input for adding new friends
  const [friendType, setFriendType] = useState<FriendType>(
    FRIEND_TYPES.FRIENDS, // Currently active tab filter (FRIENDS, REQUESTS, or SENT)
  );

  // Transient error message state for form validations and API errors
  const [formError, setFormError] = useState<string | null>(null);

  /**
   * Helper function to render a temporary notification toast/banner
   */
  const showError = (message: string) => {
    setFormError(message);

    // Automatically clear the banner after 2.5 seconds
    setTimeout(() => {
      setFormError(null);
    }, 2500);
  };

  /**
   * Sends a new outgoing friend request
   */
  const handleAdd = async (friendId: string) => {
    if (!friendId.trim()) {
      showError("Please enter a friend ID.");
      return;
    }

    try {
      await addFriend(friendId);
      setFriendId(""); // Reset input on success
    } catch {
      console.error("Error adding friend:", friendError);
      showError("Failed to add friend");
    }
  };

  /**
   * Accepts an incoming friend request
   */
  const handleUpdate = async (friendId: string) => {
    try {
      await updateFriend(friendId);
    } catch {
      console.error("Error updating friend request:", friendError);
      showError("Failed to accept friend request");
    }
  };

  /**
   * Removes a friend, declines a request, or cancels a sent request
   */
  const handleDelete = async (friendId: string) => {
    try {
      await deleteFriend(friendId);
    } catch {
      console.error("Error deleting friend relationship:", friendError);
      showError("Failed to delete friend");
    }
  };

  /**
   * Re-fetches matching user profiles whenever the active filter tab,
   * underlying friend array, or current authenticated user changes.
   */
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
      {/* Toast Error Banner */}
      {formError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] rounded-md bg-red-500 px-4 py-3 text-sm text-white shadow-lg">
          {formError}
        </div>
      )}

      {/* Header and Add Friend Dialog */}
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

      {/* Filter Tabs */}
      <div className="flex justify-start my-8 gap-2">
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

      {/* Friends List Render */}
      <div>
        {filteredFriends.length === 0 ? (
          <p className="text-muted-foreground">No Friends Found</p>
        ) : (
          filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex justify-between items-center border rounded-xl border-border bg-card p-3 mb-3 text-card-foreground shadow-sm"
            >
              {/* Profile Identifiers */}
              <p className="pb-0 mb-0 font-bold">{friend.id}</p>

              {/* Contextual Action Buttons depending on active tab */}
              <div className="flex items-center gap-2">
                {/* Accepted Friends Tab */}
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

                {/* Pending Incoming Requests Tab */}
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

                {/* Pending Outgoing Requests Tab */}
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
