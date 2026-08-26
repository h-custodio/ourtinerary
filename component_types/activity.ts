import {Address} from "@/component_types/address"
import { Database } from "@/lib/supabase/database.types";

export interface ActivityData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  address: Address;
}

export type Activity = Database["public"]["Tables"]["activity"]["Row"];