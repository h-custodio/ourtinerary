import { Address } from "@/types/address";
import { Database } from "@/types/database.types";

export interface ActivityData {
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  address: Address | null;
}

// Represents what you get back from the database
export type Activity = Database["public"]["Tables"]["activity"]["Row"];

// Represents what you are allowed/expected to send when creating a row
export type ActivityInsert = Database["public"]["Tables"]["activity"]["Insert"];

// Represents what you can send when modifying a row
export type ActivityUpdate = Database["public"]["Tables"]["activity"]["Update"];