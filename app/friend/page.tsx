import FriendDisplay from "@/components/friend/FriendDisplay";

import { redirect } from "next/navigation";
import createClient from "@/lib/supabase/server";

export default async function FriendPage() {
  const supabaseServer = await createClient();

  const {
    data: { user },
    error,
  } = await supabaseServer.auth.getUser();

  if (error) {
    console.error("Failed to get user:", error);
    return;
  }

  if (!user) {
    console.log("user not authenticated, no access");
    redirect("/auth/login");
  }

  return <FriendDisplay user={user} />;
}
