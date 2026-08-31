import { Database } from "@/types/database.types";

// Represents what you get back from the database
export type Plan = Database["public"]["Tables"]["plan"]["Row"];

// Represents what you are allowed/expected to send when creating a row
export type PlanInsert = Database["public"]["Tables"]["plan"]["Insert"];

// Represents what you can send when modifying a row
export type PlanUpdate = Database["public"]["Tables"]["plan"]["Update"];
