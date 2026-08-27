import { Database } from "@/lib/supabase/database.types";

// application/UI model for user input
export interface PlanData {
  title: string;
  description: string | null;
  date: Date;
}

// Represents what you get back from the database
export type Plan = Database["public"]["Tables"]["plan"]["Row"];

// Represents what you are allowed/expected to send when creating a row
type PlanInsert = Database["public"]["Tables"]["plan"]["Insert"];

// Represents what you can send when modifying a row
type PlanUpdate = Database["public"]["Tables"]["plan"]["Update"];
