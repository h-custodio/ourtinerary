import FriendDashboard from "@/components/friend/FriendDashboard";

import { redirect } from "next/navigation";
import supabaseServer from "@/lib/supabase/server";

export default async function FriendPage() {
  const {
    data: { user },
    error,
  } = await supabaseServer.auth.getUser();

  // if (error) {
  //   console.error("Failed to get user:", error);
  //   return;
  // }

  // // No authenticated user
  // if (!user) {
  //   console.log("user not authenticated, no access");
  //   redirect("auth/login");
  // }

  return <FriendDashboard user={user} />;
}
