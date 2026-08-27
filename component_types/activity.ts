import { Address } from "@/component_types/address";
import { Database } from "@/lib/supabase/database.types";

export interface ActivityData {
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  address: Address | null;
}

export type Activity = Database["public"]["Tables"]["activity"]["Row"];
