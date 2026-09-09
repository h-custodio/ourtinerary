import createClient from "@/lib/supabase/server";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { buttonVariants } from "@/components/ui/button";

const NavHeader = async () => {
  const supabaseServer = await createClient();

  const {
    data: { user },
    error,
  } = await supabaseServer.auth.getUser();

  if (error) {
    console.error("Failed to get user:", error);
  }

  return (
    <div className="flex justify-between">
      <Link href="/" className="text-3xl font-bold">
        OURTINERARY
      </Link>

      <nav>
        {!user ? (
          <Link
            href="/auth/login"
            className={buttonVariants({ size: "lg", variant: "default" })}
          >
            Sign in
          </Link>
        ) : (
          <div className="flex gap-1">
            <Link
              href="/account"
              className={buttonVariants({ size: "lg", variant: "secondary" })}
            >
              Account
            </Link>
            <LogoutButton />
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavHeader;
