"use client";

import { useState } from "react";

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

import { useFriends } from "@/hooks/useFriends";

import { FRIEND_TYPES, FriendType } from "@/types/friend";

import FriendDisplay from "./FriendDisplay";

import type { User } from "@supabase/supabase-js";

interface FriendDashboardProps {
  user: User | null;
}

const FriendDashboard = ({ user }: FriendDashboardProps) => {
  // const { error, loading, refetch, addFriend } = useFriends();
  const [display, setDisplay] = useState<FriendType>(FRIEND_TYPES.FRIENDS);

  return (
    <div className="flex-1 px-8 py-12 max-w-2xl mx-auto w-full text-[#1A1510]">
      <div className="flex justify-between">
        <h1 className="text-4xl font-black">Friends</h1>
        <Dialog>
          <DialogTrigger render={<Button size="lg">Add Friend</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter you Friend's ID</DialogTitle>
            </DialogHeader>
            <Field>
              <Label htmlFor="friendId">Name</Label>
              <Input id="friendId" name="friendId" placeholder="John Doe" />
            </Field>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button type="submit">Send Friend Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-content my-10">
        <Button size="lg" onClick={() => setDisplay(FRIEND_TYPES.FRIENDS)}>
          Friends
        </Button>
        <Button size="lg" onClick={() => setDisplay(FRIEND_TYPES.REQUESTS)}>
          Requests
        </Button>
        <Button size="lg" onClick={() => setDisplay(FRIEND_TYPES.SENT)}>
          Sent
        </Button>
      </div>
      <FriendDisplay FriendType={display} user={user} />
    </div>
  );
};

export default FriendDashboard;
