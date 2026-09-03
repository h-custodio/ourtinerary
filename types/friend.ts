import { Database } from "@/types/database.types";

export const FRIEND_TYPES = {
  FRIENDS: "friends",
  REQUESTS: "requests",
  SENT: "sent",
} as const;

export type FriendType = (typeof FRIEND_TYPES)[keyof typeof FRIEND_TYPES];

// Data types expected from a Friend entry
export interface FriendData {
  userId: string;
  friendId: string;
  accepted: Boolean;
}

// What can be retrieved from the Friend DB
export type Friend = Database["public"]["Tables"]["friend"]["Row"];
