import { Database } from "@/types/database.types";

// Represents what you get back from the database
export type PlanMember = Database["public"]["Tables"]["plan_member"]["Row"];

// Clearance level for what they are allowed to do, see  comments below
export type Clearance = 0 | 1 | 2 | 3;

/*
Level 0 (Host level) Perms: 
-Can modify plan (CRUD), even delete the whole plan
-Can invite
-Can kick users

Level 1 Perms:
- Can modify plan (CRUD)
- Can invite
Level 2 Perms:

- Can invite
- Can comment

Level 3 Perms (all invitees start here):
- read only
*/